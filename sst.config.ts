/// <reference path="./.sst/platform/config.d.ts" />

// SST v3 (ion) — Pulumi-backed deploy cho UMI static site.
// Deploy: AWS_REGION=ap-southeast-1 npx sst deploy --stage prod
// Stage prod: custom domain tienthanh.ankapong.com (Route53 zone ankapong.com) + alias tên cũ tienthanh.datviet.ai
// (datviet.ai hết hạn 17/12/2026 — gỡ alias trước ngày đó).

const REGION = "ap-southeast-1";

export default $config({
  app(input) {
    return {
      name: "tienthanh-fe",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { region: REGION },
      },
    };
  },
  async run() {
    const isProd = $app.stage === "prod";

    const apiUrl = isProd
      ? "https://tienthanhapi.ankapong.com"
      : "http://localhost:3002";
    const cdnBase = isProd
      ? "https://tienthanhcdn.ankapong.com"
      : "http://localhost:3002/uploads";

    // runtime-env.js được sinh bởi `npm run build-prod` (qua runtime-env-cra)
    // với UMI_APP_* env vars hardcoded trong script.

    // --- Fix 502 "Failed to contact the origin" (2026-08-23) ---
    // SST StaticSite hardcode origin `default` = "placeholder.sst.dev" — domain này KHÔNG
    // resolve DNS. Origin S3 thật chỉ được gán ở runtime bởi CloudFront Function qua
    // `cf.updateRequestOrigin()`. Nhưng CustomErrorResponses (403/404 -> /index.html, sinh
    // bởi `errorPage` bên dưới) là internal fetch của CloudFront và KHÔNG chạy qua function
    // đó => request rơi thẳng vào placeholder => 502 mỗi khi POP chưa cache sẵn /index.html.
    // Traffic thấp + index.html có Cache-Control no-store => cache nguội nhanh => lỗi thường
    // xuyên (12/38 giờ có 5xx trong tuần trước fix).
    // Fix: trỏ origin `default` thẳng vào bucket assets + OAC để mọi đường đi đều về S3.
    const oac = new aws.cloudfront.OriginAccessControl("WebAssetsOac", {
      description: "OAC cho origin S3 cua static site (fix placeholder.sst.dev 502)",
      originAccessControlOriginType: "s3",
      signingBehavior: "always",
      signingProtocol: "sigv4",
    });

    // Bucket assets được StaticSite tạo bên trong constructor, nên transform.cdn (chạy trong
    // chính constructor đó) chưa tham chiếu được. Dùng promise để nạp domain vào sau.
    let resolveAssetsDomain!: (domain: string) => void;
    const assetsDomain = new Promise<string>((resolve) => {
      resolveAssetsDomain = resolve;
    });

    const site = new sst.aws.StaticSite("Web", {
      path: ".",
      build: {
        command: isProd ? "npm run build-prod" : "npm run build",
        output: "dist",
      },
      // Tên logic bản ghi Route 53 của SST tính theo CHÍNH tên miền, nên đưa tên cũ xuống `aliases` không làm
      // xoá-tạo lại bản ghi tienthanh.datviet.ai đang chạy. Cert được thay (thêm tên = cert mới).
      domain: isProd ? { name: "tienthanh.ankapong.com", aliases: ["tienthanh.datviet.ai"] } : undefined,
      environment: {
        REACT_APP_API_URL: apiUrl,
        REACT_APP_CDN_BASE: cdnBase,
      },
      errorPage: "index.html",
      transform: {
        cdn: (args) => {
          args.origins = $output(assetsDomain).apply((domainName) => [
            {
              originId: "default",
              domainName,
              originAccessControlId: oac.id,
              s3OriginConfig: { originAccessIdentity: "" },
            },
          ]);
        },
      },
    });

    // Regional endpoint (không dùng site.nodes.assets.domain — đó là global endpoint
    // `<bucket>.s3.amazonaws.com`, CloudFront sẽ ăn redirect 307 khi bucket khác us-east-1).
    $output(site.nodes.assets.name).apply((bucketName) =>
      resolveAssetsDomain(`${bucketName}.s3.${REGION}.amazonaws.com`),
    );

    return {
      url: site.url,
      deployedAt: new Date().toISOString(),
    };
  },
});
