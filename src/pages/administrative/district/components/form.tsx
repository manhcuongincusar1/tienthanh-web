import { districtService } from '@/services/districtService';
import { ProFormSelect, ProFormSwitch, ProFormText } from '@ant-design/pro-form';
import { Button, Form, message, Row, Col } from 'antd';
import React, { ReactNode } from 'react';
import { useIntl } from 'umi';
import { GlobalModalForm } from '../../../../components/GlobalForm';
import _ from 'lodash';
import { provinceService } from '@/services/provinceService';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

type DistrictFormProps = {
  title?: string;
  linkAnchor?: ReactNode;
  afterSubmit?: () => void;
  defaultData?: API.DistrictData;
  branch_id: string;
  handleResponseErrorFromCallApi: (keyResponse: string) => void;
};
const DistrictForm = (props: DistrictFormProps) => {
  const intl = useIntl();
  const formRef = Form.useForm();
  const modalRef = React.useRef() as React.MutableRefObject<
    React.ElementRef<typeof GlobalModalForm>
  >;
  const { title, afterSubmit, linkAnchor, defaultData, handleResponseErrorFromCallApi, branch_id } =
    props;
  const _bindEvent = {
    onFinish: async (values: object): Promise<void> => {
      const {
        title,
        code,
        status,
        province_city_id: provinceCityId,
      } = values as API.DistrictRequest;
      if (!_.isUndefined(defaultData) && defaultData.id) {
        const response: any = await districtService.updateDistrict(defaultData.id, {
          title: title ? title?.trim() : title,
          code,
          status,
          provinceCityId,
          branch_id,
        });

        if (response?.keyResponse) {
          handleResponseErrorFromCallApi(response?.keyResponse);
          return;
        }

        if (response.status == 200) {
          message.success(
            intl.formatMessage({ id: 'global.success' }),
            MESSAGE_DISPLAY_SECONDS.SUCCESS,
          );
          modalRef.current?.closeModal();
          afterSubmit?.();
        } else {
          message.error(intl.formatMessage({ id: 'global.fail' }), MESSAGE_DISPLAY_SECONDS.ERROR);
        }
      } else {
        const response = await districtService.createDistrict({
          title: title ? title?.trim() : title,
          code,
          status,
          provinceCityId,
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
              afterSubmit?.();
            },
          );
        } else {
          message.error(intl.formatMessage({ id: 'global.fail' }), MESSAGE_DISPLAY_SECONDS.ERROR);
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
      <Row gutter={20}>
        <Col span={12}>
          <ProFormSelect
            name={`province_city_id`}
            label={intl.formatMessage({ id: 'pages.administrative.province.form.title' })}
            hasFeedback={true}
            placeholder={intl.formatMessage({ id: 'form.select' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'form.field.required' }),
              },
            ]}
            request={async ({ keyWords }) => {
              let dataFilter = {};
              const listProvince = await provinceService.getProvinceListSelect({
                limit: 500,
                search: keyWords,
                ...dataFilter,
              });
              return listProvince;
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name={`title`}
            label={intl.formatMessage({ id: 'pages.administrative.district.form.title' })}
            hasFeedback={true}
            placeholder={intl.formatMessage({ id: 'form.enter_data' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'form.field.required' }),
              },
              {
                max: 250,
                message: intl.formatMessage({ id: 'form.over_length' }),
              },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name={`code`}
            label={intl.formatMessage({ id: 'pages.administrative.district.form.code' })}
            hasFeedback={true}
            placeholder={intl.formatMessage({ id: 'form.enter_data' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'form.field.required' }),
              },
              {
                pattern: RegExp('^([0-9A-Z]){1,10}$'),
                message: intl.formatMessage({
                  id: 'pages.administrative.province.form.code.validate',
                }),
              },
              ({ getFieldValue }) => ({
                async validator(rule, value) {
                  if (_.isEmpty(value)) return Promise.resolve();
                  if (defaultData?.code && _.isEqual(value, defaultData.code))
                    return Promise.resolve();
                  const regexCode = new RegExp('^([0-9A-Z]){1,10}$');
                  if (value.match(regexCode)) {
                    const { data } = await districtService.checkCodeExistDistrict(value);
                    if (data?.result) {
                      return Promise.reject(
                        new Error(
                          intl.formatMessage({
                            id: 'pages.administrative.district.form.code.duplicate',
                          }),
                        ),
                      );
                    }
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          />
        </Col>

        <Col span={12}>
          <ProFormSwitch name={`status`} label={intl.formatMessage({ id: 'global.active' })} />
        </Col>
      </Row>
    </GlobalModalForm>
  );
};

export default DistrictForm;
