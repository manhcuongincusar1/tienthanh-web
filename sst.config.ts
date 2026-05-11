import { SSTConfig } from "sst";
import { StaticSite } from "sst/constructs";

// SST v2 (Lambda + StaticSite). S4 task 07.
// Deploy: npx sst deploy --stage prod
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
          REACT_APP_API_URL: isProd
            ? "https://tienthanhapi.datviet.ai"
            : "http://localhost:3002",
          REACT_APP_CDN_BASE: "https://tienthanhcdn.datviet.ai",
        },
        // SPA routing — không có 404, redirect tất cả về index.html.
        errorPage: "redirect_to_index_page",
        // CloudFront caching:
        //   • HTML → no-cache (mỗi deploy có hash assets mới)
        //   • assets (*.js/*.css/img) → 1 năm immutable
        // SST default đã làm điều này.
      });

      stack.addOutputs({
        URL: site.url,
        CustomDomain: site.customDomainUrl ?? "—",
      });
    });
  },
} satisfies SSTConfig;
