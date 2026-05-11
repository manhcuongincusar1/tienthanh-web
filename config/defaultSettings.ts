const isDev = process.env.NODE_ENV === 'development';
let RUNTIME_ENV = {};
if (typeof window !== 'undefined') {
  RUNTIME_ENV = window.__RUNTIME_CONFIG__;
}
import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
  APP_API?: string;
  APP_ROOT?: string;
  APP_API_ADMINISTRATIVE?: string;
  secretKey: string;
  publicVapidKey: string;
  useServiceWorker?: boolean;
  SHOW_BRANCH: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#3169B3',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'TITA',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
  APP_API: (isDev ? process.env.UMI_APP_DEV_API : RUNTIME_ENV.UMI_APP_API) || '',
  APP_ROOT: (isDev ? process.env.UMI_APP_DEV_ROOT : RUNTIME_ENV.UMI_APP_ROOT) || '',
  APP_API_ADMINISTRATIVE:
    (isDev ? process.env.UMI_ADMINISTRATIVE_DEV_API : RUNTIME_ENV.UMI_ADMINISTRATIVE_API) || '',
  secretKey: 'djfshfsdjfhdsfjdshfjsdfh',
  publicVapidKey:
    'BEEQu35i-gHV59m-9JfaLbtBDRQN1W3su3niYGII7o55iWIe50cLi60h0qkgY4OMY_bAg1Q2rk5VLmdATEdeTmc',
  useServiceWorker: true,
  SHOW_BRANCH: (isDev ? process.env.UMI_APP_SHOW_BRANCH : RUNTIME_ENV.UMI_APP_SHOW_BRANCH) || '',
};

export default Settings;
