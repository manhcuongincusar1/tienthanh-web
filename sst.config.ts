import { SSTConfig } from "sst";
import { StaticSite } from "sst/constructs";
import * as fs from "fs";
import * as path from "path";

// SST v2 (Lambda + StaticSite). S4 task 07 + S5 task 11.
// Deploy: npx sst deploy --stage prod
// Trước build, copy template runtime-env → public/runtime-env.js + replace placeholder.
// Cho phép swap URL post-deploy mà không rebuild (xem runbook_env_swap.md).
export default {
  config(_input) {
    return {
      name: "tienthanh-fe",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const isProd = app.stage === "prod";

      const apiUrl = isProd
        ? "https://tienthanhapi.datviet.ai"
        : "http://localhost:3002";
      const cdnBase = isProd
        ? "https://tienthanhcdn.datviet.ai"
        : "http://localhost:3002/uploads";

      // Generate runtime-env.js từ template trước khi UMI build.
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

      const site = new StaticSite(stack, "fe", {
        path: ".",
        buildCommand: isProd ? "npm run build-prod" : "npm run build",
        buildOutput: "dist",
        customDomain: isProd
          ? {
              domainName: "tienthanh.datviet.ai",
              hostedZone: "datviet.ai",
            }
          : undefined,
        environment: {
          REACT_APP_API_URL: apiUrl,
          REACT_APP_CDN_BASE: cdnBase,
        },
        // SPA routing — không có 404, redirect tất cả về index.html.
        errorPage: "redirect_to_index_page",
        // CloudFront caching: HTML + runtime-env.js no-cache; assets hash + 1 năm immutable.
        // SST default đã set proper cache-control cho HTML + assets.
      });

      stack.addOutputs({
        URL: site.url,
        CustomDomain: site.customDomainUrl ?? "—",
        DeployedAt: new Date().toISOString(),
      });
    });
  },
} satisfies SSTConfig;
