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
    const fs = await import("fs");
    const path = await import("path");
    const isProd = $app.stage === "prod";

    const apiUrl = isProd
      ? "https://tienthanhapi.datviet.ai"
      : "http://localhost:3002";
    const cdnBase = isProd
      ? "https://tienthanhcdn.datviet.ai"
      : "http://localhost:3002/uploads";

    // Inject runtime-env.js từ template trước khi UMI build.
    const tmpl = path.join(__dirname, "public", "runtime-env.template.js");
    const out = path.join(__dirname, "public", "runtime-env.js");
    if (fs.existsSync(tmpl)) {
      const content = fs
        .readFileSync(tmpl, "utf8")
        .replace("__REACT_APP_ENV__", isProd ? "prod" : "dev")
        .replace("__REACT_APP_API_URL__", apiUrl)
        .replace("__REACT_APP_CDN_BASE__", cdnBase)
        .replace("__DEPLOYED_AT__", new Date().toISOString())
        .replace("__GIT_SHA__", process.env.GITHUB_SHA || "local");
      fs.writeFileSync(out, content);
    }

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
