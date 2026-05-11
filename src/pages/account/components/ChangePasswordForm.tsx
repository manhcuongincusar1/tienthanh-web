import { forwardRef, useImperativeHandle, useRef } from 'react';
import ProForm, { ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { Row, Col } from 'antd';
import { useIntl } from 'umi';
import { history } from '@@/core/history';
import _ from 'lodash';

const AccountForm = forwardRef(({ userId, handleForm }: any, ref) => {
  const [form] = ProForm.useForm();
  const formRef = useRef<ProFormInstance>();

  const intl = useIntl();
  const checkPassword = new RegExp('^(?=.*?[A-Z]{1})(?=.*?[a-z])(?=.*?[0-9]{1}).{6,}$');

  useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
  }));

  const _bindEvent = {
    onFinish: async (values: any) => {
      await handleForm(values);
    },
    onReset: async (values: any) => {
      history.push(`/account/edit/${userId}`);
    },
  };

  const initialValues = {
    id: userId,
  };

  return (
    <ProForm
      formRef={formRef}
      form={form}
      onKeyUp={async (event) => {
        if (event.keyCode === 13) {
          formRef.current?.submit();
        }
      }}
      initialValues={initialValues}
      submitter={{
        searchConfig: {
          submitText: 'Lưu',
          resetText: 'Hủy',
        },

        render: (props, dom) => {
          return <div className="form-footer">{dom}</div>;
        },
      }}
      onFinish={_bindEvent.onFinish}
      onReset={_bindEvent.onReset}
    >
      <ProFormText hidden={true} name="id" />
      <Row gutter={16} justify="center" align="middle">
        <Col span={12}>
          <ProFormText.Password
            name="password"
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
            label={intl.formatMessage({ id: 'form.enter_new_password.label' })}
            placeholder={intl.formatMessage({ id: 'form.enter_new_password.placeholder' })}
            hasFeedback={true}
          />
          <ProFormText.Password
            name="re_password"
            dependencies={['password']}
            hasFeedback={true}
            placeholder={intl.formatMessage({ id: 'form.enter_confirm_password' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'form.field.required.re_password' }),
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
            label={intl.formatMessage({ id: 'form.enter_re_password' })}
          />
        </Col>
      </Row>
    </ProForm>
  );
});

export default AccountForm;
