import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Checkbox, Col, Form, Row, Tag, Tooltip } from 'antd';

import Styles from './sell-details-style.less';

export type Deal = {
  dealID: string;
  created_at: string;
  address: string;
  demand: string;
  status: number;
  saler: string;
  phone_number: string;
  goodwill: boolean;
};

// demo data
const tableListDataSource: Deal[] = [];

const created_at = ['26/06/2022', '05/12/2021', '07/12/2021', '11/12/2021'];
const demand = ['Bán', 'Cho thuê', 'Bán', 'Bán'];
const status = [0, 1, 2, 3];
const goodwill = [true, false, true, true];

for (let i = 0; i < 4; i += 1) {
  tableListDataSource.push({
    dealID: `${102047 + i}`,
    created_at: created_at[i],
    address: '535/23, Cao Thắng, Phường 5, Quận 3, TP. Hồ Chí Minh',
    demand: demand[i],
    status: status[i],
    saler: 'Nguyễn Văn A',
    phone_number: '0923567474',
    goodwill: goodwill[i],
  });
}
// end demo data
const statusMap = {
  0: {
    color: 'processing',
    text: 'Đang bán',
  },
  1: {
    color: 'success',
    text: 'Đã bán',
  },
  2: {
    color: 'warning',
    text: 'Cho thuê',
  },
  3: {
    color: 'error',
    text: 'Đã cho thuê',
  },
};

