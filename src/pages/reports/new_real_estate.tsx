import MpireChart, { BaseChartProps } from '@/components/Chart/BaseChart';
import { ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl, useModel } from 'umi';
import { useRef } from 'react';
import TableNewRealEstateReport from './components/TableNewRealEstateReport';
import { realEstateService } from '@/services/realEstateService';
import ProCard from '@ant-design/pro-card';
import { TableRef } from '../types';
import itemRender from '@/helpers/breadcrumbHelper';
import _ from 'lodash';

function NewRealEstate() {
  const intl = useIntl();
  const { valueEnumChart, isSubmit } = useModel('realEstateReport');
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const tableRef = useRef<TableRef>();
  const chartRef = useRef<React.RefAttributes<BaseChartProps> | undefined | any>();
  const formRef = useRef<ProFormInstance>();
  const switcherRef = useRef<ProFormInstance>();

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.new_real_estate.title' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.new_real_estate.title' }),
            },
          ],
        },
        extra: [],
      }}
    >
      <ProCard style={{ marginBottom: '16px' }}>
        <MpireChart
          ref={chartRef}
          request={async (params) => {
            const { category_id, data_filter } = params;
            const { type: type_chart } = switcherRef?.current?.getFieldsValue();

            if (isSubmit) {
              let type_chart_new;
              if (!type_chart) {
                type_chart_new = 'pie';
              } else {
                type_chart_new = type_chart;
              }
              const dataFilterNew =
                data_filter && data_filter !== 'undefined' && JSON.parse(data_filter);
              if (type_chart_new === 'pie') {
                let dataNew;
                if (dataFilterNew) {
                  const response = await realEstateService.getListRealEstateDataReport({
                    category_id: category_id,
                    ...dataFilterNew,
                    type_chart: type_chart_new,
                    branch_id: currentUser?.currentWorkSpace?.id,
                  });

                  if (response) {
                    const { data } = response;
                    dataNew = data.map((item) => {
                      return { ...item, scales: item?.scales && Number(item?.scales) };
                    });
                  }
                }

                return dataNew || [];
              } else if (type_chart_new === 'column') {
                let dataNew;
                const response = await realEstateService.getListRealEstateDataReport({
                  category_id: category_id,
                  ...dataFilterNew,
                  type_chart: type_chart_new,
                  branch_id: currentUser?.currentWorkSpace?.id,
                });
                if (response) {
                  const { data } = response;
                  dataNew = data.map((item) => ({ ...item, value: Number(item.value) }));
                }
                return dataNew || [];
              }
            }
            return [];
          }}
          optionals={{ showFilterSubmitter: false }}
          chartSwitch={{
            pie: {
              title: 'Pie chart',
              typeChart: 'pie',
              config: {
                height: 422,
                appendPadding: 20,
                padding: 1,
                color: [
                  '#3169B3',
                  '#018EA1',
                  '#FEE004',
                  '#F79C5B',
                  '#AF9ECB',
                  '#7FB7D6',
                  '#99CDB7',
                  '#FFECB9',
                  '#F7A99D',
                  '#E5C7D1',
                ],
                angleField: 'scales',
                colorField: 'title',
                tooltip: {
                  formatter: (datum: any) => {
                    return { name: datum.title, value: datum.scales + '%' };
                  },
                  domStyles: {
                    'g2-tooltip-name': {
                      color: '#737D89',
                      fontFamily: 'SVN-Gilroy',
                      fontSize: '14px',
                      lineHeight: '22px',
                    },
                    'g2-tooltip-list-item': {
                      marginTop: '9px',
                      marginBottom: '6px',
                    },
                    'g2-tooltip-value': {
                      fontSize: '14px',
                      lineHeight: '22px',
                      color: '#737D89',
                      fontFamily: 'SVN-Gilroy',
                      marginLeft: '20px',
                      fontWeight: 600,
                    },
                  },
                },
                label: {
                  // autoRotate: false,
                  // offset: '-30%',
                  // labelHeight: 28,
                  type: 'outer',
                  // content: '%',
                  content: ({ scales }: any) => {
                    return `${scales}%`;
                  },
                  // style: {
                  //   textAlign: 'center',
                  //   fontSize: 18,
                  //   fontFamily: 'SVN-Gilroy',
                  //   fontWeight: '600',
                  // },
                },
                interactions: [
                  {
                    type: 'element-active',
                  },
                ],
                state: {
                  active: {
                    animate: { duration: 100, easing: 'easeLinear' },
                    style: {
                      lineWidth: 2,
                      stroke: '#3169B3',
                    },
                  },
                },
              },
            },
            column: {
              title: 'Bar chart',
              typeChart: 'column',
              config: {
                color: [
                  '#3169B3',
                  '#018EA1',
                  '#FEE004',
                  '#F79C5B',
                  '#AF9ECB',
                  '#7FB7D6',
                  '#99CDB7',
                  '#FFECB9',
                  '#F7A99D',
                  '#E5C7D1',
                ],
                yField: 'value',
                xField: 'month',
                isPercent: false,
                isStack: true,
                seriesField: 'title',
              },
            },
          }}
          filterRef={formRef}
          switcherRef={switcherRef}
          rightFilters={[
            <>
              <ProFormSelect
                style={{ fontSize: '16px' }}
                key="category_id"
                name={`category_id`}
                placeholder="Danh mục BĐS"
                initialValue={'category'}
                valueEnum={{ ...valueEnumChart }}
                fieldProps={{
                  dropdownClassName: 'mpire-chart-select',
                  onChange: (value) => {
                    if (value) {
                      formRef?.current?.submit();
                    }
                  },
                }}
              />
              <ProFormText name={'data_filter'} hidden />
            </>,
          ]}
        />
      </ProCard>
      <TableNewRealEstateReport formRef={formRef} tableRef={tableRef} chartRef={chartRef} />
    </PageContainer>
  );
}

export default NewRealEstate;
