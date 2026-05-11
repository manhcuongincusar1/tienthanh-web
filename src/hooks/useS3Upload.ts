// S5/03 — hook upload trực tiếp lên S3 qua presigned PUT URL (DECISIONS D1).
import { useRef, useState } from 'react';
import { presignUpload, PresignResponse } from '@/services/upload';

export type UseS3UploadOptions = {
  isConfidential?: boolean;
  visibility?: 'public' | 'private';
  onProgress?: (pct: number) => void;
};

export type UploadedMedia = {
  mediaId: number | null;
  s3Key: string;
  visibility: 'public' | 'private';
  mime: string;
};

export function useS3Upload(opts: UseS3UploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const upload = async (file: File): Promise<UploadedMedia> => {
    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      const presigned = await presignUpload({
        filename: file.name,
        mime: file.type,
        size: file.size,
        isConfidential: opts.isConfidential,
        visibility: opts.visibility,
      });

      await putToS3(file, presigned, (pct) => {
        setProgress(pct);
        opts.onProgress?.(pct);
      }, xhrRef);

      return {
        mediaId: presigned.media_id,
        s3Key: presigned.s3_key,
        visibility: presigned.visibility,
        mime: presigned.mime,
      };
    } catch (e: any) {
      const err = e instanceof Error ? e : new Error(String(e));
      setError(err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const abort = () => {
    xhrRef.current?.abort();
  };

  return { upload, abort, uploading, error, progress };
}

function putToS3(
  file: File,
  presigned: PresignResponse,
  onProgress: (pct: number) => void,
  xhrRef: React.MutableRefObject<XMLHttpRequest | null>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open(presigned.method, presigned.upload_url, true);
    // Content-Type khớp với mime đã sign — nếu lệch S3 reject.
    xhr.setRequestHeader('Content-Type', presigned.mime);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`S3 PUT ${xhr.status}: ${xhr.responseText?.slice(0, 200)}`));
    };
    xhr.onerror = () => reject(new Error('S3 PUT network error'));
    xhr.onabort = () => reject(new Error('aborted'));
    xhr.send(file);
  });
}
