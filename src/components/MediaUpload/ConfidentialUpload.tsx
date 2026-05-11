// S5/04 — Wrapper trên MediaUpload có toggle isConfidential cho field generic.
// Field nghiệp vụ chuyên biệt (CMND, sổ đỏ, hợp đồng) → dùng `<MediaUpload isConfidential>` hard-code.
// Field generic (ảnh nội thất, doc generic) → dùng `<ConfidentialUpload>`.
import { useState } from 'react';
import { Checkbox, Space } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { MediaUpload, MediaUploadProps } from './MediaUpload';

export type ConfidentialUploadProps = Omit<MediaUploadProps, 'isConfidential'> & {
  defaultConfidential?: boolean;
  showToggle?: boolean;
};

export const ConfidentialUpload: React.FC<ConfidentialUploadProps> = ({
  defaultConfidential = false,
  showToggle = true,
  ...rest
}) => {
  const [confidential, setConfidential] = useState(defaultConfidential);
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {showToggle && (
        <Checkbox
          checked={confidential}
          onChange={(e) => setConfidential(e.target.checked)}
        >
          <LockOutlined /> Ảnh / tài liệu riêng tư (chỉ nội bộ xem qua signed URL)
        </Checkbox>
      )}
      <MediaUpload {...rest} isConfidential={confidential} />
    </Space>
  );
};

export default ConfidentialUpload;
