import { ModalForm, ProFormInstance } from '@ant-design/pro-form';
import { Form, ModalProps } from 'antd';
import React, { ReactNode, useImperativeHandle, useState } from 'react';
import { useIntl } from 'umi';
import _ from 'lodash';

interface GlobalModalFormProps extends ModalProps {
  title?: string;
  name?: string;
  initialValues?: {
    id?: string;
  };
  textField?: {
    okText?: string;
  };
  submitter: any;
  trigger: any;
  request?: any;
  params?: Record<string, any> | undefined;
  modalProps?: Omit<ModalProps, 'visible'>;
  children?: ReactNode;
  formRef:
    | React.MutableRefObject<ProFormInstance<any> | undefined>
    | React.RefObject<ProFormInstance<any> | undefined>
    | undefined;
  actions?: {
    onFinish?: (values: any) => Promise<boolean | undefined | void>;
    onVisibleChange?: () => void;
    onCancel?: () => void;
    onValuesChange?: () => void;
  };
}

type GlobalModalFormRef = {
  openModal: () => void;
  closeModal: () => void;
};

const GlobalModalForm = React.forwardRef<GlobalModalFormRef, GlobalModalFormProps>((props, ref) => {
  const intl = useIntl();
  const [visible, setVisible] = useState(false);

  const {
    title,
    name,
    children,
    actions,
    formRef,
    initialValues,
    submitter,
    textField,
    params,
    request,
    modalProps,
    ...rest
  } = props;

  useImperativeHandle(ref, () => ({
    openModal() {
      setVisible(true);
    },
    closeModal() {
      setVisible(false);
    },
  }));

  return (
    <Form.Provider>
      <ModalForm
        title={title}
        name={name}
        initialValues={initialValues}
        params={params}
        formRef={formRef}
        visible={visible}
        request={request}
        onVisibleChange={actions?.onVisibleChange ? actions.onVisibleChange : setVisible}
        onValuesChange={actions?.onValuesChange}
        onFinish={actions?.onFinish}
        modalProps={{
          destroyOnClose: true,
          onCancel: actions?.onCancel,
          okText: textField?.okText,
          closeIcon: (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
              />
            </svg>
          ),
          ...modalProps,
        }}
        submitter={
          submitter && {
            searchConfig: {
              resetText: intl.formatMessage({ id: 'global.form.button_cancel' }),
              submitText: _.isUndefined(initialValues?.id)
                ? intl.formatMessage({ id: 'global.form.button_create' })
                : intl.formatMessage({ id: 'global.form.button_ok' }),
            },
            submitButtonProps: {
              shape: 'circle',
            },
            resetButtonProps: {
              shape: 'circle',
            },
          }
        }
        {...rest}
      >
        {children}
      </ModalForm>
    </Form.Provider>
  );
});

GlobalModalForm.defaultProps = {};
export default GlobalModalForm;
