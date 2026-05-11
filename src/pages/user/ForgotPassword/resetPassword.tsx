import ProForm, { ProFormText } from '@ant-design/pro-form';
import React, { useState, useLayoutEffect } from 'react';
import { message, Button } from 'antd';
import { useIntl, history } from 'umi';
import ContainerForgotPassword from './components/ContainerForgotPassword';
import Styles from './index.less';
import { apiUser } from '@/api/users/api';
import _ from 'lodash';
import { encryptPassword } from '@/helpers/crypto';
import IconShowPassword from '@/components/Common/IconShowPassword';
import IconHidePassword from '@/components/Common/IconHidePassword';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

interface DataForm {
  password: string;
  repassword: string;
}

export default function ResetPassword() {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);

  const checkPassword = new RegExp('^(?=.*?[A-Z]{1})(?=.*?[a-z])(?=.*?[0-9]{1}).{6,}$');
  const [body, setBody] = useState<React.ReactNode>();
  const onFinish = async (data: DataForm) => {
    const encryptText = encryptPassword(data.password);
    const activationKey = history.location.query?.activation_key;
    if (typeof activationKey === 'string') {
      await apiUser
        .resetPassword({
          password: encryptText,
          activation_key: activationKey,
        })
        .then((res) => {
          if (res.status === 200) {
            message.success(
              {
                content: intl.formatMessage({ id: 'form.change_password_success' }),
                duration: 2,
                key: 'change_password_succes',
                onClose: () => {
                  history.push('/user/login');
                },
              },
              MESSAGE_DISPLAY_SECONDS.SUCCESS,
            );
          }
        })
        .catch((error) => {
          message.error({
            content: intl.formatMessage({ id: 'form.change_password_error' }),
            duration: MESSAGE_DISPLAY_SECONDS.ERROR,
            key: 'change_password_error',
          });
        });
    }
  };
  useLayoutEffect(() => {
    if (
      (_.isEmpty(history.location.query) &&
        _.isUndefined(history.location.query?.activation_key)) ||
      _.isEmpty(history.location.query?.activation_key)
    ) {
      history.push('/user/login');
    } else {
      const checkToken = async () => {
        const activation_key = history.location.query?.activation_key;
        if (typeof activation_key === 'string') {
          return await apiUser
            .checkTokenResetPassword({
              activation_key: activation_key,
            })
            .then((res) => {
              if (res.status === 404) {
                setBody(
                  <div className={Styles.formRequestAlert}>
                    <span className={Styles.icon}>
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M21.9337 4.75647C22.8697 4.22949 23.9258 3.95264 24.9999 3.95264C26.0741 3.95264 27.1302 4.22949 28.0662 4.75647C29.0022 5.28346 29.7866 6.04279 30.3437 6.96121L30.3497 6.97111L47.9955 36.4295L48.0124 36.4582C48.5581 37.4033 48.8469 38.4748 48.85 39.5661C48.853 40.6574 48.5703 41.7305 48.0298 42.6786C47.4894 43.6267 46.7102 44.4168 45.7696 44.9703C44.829 45.5237 43.7599 45.8212 42.6687 45.8332L42.6458 45.8335L7.33121 45.8334C6.23995 45.8214 5.17086 45.5237 4.2303 44.9703C3.28973 44.4168 2.51047 43.6267 1.97004 42.6786C1.42962 41.7305 1.14687 40.6574 1.14993 39.5661C1.15298 38.4748 1.44174 37.4033 1.98746 36.4582L2.00438 36.4295L19.6562 6.96119C20.2133 6.04278 20.9977 5.28346 21.9337 4.75647ZM24.9999 8.1193C24.6419 8.1193 24.2899 8.21159 23.9779 8.38725C23.6673 8.56212 23.4068 8.81374 23.2212 9.11802L5.58887 38.5538C5.41142 38.8659 5.31758 39.2186 5.31658 39.5778C5.31556 39.9415 5.40981 40.2992 5.58995 40.6153C5.77009 40.9313 6.02985 41.1947 6.34337 41.3792C6.65415 41.562 7.00701 41.6611 7.36744 41.6667H42.6325C42.9929 41.6611 43.3457 41.562 43.6565 41.3792C43.97 41.1947 44.2298 40.9313 44.4099 40.6153C44.5901 40.2992 44.6843 39.9415 44.6833 39.5778C44.6823 39.2187 44.5885 38.866 44.4111 38.5539L26.7812 9.12216C26.7804 9.12078 26.7795 9.1194 26.7787 9.11802C26.5931 8.81374 26.3326 8.56212 26.022 8.38725C25.71 8.21159 25.358 8.1193 24.9999 8.1193ZM24.9999 16.6667C26.1505 16.6667 27.0833 17.5994 27.0833 18.75V27.0834C27.0833 28.2339 26.1505 29.1667 24.9999 29.1667C23.8493 29.1667 22.9166 28.2339 22.9166 27.0834V18.75C22.9166 17.5994 23.8493 16.6667 24.9999 16.6667ZM22.9166 35.4167C22.9166 34.2661 23.8493 33.3334 24.9999 33.3334H25.0208C26.1714 33.3334 27.1041 34.2661 27.1041 35.4167C27.1041 36.5673 26.1714 37.5 25.0208 37.5H24.9999C23.8493 37.5 22.9166 36.5673 22.9166 35.4167Z"
                          fill="#FAAD14"
                        />
                      </svg>
                    </span>
                    <h3 className={`${Styles.alertTitle} ${Styles.alertTitleWarning}`}>
                      {intl.formatMessage({ id: 'pages.user.reset_password.expire' })}
                    </h3>
                    <p className={Styles.alertDesc}>
                      {intl.formatMessage({ id: 'pages.user.reset_password.rejected' })}
                    </p>
                    <Button
                      type="primary"
                      shape="circle"
                      onClick={() => history.push('/user/login')}
                    >
                      {intl.formatMessage({ id: 'form.login' })}
                    </Button>
                  </div>,
                );
                setLoading(false);
              } else if (res.status === 200) {
                setBody(
                  <div className={Styles.formNewPassword}>
                    <h3 className={Styles.blockTitle}>
                      <span>{intl.formatMessage({ id: 'pages.user.reset_password.create' })}</span>
                    </h3>
                    <div className={Styles.formWrapper}>
                      <ProForm
                        onFinish={onFinish}
                        submitter={{
                          submitButtonProps: {
                            shape: 'circle',
                          },
                          resetButtonProps: {
                            shape: 'circle',
                          },
                          searchConfig: {
                            resetText: intl.formatMessage({ id: 'form.cancel' }),
                            submitText: intl.formatMessage({ id: 'form.save_password' }),
                          },
                          onReset: () => {
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
                            iconRender: (visible) =>
                              visible ? IconShowPassword : IconHidePassword,
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
                            iconRender: (visible) =>
                              visible ? IconShowPassword : IconHidePassword,
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
                                  new Error(
                                    intl.formatMessage({ id: 'form.field.match.password' }),
                                  ),
                                );
                              },
                            }),
                          ]}
                          placeholder={intl.formatMessage({ id: 'form.enter_re_password' })}
                        />
                      </ProForm>
                    </div>
                  </div>,
                );
              }
              return res;
            })
            .catch((error) => {
              return { status: 404 };
            });
        }
      };
      checkToken();
    }
    setLoading(false);
  }, []);
  return <ContainerForgotPassword loading={loading}>{body}</ContainerForgotPassword>;
}
