// MediaImage — S3/08 + S5/08 dual-mode fallback (DECISIONS D5/D6/D7/D9).
// State machine: new (s3_key) → legacy (cdn_path cũ) → placeholder.
// Trong cửa sổ migrate D9: record có thể có cả 2 hoặc chỉ 1.

import { useEffect, useState, SyntheticEvent } from 'react';
import { cdnUrl, MediaSize } from '@/utils/cdn';

export type MediaImageProps = {
  /** S3 key mới (sau migrate). Ưu tiên render. */
  s3Key?: string | null;
  /** Legacy URL (cdn_path cũ). Fallback nếu s3Key không load được. */
  legacyUrl?: string | null;
  /** @deprecated dùng `legacyUrl` thay. Giữ alias cho call site cũ S3/08. */
  fallbackSrc?: string;
  alt: string;
  size?: MediaSize;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
};

type Mode = 'new' | 'legacy' | 'placeholder';

const MAX_RETRY = 3;
const RETRY_DELAY_MS = 2000;

function pickInitialMode(s3Key?: string | null, legacy?: string | null): Mode {
  if (s3Key) return 'new';
  if (legacy) return 'legacy';
  return 'placeholder';
}

export const MediaImage: React.FC<MediaImageProps> = ({
  s3Key,
  legacyUrl,
  fallbackSrc,
  alt,
  size = 'large',
  width,
  height,
  className,
  style,
}) => {
  const legacy = legacyUrl ?? fallbackSrc ?? null;
  const [mode, setMode] = useState<Mode>(() => pickInitialMode(s3Key, legacy));
  const [retry, setRetry] = useState(0);

  // Reset state khi prop đổi (vd list re-render với key khác).
  useEffect(() => {
    setMode(pickInitialMode(s3Key, legacy));
    setRetry(0);
  }, [s3Key, legacy]);

  const handleError = (_e: SyntheticEvent<HTMLImageElement>) => {
    if (mode === 'new') {
      if (retry < MAX_RETRY) {
        setTimeout(() => setRetry((r) => r + 1), RETRY_DELAY_MS);
      } else if (legacy) {
        setMode('legacy');
        setRetry(0);
      } else {
        setMode('placeholder');
      }
    } else if (mode === 'legacy') {
      setMode('placeholder');
    }
  };

  if (mode === 'placeholder') {
    return (
      <div
        className={className}
        style={{
          width,
          height,
          background: '#f0f0f0',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#bbb',
          ...style,
        }}
      >
        —
      </div>
    );
  }

  if (mode === 'legacy') {
    return (
      <img
        src={legacy as string}
        alt={alt}
        loading="lazy"
        width={width}
        height={height}
        className={className}
        style={style}
        onError={handleError}
      />
    );
  }

  // mode === 'new'
  // Cache-bust trên retry để bypass CloudFront cache 404.
  const primarySrc =
    cdnUrl(s3Key as string, size) + (retry > 0 ? `?t=${Date.now()}` : '');
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${cdnUrl(s3Key as string, 'thumbnail')} 200w, ${cdnUrl(s3Key as string, 'large')} 1280w`}
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