const onPaginationChange = (page: number, pageSize: number) => {
  console.log(page, pageSize);
};
function CustomerSellDetails() {
  const columns: ProColumns<Deal>[] = [
    {
      dataIndex: 'created_at',
      title: 'Ngày tạo',
      width: 125,
    },
    {
      dataIndex: 'address',
      title: 'Địa chỉ',
      render: (dom, record) => {
        const title = record.address.slice(0, 25) + '...';
        return (
          <a href="#" title={record.address}>
            <Tooltip title={record.address.toString()}>{title}</Tooltip>
          </a>
        );
      },
    },
    {
      dataIndex: 'demand',
      title: 'Nhu cầu',
      render: (dom) => {
        return <Tag color="default">{dom}</Tag>;
      },
    },
    {
      dataIndex: 'status',
      title: 'Tình trạng',
      render: (dom, record) => {
        return (
          <>
            <Tag color={statusMap[record.status].color}>{statusMap[record.status].text}</Tag>
          </>
        );
      },
    },
    {
      dataIndex: 'saler',
      title: 'Sale',
    },
    {
      dataIndex: 'phone_number',
      title: 'Sđt Sale',
    },
    {
      dataIndex: 'goodwill',
      title: 'Thiện chí',
      render(dom, entity) {
        return <Checkbox defaultChecked={entity.goodwill} disabled />;
      },
    },
  ];
  return (
    <PageContainer>
      <ProCard headerBordered direction="column" title="Thông tin KH">
        <ProForm
          submitter={{
            searchConfig: {
              submitText: 'Lưu',
              resetText: 'Huỷ',
            },

            render: (props, dom) => {
              return <div className="form-footer">{dom}</div>;
            },
          }}
        >
          <Row gutter={24}>
            <Col span={24} xl={{ span: 12 }}>
              <ProFormText
                name="name"
                label="Tên KH"
                fieldProps={{
                  value: 'Nguyễn Trần Anh Khoa',
                }}
                required
                disabled={true}
              />
            </Col>
            <Col span={24} xl={{ span: 12 }}>
              <div className={Styles.formItem}>
                <ProFormText
                  name="phone-number"
                  label="Số điện thoại"
                  fieldProps={{
                    value: '0986130615',
                  }}
                  required
                  disabled={true}
                />
              </div>
              <div className={Styles.addMore}>
                <Form.List name="phone-number-list">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name }) => (
                        <div key={key} className={Styles.dynamicFormItem}>
                          <div className={Styles.dynamicFormItemInput}>
                            <ProFormText name="phone-number-item" />
                          </div>
                          <Button className={Styles.btnRemove} onClick={() => remove(name)}>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M6.66536 1.99984C6.48855 1.99984 6.31898 2.07007 6.19396 2.1951C6.06894 2.32012 5.9987 2.48969 5.9987 2.6665V3.33317H9.9987V2.6665C9.9987 2.48969 9.92846 2.32012 9.80344 2.1951C9.67841 2.07007 9.50884 1.99984 9.33203 1.99984H6.66536ZM11.332 3.33317V2.6665C11.332 2.13607 11.1213 1.62736 10.7462 1.25229C10.3712 0.877218 9.86246 0.666504 9.33203 0.666504H6.66536C6.13493 0.666504 5.62622 0.877218 5.25115 1.25229C4.87608 1.62736 4.66536 2.13607 4.66536 2.6665V3.33317H1.9987C1.63051 3.33317 1.33203 3.63165 1.33203 3.99984C1.33203 4.36803 1.63051 4.6665 1.9987 4.6665H2.66536V13.3332C2.66536 13.8636 2.87608 14.3723 3.25115 14.7474C3.62622 15.1225 4.13493 15.3332 4.66536 15.3332H11.332C11.8625 15.3332 12.3712 15.1225 12.7462 14.7474C13.1213 14.3723 13.332 13.8636 13.332 13.3332V4.6665H13.9987C14.3669 4.6665 14.6654 4.36803 14.6654 3.99984C14.6654 3.63165 14.3669 3.33317 13.9987 3.33317H11.332ZM3.9987 4.6665V13.3332C3.9987 13.51 4.06894 13.6795 4.19396 13.8046C4.31898 13.9296 4.48855 13.9998 4.66536 13.9998H11.332C11.5088 13.9998 11.6784 13.9296 11.8034 13.8046C11.9285 13.6795 11.9987 13.51 11.9987 13.3332V4.6665H3.9987ZM6.66536 6.6665C7.03355 6.6665 7.33203 6.96498 7.33203 7.33317V11.3332C7.33203 11.7014 7.03355 11.9998 6.66536 11.9998C6.29717 11.9998 5.9987 11.7014 5.9987 11.3332V7.33317C5.9987 6.96498 6.29717 6.6665 6.66536 6.6665ZM8.66536 7.33317C8.66536 6.96498 8.96384 6.6665 9.33203 6.6665C9.70022 6.6665 9.9987 6.96498 9.9987 7.33317V11.3332C9.9987 11.7014 9.70022 11.9998 9.33203 11.9998C8.96384 11.9998 8.66536 11.7014 8.66536 11.3332V7.33317Z"
                              />
                            </svg>
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        shape="circle"
                        onClick={() => add()}
                        className={Styles.btnAddMore}
                        icon={
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M8.0013 2.6665C8.36949 2.6665 8.66797 2.96498 8.66797 3.33317V7.33317H12.668C13.0362 7.33317 13.3346 7.63165 13.3346 7.99984C13.3346 8.36803 13.0362 8.6665 12.668 8.6665H8.66797V12.6665C8.66797 13.0347 8.36949 13.3332 8.0013 13.3332C7.63311 13.3332 7.33464 13.0347 7.33464 12.6665V8.6665H3.33464C2.96645 8.6665 2.66797 8.36803 2.66797 7.99984C2.66797 7.63165 2.96645 7.33317 3.33464 7.33317H7.33464V3.33317C7.33464 2.96498 7.63311 2.6665 8.0013 2.6665Z"
                            />
                          </svg>
                        }
                      />
                    </>
                  )}
                </Form.List>
              </div>
            </Col>
          </Row>
          <span className="section-space-top" />
          <h3 className="section-title">Lịch sử giao dịch</h3>
          <ProTable
            columns={columns}
            rowKey="dealID"
            pagination={{
              total: 20,
              size: 'default',
              pageSize: 10,
              showTotal: undefined,
              showSizeChanger: true,
              onChange: (page, pageSize) => onPaginationChange(page, pageSize),
            }}
            toolBarRender={false}
            search={false}
            request={(params, sorter, filter) => {
              console.log(params, sorter, filter);
              return Promise.resolve({
                data: tableListDataSource,
                success: true,
              });
            }}
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
}

export default CustomerSellDetails;
