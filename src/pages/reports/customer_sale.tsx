import MpireChart, { BaseChartProps } from '@/components/Chart/BaseChart';
import ProCard from '@ant-design/pro-card';
import { ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { RefAttributes, useRef } from 'react';
import Styles from './index.less';
import { TableRef } from '../types';
import { useIntl, useModel } from 'umi';
import TableCustomerSale from './components/TableCustomerSale';
import { customerServices } from '@/services/customerServices';
import itemRender from '@/helpers/breadcrumbHelper';

type BaseChartRef = {};
function CustomerSale() {
  const intl = useIntl();
  const chartRef = useRef<any & BaseChartProps<any> & RefAttributes<BaseChartRef>>();
  const tableRef = useRef<TableRef>();
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const { isSubmit } = useModel('realEstateReport');

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.customer_sale.breadcrumb' }),
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
              breadcrumbName: intl.formatMessage({
                id: 'pages.customer_sale.breadcrumb',
              }),
            },
          ],
        },
        extra: [],
      }}
    >
      <ProCard className={`${Styles.chartContainer} mb-3`}>
        <MpireChart
          request={async (params) => {
            const { data_filter } = params;

            if (isSubmit && data_filter) {
              const response = await customerServices.getListCustomerDataReport({
                branch_id: currentUser?.currentWorkSpace?.id,
              });
              const newData = Object.values(response).map((item: any) => {
                return {
                  value: item.value && Number(item.value),
                  month: item.month,
                  title: item.title === 1 ? 'Cần mua' : 'Cần thuê',
                };
              });
              if (data_filter) {
                const dataFilterNew =
                  data_filter && data_filter !== 'undefined' && JSON.parse(data_filter);

                const response = await customerServices.getListCustomerDataReport({
                  ...dataFilterNew,
                  branch_id: currentUser?.currentWorkSpace?.id,
                });
                const newData = Object.values(response).map((item: any) => {
                  return {
                    value: item.value && Number(item.value),
                    month: item.month,
                    title: item.title === 1 ? 'Cần mua' : 'Cần thuê',
                  };
                });
                return newData || [];
              }
              return newData || [];
            }
            return [];
          }}
          ref={chartRef}
          filterRef={formRef}
          optionals={{
            showFilterSubmitter: false,
          }}
          rightFilters={[
            <>
              <ProFormText name={'data_filter'} hidden />
            </>,
          ]}
          chartSwitch={{
            line: {
              title: 'line chart',
              typeChart: 'line',
              config: {
                xField: 'month',
                yField: 'value',
                seriesField: 'title',
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
                yAxis: {
                  line: null,
                  label: {
                    style: {
                      fill: '#737D89',
                      fontFamily: 'SVN-Gilroy',
                      fontWeight: 600,
                      fontSize: 16,
                      letterSpacing: 0.5,
                    },
                  },
                },
                xAxis: {
                  // type: 'time',
                  line: {
                    style: {
                      stroke: '#C6CCD3',
                    },
                  },
                  label: {
                    style: {
                      fill: '#737D89',
                      fontFamily: 'SVN-Gilroy',
                      fontWeight: 600,
                      fontSize: 16,
                      letterSpacing: 0.5,
                    },
                  },
                },
                tooltip: {
                  domStyles: {
                    'g2-tooltip': {
                      fontFamily: 'SVN-Gilroy',
                      background: '#fff',
                      opacity: 1,
                    },
                    'g2-tooltip-title': {
                      fontSize: '14px',
                      lineHeight: '22px',
                      letterSpacing: '0.5px',
                      color: '#737D89',
                      marginBottom: '8px',
                    },
                    'g2-tooltip-name': {
                      color: '#737D89',
                      fontFamily: 'SVN-Gilroy',
                      fontSize: '14px',
                      lineHeight: '22px',
                    },
                    'g2-tooltip-list-item': {
                      marginTop: '8px',
                      marginBottom: '7px',
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
              },
            },
          }}
        />
      </ProCard>
      <TableCustomerSale tableRef={tableRef} formRef={formRef} />
    </PageContainer>
  );
}

export default CustomerSale;
