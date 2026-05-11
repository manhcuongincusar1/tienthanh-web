import {ProFormInstance, ProFormSelect, ProFormSwitch, ProFormText} from '@ant-design/pro-form';
import ProFormAutocomplete from '@/components/Custom/ProFormAutocomplete';
import {Col} from 'antd';
import {MutableRefObject, useEffect, useState} from 'react';
import {useIntl, useModel, useParams, useHistory} from 'umi';
import {realEstateCategoryService} from '@/services/realEstateCategoryService';
import {brokerService} from '@/services/brokerService';
import _ from 'lodash';
import FormRealEstateAdministrative from './FormRealEstateAdministrative';
import {TagRender} from './TagRender';
import dayjs from 'dayjs';
import {formatDate} from '@/utils/dateUtils';
import {REAL_ESTATE_TYPE_ENUM} from '../constants';
import {
  CHECK_PHONE_NUMBER,
  CHECK_VALUE_NUMBER,
  CHECK_REAL_ESTATE_PRICE,
} from '@/pages/expression';
import {customerServices} from '@/services/customerServices';
import formaterRealEstatePrice from '@/helpers/formaterRealEstatePrice';

interface FormRealEstateSellMainProps {
  formRef: MutableRefObject<ProFormInstance<any> | undefined>;
  disabled?: boolean;
}

