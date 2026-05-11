import React, { useRef } from 'react';
import MpireChart from '@/components/Chart/BaseChart';
import { ProFormSelect } from '@ant-design/pro-form';
import axios from 'axios';

const RealEstateSaleReport: React.FC = (props) => {
  const formFilterRef = useRef();
  const chartRef = useRef();

  return (
    <MpireChart
      request={async (params) => {
        const test = await axios.get(
          'https://gw.alipayobjects.com/os/antfincdn/jSRiL%26YNql/percent-column.json',
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
          Date: 'TP.HCM',
          scales: 27,
        },
        {
          Date: 'Ha Noi',
          scales: 20,
        },
        {
          Date: 'Da Nang',
          scales: 18,
        },
        {
          Date: 'Dong Nai',
          scales: 15,
        },
        {
          Date: 'Ca Mau',
          scales: 10,
        },
        {
          Date: 'Lang Son',
          scales: 10,
        },
      ]}
      chartSwitch={{
        pie: {
          title: 'Pie chart',
          typeChart: 'pie',
          config: {
            angleField: 'value',
            colorField: 'year',
          },
        },
        column: {
          title: 'Column chart',
          typeChart: 'column',
          config: {
            yField: 'value',
            xField: 'year',
            isPercent: true,
            isStack: true,
            seriesField: 'type',
          },
        },
        bar: {
          title: 'Bar chart',
          typeChart: 'bar',
          config: {
            xField: 'value',
            yField: 'year',
            seriesField: 'type',
          },
        },
      }}
      rightFilters={[
        <ProFormSelect
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
  );
};

export default RealEstateSaleReport;
