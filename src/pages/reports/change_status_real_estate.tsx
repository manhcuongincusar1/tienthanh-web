import MpireChart, { BaseChartProps } from '@/components/Chart/BaseChart';
import ProCard from '@ant-design/pro-card';
import { ProFormInstance, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { RefAttributes, useEffect, useRef, useState } from 'react';
import Styles from './index.less';
import { TableRef } from '../types';
import { useIntl } from 'umi';
import TableChangeStatusRealEstate from './components/TableChangeStatusRealEstate';
import { realEstateService } from '@/services/realEstateService';
import itemRender from '@/helpers/breadcrumbHelper';
import { realEstateStatusService } from '@/services/realEstateStatusService';
import {useModel} from "@@/plugin-model/useModel";
type BaseChartRef = {};
function ChangeStatusRealEstate() {
  const intl = useIntl();
  const chartRef = useRef<any & BaseChartProps<any> & RefAttributes<BaseChartRef>>();
  const tableRef = useRef<TableRef>();
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const [realEstateStatusDataList, setRealEstateStatusDataList] = useState<
    API.RealEstateStatusResponse[] | undefined
  >();
  useEffect(() => {
    realEstateStatusService.getListRealEstateStatus({}).then((res) => {
      if (res?.data) {
        setRealEstateStatusDataList(res?.data);
      }
    });
  }, []);

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.change_status_real_estate.breadcrumb' }),
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
                id: 'pages.change_status_real_estate.breadcrumb',
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
            if (data_filter) {
              const dataFilterNew =
                data_filter && data_filter !== 'undefined' && JSON.parse(data_filter);
              const response = await realEstateService.getListChangeStatusRealEstateDataReport({
                ...dataFilterNew,
                branch_id: currentUser?.currentWorkSpace?.id
              });

              const newChartData = response?.map(
                (item: { value: number; month: string; title: string; id: string }) => {
                  if (item.id) {
                    const realEstateStatusOfRow: { title: string } | any =
                      realEstateStatusDataList?.find((realEstateStatusItem) => {
                        return realEstateStatusItem?.id === item?.id;
                      });

                    return {
                      ...item,
                      title: realEstateStatusOfRow?.title,
                    };
                  }
                  return {
                    ...item,
                    title: item.title,
                  };
                },
              );

              return newChartData || [];
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
      <TableChangeStatusRealEstate
        tableRef={tableRef}
        formRef={formRef}
        realEstateStatusDataList={realEstateStatusDataList}
      />
    </PageContainer>
  );
}

export default ChangeStatusRealEstate;
