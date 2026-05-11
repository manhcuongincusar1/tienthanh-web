import { ProFormInstance, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import { Button, Col, Form, message, Row } from 'antd';
import React, { ReactNode, useImperativeHandle } from 'react';
import { useIntl } from 'umi';
import { GlobalModalForm } from '../../../../components/GlobalForm';
import _ from 'lodash';
import { STATUS_ENUM } from '@/constants';
import { realEstateCategoryService } from '@/services/realEstateCategoryService';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

interface TableRef extends ProFormInstance {
  reloadTable: () => void;
}
type RealEstateCategoryFormProps = {
  title?: string;
  idData?: number;
  linkAnchor?: ReactNode;
  afterSubmit?: () => void;
  defaultData?: object;
  tableRef: React.MutableRefObject<TableRef | undefined>;
  handleResponseErrorFromCallApi: (keyResponse: string) => void;
  branch_id: string;
};

type ModalFormRef = {
  openModal: () => void;
  closeModal: () => void;
};

const RealEstateCategoryForm = React.forwardRef<ModalFormRef, RealEstateCategoryFormProps>(
  (props, ref) => {
    const intl = useIntl();
    const formRef = Form.useForm();
    const modalRef = React.useRef() as React.MutableRefObject<
      React.ElementRef<typeof GlobalModalForm>
    >;

    const {
      title,
      afterSubmit,
      linkAnchor,
      defaultData,
      tableRef,
      handleResponseErrorFromCallApi,
      branch_id,
    } = props;

    useImperativeHandle(ref, () => ({
      openModal() {
        modalRef.current.openModal();
      },
      closeModal() {
        modalRef.current.closeModal();
      },
    }));

    const _bindEvent = {
      onFinish: async (values: { [key: string]: any }): void => {
        const { title, status } = values;
        let statusUpdate = STATUS_ENUM.PENDING;
        if (status) {
          statusUpdate = STATUS_ENUM.ACTIVE;
        }
        if (!_.isUndefined(defaultData) && defaultData.id) {
          const response = await realEstateCategoryService.checkDuplicateRealEstateCategory({
            title: title.trim(),
            current_category_id: defaultData.id,
          });
          if (response) {
            formRef.current?.setFields([{ name: 'title', errors: ['Danh mục đã tồn tại'] }]);
          } else {
            const response: any = await realEstateCategoryService.update(defaultData.id, {
              title,
              status: statusUpdate,
              branch_id,
            });
            if (response?.keyResponse) {
              handleResponseErrorFromCallApi(response?.keyResponse);
              return;
            }

            if (response?.status == 200) {
              message.success(
                intl.formatMessage({ id: 'global.success' }),
                MESSAGE_DISPLAY_SECONDS.SUCCESS,
              );
              modalRef.current?.closeModal();
              tableRef.current?.reloadTable();
            } else {
              message.error(
                intl.formatMessage({ id: 'global.fail' }),
                MESSAGE_DISPLAY_SECONDS.ERROR,
              );
            }
          }
        } else {
          const response = await realEstateCategoryService.checkDuplicateRealEstateCategory({
            title: title.trim(),
            current_category_id: undefined,
          });

          if (response) {
            formRef.current?.setFields([
              {
                name: 'title',
                errors: [intl.formatMessage({ id: 'pages.real_estate_category.title_error' })],
              },
            ]);
          } else {
            const response: any = await realEstateCategoryService.createRealEstateCategory({
              title,
              status: statusUpdate,
              branch_id,
            });
            if (response?.keyResponse) {
              handleResponseErrorFromCallApi(response?.keyResponse);
              return;
            }

            if (response?.status == 200) {
              message.success(
                intl.formatMessage({ id: 'global.success' }),
                MESSAGE_DISPLAY_SECONDS.SUCCESS,
                () => {
                  modalRef.current?.closeModal();
                  formRef.current?.resetFields();
                  afterSubmit?.();
                },
              );
            } else {
              message.error(
                intl.formatMessage({ id: 'global.fail' }),
                MESSAGE_DISPLAY_SECONDS.ERROR,
              );
            }
          }
        }
      },
    };

    return (
      <GlobalModalForm
        actions={{
          onFinish: _bindEvent.onFinish,
        }}
        formRef={formRef}
        ref={modalRef}
        initialValues={{
          status: true,
          is_editable_re: true,
          is_default: false,
          ...defaultData,
        }}
        title={title}
        trigger={
          linkAnchor ? (
            linkAnchor
          ) : (
            <Button type="primary" key="primary" shape="circle" size="small">
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
                  d="M7.99984 2.66667C8.36803 2.66667 8.6665 2.96514 8.6665 3.33333V7.33333H12.6665C13.0347 7.33333 13.3332 7.63181 13.3332 8C13.3332 8.36819 13.0347 8.66667 12.6665 8.66667H8.6665V12.6667C8.6665 13.0349 8.36803 13.3333 7.99984 13.3333C7.63165 13.3333 7.33317 13.0349 7.33317 12.6667V8.66667H3.33317C2.96498 8.66667 2.6665 8.36819 2.6665 8C2.6665 7.63181 2.96498 7.33333 3.33317 7.33333H7.33317V3.33333C7.33317 2.96514 7.63165 2.66667 7.99984 2.66667Z"
                  fill="white"
                />
              </svg>
              {intl.formatMessage({ id: 'global.create_new' })}
            </Button>
          )
        }
      >
        {!_.isUndefined(defaultData) && defaultData.id && (
          <Row gutter={24}>
            <Col span={24}>
              <ProFormText
                name={`code`}
                label={intl.formatMessage({ id: 'pages.real_estate_category.code' })}
                disabled={true}
              />
            </Col>
          </Row>
        )}
        <Row gutter={24}>
          <Col span={24}>
            <ProFormText
              name={`title`}
              label={intl.formatMessage({ id: 'pages.real_estate_category.title' })}
              hasFeedback={true}
              placeholder={intl.formatMessage({ id: 'form.enter_data' })}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'form.field.required' }),
                },
              ]}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <ProFormSwitch name={`status`} label={intl.formatMessage({ id: 'global.active' })} />
          </Col>
        </Row>
      </GlobalModalForm>
    );
  },
);

export default RealEstateCategoryForm;
