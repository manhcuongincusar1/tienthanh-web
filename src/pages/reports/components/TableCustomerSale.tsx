import React, { MutableRefObject, useEffect } from 'react';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { Button, Space, Tag, Typography } from 'antd';
import { ProFormDigit, ProFormInstance, ProFormSelect } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { useIntl, useModel } from 'umi';
import { TableRef } from '@/pages/types';
import { formatDate } from '@/utils';
import moment from 'moment';
import { customerServices } from '@/services/customerServices';
import { CHECK_REAL_ESTATE_PRICE } from '@/pages/expression';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import formaterRealEstatePrice from '@/helpers/formaterRealEstatePrice';

interface TableChangeStatusRealEstateReportProps {
  formRef: MutableRefObject<ProFormInstance<Record<string, any>> | undefined>;
  tableRef: React.MutableRefObject<TableRef | undefined>;
}

export default function TableCustomerSale({
  tableRef,
  formRef,
}: TableChangeStatusRealEstateReportProps) {
  const intl = useIntl();
  const { getSaleList, saleList } = useModel('prepareSale');
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const { initialState } = useModel('@@initialState');
  const { getSetting, settingSystem } = useModel('setting');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const { isSubmit, setIsSubmit } = useModel('realEstateReport');
  const currentUser = initialState?.currentUser;
  useEffect(() => {
    getSaleList();
    getSetting(workspace_id);
    setIsSubmit(false);
    return () => {
      setIsSubmit(false);
    };
  }, []);

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({ id: 'pages.customer_sale.customer_full_name' }),
      dataIndex: 'full_name',
      hideInSearch: true,
      render: (dom: any) => {
        return (
          <Typography.Text
            ellipsis={{ tooltip: dom }}
            style={{
              width: 200,
            }}
          >
            {dom}
          </Typography.Text>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_sale.phone_number' }),
      dataIndex: 'phone_number',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_sale.demand' }),
      dataIndex: 'type',
      hideInSearch: true,
      render: (dom) => {
        return (
          <Tag>
            {Number(dom) === 1
              ? intl.formatMessage({ id: 'pages.customer_buy_rent.buy' })
              : intl.formatMessage({ id: 'pages.customer_buy_rent.rent' })}
          </Tag>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_sale.created_date' }),
      dataIndex: 'created_at',
      hideInSearch: true,
      sorter: true,
      render: (dom: any) => {
        return formatDate(dom);
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_sale.price_billion' }),
      dataIndex: 'price_from_sell',
      hideInSearch: true,
      sorter: true,
      render: (dom, record) => {
        let newDom;
        if (record.price_from_sell && record.price_to_sell) {
          newDom = `Từ ${formaterRealEstatePrice(
            record.price_from_sell,
          )} đến ${formaterRealEstatePrice(record.price_to_sell)}`;
        } else if (record.price_from_sell || record.price_to_sell) {
          newDom = record.price_from_sell
            ? `Từ ${formaterRealEstatePrice(record.price_from_sell)}`
            : `Từ 0 đến ${formaterRealEstatePrice(record.price_to_sell)}`;
        }
        return <>{newDom}</>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_sale.price_million' }),
      dataIndex: 'price_from_rent',
      hideInSearch: true,
      sorter: true,
      render: (dom, record) => {
        let newDom;
        if (record.price_from_rent && record.price_to_rent) {
          newDom = `Từ ${formaterRealEstatePrice(
            record.price_from_rent,
          )} đến ${formaterRealEstatePrice(record.price_to_rent)}`;
        } else if (record.price_from_rent || record.price_to_rent) {
          newDom = record.price_from_rent
            ? `Từ ${formaterRealEstatePrice(record.price_from_rent)}`
            : `Từ 0 đến ${formaterRealEstatePrice(record.price_to_rent)}`;
        }
        return <>{newDom}</>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_sale.sale_full_name' }),
      dataIndex: 'sale_full_name',
      hideInSearch: true,
      render: (dom: any) => {
        return (
          <Typography.Text
            ellipsis={{ tooltip: dom }}
            style={{
              width: 200,
            }}
          >
            {dom}
          </Typography.Text>
        );
      },
    },
  ];
  const columnsFilters: ProColumns[] = [
    {
      title: intl.formatMessage({ id: 'global.time' }),
      hideInTable: true,
      order: 9,
      dataIndex: 'date_range',
      valueType: 'dateRange',
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'form.enter_info' }) }],
      },
      fieldProps: {
        format: 'DD/MM/YYYY',
        disabledDate: (current) => {
          let customDate = moment().format('YYYY-MM-DD');
          const date_range = tableRef.current?.getFieldValue('date_range');
          if (!date_range || date_range.length === 0) {
            return false;
          }
          const limit_time = settingSystem?.limit_time || 90;
          const tooLate = date_range[0] && current.diff(date_range[0], 'day') > limit_time;
          const tooEarly = date_range[1] && date_range[1].diff(current, 'day') > limit_time;

          return (
            (current && current > moment(customDate, 'YYYY-MM-DD').add(1, 'days')) ||
            tooEarly ||
            tooLate
          );
        },
        placeholder: [
          intl.formatMessage({ id: 'global.start_day' }),
          intl.formatMessage({ id: 'global.end_day' }),
        ],
        rules: [{ required: true, message: intl.formatMessage({ id: 'form.enter_info' }) }],
      },
      initialValue: [moment().subtract(1, 'month'), moment()],
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_sale.price_billion' }),
      hideInTable: true,
      order: 8,
      renderFormItem: () => (
        <Space size={12} className="custom-form-range">
          <ProFormDigit
            rules={[
              {
                pattern: CHECK_REAL_ESTATE_PRICE,
                message: intl.formatMessage({ id: 'form.price.form_over_to' }),
              },
              {
                validator: (rule, value) => {
                  const priceTo = tableRef.current?.getFieldValue('price_to_sell');
                  if ((!!value && priceTo && value > priceTo) || value === 0 || value < 0) {
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            fieldProps={{
              formatter: (value) => formaterRealEstatePrice(value),
            }}
            name="price_from_sell"
            placeholder="Từ"
            label="Từ"
          />
          <ProFormDigit
            name="price_to_sell"
            rules={[
              {
                pattern: CHECK_REAL_ESTATE_PRICE,
                message: intl.formatMessage({ id: 'form.price.form_over_to' }),
              },
              {
                validator: (rule, value) => {
                  const priceFrom = tableRef.current?.getFieldValue('price_from_sell');
                  if ((!!value && value < priceFrom) || value === 0 || value < 0) {
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            fieldProps={{
              formatter: (value) => formaterRealEstatePrice(value),
            }}
            placeholder="Đến"
            label="Đến"
          />
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_sale.price_million' }),
      hideInTable: true,
      order: 8,
      renderFormItem: () => (
        <Space size={12} className="custom-form-range">
          <ProFormDigit
            fieldProps={{
              formatter: (value) => formaterRealEstatePrice(value),
            }}
            rules={[
              {
                pattern: CHECK_REAL_ESTATE_PRICE,
                message: intl.formatMessage({ id: 'form.price.form_over_to' }),
              },
              {
                validator: (rule, value) => {
                  const priceTo = tableRef.current?.getFieldValue('price_to_rent');
                  if ((!!value && priceTo && value > priceTo) || value === 0 || value < 0) {
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            name="price_from_rent"
            placeholder="Từ"
            label="Từ"
          />
          <ProFormDigit
            fieldProps={{
              formatter: (value) => formaterRealEstatePrice(value),
            }}
            rules={[
              {
                pattern: CHECK_REAL_ESTATE_PRICE,
                message: intl.formatMessage({ id: 'form.price.form_over_to' }),
              },
              {
                validator: (rule, value) => {
                  const priceFrom = tableRef.current?.getFieldValue('price_from_rent');
                  if ((!!value && value < priceFrom) || value === 0 || value < 0) {
                    return Promise.reject(
                      new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            name="price_to_rent"
            placeholder="Đến"
            label="Đến"
          />
        </Space>
      ),
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_buy_rent.creator' }),
      dataIndex: 'creator_sale',
      width: 240,
      hideInTable: true,
      hideInSearch: currentUser?.role === 'sale',
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'global.all' }),
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
              maxTagCount: 'responsive',
              showArrow: true,
            }}
          />
        );
      },
    },
  ];
  return (
    <CustomProTableLayout
      ref={tableRef}
      tableKey="new-real-estate"
      dataTable={{
        optionToolbar: {
          search: false,
          layout: false,
          setting: false,
          reload: false,
        },
      }}
      table={{
        rowKey: 'id',
        columns: [...columns, ...columnsFilters],
        request: async (params, sort) => {
          const {
            price_from_sell,
            price_to_sell,
            price_from_rent,
            price_to_rent,
            pageSize,
            current,
            date_range,
            creator_sale,
          } = params;

          const offset = pageSize * current - pageSize;
          let start_day;
          let end_day;
          if (date_range) {
            start_day = moment(date_range[0], 'DD-MM-YYYY')?.format('YYYY-MM-DD');
            end_day = moment(date_range[1], 'DD-MM-YYYY')?.format('YYYY-MM-DD');
          }
          if (isSubmit) {
            const { list_data, count, keyResponse } =
              (await customerServices.getListCustomerReport({
                offset: offset,
                limit: pageSize,
                start_day: start_day,
                end_day: end_day,
                price_from_sell,
                price_to_sell,
                price_from_rent,
                price_to_rent,
                creator_sale,
                branch_id: currentUser?.currentWorkSpace?.id,
                sort,
              })) || {};
            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }
            if (list_data) {
              formRef.current?.setFieldsValue({
                data_filter: JSON.stringify({
                  price_from_sell: price_from_sell,
                  price_to_sell: price_to_sell,
                  price_from_rent: price_from_rent,
                  price_to_rent: price_to_rent,
                  creator_sale: creator_sale,
                  end_day: end_day,
                  start_day: start_day,
                }),
              });
              formRef.current?.submit();
            }

            return { data: list_data, success: true, total: count || 0 };
          }
          return { data: [], success: true, total: 0 };
        },
        toolBarRender: false,
        className: 'table-report',
        form: { ignoreRules: false },
        search: {
          labelWidth: 'auto',
          span: {
            xs: 24,
            sm: 24,
            md: 12,
            lg: 12,
            xl: 8,
            xxl: 8,
          },
          optionRender: () => {
            return [
              <Button
                key="search"
                shape="circle"
                type="primary"
                onClick={() => {
                  setIsSubmit(true);
                  tableRef?.current?.submitFormSearch();
                }}
              >
                {intl.formatMessage({ id: 'global.search' })}
              </Button>,
              <Button
                key="reset"
                shape="circle"
                onClick={() => {
                  tableRef?.current?.resetFieldsValue();
                  tableRef?.current?.submitFormSearch();
                }}
              >
                {intl.formatMessage({ id: 'global.delete.filter' })}
              </Button>,
            ];
          },
          collapseRender: (collapsed: any) => (
            <>
              {collapsed
                ? intl.formatMessage({ id: 'global.expand' })
                : intl.formatMessage({ id: 'global.close' })}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={!collapsed ? 'collapsed' : ''}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.4712 5.52859C12.2109 5.26824 11.7888 5.26824 11.5284 5.52859L7.99984 9.05719L4.47124 5.52859C4.21089 5.26824 3.78878 5.26824 3.52843 5.52859C3.26808 5.78894 3.26808 6.21105 3.52843 6.4714L7.52843 10.4714C7.78878 10.7317 8.21089 10.7317 8.47124 10.4714L12.4712 6.4714C12.7316 6.21105 12.7316 5.78894 12.4712 5.52859Z"
                  fill="#1D1E20"
                />
              </svg>
            </>
          ),
        },
      }}
    ></CustomProTableLayout>
  );
}
