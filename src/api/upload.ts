import BaseAPI from '@/api/baseAPI';
import axios from 'axios';

// Per DECISIONS D1: upload đi qua presigned URL flow, KHÔNG multipart qua server.
// Flow:
//   1. POST /_api/file/presign { filename, mime, size, isConfidential? }
//      → BE generate presigned PUT URL + insert media row → response { id, s3_key, upload_url, cdn_path, ... }
//   2. FE PUT file thẳng S3 qua upload_url
//   3. Lambda S3 event tự resize → CDN serve qua tienthanhcdn.datviet.ai/large/<key>

type PresignResponse = {
  data: {
    id: number;
    media_id: number;
    s3_key: string;
    upload_url: string;
    method: 'PUT';
    expires_in: number;
    visibility: 'public' | 'private';
    mime: string;
    cdn_path: string | null;
  };
  status: number;
};

type UploadResult = {
  id: number;
  media_id: number;
  s3_key: string;
  visibility: 'public' | 'private';
  cdn_path: string | null;
  path: string | null;
};

class Upload extends BaseAPI {
  uploadFile = async (file: File, isConfidential = false): Promise<UploadResult | undefined> => {
    if (!file) return undefined;
    const presign: PresignResponse = await this.httpApi(
      'file/presign',
      'post',
      {
        filename: file.name,
        mime: file.type,
        size: file.size,
        isConfidential,
      },
      {},
    );
    if (presign?.status !== 200 || !presign?.data?.upload_url) return undefined;
    const {upload_url, s3_key, mime, cdn_path, visibility, id, media_id} = presign.data;

    // PUT thẳng S3 — KHÔNG kèm Authorization header (presigned URL tự sign).
    // axios.create() instance không add auth interceptor cho S3 host.
    await axios.put(upload_url, file, {
      headers: {'Content-Type': mime || file.type || 'application/octet-stream'},
    });

    return {
      id: Number(id ?? media_id),
      media_id: Number(media_id ?? id),
      s3_key,
      visibility,
      cdn_path,
      path: cdn_path,
    };
  };

  uploadFileMul = async (fileList: File[]): Promise<UploadResult[]> => {
    const results: UploadResult[] = [];
    for (const file of fileList) {
      const r = await this.uploadFile(file);
      if (r) results.push(r);
    }
    return results;
  };
}

export const upload = new Upload();
