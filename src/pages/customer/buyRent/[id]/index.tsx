import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormCheckbox, ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, Form, Row, Space, message } from 'antd';
import Styles from '../index.less';
import { useIntl, useModel, useParams, history } from 'umi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import BuyRentDemandCollap from '../components/BuyRentDemandCollap';
import { useRef, useState } from 'react';
import itemRender from '@/helpers/breadcrumbHelper';
import { customerServices } from '@/services/customerServices';
import { CHECK_PHONE_NUMBER } from '@/pages/expression';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import { CUSTOMER_TYPE_ENUM } from '../../contants';

interface PhoneItem {
  phone_number_item: string;
}
interface FormData {
  full_name: string;
  phone_number: string;
  phone_number_list: PhoneItem[];
  goodwill: boolean;
}

function BuyRentDetails() {
  const intl = useIntl();
  const formRef = useRef<ProFormInstance>();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const [formRent] = Form.useForm();
  const [formBuy] = Form.useForm();
  const saveBuyRef = useRef<any>();
  const saveRentRef = useRef<any>();
  const [submitForm, setSubmitForm] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const {
    setDataSourceBuy,
    setDataSourceRent,
    dataSourceRent,
    dataSourceBuy,
    func,
    resetForm,
    setResetForm,
    isVisiableConfirm,
  } = useModel('buyRentDemand');

  const { id } = useParams<Customer.Params>();
  const [previousPhone, setPreviousPhone] = useState<string[] | []>([]);
  const _func = {
    onFinish: async (data: FormData) => {
      let resultBuy = true;
      let resultRent = true;
      if (isVisiableConfirm) {
        resultBuy = func.validateCustomerDemand(formBuy, 1);
        resultRent = func.validateCustomerDemand(formRent, 2);
        if (!resultBuy) {
          saveBuyRef?.current?.click();
          message.error(
            intl.formatMessage({ id: 'pages.customer_buy_rent.edit_demand_failed' }),
            MESSAGE_DISPLAY_SECONDS.ERROR,
          );
        }
        if (!resultRent) {
          saveRentRef?.current?.click();
          message.error(
            intl.formatMessage({ id: 'pages.customer_buy_rent.edit_demand_failed' }),
            MESSAGE_DISPLAY_SECONDS.ERROR,
          );
        }
      }
      if (resultBuy && resultRent && !submitForm) {
        saveBuyRef?.current?.click();
        saveRentRef?.current?.click();
        setSubmitForm(true);
        formRef.current?.submit();
      } else if (resultBuy && resultRent && submitForm) {
        const { full_name, phone_number, phone_number_list, goodwill = false } = data;
        const phoneNumberList = phone_number_list?.map((value) => value.phone_number_item);
        const { data: dataResponse, keyResponse } = await customerServices.updateCustomerBuyRent({
          full_name,
          id: id,
          phone_number_main: phone_number,
          phone_number_new: phoneNumberList,
          phone_number_prev: previousPhone,
          goodwill: goodwill,
          branch_id: workspace_id,
        });
        if (dataResponse) {
          message.success(
            intl.formatMessage({
              id: 'pages.customer_buy_rent.edit_success',
            }),
            MESSAGE_DISPLAY_SECONDS.SUCCESS,
            () => {
              setResetForm((prev) => prev + 1);
              setSubmitForm(false);
            },
          );
        } else if (keyResponse) {
          handleResponseFromCallApi(
            { response: keyResponse },
            { localeActionFailedId: 'pages.customer_buy_rent.edit_failed' },
          );
        }
      }
    },
    validatePhoneNumber: ({ getFieldValue }: any) => ({
      async validator(_re: any, value: string) {
        if (value && value.match(CHECK_PHONE_NUMBER)) {
          const response = await customerServices.checkExistPhoneNumberOfCustomer({
            phone_number: value,
            customer_id: id,
            branch_id: workspace_id,
            type: CUSTOMER_TYPE_ENUM.BUY,
          });
          if (!response) {
            return Promise.reject(
              new Error(
                intl.formatMessage({
                  id: 'form.field.duplicate.error',
                }),
              ),
            );
          } else if (response?.is_duplicate) {
            return Promise.reject(
              new Error(
                intl.formatMessage({
                  id: 'form.field.duplicate.phone_number',
                }),
              ),
            );
          } else {
            let phoneNumberList = getFieldValue('phone_number')
              ? [getFieldValue('phone_number')]
              : [];
            const phoneListItem = getFieldValue('phone_number_list')?.map(
              (value: any) => value?.phone_number_item,
            );
            if (phoneListItem?.length > 0) {
              phoneNumberList = [...phoneNumberList, ...phoneListItem];
            }
            const duplicateList = phoneNumberList.filter((phone) => phone === value);
            if (duplicateList.length <= 1) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error(
                intl.formatMessage({
                  id: 'form.field.duplicate.phone_number',
                }),
              ),
            );
          }
        }
      },
    }),
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.customer_buy_rent.detail' }),
        ghost: true,
        breadcrumb: {
          itemRender: itemRender,
          routes: [
            {
              path: '/',
              breadcrumbName: intl.formatMessage({ id: 'global.home' }),
            },
            {
              path: '/customer/buy-rent',
              breadcrumbName: intl.formatMessage({ id: 'pages.customer_buy_rent' }),
            },
            {
              path: '',
              breadcrumbName: intl.formatMessage({
                id: 'pages.customer_buy_rent.detail',
              }),
            },
          ],
        },
        extra: [],
      }}
    >
      <ProCard headerBordered direction="column" title="Thông tin">
        <ProForm
          formRef={formRef}
          onFinish={_func.onFinish}
          params={{ resetForm }}
          request={async () => {
            const { data, phone_list, keyResponse } =
              await customerServices.getCustomerBuyRentInfoById(id, workspace_id);
            setPreviousPhone(phone_list);

            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }

            return data || {};
          }}
          submitter={{
            searchConfig: {
              submitText: 'Lưu',
              resetText: 'Huỷ',
            },
            submitButtonProps: {
              shape: 'circle',
            },
            resetButtonProps: {
              shape: 'circle',
            },
            onReset: () => {
              history.push('/customer/buy-rent');
            },
            render: (props, dom) => {
              return <div className="form-footer">{dom}</div>;
            },
          }}
        >
          <Row gutter={24}>
            <Col span={24} xl={{ span: 12 }}>
              <ProFormText
                name="full_name"
                label={intl.formatMessage({ id: 'pages.customer_buy_rent.full_name' })}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.please_enter_data' }),
                  },
                  { max: 250, message: intl.formatMessage({ id: 'form.over_length' }) },
                ]}
                placeholder={intl.formatMessage({ id: 'form.enter_data' })}
              />
              <div className={Styles.form_check_box}>
                <ProFormCheckbox name="goodwill">
                  <span>{intl.formatMessage({ id: 'pages.customer_buy_rent.good_will' })}</span>
                </ProFormCheckbox>
              </div>

              <div className={`${Styles.formItem} ${Styles.formItemFull}`}>
                <ProFormText
                  name="phone_number"
                  label={intl.formatMessage({ id: 'form.phone' })}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'form.please_enter_data' }),
                    },
                    {
                      pattern: CHECK_PHONE_NUMBER,
                      message: intl.formatMessage({ id: 'form.phone_err' }),
                    },
                    _func.validatePhoneNumber,
                  ]}
                  placeholder={intl.formatMessage({ id: 'form.enter_data' })}
                />
              </div>
              <div className={`${Styles.addMore} ${Styles.addMoreFull}`}>
                <Form.List name="phone_number_list" initialValue={previousPhone}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name }, index) => (
                        <div key={key} className={Styles.dynamicFormItem}>
                          <div className={Styles.dynamicFormItemInput}>
                            <ProFormText
                              name={[name, 'phone_number_item']}
                              initialValue={previousPhone[key]}
                              placeholder={intl.formatMessage({ id: 'form.enter_info' })}
                              fieldProps={{
                                onChange: (event) => {},
                              }}
                              rules={[
                                {
                                  required: true,
                                  message: intl.formatMessage({ id: 'form.please_enter_data' }),
                                },
                                {
                                  pattern: CHECK_PHONE_NUMBER,
                                  message: intl.formatMessage({ id: 'form.phone_err' }),
                                },
                                _func.validatePhoneNumber,
                              ]}
                            />
                          </div>
                          <Button className={Styles.btnRemove} onClick={() => remove(name)}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.66536 1.99984C6.48855 1.99984 6.31898 2.07007 6.19396 2.1951C6.06894 2.32012 5.9987 2.48969 5.9987 2.6665V3.33317H9.9987V2.6665C9.9987 2.48969 9.92846 2.32012 9.80344 2.1951C9.67841 2.07007 9.50884 1.99984 9.33203 1.99984H6.66536ZM11.332 3.33317V2.6665C11.332 2.13607 11.1213 1.62736 10.7462 1.25229C10.3712 0.877218 9.86246 0.666504 9.33203 0.666504H6.66536C6.13493 0.666504 5.62622 0.877218 5.25115 1.25229C4.87608 1.62736 4.66536 2.13607 4.66536 2.6665V3.33317H1.9987C1.63051 3.33317 1.33203 3.63165 1.33203 3.99984C1.33203 4.36803 1.63051 4.6665 1.9987 4.6665H2.66536V13.3332C2.66536 13.8636 2.87608 14.3723 3.25115 14.7474C3.62622 15.1225 4.13493 15.3332 4.66536 15.3332H11.332C11.8625 15.3332 12.3712 15.1225 12.7462 14.7474C13.1213 14.3723 13.332 13.8636 13.332 13.3332V4.6665H13.9987C14.3669 4.6665 14.6654 4.36803 14.6654 3.99984C14.6654 3.63165 14.3669 3.33317 13.9987 3.33317H11.332ZM3.9987 4.6665V13.3332C3.9987 13.51 4.06894 13.6795 4.19396 13.8046C4.31898 13.9296 4.48855 13.9998 4.66536 13.9998H11.332C11.5088 13.9998 11.6784 13.9296 11.8034 13.8046C11.9285 13.6795 11.9987 13.51 11.9987 13.3332V4.6665H3.9987ZM6.66536 6.6665C7.03355 6.6665 7.33203 6.96498 7.33203 7.33317V11.3332C7.33203 11.7014 7.03355 11.9998 6.66536 11.9998C6.29717 11.9998 5.9987 11.7014 5.9987 11.3332V7.33317C5.9987 6.96498 6.29717 6.6665 6.66536 6.6665ZM8.66536 7.33317C8.66536 6.96498 8.96384 6.6665 9.33203 6.6665C9.70022 6.6665 9.9987 6.96498 9.9987 7.33317V11.3332C9.9987 11.7014 9.70022 11.9998 9.33203 11.9998C8.96384 11.9998 8.66536 11.7014 8.66536 11.3332V7.33317Z"
                              />
                            </svg>
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        shape="circle"
                        onClick={() => add()}
                        className={Styles.btnAddMore}
                        icon={
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.0013 2.6665C8.36949 2.6665 8.66797 2.96498 8.66797 3.33317V7.33317H12.668C13.0362 7.33317 13.3346 7.63165 13.3346 7.99984C13.3346 8.36803 13.0362 8.6665 12.668 8.6665H8.66797V12.6665C8.66797 13.0347 8.36949 13.3332 8.0013 13.3332C7.63311 13.3332 7.33464 13.0347 7.33464 12.6665V8.6665H3.33464C2.96645 8.6665 2.66797 8.36803 2.66797 7.99984C2.66797 7.63165 2.96645 7.33317 3.33464 7.33317H7.33464V3.33317C7.33464 2.96498 7.63311 2.6665 8.0013 2.6665Z"
                            />
                          </svg>
                        }
                      />
                    </>
                  )}
                </Form.List>
              </div>
            </Col>
            <Col span={24} xl={{ span: 12 }}>
              <ProFormText
                disabled
                name={'creator_name'}
                label={intl.formatMessage({ id: 'pages.customer_buy_rent.creator_name' })}
                placeholder={intl.formatMessage({ id: 'form.enter_data' })}
              ></ProFormText>
              <ProFormText
                disabled
                name={'creator_phone'}
                label={intl.formatMessage({ id: 'pages.customer_buy_rent.creator_phone' })}
                placeholder={intl.formatMessage({ id: 'form.enter_data' })}
              ></ProFormText>
            </Col>
          </Row>
          <span className="section-space-top" />
          <h3 className="section-title">
            {intl.formatMessage({ id: 'pages.customer_buy_rent.demand_title' })}
          </h3>
          <Space size={24} direction="vertical" style={{ display: 'flex' }}>
            <BuyRentDemandCollap
              title={intl.formatMessage({ id: 'pages.customer_buy_rent.buy' })}
              dataSource={dataSourceBuy}
              setDataSource={setDataSourceBuy}
              defaultCollapsed={false}
              formRowRef={formBuy}
              saveRef={saveBuyRef}
              type={1}
            />
            <BuyRentDemandCollap
              title={intl.formatMessage({ id: 'pages.customer_buy_rent.rent' })}
              dataSource={dataSourceRent}
              setDataSource={setDataSourceRent}
              formRowRef={formRent}
              saveRef={saveRentRef}
              defaultCollapsed={false}
              type={2}
            />
          </Space>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
}

export default BuyRentDetails;
