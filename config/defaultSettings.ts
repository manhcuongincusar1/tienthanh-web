// S5 task 01 — đọc env qua src/utils/env.ts (runtime > build > fallback).
// Giữ shape Settings.APP_API / APP_ROOT cũ → call sites khắp src/api/* không phải đổi.
import { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { API_URL, CDN_BASE } from '../src/utils/env';

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
  // APP_API = `${REACT_APP_API_URL}/_api` — BE mount routes dưới /_api/*.
  APP_API: API_URL ? `${API_URL}/_api` : '',
  APP_ROOT: API_URL || '',
  APP_API_ADMINISTRATIVE: API_URL ? `${API_URL}/_api` : '',
  secretKey: 'djfshfsdjfhdsfjdshfjsdfh',
  publicVapidKey:
    'BEEQu35i-gHV59m-9JfaLbtBDRQN1W3su3niYGII7o55iWIe50cLi60h0qkgY4OMY_bAg1Q2rk5VLmdATEdeTmc',
  useServiceWorker: true,
  SHOW_BRANCH: '1',
};

// Expose CDN_BASE qua window cho `src/components/MediaImage` (S3 task 08).
if (typeof window !== 'undefined' && CDN_BASE) {
  (window as any).__CDN_BASE__ = CDN_BASE;
}

export default Settings;
