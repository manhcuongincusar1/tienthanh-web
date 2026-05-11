import { authService } from '@/services/authService';
import ProForm, { ProFormText, ProFormInstance } from '@ant-design/pro-form';
import { Button, Col, Row } from 'antd';
import React, { useRef, useEffect } from 'react';
import { useIntl, useModel, history, Link } from 'umi';
import { encryptPassword } from '@/helpers/crypto';
import _ from 'lodash';
import { mpireServiceWorker } from '@/utils';
import { apiNotifications } from '@/api/notifications/api';
import Styles from './index.less';
import message from 'antd/es/message';
import { TOKEN } from '@/constants';
import IconShowPassword from '@/components/Common/IconShowPassword';
import IconHidePassword from '@/components/Common/IconHidePassword';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import { CHECK_EMAIL } from '@/pages/expression';
import { getInitialState } from '@/app';

type ResponseLogin = {
  active: boolean;
  token: string;
  update_password: string;
};

const Login: React.FC = () => {
  const { setInitialState, refresh } = useModel('@@initialState');
  const checkPassword = new RegExp('^(?=.*?[A-Z]{1})(?=.*?[a-z])(?=.*?[0-9]{1}).{6,128}$');
  const { setUserName } = useModel('userChangePassword');
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (localStorage.getItem('auth_token')) {
      history.push('/real-estate-sell/list');
      window.location.reload();
    }
  }, []);

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      if (!_.isUndefined(values.password)) {
        const encryptText = encryptPassword(values.password);
        const res: ResponseLogin | any = await authService
          .login({
            username: values.username,
            password: encryptText,
          })
          .then((res) => res)
          .catch((error) => {
            console.log(error);
          });

        if (res.active === false) {
          message.error({
            content: intl.formatMessage({
              id: 'form.account_not_active',
            }),
            key: 'user_inactive',
            duration: MESSAGE_DISPLAY_SECONDS.ERROR,
          });
        } else if (res.active === true) {
          const { token } = res;
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: 'Thành công！',
          });
          message.success({
            content: defaultLoginSuccessMessage,
            duration: MESSAGE_DISPLAY_SECONDS.SUCCESS,
            key: 'login_sucess',
            onClose: async () => {
              if (res.update_password) {
                localStorage.setItem(TOKEN, token);
                await getInitialState().then(async (state) => {
                  const { fetchUserInfo } = state;
                  await fetchUserInfo?.().then(async (initialStateNew: any) => {
                    await setInitialState((s: any) => ({
                      ...s,
                      currentUser: initialStateNew?.currentUser,
                      listWorkspace: initialStateNew?.listWorkspace,
                    }));
                    history.push('/real-estate-sell/list');
                    refresh();
                  });
                });

                const existingSubscription: any = await mpireServiceWorker?.getUserSubscription();
                if (existingSubscription) {
                  await apiNotifications.postSubscriptionApi(existingSubscription);
                }
              } else {
                setUserName(values.username);
                history.push('/user/change-password-first');
                return true;
              }
            },
          });
        }
      }
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'form.field.incorrect_account',
        defaultMessage: 'Thất bại, vui lòng thử lại！',
      });

      message.error(
        { content: defaultLoginFailureMessage, key: 'failure' },
        MESSAGE_DISPLAY_SECONDS.ERROR,
      );
    }
  };

  return (
    <div className={Styles.content}>
      <img src="/images/bg-login.svg" alt="" className={Styles.bg} />
      <div className={Styles.container}>
        <div className={Styles.logo}>
          <img alt="logo" src="/images/logo.png" />
        </div>
        <h1 className={Styles.title}>Công ty BĐS Tiến Thành</h1>
        <p className={Styles.desc}>Hệ thống quản lý BĐS nội bộ</p>
        <Row gutter={30}>
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <ProForm
              onKeyUp={async (event) => {
                if (event.keyCode === 13) {
                  formRef.current?.submit();
                }
              }}
              formRef={formRef}
              onFinish={async (values) => {
                await handleSubmit(values as API.LoginParams);
              }}
              submitter={{
                render: (props) => {
                  return [
                    <div key="submit" className={Styles.formAction}>
                      <Link
                        to="/user/forgot-password"
                        className={Styles.btnForgot}
                        title={intl.formatMessage({ id: 'forms.forgot-password' })}
                      >
                        {intl.formatMessage({ id: 'form.forgot_password' })}
                      </Link>
                      <Button shape="circle" type="primary" onClick={() => props.form?.submit?.()}>
                        {intl.formatMessage({ id: 'form.login' })}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.52851 3.52859C5.78886 3.26824 6.21097 3.26824 6.47132 3.52859L10.4713 7.52859C10.7317 7.78894 10.7317 8.21105 10.4713 8.4714L6.47132 12.4714C6.21097 12.7317 5.78886 12.7317 5.52851 12.4714C5.26816 12.2111 5.26816 11.7889 5.52851 11.5286L9.05711 8L5.52851 4.4714C5.26816 4.21105 5.26816 3.78894 5.52851 3.52859Z"
                            fill="white"
                          />
                        </svg>
                      </Button>
                    </div>,
                  ];
                },
              }}
            >
              <ProFormText
                name="username"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.field.required.account' }),
                  },
                  {
                    pattern: CHECK_EMAIL,
                    message: intl.formatMessage({ id: 'form.field.incorrect.email' }),
                  },
                ]}
                label={intl.formatMessage({ id: 'form.label_account' })}
                placeholder={intl.formatMessage({ id: 'form.enter_account' })}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  iconRender: (visible) => (visible ? IconShowPassword : IconHidePassword),
                }}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.field.required.password' }),
                  },
                  {
                    pattern: checkPassword,
                    message: intl.formatMessage({ id: 'form.field.incorrect.password' }),
                  },
                ]}
                label={intl.formatMessage({ id: 'form.label_password' })}
                placeholder={intl.formatMessage({ id: 'form.enter_password' })}
              />
            </ProForm>
          </Col>
        </Row>
      </div>
      <div className={Styles.copyright}>
        <div className={Styles.container}>
          <div className={Styles.copyright__content}>
            <img src="/images/eos-logo.svg" alt="logo" />
            <span>Powered by EOS Solutions </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
