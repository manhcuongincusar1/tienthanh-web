import ProForm, { ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { useRef } from 'react';
import { message } from 'antd';
import { useIntl, history, useModel } from 'umi';
import ContainerForgotPassword from './components/ContainerForgotPassword';
import Styles from './index.less';
import { apiUser } from '@/api/users/api';
import _ from 'lodash';
import { encryptPassword } from '@/helpers/crypto';
import IconShowPassword from '@/components/Common/IconShowPassword';
import IconHidePassword from '@/components/Common/IconHidePassword';
import { TOKEN, MESSAGE_DISPLAY_SECONDS } from '@/constants';

export default function ChangePasswordFirst() {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const { username } = useModel('userChangePassword');
  const checkPassword = new RegExp('^(?=.*?[A-Z]{1})(?=.*?[a-z])(?=.*?[0-9]{1}).{6,128}$');

  const onFinish = async (data: any) => {
    const encryptTextNew = encryptPassword(data.repassword);
    if (username) {
      const response = await apiUser.changePasswordFirst({
        new_password: encryptTextNew,
        username: username,
      });
      if (response.status === 200) {
        message.success({
          content: intl.formatMessage({ id: 'pages.user.info.update_password_success' }),
          duration: MESSAGE_DISPLAY_SECONDS.SUCCESS,
          onClose: () => {
            localStorage.removeItem(TOKEN);
            history.push('/user/login');
          },
        });
      } else {
        localStorage.removeItem(TOKEN);
        history.push('/user/login');
      }
    }
  };

  return (
    <ContainerForgotPassword loading={false}>
      <div className={Styles.formNewPassword}>
        <h3 className={Styles.blockTitle}>
          <span>{intl.formatMessage({ id: 'pages.user.change_password.first' })}</span>
        </h3>
        <div className={Styles.formWrapper}>
          <ProForm
            onFinish={onFinish}
            formRef={formRef}
            submitter={{
              submitButtonProps: {
                shape: 'circle',
              },
              resetButtonProps: {
                shape: 'circle',
              },
              searchConfig: {
                resetText: intl.formatMessage({ id: 'form.cancel' }),
                submitText: intl.formatMessage({ id: 'pages.user.update' }),
              },
              onReset: () => {
                localStorage.removeItem(TOKEN);
                history.push('/user/login');
              },
              render: (props, dom) => {
                return <div className={Styles.formActions}>{dom}</div>;
              },
            }}
          >
            <ProFormText.Password
              label={intl.formatMessage({ id: 'form.enter_new_password.label' })}
              fieldProps={{
                iconRender: (visible) => (visible ? IconShowPassword : IconHidePassword),
              }}
              name="password"
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'form.please_enter_data' }),
                },
                {
                  pattern: checkPassword,
                  message: intl.formatMessage({ id: 'form.field.incorrect.password' }),
                },
              ]}
              placeholder={intl.formatMessage({
                id: 'form.enter_new_password.placeholder',
              })}
            />
            <ProFormText.Password
              name="repassword"
              label={intl.formatMessage({ id: 'form.enter_re_password' })}
              dependencies={['password']}
              fieldProps={{
                iconRender: (visible) => (visible ? IconShowPassword : IconHidePassword),
              }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'form.please_enter_data' }),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: 'form.field.match.password' })),
                    );
                  },
                }),
              ]}
              placeholder={intl.formatMessage({ id: 'form.enter_re_password' })}
            />
          </ProForm>
        </div>
      </div>
    </ContainerForgotPassword>
  );
}
