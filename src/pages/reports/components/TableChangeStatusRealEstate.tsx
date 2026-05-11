import React, { MutableRefObject, useEffect, useState } from 'react';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { Button, Space, Tag, Typography } from 'antd';
import {
  ProFormCheckbox,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
} from '@ant-design/pro-form';
import { REAL_ESTATE_TYPE_OPTION } from '../constant';
import { realEstateService } from '@/services/realEstateService';
import type { ProColumns } from '@ant-design/pro-table';
import { useIntl, useModel } from 'umi';
import { TableRef } from '@/pages/types';
import { formatDate } from '@/utils';
import moment from 'moment';
import { CHECK_REAL_ESTATE_PRICE } from '@/pages/expression';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import formaterRealEstatePrice from '@/helpers/formaterRealEstatePrice';

interface TableChangeStatusRealEstateReportProps {
  formRef: MutableRefObject<ProFormInstance<Record<string, any>> | undefined>;
  tableRef: React.MutableRefObject<TableRef | undefined>;
  realEstateStatusDataList?: API.RealEstateStatusResponse[];
}

export default function TableChangeStatusRealEstate({
  tableRef,
  formRef,
  realEstateStatusDataList,
}: TableChangeStatusRealEstateReportProps) {
  const intl = useIntl();
  const { getSetting, settingSystem } = useModel('setting');
  const [realEstateType, setRealEstateType] = useState<string | number>();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const currentUser = initialState?.currentUser;
  const [realEstateTypeLabelFilter, setRealEstateTypeLabelFilter] = useState<string | number>();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const { isSubmit, setIsSubmit } = useModel('realEstateReport');
  useEffect(() => {
    getSetting(workspace_id);
    setIsSubmit(false);
    return () => {
      setIsSubmit(false);
    };
  }, []);

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({ id: 'global.created_date' }),
      dataIndex: 'created_at',
      hideInSearch: true,
      sorter: true,
      render: (dom: any) => {
        return formatDate(dom);
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.change_status_real_estate.address' }),
      dataIndex: 'full_address',
      hideInSearch: true,
      width: 400,
      render: (dom) => {
        return (
          <Typography.Text
            ellipsis={{ tooltip: dom }}
            style={{
              maxWidth: 400,
            }}
          >
            {dom === '-' ? '' : dom}
          </Typography.Text>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.change_status_real_estate.status' }),
      dataIndex: ['next_real_estate_status', 'title'],
      hideInSearch: true,
      render: (dom, record) => {
        return (
          <>
            <Tag color={record?.real_estate_status_color}>{dom}</Tag>
          </>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.change_status_real_estate.category' }),
      dataIndex: 'category_title',
      hideInSearch: true,
    },
    {
      title:
        realEstateType === 2
          ? intl.formatMessage({ id: 'pages.change_status_real_estate.rent_internal' })
          : intl.formatMessage({ id: 'pages.change_status_real_estate.sell_internal' }),
      dataIndex: 'is_internal',
      hideInSearch: true,
      render: (dom, record) => {
        return (
          <ProFormCheckbox disabled fieldProps={{ checked: record?.is_internal }}></ProFormCheckbox>
        );
      },
    },
    {
      title: intl.formatMessage({
        id:
          realEstateType === 2
            ? 'pages.change_status_real_estate.price_million'
            : 'pages.change_status_real_estate.price_billion',
      }),
      dataIndex: 'price',
      sorter: true,
      hideInSearch: true,
      render: (dom) => {
        return dom && formaterRealEstatePrice(`${dom}`);
      },
    },
  ];
  const columnsFilters: ProColumns[] = [
    {
      title:
        realEstateTypeLabelFilter === 2
          ? intl.formatMessage({ id: 'pages.change_status_real_estate.rent_internal' })
          : intl.formatMessage({ id: 'pages.change_status_real_estate.sell_internal' }),
      dataIndex: 'is_internal',
      colSize: 1.5,
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'global.all' }),
        options: [
          { value: true, label: 'Có' },
          { value: false, label: 'Không' },
        ],
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.change_status_real_estate.type' }),
      hideInTable: true,
      dataIndex: 'real_estate_type',
      colSize: 1.5,
      order: 10,
      valueType: 'select',
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'form.enter_info' }) }],
      },
      fieldProps: {
        allowClear: false,
        placeholder: intl.formatMessage({ id: 'global.all' }),
        options: REAL_ESTATE_TYPE_OPTION,
        onChange: (value: any) => {
          if (value) {
            setRealEstateTypeLabelFilter(value);
          }
        },
      },
      initialValue: 1,
      // renderFormItem: () => (
      //   <ProFormSelect
      //     name="real_estate_type"
      //     initialValue={1}
      //     fieldProps={{
      //       allowClear: false,
      // onChange: (value) => {
      //   if (value) {
      //     setRealEstateTypeLabelFilter(value);
      //   }
      // },
      //     }}
      //     placeholder={intl.formatMessage({ id: 'global.all' })}
      //     options={REAL_ESTATE_TYPE_OPTION}
      //   />
      // ),
    },
    {
      title: intl.formatMessage({ id: 'global.time' }),
      hideInTable: true,
      colSize: 1.5,
      order: 9,
      dataIndex: 'date_range',
      valueType: 'dateRange',
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
      },
      initialValue: [moment().subtract(1, 'month'), moment()],
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'form.enter_info' }) }],
      },
    },
    {
      title: intl.formatMessage({
        id:
          realEstateTypeLabelFilter === 2
            ? 'pages.change_status_real_estate.range_price_million'
            : 'pages.change_status_real_estate.range_price_billion',
      }),
      hideInTable: true,
      order: 8,
      colSize: 1.5,
      renderFormItem: () => (
        <Space size={12} className="custom-form-range">
          <ProFormDigit
            placeholder="Từ"
            rules={[
              {
                pattern: CHECK_REAL_ESTATE_PRICE,
                message: intl.formatMessage({ id: 'form.price.form_over_to' }),
              },
            ]}
            fieldProps={{
              formatter: (value) => formaterRealEstatePrice(value),
            }}
            label="Từ"
            name="price_from"
          />
          <ProFormDigit
            placeholder="Đến"
            rules={[
              {
                pattern: CHECK_REAL_ESTATE_PRICE,
                message: intl.formatMessage({ id: 'form.price.form_over_to' }),
              },
              {
                validator: (rule, value) => {
                  const priceFrom = tableRef.current?.getFieldValue('price_from');
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
            label="Đến"
            name="price_to"
          />
        </Space>
      ),
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
        form: { ignoreRules: false },
        className: 'table-report',
        columns: [...columns, ...columnsFilters],
        request: async (params, sorter) => {
          const {
            real_estate_type,
            price_from,
            price_to,
            is_internal,
            pageSize,
            current,
            date_range,
          } = params;

          const offset = pageSize * current - pageSize;
          let start_day;
          let end_day;
          if (date_range) {
            start_day = moment(date_range[0], 'DD-MM-YYYY')?.format('YYYY-MM-DD');
            end_day = moment(date_range[1], 'DD-MM-YYYY')?.format('YYYY-MM-DD');
          }
          if (isSubmit) {
            setRealEstateType(real_estate_type);
            const { data_list, count, keyResponse } =
              (await realEstateService.getListChangeStatusRealEstateReport({
                offset: offset,
                limit: pageSize,
                type: real_estate_type,
                is_internal: is_internal,
                from_price: price_from,
                to_price: price_to,
                start_day: start_day,
                end_day: end_day,
                sorter: sorter,
                branch_id: currentUser?.currentWorkSpace?.id,
              })) || {};

            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }

            if (data_list) {
              formRef.current?.setFieldsValue({
                data_filter: JSON.stringify({
                  from_price: price_from,
                  to_price: price_to,
                  type: real_estate_type,
                  end_day: end_day,
                  start_day: start_day,
                  is_internal: is_internal,
                }),
              });
              formRef.current?.submit();

              const newReportDataList = data_list?.map((item: any) => {
                const realEstateStatusOfRow: any = realEstateStatusDataList?.find(
                  (realEstateStatusItem: { id?: string }) => {
                    return realEstateStatusItem?.id === item?.next_real_estate_status?.id;
                  },
                );

                return {
                  ...item,
                  real_estate_status_color: realEstateStatusOfRow?.color,
                };
              });

              return { data: newReportDataList || [], success: true, total: count };
            }
          }
          return { data: [], success: true, total: 0 };
        },
        toolBarRender: false,
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
                onClick={() => {
                  tableRef?.current?.resetFieldsValue();
                  tableRef?.current?.submitFormSearch();
                }}
                key="reset"
                shape="circle"
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
