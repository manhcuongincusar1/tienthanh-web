import { realEstateService } from '@/services/realEstateService';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { Button, Tag, Typography } from 'antd';
import { ProFormDigit, ProFormInstance } from '@ant-design/pro-form';
import { TableRef } from '@/pages/types';
import { Space } from 'antd';
import { useIntl, useModel } from 'umi';
import { MutableRefObject, useEffect, useState } from 'react';
import { REAL_ESTATE_TYPE_OPTION } from '../constant';
import { formatDate } from '@/utils/dateUtils';
import useAdministrative from '@/helpers/useAdministrative';
import { ProColumns } from '@ant-design/pro-table';
import moment from 'moment';
import _ from 'lodash';
import { CHECK_REAL_ESTATE_PRICE } from '@/pages/expression';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import { TagRender } from '../../real_estate/components/TagRender';
import formaterRealEstatePrice from '@/helpers/formaterRealEstatePrice';

interface TableNewRealEstateReportProps {
  formRef: MutableRefObject<ProFormInstance<Record<string, any>> | undefined>;
  tableRef: React.MutableRefObject<TableRef | undefined>;
  chartRef: any;
}

export default function TableNewRealEstateReport({
  formRef,
  tableRef,
  chartRef,
}: TableNewRealEstateReportProps) {
  const intl = useIntl();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const { valueEnumChart, setValueEnumChart, isSubmit, setIsSubmit, enumValue } =
    useModel('realEstateReport');

  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const currentUser = initialState?.currentUser;
  const [realEstateType, setRealEstateType] = useState<number>(1);
  const { getSetting, settingSystem } = useModel('setting');
  const { handleRealEstateStatus } = useModel('realEstateSell');

  useEffect(() => {
    getSetting(workspace_id);
    setIsSubmit(false);
    return () => {
      setIsSubmit(false);
    };
  }, []);

  const _func = {
    onChangeEnumChart: (key: string, disabled: boolean) => {
      setValueEnumChart((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          disabled: disabled,
        },
      }));
    },
    handleRightFilter: (filterList: any[]) => {
      const currentCategory = formRef.current?.getFieldValue('category_id');
      if (_.isArray(filterList) && filterList.length > 0) {
        const valueEnumChartNew = filterList.reduce((acc, item) => {
          if (item?.key) {
            if (currentCategory === item.key && item.value) {
              formRef.current?.setFieldsValue({ category_id: 'category' });
            }
            return {
              ...acc,
              [item.key]: {
                ...valueEnumChart[item.key],
                disabled: item.value,
              },
            };
          }
          return acc;
        }, {});

        setValueEnumChart({ ...valueEnumChart, ...valueEnumChartNew });
      }
    },
  };

  const filterAdministrative = useAdministrative(tableRef, {
    province: {
      mode: 'multiple',
      onChange: (value) => {},
      max: settingSystem?.amount_select || 10,
    },
    district: {
      mode: 'multiple',
      max: settingSystem?.amount_select || 10,
      onChange: (value) => {},
    },
    ward: {
      mode: 'multiple',
      max: settingSystem?.amount_select || 10,
      onChange: (value) => {},
    },
  });
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
      title: intl.formatMessage({ id: 'pages.new_real_estate.address' }),
      dataIndex: 'address',
      hideInSearch: true,
      width: 200,
      render: (dom) => {
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
    ...filterAdministrative,
    {
      title: intl.formatMessage({ id: 'pages.new_real_estate.category' }),
      dataIndex: 'category_title',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id:
          realEstateType === 1
            ? 'pages.new_real_estate.price_billion'
            : 'pages.new_real_estate.price_million',
      }),
      dataIndex: 'price',
      render: (dom) => {
        return dom && formaterRealEstatePrice(`${dom}`);
      },
      align: 'right',
      sorter: true,
      hideInSearch: true,
    },
  ];

  const columnsFilters: ProColumns[] | any = [
    {
      title: intl.formatMessage({ id: 'pages.new_real_estate.type' }),
      dataIndex: 'real_estate_type',
      order: 10,
      hideInTable: true,
      valueType: 'select',
      formItemProps: {
        rules: [{ required: true, message: intl.formatMessage({ id: 'form.enter_info' }) }],
      },
      fieldProps: {
        allowClear: false,
        placeholder: intl.formatMessage({ id: 'global.all' }),
        options: REAL_ESTATE_TYPE_OPTION,
        onChange: (value: number) => {
          tableRef.current?.setFieldsValue({
            real_estate_status: undefined,
          });
          if (value) {
            setRealEstateType(value);
          }
        },
      },
      initialValue: 1,
    },
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
        disabledDate: (current: any) => {
          let customDate = moment().format('YYYY-MM-DD');
          const schedule_date = tableRef.current?.getFieldValue('date_range');
          if (!schedule_date || schedule_date.length === 0) {
            return false;
          }

          const limit_time = settingSystem?.limit_time || 90;
          const tooLate = schedule_date[0] && current.diff(schedule_date[0], 'day') > limit_time;
          const tooEarly = schedule_date[1] && schedule_date[1].diff(current, 'day') > limit_time;

          return (
            (current && current > moment(customDate, 'YYYY-MM-DD').add(1, 'days')) ||
            tooEarly ||
            tooLate
          );
        },
        onCalendarChange: (value: any) => {
          tableRef.current?.setFieldsValue({
            date_range: value,
          });
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
      title: intl.formatMessage({
        id:
          realEstateType === 1
            ? 'pages.new_real_estate.range_price_billion'
            : 'pages.new_real_estate.range_price_million',
      }),
      order: 8,
      hideInTable: true,
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
    {
      title: intl.formatMessage({ id: 'pages.new_real_estate.status' }),
      dataIndex: 'real_estate_status',
      hideInTable: true,
      valueType: 'select',
      dependencies: ['real_estate_type'],
      request: async ({ real_estate_type }: { real_estate_type: number }) => {
        const response = await handleRealEstateStatus(real_estate_type);
        return response || [];
      },
      fieldProps: {
        tagRender: (props: any) => {
          return TagRender(props);
        },
        mode: 'multiple',
        maxTagCount: 'responsive',
        showArrow: true,
        showSearch: true,
        placeholder: intl.formatMessage({ id: 'global.all' }),
        optionItemRender: (dom: { color: string; label: string }) => {
          return <Tag color={dom.color}>{dom.label}</Tag>;
        },
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
        className: 'table-report',
        columns: [...columns, ...columnsFilters],
        request: async (params, sorter: any) => {
          const {
            real_estate_type,
            real_estate_status,
            district_title,
            province_city_title,
            ward_title,
            price_from,
            price_to,
            pageSize,
            current,
            date_range,
          } = params;

          if (isSubmit) {
            const offset = pageSize * current - pageSize;
            let start_day;
            let end_day;

            if (date_range) {
              start_day = moment(date_range[0], 'DD-MM-YYYY')?.format('YYYY-MM-DD');
              end_day = moment(date_range[1], 'DD-MM-YYYY')?.format('YYYY-MM-DD');
            }

            _func.handleRightFilter([
              { key: 'province', value: !province_city_title || _.isEmpty(province_city_title) },
              { key: 'district', value: !district_title || _.isEmpty(district_title) },
              { key: 'ward', value: !ward_title || _.isEmpty(ward_title) },
            ]);
            const response: any = await realEstateService.getListRealEstateReport({
              province_city_ids: province_city_title,
              district_ids: district_title,
              ward_ids: ward_title,
              price_from: price_from,
              price_to: price_to,
              type: real_estate_type,
              end_day: end_day,
              start_day: start_day,
              offset: offset,
              limit: pageSize,
              sorter: sorter,
              branch_id: currentUser?.currentWorkSpace?.id,
              real_estate_status_ids: real_estate_status,
            });

            if (response) {
              formRef.current?.setFieldsValue({
                data_filter: JSON.stringify({
                  province_city_ids: province_city_title,
                  real_estate_status_ids: real_estate_status,
                  district_ids: district_title,
                  ward_ids: ward_title,
                  price_from: price_from,
                  price_to: price_to,
                  type: real_estate_type,
                  end_day: end_day,
                  start_day: start_day,
                }),
              });
              formRef.current?.submit();

              const { data, count, keyResponse } = response;
              if (keyResponse) {
                handleResponseFromCallApi({ response: keyResponse });
                return {};
              }

              return { data: data || [], success: true, total: count };
            }
          }
          return { data: [], success: true, total: 0 };
        },
        toolBarRender: false,
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
                  // if (!isOverSelect) {
                  setIsSubmit(true);
                  tableRef?.current?.submitFormSearch();
                  // }
                }}
              >
                {intl.formatMessage({ id: 'global.search' })}
              </Button>,
              <Button
                key="reset"
                shape="circle"
                onClick={() => {
                  tableRef.current?.resetFieldsValue();
                  setValueEnumChart(enumValue);
                  tableRef?.current?.submitFormSearch();
                  formRef.current?.setFieldsValue({ category_id: 'category' });
                  chartRef?.current?.resetSwitch('pie');
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
