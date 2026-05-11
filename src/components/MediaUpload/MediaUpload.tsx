// S5/03 — Ant Design <Upload> wrapper dùng presigned URL flow.
// Drop-in replace cho `<Upload action="/api/upload">` cũ.
import { useState } from 'react';
import { Upload, Button, Progress, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile } from 'antd/es/upload/interface';
import { useS3Upload, UploadedMedia } from '@/hooks/useS3Upload';

export type MediaUploadProps = {
  onUploaded: (media: UploadedMedia) => void;
  onError?: (err: Error) => void;
  isConfidential?: boolean;
  /** Bytes. Default 25MB. */
  maxSize?: number;
  /** MIME whitelist FE-side (BE re-check magic bytes). */
  accept?: string;
  buttonText?: string;
  multiple?: boolean;
  showProgress?: boolean;
  disabled?: boolean;
};

const DEFAULT_MAX_SIZE = 25 * 1024 * 1024;

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onUploaded,
  onError,
  isConfidential,
  maxSize = DEFAULT_MAX_SIZE,
  accept,
  buttonText = 'Chọn file',
  multiple = false,
  showProgress = true,
  disabled = false,
}) => {
  const { upload, uploading, progress } = useS3Upload({ isConfidential });
  const [lastFileName, setLastFileName] = useState<string>('');

  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    if (file.size > maxSize) {
      message.error(`File quá lớn (max ${Math.round(maxSize / 1e6)}MB)`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const customRequest: UploadProps['customRequest'] = async (options) => {
    const file = options.file as RcFile;
    setLastFileName(file.name);
    try {
      const result = await upload(file);
      options.onSuccess?.(result, new XMLHttpRequest());
      onUploaded(result);
    } catch (e: any) {
      options.onError?.(e);
      message.error('Upload thất bại: ' + (e?.message || 'unknown'));
      onError?.(e);
    }
  };

  return (
    <div>
      <Upload
        beforeUpload={beforeUpload}
        customRequest={customRequest}
        accept={accept}
        multiple={multiple}
        showUploadList={false}
        disabled={disabled || uploading}
      >
        <Button icon={<UploadOutlined />} loading={uploading} disabled={disabled}>
          {buttonText}
        </Button>
      </Upload>
      {showProgress && uploading && (
        <Progress percent={progress} size="small" status="active" style={{ marginTop: 8 }} />
      )}
      {lastFileName && !uploading && (
        <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>{lastFileName}</div>
      )}
    </div>
  );
};

export default MediaUpload;
