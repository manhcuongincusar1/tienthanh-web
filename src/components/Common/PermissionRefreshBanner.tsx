// S5/09 — Banner báo permission đã đổi, gợi ý reload.
// Mount vào layout (xem ghi chú Acceptance: phần `app.tsx` hoặc layout cha).
import { useEffect, useState } from 'react';
import { Alert, Button } from 'antd';
import { onPermissionChanged } from '@/utils/permissionRefresh';
import { onAuthEvent } from '@/utils/authChannel';

export const PermissionRefreshBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const offLocal = onPermissionChanged(() => setVisible(true));
    const offCross = onAuthEvent((e) => {
      if (e.type === 'permission_changed') setVisible(true);
    });
    return () => {
      offLocal();
      offCross();
    };
  }, []);

  if (!visible) return null;

  return (
    <Alert
      type="warning"
      showIcon
      closable
      onClose={() => setVisible(false)}
      message="Quyền của bạn vừa được cập nhật. Một số menu có thể đã thay đổi."
      action={
        <Button size="small" onClick={() => window.location.reload()}>
          Tải lại trang
        </Button>
      }
      style={{ borderRadius: 0 }}
    />
  );
};

export default PermissionRefreshBanner;
