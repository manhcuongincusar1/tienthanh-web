// S5/11 — Runtime env template. SST hoặc deploy script thay __PLACEHOLDER__ → giá trị thật.
// File này KHÔNG load trực tiếp ở browser — `runtime-env.js` mới được load (xem document.ejs).
// Logic ưu tiên: window.__RUNTIME_CONFIG__ (nếu set + KHÔNG còn placeholder) → process.env (build-time UMI define) → fallback ''.
window.__RUNTIME_CONFIG__ = {
  REACT_APP_ENV: '__REACT_APP_ENV__',
  REACT_APP_API_URL: '__REACT_APP_API_URL__',
  REACT_APP_CDN_BASE: '__REACT_APP_CDN_BASE__',
  DEPLOYED_AT: '__DEPLOYED_AT__',
  GIT_SHA: '__GIT_SHA__',
};
