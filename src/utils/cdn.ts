// CDN URL helper — Sprint 3 task 08, DECISIONS A6/D4/D6/D7.
// UMI env qua process.env.REACT_APP_CDN_BASE (KHÔNG dùng import.meta.env).

export const CDN_BASE: string =
  process.env.REACT_APP_CDN_BASE || 'https://tienthanhcdn.datviet.ai';

export type MediaSize = 'thumbnail' | 'large';

// Tạo URL CDN từ s3_key + size. s3_key đã chứa full path (vd "uploads/public/2026/05/11/abc.png").
// CloudFront Function rewrite từ `/thumbnail/{key}` → `_resized/public/thumbnail/{key}.webp` (S4 task 10).
export function cdnUrl(s3Key: string, size: MediaSize = 'large'): string {
  if (!s3Key) return '';
  return `${CDN_BASE}/${size}/${s3Key}`;
}
