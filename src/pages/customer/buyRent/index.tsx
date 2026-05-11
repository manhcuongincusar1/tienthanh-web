import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { ProFormCheckbox, ProFormDigit, ProFormSelect } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { ProColumns } from '@ant-design/pro-table';
import { Button, Space, Tag, Tooltip, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel, Link, history, useAccess } from 'umi';
import { CUSTOMER_BUY_RENT_VALUE_ENUM } from '../contants';
import useAdministrative from '@/helpers/useAdministrative';
import { TableRef } from '@/pages/types';
import { customerServices } from '@/services/customerServices';
import { formatDateTime } from '@/utils';
import _ from 'lodash';
import itemRender from '@/helpers/breadcrumbHelper';
const { Link: LinkTy } = Typography;
import { CHECK_REAL_ESTATE_PRICE } from '@/pages/expression';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import formaterRealEstatePrice from '@/helpers/formaterRealEstatePrice';

type DataSource = {
  id: string;
  full_name: string;
  created_at: Date;
  phone_number: string;
  demand: string;
  goodwill: boolean;
  saler: string;
};

function BuyRent() {
  const intl = useIntl();
  const tableRef = useRef<TableRef>();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const access = useAccess();
  const filterAdministrative = useAdministrative(tableRef, {
    ward: { hideInSearch: true, hideInTable: true },
    province: { hideInTable: true, mode: 'multiple' },
    district: { hideInTable: true, mode: 'multiple' },
  });
  const [disableRangePrice, setDisableRangePrice] = useState<boolean>(true);
  const { getSaleList, saleList } = useModel('prepareSale');

  const { initialState } = useModel('@@initialState');

  const [demandTypeData, setDemandTypeData] = useState<string>('global.range_price');
  const currentUser = initialState?.currentUser;
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  useEffect(() => {
    getSaleList();
  }, []);

  const columns: ProColumns<DataSource>[] = [
    ...filterAdministrative,
    {
      title: intl.formatMessage({ id: 'global.created_at' }),
      dataIndex: 'created_at',
      hideInSearch: true,
      sorter: true,
      render: (dom) => {
        return <>{formatDateTime(`${dom}`)}</>;
      },
    },
    {
      title: intl.formatMessage({ id: 'global.customer_name' }),
      dataIndex: 'full_name',
      sorter: true,
      hideInSearch: true,
      width: 240,
      render: (dom: any, entity: any) => {
        let newString = entity.full_name;
        if (newString.length > 25) {
          newString = `${newString.slice(0, 25)}...`;
        }
        return access.customerBuyRentEdit ? (
          <Link to={`/customer/buy-rent/${entity.id}`}>
            <Tooltip placement="topLeft" title={entity.full_name.toString()}>
              {newString}
            </Tooltip>
          </Link>
        ) : (
          newString
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'global.phone' }),
      dataIndex: 'phone_number',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_buy_rent.demand' }),
      dataIndex: 'demand_type',
      order: 10,
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: string) => {
          tableRef.current?.setFieldsValue({ price_to: undefined });
          tableRef.current?.setFieldsValue({ price_from: undefined });
          if (value) {
            const isDisable = !(value === '1' || value === '2');
            setDisableRangePrice(isDisable);
            const demandTypeNew =
              value === '1'
                ? 'pages.customer_buy_rent.range_price_billion'
                : 'pages.customer_buy_rent.range_price_million';

            setDemandTypeData(demandTypeNew);
          } else {
            setDemandTypeData('global.range_price');
          }
          tableRef.current?.submitFormSearch();
        },
      },
      render: (dom) => {
        const domNew = (dom && [dom[0]]) || [];
        if (dom && dom[1] && dom[1] !== dom[0]) {
          domNew.push(dom[1]);
        }
        if (dom && dom[0] === null) {
          return <></>;
        }

        return (
          <>
            {domNew?.map((value: any) => (
              <Tag>
                {Number(value) === 1 && intl.formatMessage({ id: 'pages.customer_buy_rent.buy' })}
                {Number(value) === 2 && intl.formatMessage({ id: 'pages.customer_buy_rent.rent' })}
              </Tag>
            ))}
          </>
        );
      },
      renderFormItem: () => {
        return <ProFormSelect valueEnum={CUSTOMER_BUY_RENT_VALUE_ENUM} />;
      },
    },
    {
      title: intl.formatMessage({ id: demandTypeData }),
      hideInTable: true,
      order: -1,
      fieldProps: {
        onChange: (value: number) => {
          tableRef.current?.submitFormSearch();
        },
      },
      renderFormItem: () => {
        return (
          <Space size={12} className="custom-form-range">
            <ProFormDigit
              label={intl.formatMessage({ id: 'global.from' })}
              placeholder={intl.formatMessage({ id: 'global.from' })}
              disabled={disableRangePrice}
              name="price_from"
              min={0}
              rules={[
                {
                  pattern: CHECK_REAL_ESTATE_PRICE,
                  message: intl.formatMessage({ id: 'form.price.form_over_to' }),
                },
                {
                  validator: (rule, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              fieldProps={{
                onChange: (value: number | string | null) => {
                  if (value) {
                    tableRef.current?.submitFormSearch();
                  }
                },
                formatter: (value) => formaterRealEstatePrice(value),
              }}
            />
            <ProFormDigit
              placeholder={intl.formatMessage({ id: 'global.to' })}
              disabled={disableRangePrice}
              min={0}
              label={intl.formatMessage({ id: 'global.to' })}
              rules={[
                {
                  pattern: CHECK_REAL_ESTATE_PRICE,
                  message: intl.formatMessage({ id: 'form.price.form_over_to' }),
                },
                {
                  validator: (rule, value) => {
                    const priceFrom = tableRef.current?.getFieldValue('price_from');
                    if ((!!value && value < priceFrom) || value < 0) {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              fieldProps={{
                onChange: (value: number | string | null) => {
                  if (value) {
                    tableRef.current?.submitFormSearch();
                  }
                },
                formatter: (value) => formaterRealEstatePrice(value),
              }}
              name="price_to"
            />
          </Space>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_buy_rent.creator' }),
      dataIndex: 'creator_sale_name',
      width: 240,
      hideInSearch: currentUser?.role === 'sale',
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: number) => {
          tableRef.current?.submitFormSearch();
        },
      },
      render: (dom, entity: any) => {
        return (
          <Typography.Text
            ellipsis={{ tooltip: entity.creator_sale_name }}
            style={{
              width: 200,
            }}
          >
            {entity.creator_sale_name}
          </Typography.Text>
        );
      },
      renderFormItem: () => {
        return (
          <ProFormSelect
            options={saleList}
            mode="multiple"
            placeholder={intl.formatMessage({ id: 'global.all' })}
            fieldProps={{
              // maxTagCount: 'responsive',
              showArrow: true,
            }}
          />
        );
      },
    },
    {
      dataIndex: 'goodwill',
      title: intl.formatMessage({ id: 'pages.customer_buy_rent.goodwill' }),
      valueType: 'select',
      valueEnum: { 1: 'Không', 2: 'Có' },
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: number) => {
          tableRef.current?.submitFormSearch();
        },
      },
      render: (dom, record) => {
        return <ProFormCheckbox disabled fieldProps={{ checked: !!record.goodwill }} />;
      },
    },
    {
      title: intl.formatMessage({ id: 'form.card.operation' }),
      hideInSearch: true,
      render: (dom, entity: any) => {
        return (
          access.customerBuyRentEdit && (
            <Link to={`/customer/buy-rent/${entity.id}`}>
              <LinkTy>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19 2.87866C18.7026 2.87866 18.4174 2.9968 18.2071 3.20709L8.90296 12.5112L8.37437 14.6256L10.4888 14.097L19.7929 4.79288C20.0032 4.58259 20.1213 4.29737 20.1213 3.99998C20.1213 3.70259 20.0032 3.41738 19.7929 3.20709C19.5826 2.9968 19.2974 2.87866 19 2.87866ZM16.7929 1.79288C17.3783 1.20751 18.1722 0.878662 19 0.878662C19.8278 0.878662 20.6217 1.20751 21.2071 1.79288C21.7925 2.37824 22.1213 3.17216 22.1213 3.99998C22.1213 4.82781 21.7925 5.62173 21.2071 6.20709L11.7071 15.7071C11.5789 15.8352 11.4184 15.9262 11.2425 15.9701L7.24254 16.9701C6.90176 17.0553 6.54127 16.9555 6.29289 16.7071C6.04451 16.4587 5.94466 16.0982 6.02986 15.7574L7.02986 11.7574C7.07382 11.5816 7.16473 11.421 7.29289 11.2929L16.7929 1.79288ZM0.87868 3.87866C1.44129 3.31605 2.20435 2.99998 3 2.99998H10C10.5523 2.99998 11 3.4477 11 3.99998C11 4.55227 10.5523 4.99998 10 4.99998H3C2.73478 4.99998 2.48043 5.10534 2.29289 5.29288C2.10536 5.48041 2 5.73477 2 5.99998V20C2 20.2652 2.10536 20.5196 2.29289 20.7071C2.48043 20.8946 2.73478 21 3 21H17C17.2652 21 17.5196 20.8946 17.7071 20.7071C17.8946 20.5196 18 20.2652 18 20V13C18 12.4477 18.4477 12 19 12C19.5523 12 20 12.4477 20 13V20C20 20.7956 19.6839 21.5587 19.1213 22.1213C18.5587 22.6839 17.7957 23 17 23H3C2.20435 23 1.44129 22.6839 0.87868 22.1213C0.31607 21.5587 0 20.7956 0 20V5.99998C0 5.20433 0.31607 4.44127 0.87868 3.87866Z"
                    fill="currentColor"
                  />
                </svg>
              </LinkTy>
            </Link>
          )
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.customer_buy_rent' }),
        ghost: true,
        breadcrumb: {
          itemRender: itemRender,
          routes: [
            {
              path: '/',
              breadcrumbName: intl.formatMessage({ id: 'global.home' }),
            },
            {
              path: '',
              breadcrumbName: intl.formatMessage({ id: 'pages.customer_buy_rent' }),
            },
          ],
        },
        extra: [],
      }}
    >
      <CustomProTableLayout
        ref={tableRef}
        tableKey={'buy-detail'}
        dataTable={{
          optionToolbar: {
            setting: true,
            reload: true,
            search: true,
            layout: false,
          },
          tooltip: intl.formatMessage({ id: 'pages.customer_buy_rent.tooltip.search' }),
        }}
        table={{
          columns: [...columns],
          toolBarRender: () => {
            return [
              <Button
                type="primary"
                key="primary"
                hidden={!access.customerBuyRentCreate}
                onClick={() => {
                  history.push('/customer/buy-rent/create');
                }}
                shape="circle"
                size="small"
              >
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
                {intl.formatHTMLMessage({ id: 'global.create_new' })}
              </Button>,
            ];
          },
          request: async (params, sorter, filter) => {
            const {
              creator_sale_name,
              keyword,
              goodwill,
              province_city_title,
              district_title,
              demand_type,
              pageSize,
              price_to,
              price_from,
              current,
            } = params;

            if (_.isUndefined(demand_type)) {
              setDisableRangePrice(true);
              setDemandTypeData('global.range_price');
            }
            const offset = pageSize * current - pageSize;
            const { customer_list, count, keyResponse } = await customerServices.getCustomerBuyRent(
              {
                province_city_id: province_city_title,
                creator_sale_id: creator_sale_name,
                keyword,
                price_to,
                price_from,
                goodwill: goodwill,
                demand_type,
                districts_id: district_title,
                sorter: _.isEmpty(sorter) ? undefined : sorter,
                offset: offset,
                limit: pageSize,
                branch_id: workspace_id,
              },
            );
            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }

            return {
              data: customer_list,
              success: true,
              total: count,
            };
          },
          rowKey: 'id',
          dateFormatter: 'string',
          search: {
            labelWidth: 'auto',
            span: {
              xs: 24,
              sm: 24,
              md: 12,
              lg: 8,
              xl: 8,
              xxl: 8,
            },
          },
        }}
      />
    </PageContainer>
  );
}
export default BuyRent;
