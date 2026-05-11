import { Button, Result } from 'antd';
import React from 'react';

const NoFoundPage: React.FC = ({ children }) => (
  <Result
    status="403"
    title="403"
    subTitle="Xin lỗi, Bạn không được quyền truy cập vào trang này."
    extra={children}
  />
);

export default NoFoundPage;
