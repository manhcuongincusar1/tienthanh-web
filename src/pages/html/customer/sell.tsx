import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { ProFormDigit, ProFormSelect } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Checkbox, Space, Tag } from 'antd';
import { useRef } from 'react';
import { history } from 'umi';

type DataSource = {
  id: string;
  full_name: string;
  created_at: string;
  phone_number: string;
  demand: string;
  goodwill: boolean;
  saler: string;
};
// demo data
const tableListDataSource: DataSource[] = [];

const created_at = ['26/06/2022', '05/12/2021', '07/12/2021', '11/12/2021'];
const demand = ['Bán', 'Cho thuê', 'Bán', 'Bán'];

const goodwill = [true, false, true, true];

for (let i = 0; i < 4; i += 1) {
  tableListDataSource.push({
    id: `${102047 + i}`,
    created_at: created_at[i],
    full_name: 'Hào Nguyễn',
    demand: demand[i],

    saler: 'Nguyễn Văn A',
    phone_number: '0923567474',
    goodwill: goodwill[i],
  });
}
// end demo data
function CustomerSell() {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const columns: ProColumns<DataSource>[] = [
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: 'Tên',
      dataIndex: 'full_name',
      hideInSearch: true,
      render: (dom, entity) => (
        <a href="#" title={entity.full_name}>
          {dom}
        </a>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      hideInSearch: true,
    },
    {
      title: 'Nhu cầu',
      dataIndex: 'demand',

      renderFormItem: () => {
        return (
          <ProFormSelect
            options={[
              {
                label: 'Tất cả',
                value: 'all',
              },
              {
                label: 'Bán',
                value: 'sell',
              },
              {
                label: 'Cho thuê',
                value: 'rent',
              },
            ]}
            placeholder=""
          />
        );
      },
      render: (dom) => {
        return <Tag color="default">{dom}</Tag>;
      },
    },
    {
      title: 'Thành phố',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormSelect
            options={[
              {
                label: 'Tất cả',
                value: 'all',
              },
              {
                label: 'Bán',
                value: 'sell',
              },
              {
                label: 'Cho thuê',
                value: 'rent',
              },
            ]}
            placeholder=""
          />
        );
      },
    },
    {
      title: 'Quận/Huyện',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <ProFormSelect
            options={[
              {
                label: 'Tất cả',
                value: 'all',
              },
              {
                label: 'Bán',
                value: 'sell',
              },
              {
                label: 'Cho thuê',
                value: 'rent',
              },
            ]}
            placeholder=""
          />
        );
      },
    },
    {
      title: 'Khoảng giá',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Space size={12} className="custom-form-range">
            <ProFormDigit placeholder="Từ" label="Từ" />
            <ProFormDigit placeholder="Đến" label="Đến" />
          </Space>
        );
      },
    },
    {
      title: 'Thiện chí',
      dataIndex: 'goodwill',
      renderFormItem: () => {
        return (
          <ProFormSelect
            options={[
              {
                label: 'Tất cả',
                value: 'all',
              },
              {
                label: 'Có thiện chí',
                value: '1',
              },
              {
                label: 'Không thiện chí',
                value: '0',
              },
            ]}
            placeholder=""
          />
        );
      },
      render(dom, entity) {
        return <Checkbox defaultChecked={entity.goodwill} disabled />;
      },
    },
    {
      title: 'Sale',
      dataIndex: 'saler',
      renderFormItem: () => {
        const options = [
          {
            label: 'Nguyễn Văn A',
            value: 'Nguyễn Văn A',
          },

          {
            label: 'Nguyễn Văn B',
            value: 'Nguyễn Văn B',
          },
          {
            label: 'Phạm Thị C',
            value: 'Phạm Thị C',
          },
          {
            label: 'Quách D',
            value: 'Quách D',
          },
        ];
        return (
          <ProFormSelect
            options={options}
            mode="multiple"
            placeholder="Tìm kiếm..."
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
    <PageContainer>
      <CustomProTableLayout
        dataTable={{
          optionToolbar: {
            setting: true,
            reload: true,
            search: true,
            layout: false,
          },
          onClickAdd: () => {
            history.push('/account/create');
          },
        }}
        table={{
          columns: [...columns],
          actionRef: actionRef,
          formRef: formRef,
          searchSpan: 8,
          request: () => {
            const total = 10;

            return Promise.resolve({
              data: tableListDataSource,
              success: true,
              total: total,
            });
          },

          rowKey: 'id',
          dateFormatter: 'string',
        }}
        actions={{
          isSearchHeader: true,
        }}
      />
    </PageContainer>
  );
}

export default CustomerSell;
