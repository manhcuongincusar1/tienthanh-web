// S5/05 — Render file private qua signed URL (DECISIONS D4).
// Auto-refresh URL trước khi hết hạn (CloudFront signed TTL = 5 phút).
import { useEffect, useRef, useState } from 'react';
import { Spin, Empty } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { getMediaUrl } from '@/services/media';

export type PrivateMediaProps = {
  mediaId: string | number;
  alt: string;
  size?: 'thumbnail' | 'large';
  width?: number;
  height?: number;
  className?: string;
  /** 'auto' detect by content_type. */
  renderAs?: 'image' | 'pdf' | 'auto';
};

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; url: string; contentType: string | null; expiresAt: number | null }
  | { kind: 'forbidden' }
  | { kind: 'error' };

const REFRESH_BEFORE_MS = 60 * 1000;

export const PrivateMedia: React.FC<PrivateMediaProps> = ({
  mediaId,
  alt,
  size = 'large',
  width,
  height,
  className,
  renderAs = 'auto',
}) => {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUrl = async () => {
      try {
        const data = await getMediaUrl(mediaId, size);
        if (cancelled) return;
        setState({
          kind: 'ready',
          url: data.url,
          contentType: data.content_type,
          expiresAt: data.expires_at,
        });
        if (data.expires_at) {
          const delay = Math.max(data.expires_at - Date.now() - REFRESH_BEFORE_MS, 1000);
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(fetchUrl, delay);
        }
      } catch (e: any) {
        if (cancelled) return;
        const status = e?.response?.status;
        setState({ kind: status === 403 ? 'forbidden' : 'error' });
      }
    };

    fetchUrl();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mediaId, size]);

  if (state.kind === 'loading') {
    return <Spin />;
  }
  if (state.kind === 'forbidden') {
    return (
      <Empty
        image={<LockOutlined style={{ fontSize: 48 }} />}
        description="Bạn không có quyền xem file này"
      />
    );
  }
  if (state.kind === 'error') {
    return <Empty description="Không tải được file" />;
  }

  const isPdf =
    renderAs === 'pdf' ||
    (renderAs === 'auto' && state.contentType === 'application/pdf');

  if (isPdf) {
    return (
      <iframe
        src={state.url}
        className={className}
        width={width || '100%'}
        height={height || 600}
        title={alt}
      />
    );
  }

  return (
    <img
      src={state.url}
      alt={alt}
      loading="lazy"
      width={width}
      height={height}
      className={className}
    />
  );
};

export default PrivateMedia;
