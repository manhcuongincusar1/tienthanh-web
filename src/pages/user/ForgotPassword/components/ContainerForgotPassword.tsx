import { Col, Row, Spin } from 'antd';
import Styles from '../index.less';
interface ContainerForgotPasswordProps {
  children: React.ReactNode;
  loading?: boolean;
}
function ContainerForgotPassword({ children, loading }: ContainerForgotPasswordProps) {
  return (
    <div className={Styles.content}>
      <div className={Styles.container}>
        <Row gutter={30}>
          <Col span={24} lg={{ span: 12 }}>
            <div className={Styles.logo}>
              <img alt="logo" src="/images/logo.png" />
            </div>
            <h1 className={Styles.title}>Công ty BĐS Tiến Thành</h1>
            <p className={Styles.desc}>Hệ thống quản lý BĐS nội bộ</p>
          </Col>
          <Col span={24} lg={{ span: 12 }}>
            <Spin spinning={loading}>
              <div className={Styles.formBlock}>{children}</div>
            </Spin>
          </Col>
        </Row>
      </div>
      <div className={Styles.copyright}>
        <div className={Styles.container}>
          <div className={Styles.copyright__content}>
            <img src="/images/eos-logo.svg" alt="logo" />
            <span>Powered by EOS Solutions</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContainerForgotPassword;
