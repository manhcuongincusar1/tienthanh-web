import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useParams, useIntl, history, Link, useModel } from 'umi';
import { Button, Col, Form, Row, Tag, Tooltip, Typography } from 'antd';
import Styles from './index.less';
import { apiCustomer } from '@/api/customers/api';
import { useRef, useState } from 'react';
import { message } from 'antd';
import { formatDateTime } from '@/utils/dateUtils';
import _ from 'lodash';
import itemRender from '@/helpers/breadcrumbHelper';
import { customerServices } from '@/services/customerServices';
import { CHECK_PHONE_NUMBER } from '@/pages/expression';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import { CUSTOMER_TYPE_ENUM } from '../../contants';

interface Params {
  id: string;
}
interface TableTransactionHistory {
  address: string;
  created_at: Date;
  status: number;
  id: string;
  real_status: [];
  province_city_title: string;
  district_title: string;
  ward_title: string;
  street_title: string;
  real_estate_status_color: string;
  real_estate_status_title: string;
  type: number;
}

interface PhoneNumberSub {
  phone_number: string;
  status: number;
  id: string;
  is_delete: boolean;
}

const STATUS_ENUM = {
  ACTIVE: 1,
  DELETED: 2,
};

function Edit() {
  const { id } = useParams<Params>();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const intl = useIntl();
  const [previousPhoneNumberEntries, setPreviosPhoneNumberEntries] = useState<
    PhoneNumberSub[] | []
  >([]);
  const [previousPhoneNumberList, setPreviosPhoneNumberList] = useState<string[]>([]);

  const { typePageDefault } = useModel('realEstateSell');
  const [forceUpdate, setForceUpdate] = useState<number>(1);
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);

  const columns: ProColumns<TableTransactionHistory>[] = [
    {
      dataIndex: 'created_at',
      title: intl.formatMessage({ id: 'global.created_at' }),
      width: 125,
      sorter: true,
      render: (dom) => {
        return formatDateTime(`${dom}`);
      },
    },
    {
      dataIndex: 'address',
      title: intl.formatMessage({ id: 'pages.customer_sell_rent.address' }),
      width: 400,
      render: (dom, record) => {
        let title = `${record.address} ${record.street_title}, ${record.ward_title}, ${record.district_title}, ${record.province_city_title}`;
        const typePageNew = typePageDefault.find((item) => item.type === record.type);
        return (
          <Tooltip placement="topLeft" title={title}>
            <Typography.Link
              ellipsis={true}
              style={{
                width: 400,
              }}
            >
              <Link to={`/${typePageNew?.path}/${record?.id}`} target="_blank" title={title}>
                {title}
              </Link>
            </Typography.Link>
          </Tooltip>
        );
      },
    },
    {
      dataIndex: 'type',
      title: intl.formatMessage({ id: 'pages.customer_sell_rent.demand' }),
      render: (dom) => {
        const domNew = Number(dom);
        return (
          <>
            <Tag>{domNew === 1 ? 'Bán' : 'Cho thuê'}</Tag>
          </>
        );
      },
    },
    {
      dataIndex: 'real_estate_status_title',
      title: intl.formatMessage({ id: 'global.status' }),
      render: (dom, record) => {
        const domNew = dom === '-' || dom === undefined ? undefined : dom;
        return (
          <>
            {domNew && (
              <Tag color={record.real_estate_status_color}>{record.real_estate_status_title}</Tag>
            )}
          </>
        );
      },
    },
    {
      dataIndex: 'creator_sale_name',
      title: intl.formatMessage({ id: 'pages.customer_sale.creator_full_name' }),
    },
    {
      dataIndex: 'creator_sale_phone',
      title: intl.formatMessage({ id: 'pages.customer_sale.creator_phone_number' }),
    },
  ];
  const _func = {
    onFinish: async (data: any) => {
      const { phone_number_list, full_name, phone_number } = data;
      const newPhoneNumberList = phone_number_list.map((phone: any) => {
        let newPhoneItem;
        _.each(phone, (value, key) => {
          if (key?.includes('item__')) {
            const newIdItem = key?.split('__')?.[1];
            newPhoneItem = {
              id: newIdItem,
              phone_number: value,
              status: STATUS_ENUM.ACTIVE,
            };
          } else if (key?.includes('phone_number_item')) {
            newPhoneItem = {
              phone_number: value,
              status: 0,
            };
          }
        });
        return newPhoneItem;
      });

      let phoneNumberDeleteList = previousPhoneNumberEntries?.filter((phone) => {
        return !newPhoneNumberList.some((phoneItem: any) => {
          return phone?.id === phoneItem.id;
        });
      });

      phoneNumberDeleteList = phoneNumberDeleteList?.map((phoneDelete) => {
        return { ...phoneDelete, status: STATUS_ENUM.DELETED };
      });
      const { data: dataResponse, keyResponse } = await customerServices.updateCustomerSellRentById(
        {
          phone_number: phone_number,
          full_name: full_name,
          phone_number_sub_list: [...newPhoneNumberList, ...phoneNumberDeleteList],
          branch_id: workspace_id,
        },
        id,
      );
      if (dataResponse) {
        message.success(
          intl.formatMessage({ id: 'form.update_info_success' }),
          MESSAGE_DISPLAY_SECONDS.SUCCESS,
          () => {
            setForceUpdate((prv) => prv + 1);
          },
        );
      } else if (keyResponse) {
        handleResponseFromCallApi(
          { response: keyResponse },
          { localeActionFailedId: 'form.update_info_failed' },
        );
      }
      return true;
    },
    validatePhoneNumber: ({ getFieldValue }: any) => ({
      async validator(_re: any, value: string) {
        if (value && value.match(CHECK_PHONE_NUMBER)) {
          const response = await customerServices.checkExistPhoneNumberOfCustomer({
            customer_id: id,
            phone_number: value,
            branch_id: workspace_id,
            type: CUSTOMER_TYPE_ENUM.SELL,
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
              new Error(intl.formatMessage({ id: 'form.field.duplicate.phone_number' })),
            );
          } else {
            const resultPhoneListRaw = getFieldValue('phone_number_list');
            let phoneNumberList = resultPhoneListRaw.map((value: any) => {
              let phoneNumber;
              _.each(value, (value: any) => {
                if (value.length >= 8) {
                  phoneNumber = value;
                }
              });
              return phoneNumber;
            });
            phoneNumberList = [getFieldValue('phone_number'), ...phoneNumberList];

            const duplicateList = phoneNumberList.filter((phone: string) => phone === value);
            if (duplicateList.length <= 1) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error(intl.formatMessage({ id: 'form.field.duplicate.phone_number' })),
            );
          }
        }
      },
    }),
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.customer_sell_rent.detail' }),
        ghost: true,
        breadcrumb: {
          itemRender: itemRender,
          routes: [
            {
              path: '/',
              breadcrumbName: intl.formatMessage({ id: 'global.home' }),
            },
            {
              path: '/customer/sell-rent',
              breadcrumbName: intl.formatMessage({ id: 'pages.customer_sell_rent' }),
            },
            {
              path: '',
              breadcrumbName: intl.formatMessage({
                id: 'pages.customer_sell_rent.detail',
              }),
            },
          ],
        },
        extra: [],
      }}
    >
      <ProCard
        headerBordered
        direction="column"
        title={intl.formatMessage({ id: 'pages.customer_sell_rent.info' })}
      >
        <ProForm
          onFinish={_func.onFinish}
          formRef={formRef}
          params={{ forceUpdate }}
          request={async () => {
            const { customer_data, phone_number_sub_list, keyResponse } =
              await customerServices.getCustomerSellRentInfoById(id, workspace_id);
            const newPhoneList = phone_number_sub_list?.map(
              (phone_number: { phone_number: string }) => {
                return phone_number?.phone_number;
              },
            );

            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }

            setPreviosPhoneNumberList(newPhoneList);
            setPreviosPhoneNumberEntries(phone_number_sub_list || []);

            return customer_data || {};
          }}
          submitter={{
            searchConfig: {
              submitText: intl.formatMessage({ id: 'global.form.button_ok' }),
              resetText: intl.formatMessage({ id: 'global.form.button_cancel' }),
            },
            submitButtonProps: {
              shape: 'circle',
            },
            resetButtonProps: {
              shape: 'circle',
            },
            onReset: () => {
              history.push('/customer/sell-rent');
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
                label={intl.formatMessage({ id: 'global.customer_name' })}
                rules={[
                  { required: true, message: intl.formatMessage({ id: 'form.please_enter_data' }) },
                  { max: 250, message: intl.formatMessage({ id: 'form.over_length' }) },
                ]}
                placeholder={intl.formatMessage({ id: 'form.enter_data' })}
              />
            </Col>
            <Col span={24} xl={{ span: 12 }}>
              <div className={Styles.formItem}>
                <ProFormText
                  name="phone_number"
                  label={intl.formatMessage({ id: 'global.phone_number' })}
                  placeholder={intl.formatMessage({ id: 'form.enter_data' })}
                  fieldProps={{
                    onChange: (event) => {
                      if (event.target.value.length < 10 || _.isUndefined(event.target.value)) {
                        formRef.current?.submit();
                      }
                    },
                  }}
                  normalize={(value) => value.trim()}
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
              <div className={Styles.addMore}>
                <Form.List name="phone_number_list" initialValue={previousPhoneNumberList}>
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        {fields.map(({ key, name }, index) => {
                          const previousPhoneNumberItem: any = previousPhoneNumberEntries.find(
                            (phoneItem) => {
                              return phoneItem.phone_number === previousPhoneNumberList?.[key];
                            },
                          );

                          if (previousPhoneNumberItem) {
                            formRef.current?.setFields([
                              {
                                name: [`phone_number_list_${index}_phone_number_item`],
                                value: previousPhoneNumberItem?.phone_number,
                              },
                            ]);
                          }
                          return (
                            <div key={key} className={Styles.dynamicFormItem}>
                              <div className={Styles.dynamicFormItemInput}>
                                <ProFormText
                                  initialValue={previousPhoneNumberList[key]}
                                  name={[
                                    name,
                                    `${
                                      previousPhoneNumberItem?.id
                                        ? 'item__' + previousPhoneNumberItem?.id
                                        : 'phone_number_item'
                                    }`,
                                  ]}
                                  placeholder={intl.formatMessage({ id: 'form.enter_info' })}
                                  normalize={(value) => value.trim()}
                                  fieldProps={{
                                    onChange: (event) => {
                                      if (event.target.value) {
                                        formRef.current?.setFields([
                                          {
                                            name: [`phone_number_list_${key}_phone_number_item`],
                                            value: event.target.value.trim(),
                                          },
                                        ]);
                                      }
                                    },
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
                              {!previousPhoneNumberItem ||
                              (previousPhoneNumberItem && previousPhoneNumberItem?.is_delete) ? (
                                <Button
                                  className={Styles.btnRemove}
                                  onClick={() => {
                                    remove(name);
                                  }}
                                >
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
                              ) : (
                                <Button className={Styles.btnRemove}></Button>
                              )}
                            </div>
                          );
                        })}
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
                    );
                  }}
                </Form.List>
              </div>
            </Col>
          </Row>
          <span className="section-space-top" />
          <h3 className="section-title">
            {intl.formatMessage({ id: 'pages.customer_sell_rent.transaction_history' })}
          </h3>
          <ProTable
            columns={columns}
            rowKey="dealID"
            pagination={{
              size: 'default',
              pageSize: 10,
              showTotal: undefined,
              showSizeChanger: true,
            }}
            toolBarRender={false}
            search={false}
            request={async (params, sorter, filter) => {
              const { pageSize, current } = params;
              let offset: number = 0;
              if (pageSize && current) {
                offset = pageSize * current - pageSize;
              }

              const { list, count, keyResponse } = await apiCustomer.getTransactionHistory({
                customer_id: id,
                offset: offset,
                limit: pageSize || 10,
                sorter: sorter,
                branch_id: workspace_id,
              });
              if (keyResponse) {
                handleResponseFromCallApi({ response: keyResponse });
                return {};
              }

              return {
                data: list,
                success: true,
                total: count,
              };
            }}
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
}

export default Edit;
