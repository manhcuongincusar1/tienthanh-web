/// <reference path="./.sst/platform/config.d.ts" />

// SST v3 (ion) — Pulumi-backed deploy cho UMI static site.
// Deploy: AWS_REGION=ap-southeast-1 npx sst deploy --stage prod
// Stage prod: custom domain tienthanh.datviet.ai (Route53 zone datviet.ai từ Pulumi BE infra).

export default $config({
  app(input) {
    return {
      name: "tienthanh-fe",
      removal: input?.stage === "prod" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { region: "ap-southeast-1" },
      },
    };
  },
  async run() {
    const isProd = $app.stage === "prod";

    const apiUrl = isProd
      ? "https://tienthanhapi.datviet.ai"
      : "http://localhost:3002";
    const cdnBase = isProd
      ? "https://tienthanhcdn.datviet.ai"
      : "http://localhost:3002/uploads";

    // runtime-env.js được sinh bởi `npm run build-prod` (qua runtime-env-cra)
    // với UMI_APP_* env vars hardcoded trong script.

    const site = new sst.aws.StaticSite("Web", {
      path: ".",
      build: {
        command: isProd ? "npm run build-prod" : "npm run build",
        output: "dist",
      },
      domain: isProd ? "tienthanh.datviet.ai" : undefined,
      environment: {
        REACT_APP_API_URL: apiUrl,
        REACT_APP_CDN_BASE: cdnBase,
      },
      errorPage: "index.html",
    });

    return {
      url: site.url,
      deployedAt: new Date().toISOString(),
    };
  },
});
