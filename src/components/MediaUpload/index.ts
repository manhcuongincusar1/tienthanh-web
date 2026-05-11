// S5/03 + S5/04 + S5/05.
export { MediaUpload } from './MediaUpload';
export type { MediaUploadProps } from './MediaUpload';
export { ConfidentialUpload } from './ConfidentialUpload';
export type { ConfidentialUploadProps } from './ConfidentialUpload';
export { PrivateMedia } from './PrivateMedia';
export type { PrivateMediaProps } from './PrivateMedia';

// MIME whitelists (FE-side; BE re-check magic bytes).
// DECISIONS D2: SVG cấm hoàn toàn.
export const ACCEPT_IMAGE = 'image/jpeg,image/png,image/webp';
export const ACCEPT_DOC = 'application/pdf,image/jpeg,image/png,image/webp';
