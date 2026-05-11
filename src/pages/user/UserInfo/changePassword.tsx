import { Form, Row, Col, Input, Button, Space, message } from 'antd';
import { history, useIntl } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import { apiUser } from '@/api/users/api';
import { encryptPassword } from '@/helpers/crypto';
import IconShowPassword from '@/components/Common/IconShowPassword';
import IconHidePassword from '@/components/Common/IconHidePassword';
import ProCard from '@ant-design/pro-card';
import itemRender from '@/helpers/breadcrumbHelper';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

interface DataForm {
  password: string;
  new_password: string;
  confirm_password: string;
}
export default function ChangePassword() {
  const intl = useIntl();
  const [formRef] = Form.useForm();
  const checkPassword = new RegExp('^(?=.*?[A-Z]{1})(?=.*?[a-z])(?=.*?[0-9]{1}).{6,}$');
  const onFinish = async (data: DataForm) => {
    const encryptText = encryptPassword(data.password);
    const encryptTextNew = encryptPassword(data.new_password);
    const response = await apiUser.changePassword({
      password: encryptText,
      new_password: encryptTextNew,
    });
    if (response.status === 200) {
      message.success({
        content: intl.formatMessage({ id: 'pages.user.change_password.success' }),
        duration: MESSAGE_DISPLAY_SECONDS.SUCCESS,
        onClose: () => {
          history.push('/user-info');
        },
      });
    } else {
      formRef.setFields([
        {
          name: 'password',
          errors: [intl.formatMessage({ id: 'form.current_password.error' })],
        },
      ]);
    }
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.user.change_password' }),
        ghost: true,
        breadcrumb: {
          itemRender: itemRender,
          routes: [
            {
              path: '/',
              breadcrumbName: intl.formatMessage({ id: 'global.home' }),
            },
            {
              path: '',
              breadcrumbName: intl.formatMessage({ id: 'pages.user.change_password' }),
            },
          ],
        },
        extra: [],
      }}
    >
      <ProCard>
        <Row style={{ marginTop: '40px' }}>
          <Col span={24} xxl={{ span: 8 }} lg={{ span: 12 }} md={{ span: 16 }}>
            <Form form={formRef} onFinish={onFinish} layout={'vertical'}>
              <Form.Item
                label={intl.formatMessage({ id: 'form.enter_current_password' })}
                name="password"
                hasFeedback={true}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.enter_info' }),
                  },
                  {
                    pattern: checkPassword,
                    message: intl.formatMessage({ id: 'form.field.incorrect.password' }),
                  },
                ]}
              >
                <Input.Password
                  iconRender={(visible) => (visible ? IconShowPassword : IconHidePassword)}
                  placeholder={intl.formatMessage({ id: 'form.field.required.current_password' })}
                />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'form.enter_new_password.label' })}
                name="new_password"
                hasFeedback={true}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.enter_info' }),
                  },
                  {
                    pattern: checkPassword,
                    message: intl.formatMessage({ id: 'form.field.incorrect.password' }),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') !== value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.error_duplicate_password' })),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  iconRender={(visible) => (visible ? IconShowPassword : IconHidePassword)}
                  placeholder={intl.formatMessage({ id: 'form.field.required.password' })}
                />
              </Form.Item>
              <Form.Item
                label={intl.formatMessage({ id: 'form.enter_confirm_password' })}
                name="confirm_password"
                hasFeedback={true}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.enter_info' }),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.field.match.password' })),
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  iconRender={(visible) => (visible ? IconShowPassword : IconHidePassword)}
                  placeholder={intl.formatMessage({ id: 'form.field.required.re_password' })}
                />
              </Form.Item>
              <Form.Item style={{ float: 'right' }}>
                <Space>
                  <Button type="primary" htmlType="submit" shape="circle">
                    {intl.formatMessage({ id: 'form.update' })}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
}
