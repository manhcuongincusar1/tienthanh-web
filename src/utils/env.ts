// Sprint 5 task 01 + task 11 — 1 chỗ duy nhất đọc env (DECISIONS A6).
// 3 nguồn theo thứ tự ưu tiên:
//   1. window.__RUNTIME_CONFIG__ (runtime override, FE-11) — cho phép swap không rebuild.
//      Nếu giá trị còn dạng `__PLACEHOLDER__` (SST chưa replace) → bỏ qua, dùng nguồn dưới.
//   2. process.env.REACT_APP_* (build-time inject qua UMI `define` trong config/config.ts).
//   3. fallback string rỗng + console.error.

type RuntimeConfig = Partial<{
  REACT_APP_API_URL: string;
  REACT_APP_CDN_BASE: string;
  REACT_APP_ENV: 'dev' | 'prod';
  DEPLOYED_AT: string;
  GIT_SHA: string;
}>;

declare global {
  interface Window {
    __RUNTIME_CONFIG__?: RuntimeConfig;
  }
}

function isPlaceholder(v: unknown): boolean {
  return typeof v === 'string' && v.startsWith('__') && v.endsWith('__');
}

function read(key: keyof RuntimeConfig, buildValue: string | undefined): string {
  if (typeof window !== 'undefined') {
    const runtimeVal = window.__RUNTIME_CONFIG__?.[key];
    if (runtimeVal && !isPlaceholder(runtimeVal)) {
      return runtimeVal as string;
    }
  }
  return buildValue || '';
}

export const ENV = (read('REACT_APP_ENV', process.env.REACT_APP_ENV) || 'dev') as 'dev' | 'prod';
export const API_URL = read('REACT_APP_API_URL', process.env.REACT_APP_API_URL);
export const CDN_BASE = read('REACT_APP_CDN_BASE', process.env.REACT_APP_CDN_BASE);
export const DEPLOYED_AT = read('DEPLOYED_AT', undefined);
export const GIT_SHA = read('GIT_SHA', undefined);

if (typeof window !== 'undefined') {
  if (!API_URL) console.error('[env] REACT_APP_API_URL chưa set');
  if (!CDN_BASE) console.error('[env] REACT_APP_CDN_BASE chưa set');
}
