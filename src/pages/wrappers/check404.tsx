import NoFoundPage from '@/pages/404';
import ComponentForbidden from '@/pages/403';
import { useModel } from 'umi';
import { Button } from 'antd';

export default (props: any) => {
  const {
    initialState: { show404, show403 },
  }: any = useModel('@@initialState');
  if (show403) {
    return (
      <ComponentForbidden
        children={
          <Button
            type="primary"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Quay lại trang chủ
          </Button>
        }
      />
    );
  }
  if (show404) {
    return <NoFoundPage />;
  }
  if (!show404 && !show403) {
    return <div>{props.children}</div>;
  }
};
