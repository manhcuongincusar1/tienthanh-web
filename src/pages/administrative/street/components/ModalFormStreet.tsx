import { streetService } from '@/services/streetService';
import {
  ProFormDependency,
  ProFormInstance,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import { administrativeDivision } from '@/api/administrativeDivision';
import { message, Row, Col } from 'antd';
import React, { ReactNode, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { GlobalModalForm } from '../../../../components/GlobalForm';
import _ from 'lodash';
import { DistrictList, WardList } from '@/pages/types';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

type StreetFormProps = {
  title?: string;
  linkAnchor?: ReactNode;
  afterSubmit?: () => void;
  branch_id: string;
  handleResponseErrorFromCallApi: (keyResponse: string) => void;
};

interface DataForm {
  id: number;
  province_city_id: number;
  districts_id: number;
  ward_id: number;
  display_title: string;
  status: boolean;
}

const ModalFormStreet = forwardRef((props: StreetFormProps, ref) => {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const { provinceList } = useModel('administrativeDivision');
  const modalRef = React.useRef() as React.MutableRefObject<
    React.ElementRef<typeof GlobalModalForm>
  >;
  const [inititalValues, setInitialValues] = useState<DataForm | any>();
  const { afterSubmit, handleResponseErrorFromCallApi, branch_id } = props;

  useImperativeHandle(ref, () => ({
    onOpen(data?: DataForm) {
      if (!_.isEmpty(data)) {
        setInitialValues(data);
      }
      modalRef.current?.openModal();
    },
  }));

  const _bindEvent = {
    onFinish: async (values: any): Promise<boolean | undefined | void> => {
      const { display_title, ward_id, status, province_city_id, districts_id } = values;

      if (!_.isUndefined(inititalValues) && inititalValues.id) {
        streetService
          .updateStreet(inititalValues.id, {
            title: display_title ? display_title.trim() : display_title,
            province_city_id: province_city_id,
            districts_id: districts_id,
            ward_id: ward_id,
            status,
            branch_id,
          })
          .then(({ status, data }) => {
            if (status == 200) {
              if (data?.is_duplicate) {
                formRef?.current?.setFields([
                  {
                    name: 'display_title',
                    errors: ['Đường bị trùng. Vui lòng kiểm tra lại'],
                  },
                ]);
              } else {
                message.success(
                  intl.formatMessage({ id: 'global.success' }),
                  MESSAGE_DISPLAY_SECONDS.SUCCESS,
                  () => {
                    modalRef.current?.closeModal();
                    afterSubmit?.();
                  },
                );
              }
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
        streetService
          .createStreet({
            title: display_title ? display_title.trim() : display_title,
            province_city_id: province_city_id,
            districts_id: districts_id,
            ward_id: ward_id,
            status,
            branch_id,
          })
          .then(({ status, data }) => {
            if (status == 200) {
              if (data?.is_duplicate) {
                formRef?.current?.setFields([
                  {
                    name: 'display_title',
                    errors: ['Đường bị trùng. Vui lòng kiểm tra lại'],
                  },
                ]);
              } else {
                message.success(
                  intl.formatMessage({ id: 'global.success' }),
                  MESSAGE_DISPLAY_SECONDS.SUCCESS,
                  () => {
                    modalRef.current?.closeModal();
                    afterSubmit?.();
                  },
                );
              }
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
      modalProps={{
        destroyOnClose: true,
        afterClose() {
          setInitialValues(undefined);
          formRef.current?.resetFields();
        },
      }}
      ref={modalRef}
      initialValues={{
        status: true,
        ...inititalValues,
      }}
      title={
        !_.isEmpty(inititalValues)
          ? intl.formatMessage(
              {
                id: 'pages.administrative.street.edit.title',
              },
              { name: inititalValues?.display_title && inititalValues?.display_title },
            )
          : intl.formatMessage({ id: 'pages.administrative.street.form.create' })
      }
    >
      <Row gutter={20}>
        <Col span={12}>
          <Row gutter={20}>
            <Col span={24}>
              <ProFormSelect
                rules={[{ required: true, message: intl.formatMessage({ id: 'form.enter_info' }) }]}
                name={'province_city_id'}
                placeholder={intl.formatMessage({ id: 'form.select' })}
                label={intl.formatMessage({ id: 'form.province' })}
                options={provinceList}
                fieldProps={{
                  onChange: () => {
                    formRef.current?.setFields([
                      { name: 'street_id', value: undefined },
                      { name: 'districts_id', value: undefined },
                      { name: 'ward_id', value: undefined },
                    ]);
                  },
                }}
                showSearch
              />
            </Col>
            <Col span={24}>
              <ProFormDependency name={['province_city_id']}>
                {({ province_city_id }) => {
                  return (
                    <ProFormSelect
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'form.enter_info' }),
                        },
                      ]}
                      fieldProps={{
                        onChange: () => {
                          formRef.current?.setFields([
                            { name: 'street_id', value: undefined },
                            { name: 'ward_id', value: undefined },
                          ]);
                        },
                      }}
                      placeholder={intl.formatMessage({ id: 'form.select' })}
                      label={intl.formatMessage({ id: 'form.district' })}
                      name={'districts_id'}
                      params={province_city_id}
                      request={async () => {
                        const response = province_city_id
                          ? await administrativeDivision.getDistrictList({
                              province_id: Number(province_city_id),
                            })
                          : {};

                        return (
                          response &&
                          response?.map((value: DistrictList) => ({
                            label: value.display_title,
                            value: value.id,
                          }))
                        );
                      }}
                      showSearch
                    />
                  );
                }}
              </ProFormDependency>
            </Col>
            <Col span={24}>
              <ProFormDependency name={['districts_id']}>
                {({ districts_id }) => {
                  return (
                    <ProFormSelect
                      name={'ward_id'}
                      fieldProps={{
                        onChange: () => {
                          formRef.current?.setFieldsValue({ street_id: undefined });
                        },
                      }}
                      params={districts_id}
                      request={async () => {
                        const response = districts_id
                          ? await administrativeDivision.getWardList({
                              district_id: Number(districts_id),
                            })
                          : {};
                        return (
                          response &&
                          response?.map((value: WardList) => ({
                            label: value.display_title,
                            value: value.id,
                          }))
                        );
                      }}
                      label={intl.formatMessage({ id: 'form.ward' })}
                      placeholder={intl.formatMessage({ id: 'form.select' })}
                      showSearch
                    />
                  );
                }}
              </ProFormDependency>
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row>
            <Col span={24}>
              <ProFormText
                name={'display_title'}
                label={intl.formatMessage({ id: 'pages.administrative.street.form.title' })}
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
            <Col span={24}>
              <ProFormSwitch name={'status'} label={intl.formatMessage({ id: 'global.active' })} />
            </Col>
          </Row>
        </Col>
      </Row>
    </GlobalModalForm>
  );
});

export default ModalFormStreet;
