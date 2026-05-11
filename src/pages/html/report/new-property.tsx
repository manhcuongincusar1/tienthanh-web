import MpireChart from '@/components/Chart/BaseChart';
import ProCard from '@ant-design/pro-card';
import { ProFormDateRangePicker, ProFormDigit, ProFormSelect } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Space } from 'antd';
import axios from 'axios';
import { useRef } from 'react';
import Styles from '../../../styles/page/report/styles.less';
type DataSource = {
  id: string;
  created_at: string;
  province: string;

  district: string;
  ward: string;
  category: string;
  price: string;
};
// demo data
const tableListDataSource: DataSource[] = [];

const created_at = ['26/06/2022', '05/12/2021', '07/12/2021', '11/12/2021'];
const province = ['Đồng Nai', 'Hồ Chí Minh', 'Huế', 'Đà Nẵng'];
const district = ['Biên Hoà', 'Bình Tân', 'Quận 5', 'Quận 3'];
const ward = ['An Bình', 'Bình Đa', 'Bến Nghé', 'Đa Kao'];
const category = ['Nhà phố', 'Chung cư', 'Biệt thự', 'Nhà phố'];

for (let i = 0; i < 4; i += 1) {
  tableListDataSource.push({
    id: `${102047 + i}`,
    created_at: created_at[i],
    province: province[i],

    district: district[i],
    ward: ward[i],
    category: category[i],
    price: '4',
  });
}
function NewProperty() {
  const formFilterRef = useRef();
  const chartRef = useRef();
  const columns: ProColumns<DataSource>[] = [
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: 'Thành phố',
      dataIndex: 'province',
      hideInSearch: true,
    },
    {
      title: 'Quận/Huyện',
      dataIndex: 'district',
      hideInSearch: true,
    },
    {
      title: 'Phường/Xã',
      dataIndex: 'ward',
      hideInSearch: true,
    },
    {
      title: 'Danh mục BĐS',
      dataIndex: 'category',
      hideInSearch: true,
    },
    {
      title: 'Giá (tỷ VNĐ)',
      dataIndex: 'price',
      hideInSearch: true,
    },
  ];
  const columnsFilters: ProColumns<DataSource>[] = [
    {
      title: 'Phân loại',
      hideInTable: true,
      renderFormItem: () => (
        <ProFormSelect placeholder={'Chọn'} options={[{ value: 0, label: 'Bán' }]} />
      ),
    },
    {
      title: 'Thời gian',
      hideInTable: true,
      renderFormItem: () => (
        <ProFormDateRangePicker
          name="time"
          fieldProps={{ placeholder: ['Ngày bắt đầu', 'Ngày kết thúc'] }}
        />
      ),
    },
    {
      title: 'Phân khúc giá (tỷ VND)',
      hideInTable: true,
      renderFormItem: () => (
        <Space size={12} className="custom-form-range">
          <ProFormDigit placeholder="Từ" label="Từ" />
          <ProFormDigit placeholder="Đến" label="Đến" />
        </Space>
      ),
    },
    {
      title: 'Thành phố',
      hideInTable: true,
      renderFormItem: () => (
        <ProFormSelect
          mode="multiple"
          fieldProps={{
            maxTagCount: 'responsive',
          }}
          options={[
            {
              value: 0,
              label: 'Đồng Nai',
            },
            {
              value: 1,
              label: 'Hồ Chí Minh',
            },
            {
              value: 2,
              label: 'Ninh Thuận',
            },
            {
              value: 3,
              label: 'Cần Thơ',
            },
            {
              value: 4,
              label: 'Long An',
            },
          ]}
        />
      ),
    },
    {
      title: 'Quận/Huyện',
      hideInTable: true,
      renderFormItem: () => (
        <ProFormSelect
          options={[
            {
              value: 0,
              label: 'Biên Hoà',
            },
            {
              value: 1,
              label: 'Quận 5',
            },
          ]}
        />
      ),
    },
    {
      title: 'Phường/Xã',
      hideInTable: true,
      renderFormItem: () => (
        <ProFormSelect
          options={[
            {
              value: 0,
              label: 'An Bình',
            },
            {
              value: 1,
              label: 'Bến Nghé',
            },
          ]}
        />
      ),
    },
  ];
  return (
    <PageContainer>
      <ProCard className={`${Styles.chartContainer} mb-4`}>
        <MpireChart
          request={async () => {
            const test = await axios.get(
              // 'https://gw.alipayobjects.com/os/antfincdn/jSRiL%26YNql/percent-column.json',
              'https://gw.alipayobjects.com/os/antfincdn/8elHX%26irfq/stack-column-data.json',
            );
            const { data } = test;
            return data;
          }}
          ref={chartRef}
          optionals={{
            showFilterSubmitter: false,
          }}
          filterRef={formFilterRef}
          defaultData={[
            {
              date: '06/2022',
              title: 'Nhà phố',
              value: 10,
            },
            {
              date: '07/2022',
              title: 'Chung cư',
              value: 15,
            },
            {
              date: '08/2022',
              title: 'Biệt thự',
              value: 75,
            },
          ]}
          chartSwitch={{
            pie: {
              title: 'Pie chart',
              typeChart: 'pie',
              config: {
                angleField: 'value',
                colorField: 'year',
                height: 402,
                padding: 1,
                color: ['#E69113', '#1996D4', '#44D6B3', 'green'],

                tooltip: {
                  formatter: (datum) => {
                    return { name: datum.year, value: datum.value + '%' };
                  },
                  domStyles: {
                    'g2-tooltip': {
                      background: '#fff',
                      opacity: 1,
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
                label: {
                  autoRotate: false,
                  type: 'inner',
                  offset: '-30%',
                  content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,

                  style: {
                    textAlign: 'center',
                    fontSize: 18,
                    fontFamily: 'SVN-Gilroy',
                    fontWeight: '600',
                  },
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
              title: 'Column chart',
              typeChart: 'column',
              config: {
                color: ['#E69113', '#1996D4', '#44D6B3', 'green'],
                xField: 'year',
                yField: 'value',
                isStack: true,
                seriesField: 'type',
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
                legend: false,
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
                label: {
                  position: 'middle', // 'top', 'bottom', 'middle'
                  style: {
                    fontFamily: 'SVN-Gilroy',
                    fontSize: 14,
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  },
                },
              },
            },
            bar: {
              title: 'Bar chart',
              typeChart: 'bar',
              config: {
                xField: 'value',
                yField: 'year',
                seriesField: 'type',
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
                yAxis: {
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
                xAxis: {
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
              },
            },
          }}
          rightFilters={[
            <ProFormSelect
              key="category_id"
              name={`category_id`}
              placeholder="Danh mục BĐS"
              options={[
                {
                  value: 0,
                  label: 'Khu vực - Thành phố',
                },
                {
                  value: 1,
                  label: 'Khu vực - Quận/Huyện',
                },
                {
                  value: 2,
                  label: 'Khu vực - Phường/Xã',
                },
              ]}
            />,
          ]}
        />
      </ProCard>

      <ProTable
        search={{
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
              <Button key="reset" shape="circle" type="primary">
                Xoá bộ lọc
              </Button>,
            ];
          },
          collapseRender: (collapsed: any) => (
            <>
              {collapsed ? 'Mở rộng' : 'Thu gọn'}
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
        }}
        toolBarRender={false}
        tableClassName={'table-less-toolbar'}
        columns={[...columns, ...columnsFilters]}
        rowKey={'id'}
      />
    </PageContainer>
  );
}

export default NewProperty;
