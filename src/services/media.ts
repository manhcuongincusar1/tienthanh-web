// S5/05 — fetch URL signed cho file (public dùng CDN; private dùng CloudFront signed).
import axiosInstance from '../../utils/httpRequest';
import Settings from '../../config/defaultSettings';

export type MediaUrlResponse = {
  url: string;
  expires_at: number | null;
  content_type: string | null;
  file_name: string | null;
  visibility: 'public' | 'private';
};

type Wrapped<T> = { status: number; message: string; data: T };

export async function getMediaUrl(
  mediaId: string | number,
  size: 'thumbnail' | 'large' = 'large',
): Promise<MediaUrlResponse> {
  const res: Wrapped<MediaUrlResponse> = await axiosInstance.get(
    `${Settings.APP_API}/file/url/${mediaId}`,
    { params: { size } },
  );
  if (res?.status !== 200 || !res?.data?.url) {
    throw new Error(res?.message || 'media_url_failed');
  }
  return res.data;
}
