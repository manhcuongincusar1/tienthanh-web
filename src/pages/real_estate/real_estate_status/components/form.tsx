import { ProFormInstance, ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import { Button, Col, Form, Tag, Row, message } from 'antd';
import React, { ReactNode, useImperativeHandle } from 'react';
import { useIntl } from 'umi';
import { GlobalModalForm } from '../../../../components/GlobalForm';
import _ from 'lodash';
import {
  REAL_ESTATE_STATUS_COLOR_ENUM,
  REAL_ESTATE_TYPE_ENUM_SELECT,
  STATUS_ENUM,
} from '@/constants';
import { realEstateStatusService } from '@/services/realEstateStatusService';
import { error } from '@/components/popup';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

interface TableRef extends ProFormInstance {
  reloadTable: () => void;
}

type RealEstateStatusFormProps = {
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

const RealEstateStatusForm = React.forwardRef<ModalFormRef, RealEstateStatusFormProps>(
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
        const {
          title,
          type,
          is_default,
          is_editable_re,
          is_show_internal,
          is_allow_duplicate,
          status,
          color,
        } = values;
        if (!_.isUndefined(defaultData) && defaultData.id) {
          let statusUpdate = STATUS_ENUM.PENDING;
          if (status) {
            statusUpdate = STATUS_ENUM.ACTIVE;
          }
          const response = await realEstateStatusService.checkDuplicateRealEstateStatus({
            title: title.trim(),
            current_status_id: defaultData.id,
          });

          if (response) {
            formRef.current?.setFields([{ name: 'title', errors: ['Trạng thái đã tồn tại'] }]);
          } else {
            const response: any = await realEstateStatusService.update(defaultData.id, {
              title: title.trim(),
              type: _.toNumber(type),
              isDefault: is_default,
              isEditableRe: is_editable_re,
              isShowInternal: is_show_internal,
              isAllowDuplicate: is_allow_duplicate,
              status: statusUpdate,
              color,
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
          const response = await realEstateStatusService.checkDuplicateRealEstateStatus({
            title: title.trim(),
          });
          if (response) {
            formRef.current?.setFields([{ name: 'title', errors: ['Trạng thái đã tồn tại'] }]);
          } else {
            const response: any = await realEstateStatusService.createRealEstateStatus({
              title,
              type: _.toNumber(type),
              isDefault: is_default,
              isEditableRe: is_editable_re,
              isShowInternal: is_show_internal,
              isAllowDuplicate: is_allow_duplicate,
              status,
              color,
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
              message.error(intl.formatMessage({ id: 'global.fail' }));
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
          is_show_internal: false,
          is_allow_duplicate: false,
          color: 'default',
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
                label={intl.formatMessage({ id: 'pages.real_estate_status.code' })}
                disabled={true}
              />
            </Col>
          </Row>
        )}
        <Row gutter={24}>
          <Col span={12}>
            <ProFormText
              name={`title`}
              label={intl.formatMessage({ id: 'pages.real_estate_status.title' })}
              placeholder={intl.formatMessage({ id: 'form.enter_data' })}
              hasFeedback={true}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'form.field.required' }),
                },
              ]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name={`type`}
              valueEnum={REAL_ESTATE_TYPE_ENUM_SELECT}
              hasFeedback={true}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'form.field.required' }),
                },
              ]}
              label={intl.formatMessage({
                id: 'pages.real_estate_status.type',
              })}
            />
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <ProFormSelect
              name={`color`}
              label={intl.formatMessage({ id: 'pages.real_estate_status.color' })}
              options={REAL_ESTATE_STATUS_COLOR_ENUM.map((item) => ({
                ...item,
                label: <Tag color={item.value}>{item.label}</Tag>,
              }))}
              hasFeedback={true}
              fieldProps={{
                allowClear: false,
              }}
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
            <ProFormSwitch
              name={`is_default`}
              label={intl.formatMessage({ id: 'pages.real_estate_status.is_default' })}
            />
          </Col>
          <Col span={8}>
            <ProFormSwitch
              name={`is_editable_re`}
              label={intl.formatMessage({ id: 'pages.real_estate_status.is_editable_re' })}
            />
          </Col>
          <Col span={8}>
            <ProFormSwitch
              name={`is_show_internal`}
              label={intl.formatMessage({ id: 'pages.real_estate_status.is_show_internal' })}
            />
          </Col>
          <Col span={8}>
            <ProFormSwitch
              name={`is_allow_duplicate`}
              label={intl.formatMessage({ id: 'pages.real_estate_status.is_allow_duplicate' })}
            />
          </Col>
          <Col span={8}>
            <ProFormSwitch name={`status`} label={intl.formatMessage({ id: 'global.status' })} />
          </Col>
        </Row>
      </GlobalModalForm>
    );
  },
);

export default RealEstateStatusForm;
