// Sprint 5 task 01 — 1 chỗ duy nhất đọc env (DECISIONS A6).
// 3 nguồn theo thứ tự ưu tiên:
//   1. window.__RUNTIME_CONFIG__ (runtime override, FE-11) — cho phép swap không rebuild.
//   2. process.env.REACT_APP_* (build-time inject qua UMI `define`).
//   3. fallback string rỗng + console.error.

type RuntimeConfig = Partial<{
  REACT_APP_API_URL: string;
  REACT_APP_CDN_BASE: string;
  REACT_APP_ENV: 'dev' | 'prod';
}>;

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

function read(key: keyof RuntimeConfig, buildValue: string | undefined): string {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__?.[key]) {
    return window.__RUNTIME_CONFIG__[key] as string;
  }
  return buildValue || '';
}

export const ENV = (read('REACT_APP_ENV', process.env.REACT_APP_ENV) || 'dev') as 'dev' | 'prod';
export const API_URL = read('REACT_APP_API_URL', process.env.REACT_APP_API_URL);
export const CDN_BASE = read('REACT_APP_CDN_BASE', process.env.REACT_APP_CDN_BASE);

if (typeof window !== 'undefined') {
  if (!API_URL) console.error('[env] REACT_APP_API_URL chưa set');
  if (!CDN_BASE) console.error('[env] REACT_APP_CDN_BASE chưa set');
}
