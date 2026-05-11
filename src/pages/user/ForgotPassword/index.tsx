import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { history, useIntl } from 'umi';
import { apiUser } from '@/api/users/api';
import Styles from './index.less';
import ProForm, { ProFormInstance, ProFormText } from '@ant-design/pro-form';
import ContainerForgotPassword from './components/ContainerForgotPassword';
import { CHECK_EMAIL } from '@/pages/expression';

interface DataForm {
  username: string;
}

export default function ForgotPassword() {
  const [body, setBody] = useState<React.ReactNode>();
  const intl = useIntl();
  const formRef = useRef<ProFormInstance<DataForm>>();
  const [loading, setLoading] = useState<boolean>(true);
  const onFinish = async (data: DataForm) => {
    const response = await apiUser.checkUserExist(data);

    if (response.active) {
      const response = await apiUser.sendEmailResetPassword(data);

      if (response.status === 200) {
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
                  d="M43.1398 11.0282C43.9534 11.8418 43.9534 13.1608 43.1398 13.9744L20.2231 36.8911C19.4095 37.7047 18.0905 37.7047 17.2769 36.8911L6.86019 26.4744C6.0466 25.6608 6.0466 24.3418 6.86019 23.5282C7.67379 22.7146 8.99288 22.7146 9.80647 23.5282L18.75 32.4717L40.1935 11.0282C41.0071 10.2146 42.3262 10.2146 43.1398 11.0282Z"
                  fill="#389E0D"
                />
              </svg>
            </span>
            <h3 className={`${Styles.alertTitle} ${Styles.alertTitleSuccess}`}>
              {intl.formatMessage({ id: 'pages.user.forgot_password.send_success' })}
            </h3>
            <p className={Styles.alertDesc}>
              {intl.formatMessage({ id: 'pages.user.forgot_password.check_mail' })}
            </p>
            <Button type="primary" onClick={() => history.push('/user/login')} shape="circle">
              Đăng nhập
            </Button>
          </div>,
        );
        setLoading(false);
      } else {
        setLoading(false);

        formRef?.current?.setFields([
          {
            name: 'username',
            errors: [intl.formatMessage({ id: 'form.account_notfound' })],
          },
        ]);
      }
    } else if (response.active === false) {
      formRef.current?.setFields([
        { name: 'username', errors: [intl.formatMessage({ id: 'form.account_not_active' })] },
      ]);
    } else {
      setLoading(false);
      formRef?.current?.setFields([
        {
          name: 'username',
          errors: [intl.formatMessage({ id: 'form.account_notfound' })],
        },
      ]);
    }
  };

  useEffect(() => {
    setLoading(false);
    setBody(
      <div>
        <h3 className={Styles.blockTitle}>
          <span>{intl.formatMessage({ id: 'pages.user.forgot_password.title' })}</span>
        </h3>
        <p className={Styles.formDesc}>
          {intl.formatMessage({ id: 'pages.user.forgot_password.sub_title' }, { br: <br /> })}
        </p>
        <ProForm
          formRef={formRef}
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
              submitText: intl.formatMessage({ id: 'form.send' }),
            },
            onReset: () => {
              history.push('/user/login');
            },
            render: (props, dom) => {
              return <div className={Styles.formActions}>{dom}</div>;
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
                message: intl.formatMessage({ id: 'form.field.required.account' }),
              },
            ]}
            placeholder={intl.formatMessage({ id: 'form.enter_data_email' })}
          />
        </ProForm>
      </div>,
    );
  }, []);
  return <ContainerForgotPassword loading={loading}>{body}</ContainerForgotPassword>;
}
