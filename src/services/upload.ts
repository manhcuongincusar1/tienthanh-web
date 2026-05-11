// S5/03 — presigned upload service.
// BE route: POST /_api/upload/presign (DECISIONS D1).
// BE INSERT media row ngay lúc presign — KHÔNG cần /confirm.
import axiosInstance from '../../utils/httpRequest';
import Settings from '../../config/defaultSettings';

export type PresignRequest = {
  filename: string;
  mime: string;
  size?: number;
  visibility?: 'public' | 'private';
  isConfidential?: boolean;
};

export type PresignResponse = {
  media_id: number | null;
  s3_key: string;
  upload_url: string;
  method: 'PUT';
  expires_in: number;
  visibility: 'public' | 'private';
  mime: string;
};

type Wrapped<T> = { status: number; message: string; data: T };

export async function presignUpload(body: PresignRequest): Promise<PresignResponse> {
  const res: Wrapped<PresignResponse> = await axiosInstance.post(
    `${Settings.APP_API}/upload/presign`,
    body,
  );
  if (res?.status !== 200 || !res?.data?.upload_url) {
    throw new Error(res?.message || 'presign_failed');
  }
  return res.data;
}