export default function FormRealEstateSellMain({formRef}: FormRealEstateSellMainProps) {
  const intl = useIntl();
  const history = useHistory();
  const {initialState} = useModel('@@initialState');
  const {getWorkspaceId} = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const {id} = useParams<RealEstate.Params>();
  const {
    realEstateStatus,
    handleChangePage,
    requiredStatus,
    typePage,
    isAgency,
    setIsAgency,
    detailProperties,
  } = useModel('realEstateSell');

  const {pathname} = history.location;

  const [categoryList, setCategoryList] = useState<RealEstateSell.CategoryOptions[]>([]);
  const [realOnlySellerName, setRealOnlySellerName] = useState<RealEstate.ReadOnlyStatus>({
    status: !!id,
  });
  const [realOnlyBrokerName, setRealOnlyBrokerName] = useState<RealEstate.ReadOnlyStatus>({
    status: !!id,
  });
  const [optionPhones, setOptionPhones] = useState<RealEstateSell.Options[] | undefined | false>(
    [],
  );
  const [brokerOptionPhones, setBrokerOptionPhones] = useState<
    RealEstateSell.Options[] | undefined
  >([]);

  useEffect(() => {
    handleChangePage(pathname);
  }, [pathname]);
  useEffect(() => {
    realEstateCategoryService
      .getListRealEstateCategory({})
      .then((res) => {
        if (res?.data) {
          const categoryOptionsNew = res.data.reduce(
            (prev: RealEstateSell.CategoryOptions[], value) => {
              if (value.status === 1) {
                return [
                  ...prev,
                  {
                    value: value?.id,
                    label: value?.title,
                  },
                ];
              } else {
                return prev;
              }
            },
            [],
          );
          setCategoryList(categoryOptionsNew);
        }
      })
      .catch((err) => {
        return false;
      });
  }, []);

  useEffect(() => {
    if (formRef) {
      formRef.current?.setFieldsValue({branch_id: workspace_id});
    }
  }, []);

  const _func = {
    onSearchPhone: async (value: string) => {
      if (value && value?.length <= 10) {
        await customerServices.getListPhoneNumber(value, workspace_id).then((response) => {
          if (response) {
            const optionPhonesNew: RealEstateSell.Options[] | any =
              _.isArray(response) &&
              response.map((value: RealEstateSell.PhoneList) => ({
                value: value.phone_number,
                label: `${value.phone_number} - ${value.full_name}`,
                id: value.id,
                full_name: value.full_name,
              }));
            setOptionPhones(optionPhonesNew);
          }
        });
      }
    },
    onChange: async (value: string, options: any) => {
      if (value && value.length === 10) {
        if (options.id) {
          formRef.current?.setFieldsValue({saler_full_name: options.full_name});
          formRef.current?.setFieldsValue({sale_id: options.id});
          setRealOnlySellerName({status: true});
        }
      } else {
        setRealOnlySellerName({status: false});
      }
    },
    onSearchBrokerPhone: async (value: string) => {
      if (value && value?.length <= 10) {
        await brokerService.getListPhoneNumber(value, workspace_id).then((res: any) => {
          const optionPhonesNew = res?.map((phoneItem: RealEstateSell.PhoneList) => ({
            value: phoneItem.phone_number,
            label: `${phoneItem.phone_number} - ${phoneItem.full_name}`,
            id: phoneItem.id,
            full_name: phoneItem.full_name,
          }));

          setBrokerOptionPhones(optionPhonesNew);
        });
      }
    },
    onChangeBrokerPhone: async (value: string, options: any) => {
      if (value && value.length === 10) {
        if (options.id) {
          formRef.current?.setFieldsValue({broker_full_name: options.full_name});
          setRealOnlyBrokerName({status: true});
        }
      } else {
        setRealOnlyBrokerName({status: false});
      }
    },
    validatePhone: async (_: any, values: any) => {
      if (values && !values.match(CHECK_VALUE_NUMBER)) {
        return Promise.reject(new Error(intl.formatMessage({id: 'form.phone_not_number'})));
      } else if (!values) {
        return Promise.resolve();
      } else {
        if (!values.match(CHECK_PHONE_NUMBER)) {
          return Promise.reject(new Error(intl.formatMessage({id: 'form.phone_err'})));
        }
        return Promise.resolve(Number(values));
      }
    },
    validateBrokeragefeesRent: async (_re: any, value: any) => {
      value = typeof value === 'string' && value?.replace(',', '');
      if ((value && Number(value) < 0) || (value && !value.match(CHECK_REAL_ESTATE_PRICE))) {
        return Promise.reject(new Error(intl.formatMessage({id: 'form.field.number_incorrect'})));
      }
      return Promise.resolve(value);
    },
    validateBrokeragefeesSell: async (_re: any, value: any) => {
      if (value) {
        console.log(value);
        if (Number(value) <= 0 || Number(value) > 100 || !value.match(CHECK_REAL_ESTATE_PRICE)) {
          return Promise.reject(
            new Error(intl.formatMessage({id: 'form.field.number_incorrect'})),
          );
        }
      } else if (_.isUndefined(value)) {
        return Promise.reject();
      }
      return Promise.resolve(value);
    },
  };

  return (
    <>
      <Col span={12} lg={{span: 12}} xl={{span: 6}}>
        {id ? (
          <ProFormText
            label={intl.formatMessage({id: 'global.created_at'})}
            name="created_date"
            disabled={true}
            placeholder={intl.formatMessage({
              id: intl.formatMessage({id: 'form.enter_info'}),
            })}
          />
        ) : (
          <ProFormText
            label={intl.formatMessage({id: 'global.created_at'})}
            name="created_date"
            fieldProps={{value: formatDate(dayjs().toString())?.toString()}}
            disabled={true}
            placeholder={intl.formatMessage({
              id: intl.formatMessage({id: 'form.enter_info'}),
            })}
          />
        )}
      </Col>
      <Col span={12} lg={{span: 12}} xl={{span: 6}}>
        <ProFormText
          label={intl.formatMessage({id: `pages.${typePage?.locale}.code`})}
          name="code"
          disabled={true}
          placeholder={intl.formatMessage({
            id: intl.formatMessage({id: `pages.${typePage?.locale}.code`}),
          })}
        />
      </Col>
      <Col span={12} lg={{span: 12}} xl={{span: 6}}>
        {!!id || history.location.pathname.match(`/${typePage?.path}/preview`) ? (
          <></>
        ) : (
          <ProFormSelect
            label={intl.formatMessage({id: 'pages.real_estate_sale.status'})}
            name="real_estate_status_id"
            options={realEstateStatus}
            disabled={true}
            mode="multiple"
            fieldProps={{
              tagRender: (props) => TagRender(props),
            }}
            rules={[
              {required: requiredStatus, message: intl.formatMessage({id: 'form.enter_info'})},
            ]}
            placeholder={
              requiredStatus
                ? intl.formatMessage({
                  id: intl.formatMessage({id: 'form.enter_info'}),
                })
                : ''
            }
          />
        )}
      </Col>
      <Col
        span={12}
        lg={{
          span: 12,
        }}
        xs={{
          span: 12,
          pull: id || history.location.pathname.match(`/${typePage?.path}/preview`) ? 12 : 0,
        }}
        xl={{
          span: 6,
          pull: id || history.location.pathname.match(`/${typePage?.path}/preview`) ? 6 : 0,
        }}
      >
        <ProFormSelect
          rules={[{required: true, message: intl.formatMessage({id: 'form.enter_info'})}]}
          label={intl.formatMessage({id: 'form.real_estate_category'})}
          name="category_id"
          options={categoryList}
          fieldProps={{
            labelInValue: true,
          }}
          placeholder={intl.formatMessage({id: 'form.select'})}
        />
      </Col>
      <FormRealEstateAdministrative/>
      <Col span={24} lg={{span: 10}} xl={{span: 6}}>
        <ProFormAutocomplete
          fieldProps={{
            options: optionPhones || [],
            onSearch: _func.onSearchPhone,
            onChange: _func.onChange,
            onBlur: (event: any) => {
              const full_name_value = formRef.current?.getFieldValue('saler_full_name');
              const value = event.target.value;

              if (value && !full_name_value) {
                formRef.current?.setFields([
                  {name: 'saler_full_name', errors: ['Vui lòng nhập thông tin.']},
                ]);
              } else if (!value && full_name_value) {
                formRef.current?.setFields([
                  {name: 'saler_phone_number', errors: ['Vui lòng nhập thông tin.']},
                ]);
              } else {
                formRef.current?.setFields([{name: 'saler_full_name', errors: undefined}]);
              }
            },
          }}
          label={intl.formatMessage({id: `pages.${typePage?.locale}.sell_phone`})}
          rules={[
            {
              required: !isAgency,
              message: intl.formatMessage({id: 'form.enter_info'}),
            },
            {
              validator: _func.validatePhone,
            },
          ]}
          placeholder={intl.formatMessage({
            id: intl.formatMessage({id: 'form.search_phone'}),
          })}
          name="saler_phone_number"
          key="saler_phone_number"
          suffix={
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.33594 1.66732C3.75861 1.66732 1.66927 3.75666 1.66927 6.33398C1.66927 8.91131 3.75861 11.0007 6.33594 11.0007C7.59323 11.0007 8.7344 10.5034 9.57353 9.69491C9.59108 9.67209 9.6103 9.65015 9.6312 9.62925C9.6521 9.60835 9.67404 9.58912 9.69686 9.57158C10.5054 8.73245 11.0026 7.59128 11.0026 6.33398C11.0026 3.75666 8.91327 1.66732 6.33594 1.66732ZM11.0239 10.0791C11.845 9.05266 12.3359 7.75066 12.3359 6.33398C12.3359 3.02028 9.64964 0.333984 6.33594 0.333984C3.02223 0.333984 0.335938 3.02028 0.335938 6.33398C0.335938 9.64769 3.02223 12.334 6.33594 12.334C7.75261 12.334 9.05461 11.843 10.0811 11.0219L12.5312 13.4721C12.7915 13.7324 13.2137 13.7324 13.474 13.4721C13.7344 13.2117 13.7344 12.7896 13.474 12.5292L11.0239 10.0791Z"
                fill="rgb(29, 30, 32)"
              />
            </svg>
          }
        />
        <ProFormText name="sale_id" hidden={true}/>
        <ProFormText name="creator_id" hidden={true}/>
      </Col>
      <Col span={24} lg={{span: 10}} xl={{span: 12}}>
        <ProFormText
          rules={[
            {
              required: !isAgency,
              message: intl.formatMessage({id: 'form.enter_info'}),
            },
            {max: 250, message: intl.formatMessage({id: 'form.over_length'})},
          ]}
          fieldProps={{
            readOnly: realOnlySellerName.status,
            onBlur: (event) => {
              const phone_number_value = formRef.current?.getFieldValue('saler_phone_number');
              const value = event.target.value;

              if (value && !phone_number_value) {
                formRef.current?.setFields([
                  {name: 'saler_phone_number', errors: ['Vui lòng nhập thông tin.']},
                ]);
              } else if (!value && phone_number_value) {
                formRef.current?.setFields([
                  {name: 'saler_full_name', errors: ['Vui lòng nhập thông tin.']},
                ]);
              } else {
                formRef.current?.setFields([{name: 'saler_phone_number', errors: undefined}]);
              }
            },
          }}
          label={intl.formatMessage({id: `pages.${typePage?.locale}.sell_name`})}
          name="saler_full_name"
          placeholder={intl.formatMessage({
            id: intl.formatMessage({id: 'form.name'}),
          })}
        />
      </Col>
      <Col span={24} lg={{span: 4}} xl={{span: 6}}>
        <ProFormSwitch
          fieldProps={{defaultChecked: true}}
          name="goodwill"
          label={intl.formatMessage({id: 'pages.real_estate_sale.goodwill'})}
        />
      </Col>
      <Col span={24} lg={{span: 10}} xl={{span: 6}}>
        <ProFormAutocomplete
          fieldProps={{
            options: brokerOptionPhones,
            onSearch: _func.onSearchBrokerPhone,
            onChange: _func.onChangeBrokerPhone,
            disabled: (() => {
              const {broker_phone_number} = detailProperties;

              if (!_.isUndefined(broker_phone_number) && !_.isEmpty(broker_phone_number)) {
                return true;
              }
              return !isAgency;
            })(),
          }}
          label={intl.formatMessage({id: 'pages.real_estate_sale.broker_phone_label'})}
          name="broker_phone_number"
          key="broker_phone_number"
          rules={[
            {required: isAgency, message: intl.formatMessage({id: 'form.enter_info'})},
            {
              validator: _func.validatePhone,
            },
          ]}
          placeholder={intl.formatMessage({
            id: intl.formatMessage({id: 'form.search_phone'}),
          })}
          suffix={
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.33594 1.66732C3.75861 1.66732 1.66927 3.75666 1.66927 6.33398C1.66927 8.91131 3.75861 11.0007 6.33594 11.0007C7.59323 11.0007 8.7344 10.5034 9.57353 9.69491C9.59108 9.67209 9.6103 9.65015 9.6312 9.62925C9.6521 9.60835 9.67404 9.58912 9.69686 9.57158C10.5054 8.73245 11.0026 7.59128 11.0026 6.33398C11.0026 3.75666 8.91327 1.66732 6.33594 1.66732ZM11.0239 10.0791C11.845 9.05266 12.3359 7.75066 12.3359 6.33398C12.3359 3.02028 9.64964 0.333984 6.33594 0.333984C3.02223 0.333984 0.335938 3.02028 0.335938 6.33398C0.335938 9.64769 3.02223 12.334 6.33594 12.334C7.75261 12.334 9.05461 11.843 10.0811 11.0219L12.5312 13.4721C12.7915 13.7324 13.2137 13.7324 13.474 13.4721C13.7344 13.2117 13.7344 12.7896 13.474 12.5292L11.0239 10.0791Z"
                fill="rgb(29, 30, 32)"
              />
            </svg>
          }
        />
      </Col>
      <Col span={24} lg={{span: 10}} xl={{span: 12}}>
        <ProFormText
          label={intl.formatMessage({id: 'pages.real_estate_sale.broker_name'})}
          name="broker_full_name"
          disabled={(() => {
            const {broker_full_name} = detailProperties;
            if (!_.isUndefined(broker_full_name) && !_.isEmpty(broker_full_name)) {
              return true;
            }
            return !isAgency;
          })()}
          placeholder={intl.formatMessage({
            id: intl.formatMessage({id: 'form.name'}),
          })}
          fieldProps={{
            readOnly: realOnlyBrokerName.status,
          }}
          rules={[
            {required: isAgency, message: intl.formatMessage({id: 'form.enter_info'})},
            {max: 250, message: intl.formatMessage({id: 'form.over_length'})},
          ]}
        />
      </Col>
      <Col span={12} lg={{span: 4}} xl={{span: 3}} xxl={{span: 2}}>
        <ProFormSwitch
          name="agency"
          label="Hợp tác"
          fieldProps={{
            checked: isAgency,
            onChange: (value) => {
              setIsAgency(value);
            },
          }}
        />
      </Col>
      <Col span={24} lg={{span: 10}} xl={{span: 12}}>
        <ProFormText
          label={intl.formatMessage({id: `pages.${typePage?.locale}.price`})}
          name="price"
          fieldProps={{
            className: 'field_number_real_estate_sale input-height-40',
            allowClear: false,
          }}
          normalize={(value) => {
            return formaterRealEstatePrice(value);
          }}
          placeholder={intl.formatMessage({
            id: intl.formatMessage({id: 'form.enter_price'}),
          })}
          rules={[
            {
              required: true,
              message: intl.formatMessage({id: 'form.enter_info'}),
            },
            {
              validator: async (_re, names) => {
                names = typeof names === 'string' && names?.replace(',', '');
                if (
                  (names && Number(names) <= 0) ||
                  (names && !names.match(CHECK_REAL_ESTATE_PRICE))
                ) {
                  return Promise.reject(
                    new Error(intl.formatMessage({id: 'form.field.number_incorrect'})),
                  );
                } else if (_.isUndefined(names)) {
                  return Promise.reject();
                }

                return Promise.resolve(Number(names));
              },
            },
          ]}
        />
      </Col>
      <Col span={24} lg={{span: 10}} xl={{span: 12}}>
        <ProFormText
          label={intl.formatMessage(
            {id: 'pages.real_estate_sale.agency_cost'},
            {unit: typePage?.type === REAL_ESTATE_TYPE_ENUM.SELL ? '%' : 'triệu'},
          )}
          name="brokerage_fees"
          placeholder={'0'}
          fieldProps={{
            className: 'field_number_real_estate_sale input-height-40',
            allowClear: false,
          }}
          normalize={typePage?.type === REAL_ESTATE_TYPE_ENUM.SELL ? (value) => {
            return value;
          } : (value) => {
            return formaterRealEstatePrice(value);
          }}
          rules={[
            {
              required: typePage?.type === REAL_ESTATE_TYPE_ENUM.SELL,
              message: intl.formatMessage({id: 'form.enter_info'}),
            },
            {
              validator:
                typePage?.type === REAL_ESTATE_TYPE_ENUM.SELL
                  ? _func.validateBrokeragefeesSell
                  : _func.validateBrokeragefeesRent,
            },
          ]}
        />
        <ProFormText hidden name="branch_id"/>
      </Col>
    </>
  );
}
