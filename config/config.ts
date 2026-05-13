// https://umijs.org/config/
import { join } from 'path';
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

// Sprint 5 task 01 — domain switch.
// 2 env: dev (local) + prod (DECISIONS E10 — không có staging).
// Build-time inject qua UMI `define`. Runtime override qua `public/runtime-env.js` (task FE-11).
const API_URL_MAP: Record<string, string> = {
  dev: 'http://localhost:3002',
  prod: 'https://tienthanhapi.datviet.ai',
};
const CDN_BASE_MAP: Record<string, string> = {
  dev: 'http://localhost:3002/uploads',
  prod: 'https://tienthanhcdn.datviet.ai',
};
const envName = REACT_APP_ENV || 'dev';

export default defineConfig({
  // Prod deploy ở root domain (tienthanh.datviet.ai), không có /cms prefix.
  // Local dev có thể vẫn dùng /cms qua proxy nếu cần.
  base: process.env.REACT_APP_ENV === 'prod' ? '/' : '/cms',
  hash: true,
  // Bắt buộc khai báo vendor chunks ở đây để html-webpack-plugin inject <script> tag.
  // Không có dòng này: umi.js entry queue `W.O(["vendor"], ...)` chờ vendor chunk
  // không bao giờ load → React không mount → splash đứng vĩnh viễn (dev + prod).
  // Order quan trọng: vendor trước, umi sau. vendor-echarts là async, webpack tự lo.
  chunks: ['vendor', 'vendor-antd', 'vendor-lodash', 'vendor-moment', 'umi'],
  define: {
    'process.env.REACT_APP_ENV': envName,
    'process.env.REACT_APP_API_URL':
      process.env.REACT_APP_API_URL || API_URL_MAP[envName] || API_URL_MAP.dev,
    'process.env.REACT_APP_CDN_BASE':
      process.env.REACT_APP_CDN_BASE || CDN_BASE_MAP[envName] || CDN_BASE_MAP.dev,
  },
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'vi-VN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
    title: false,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  workerLoader: {},
  chainWebpack(memo) {
    // Dev: MFSU pre-bundles vendors + lock `chunks: ['umi']` (mfsu.js:250 stage:Infinity).
    // Custom splitChunks tạo orphan vendor.js mà HTML không inject → entry chờ
    // `W.O(["vendor"], ...)` mãi mãi → React không mount → splash đứng vĩnh viễn.
    // Chỉ split ở prod build (MFSU off mặc định) — `chunks: [...]` ở trên inject đủ.
    if (process.env.NODE_ENV !== 'production') return;
    memo.optimization.splitChunks({
      chunks: 'all',
      minSize: 30000,
      cacheGroups: {
        antd: {
          name: 'vendor-antd',
          test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
          priority: 30,
          chunks: 'all',
        },
        moment: {
          // Giữ moment.js per DECISIONS C7. Tách chunk để cache lâu dài.
          name: 'vendor-moment',
          test: /[\\/]node_modules[\\/](moment|moment-timezone)[\\/]/,
          priority: 25,
          chunks: 'all',
        },
        lodash: {
          name: 'vendor-lodash',
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          priority: 25,
          chunks: 'all',
        },
        echarts: {
          name: 'vendor-echarts',
          test: /[\\/]node_modules[\\/](echarts|zrender|@antv)[\\/]/,
          priority: 22,
          chunks: 'all',
        },
        vendors: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'all',
        },
      },
    });
  },
});
