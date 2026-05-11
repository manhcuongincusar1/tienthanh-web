import { wardService } from '@/services/wardService';
import { ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import { Button, Form, message } from 'antd';
import React, { ReactNode } from 'react';
import { useIntl, useModel } from 'umi';
import { GlobalModalForm } from '../../../../components/GlobalForm';
import _ from 'lodash';
import { provinceService } from '@/services/provinceService';
import { districtService } from '@/services/districtService';
import { RequestOptionsType } from '@ant-design/pro-utils';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

type WardFormProps = {
  title?: string;
  linkAnchor?: ReactNode;
  afterSubmit?: () => void;
  defaultData?: API.WardRequest;
  branch_id: string;
  handleResponseErrorFromCallApi: (keyResponse: string) => void;
};
const WardForm = (props: WardFormProps) => {
  const intl = useIntl();
  const formRef = Form.useForm();
  const modalRef = React.useRef() as React.MutableRefObject<
    React.ElementRef<typeof GlobalModalForm>
  >;

  const {
    initialState: { currentUser },
  } = useModel('@@initialState');
  const { title, afterSubmit, linkAnchor, defaultData, branch_id, handleResponseErrorFromCallApi } =
    props;

  const _bindEvent = {
    onFinish: (values: any): void => {
      const { title, code, status, district_id: districtId } = values;
      if (!_.isUndefined(defaultData) && defaultData.id) {
        wardService
          .updateWard(defaultData.id, {
            title: title ? title.trim() : title,
            code,
            status,
            districtId,
            branch_id,
          } as API.DistrictData)
          .then((res) => {
            if (res.status == 200) {
              message.success(
                intl.formatMessage({ id: 'global.success' }),
                MESSAGE_DISPLAY_SECONDS.SUCCESS,
              );
              modalRef.current?.closeModal();
              afterSubmit?.();
            } else {
              message.error(
                intl.formatMessage({ id: 'global.fail' }),
                MESSAGE_DISPLAY_SECONDS.ERROR,
              );
            }
          })
          .catch((error) => {
            if (error?.response?.data?.message) {
              handleResponseErrorFromCallApi(error?.response?.data?.message);
              return;
            } else {
              message.error(
                intl.formatMessage({ id: 'global.fail' }),
                MESSAGE_DISPLAY_SECONDS.ERROR,
              );
            }
          });
      } else {
        wardService
          .createWard({
            title: title ? title.trim() : title,
            code,
            status,
            districtId,
            branch_id,
          } as API.DistrictData)
          .then((res) => {
            if (res.status == 200) {
              message.success(
                intl.formatMessage({ id: 'global.success' }),
                MESSAGE_DISPLAY_SECONDS.SUCCESS,
                () => {
                  modalRef.current?.closeModal();
                  afterSubmit?.();
                },
              );
            } else {
              message.error(
                intl.formatMessage({ id: 'global.fail' }),
                MESSAGE_DISPLAY_SECONDS.ERROR,
              );
            }
          })
          .catch((error) => {
            if (error?.response?.data?.message) {
              handleResponseErrorFromCallApi(error?.response?.data?.message);
              return;
            } else {
              message.error(
                intl.formatMessage({ id: 'global.fail' }),
                MESSAGE_DISPLAY_SECONDS.ERROR,
              );
            }
          });
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
      <ProFormSelect
        name={`province_city_id`}
        label={intl.formatMessage({ id: 'pages.administrative.province.title' })}
        hasFeedback={true}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'form.field.required' }),
          },
        ]}
        fieldProps={{
          showSearch: true,
        }}
        request={async ({ keyWords }) => {
          const listProvince = await provinceService.getProvinceListSelect({
            limit: 500,
            search: keyWords,
          });
          return listProvince;
        }}
      />
      <ProFormSelect
        name={`district_id`}
        label={intl.formatMessage({ id: 'pages.administrative.district.title' })}
        hasFeedback={true}
        dependencies={['province_city_id']}
        fieldProps={{
          showSearch: true,
        }}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'form.field.required' }),
          },
        ]}
        request={async ({ province_city_id, keyWords }) => {
          let listDistrict: RequestOptionsType[] = [];
          if (province_city_id) {
            listDistrict = await districtService.getDistrictListSelect(
              {
                limit: 500,
                province_id: province_city_id,
                search: keyWords,
              },
              true,
            );
            return listDistrict;
          }
        }}
      />
      <ProFormText
        name={`code`}
        label={intl.formatMessage({ id: 'pages.administrative.ward.form.code' })}
        hasFeedback={true}
        placeholder={intl.formatMessage({ id: 'form.enter_data' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'form.field.required' }),
          },
          {
            pattern: RegExp('^([0-9A-Z]){1,10}$'),
            message: intl.formatMessage({ id: 'pages.administrative.form.code.validate' }),
          },
          ({ getFieldValue }) => ({
            async validator(rule, value) {
              if (_.isEmpty(value)) return Promise.resolve();
              if (defaultData?.code && _.isEqual(value, defaultData.code)) return Promise.resolve();
              const regexCode = new RegExp('^([0-9A-Z]){1,10}$');
              if (value.match(regexCode)) {
                const { data } = await wardService.checkCodeExistWard(value);

                if (data?.result) {
                  return Promise.reject(
                    new Error(
                      intl.formatMessage({ id: 'pages.administrative.ward.form.code.duplicate' }),
                    ),
                  );
                }
              }

              return Promise.resolve();
            },
          }),
        ]}
      />
      <ProFormText
        name={`title`}
        label={intl.formatMessage({ id: 'pages.administrative.ward.form.title' })}
        hasFeedback={true}
        placeholder={intl.formatMessage({ id: 'form.enter_data' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'form.field.required' }),
          },
        ]}
      />
      <ProFormSwitch name={`status`} label={intl.formatMessage({ id: 'global.active' })} />
    </GlobalModalForm>
  );
};

export default WardForm;
