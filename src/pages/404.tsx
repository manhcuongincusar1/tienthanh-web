import { Button, Result } from 'antd';
import React from 'react';
import { history } from 'umi';

const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    subTitle=" Xin lỗi, Bạn đang truy cập vào trang không tồn tại.."
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        Quay lại trang chủ
      </Button>
    }
  />
);

export default NoFoundPage;
