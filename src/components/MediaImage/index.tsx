// MediaImage — Sprint 3 task 08.
// Render <picture> với srcset 2 size (D6) WebP only (D7).
// D5 KISS: nếu Lambda chưa kịp resize → onError retry sau 2s, max 3 lần.

import { useState, SyntheticEvent } from 'react';
import { cdnUrl, MediaSize } from '@/utils/cdn';

type Props = {
  s3Key?: string | null;
  // Fallback URL cho data cũ (chưa migrate, dùng cdn_path).
  fallbackSrc?: string;
  alt: string;
  size?: MediaSize;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
};

const MAX_RETRY = 3;
const RETRY_DELAY_MS = 2000;

export const MediaImage: React.FC<Props> = ({
  s3Key,
  fallbackSrc,
  alt,
  size = 'large',
  width,
  height,
  className,
  style,
}) => {
  const [retryCount, setRetryCount] = useState(0);

  // Fallback chain: s3Key → cdnUrl. Nếu không có s3Key, dùng fallbackSrc (legacy data).
  const primarySrc = s3Key ? cdnUrl(s3Key, size) : fallbackSrc || '';
  if (!primarySrc) return null;

  const handleError = (e: SyntheticEvent<HTMLImageElement>) => {
    if (!s3Key) return; // fallbackSrc URL đã cứng — không retry.
    if (retryCount >= MAX_RETRY) return;
    setTimeout(() => {
      setRetryCount((c) => c + 1);
      // Cache-bust để browser không serve lại response 404 cũ.
      const target = e.target as HTMLImageElement;
      target.src = `${cdnUrl(s3Key, size)}?t=${Date.now()}`;
    }, RETRY_DELAY_MS);
  };

  // Nếu chỉ có fallbackSrc (legacy), render <img> thường.
  if (!s3Key) {
    return (
      <img
        src={fallbackSrc}
        alt={alt}
        loading="lazy"
        width={width}
        height={height}
        className={className}
        style={style}
      />
    );
  }

  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${cdnUrl(s3Key, 'thumbnail')} 200w, ${cdnUrl(s3Key, 'large')} 1280w`}
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <img
        src={primarySrc}
        alt={alt}
        loading="lazy"
        width={width}
        height={height}
        className={className}
        style={style}
        onError={handleError}
      />
    </picture>
  );
};

export default MediaImage;
