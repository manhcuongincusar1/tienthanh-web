import ProCard from '@ant-design/pro-card';
import ProForm, { ProFormDigit, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Checkbox, Col, Form, Row, Space } from 'antd';
import Styles from './sell-details-style.less';

export type Deal = {
  id: string;
  created_at: string;
  target: string;
  price: number[];
  province: string;
  district: string;
  note: string;
};

// demo data
const tableListDataSource: Deal[] = [];

const created_at = ['12/06/2022', '05/12/2021', '07/12/2021', '11/12/2021'];

const target = ['Để ở', 'Vừa ở vừa kinh doanh', 'Kinh doanh', 'Để ở'];

for (let i = 0; i < 4; i += 1) {
  tableListDataSource.push({
    id: `${102047 + i}`,
    created_at: created_at[i],
    target: target[i],
    price: [10 + i, 20 + i],
    province: 'Hồ Chí Minh',
    district: 'Quận 11',
    note: '-',
  });
}
// end demo data

function CustomerBuyDetails() {
  const columns: ProColumns<Deal>[] = [
    {
      dataIndex: 'created_at',
      title: 'Ngày tạo',
      valueType: 'date',
    },
    {
      dataIndex: 'target',
      title: 'Mục đích',
    },
    {
      dataIndex: 'price',
      title: 'Giá mua (tỷ VND)',
      width: 303,
      renderFormItem: (dom, config) => {
        return (
          <Space size={12} className="custom-form-range">
            <ProFormDigit
              placeholder="Từ"
              label="Từ"
              fieldProps={{
                value: config?.record?.price[0],
              }}
            />
            <ProFormDigit
              placeholder="Đến"
              label="Đến"
              fieldProps={{
                value: config?.record?.price[1],
              }}
            />
          </Space>
        );
      },
      render: (dom, record) => {
        return (
          <Space size={24} className="table-price-range">
            <div className="item">
              <span className="item__label">Từ</span> {record.price[0]}
            </div>
            <div className="item">
              <span className="item__label">Đến</span> {record.price[1]}
            </div>
          </Space>
        );
      },
    },
    {
      dataIndex: 'province',
      title: 'Thành phố',
    },
    {
      dataIndex: 'district',
      title: 'Quận',
    },

    {
      dataIndex: 'note',
      title: 'Ghi chú',
    },
    {
      title: 'Action',
      key: 'option',
      valueType: 'option',
      render: (text, record, _, action) => {
        return [
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
            className="table-action-link"
          >
            Chỉnh sửa
          </a>,
          <a href="#" key="delete" className="table-action-link">
            Xoá
          </a>,
        ];
      },
    },
  ];
  return (
    <PageContainer>
      <ProCard headerBordered direction="column" title="Thông tin">
        <ProForm
          submitter={{
            searchConfig: {
              submitText: 'Lưu',
              resetText: 'Huỷ',
            },
            submitButtonProps: {
              shape: 'circle',
            },
            resetButtonProps: {
              shape: 'circle',
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
                required
                fieldProps={{
                  value: 'Nguyễn Trần Anh Khoa',
                }}
              />

              <ProForm.Item className="form-checkbox-end">
                <Checkbox name="thien_chi">Thiện chí</Checkbox>
              </ProForm.Item>
              <div className={`${Styles.formItem} ${Styles.formItemFull}`}>
                <ProFormText
                  name="phone-number"
                  label="Số điện thoại"
                  required
                  fieldProps={{
                    value: '0986130615',
                  }}
                />
              </div>
              <div className={`${Styles.addMore} ${Styles.addMoreFull}`}>
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
            <Col span={24} xl={{ span: 12 }}>
              <ProFormText
                placeholder="Người tạo..."
                disabled={true}
                fieldProps={{ value: 'Nguyễn Văn A' }}
                label="Tên người tạo"
                name="created_by"
              />
              <ProFormText
                disabled={true}
                placeholder="Số điện thoại..."
                label="Sđt người tạo"
                name="created_phone"
                fieldProps={{ value: '098984536' }}
              />
            </Col>
          </Row>
          <span className="section-space-top" />
          <h3 className="section-title">Nhu cầu và Tài chính của KH</h3>
          <Space size={24} direction="vertical" style={{ display: 'flex' }}>
            <ProCard
              title="Cần mua"
              ghost
              collapsible
              collapsibleIconRender={({ collapsed }) => {
                if (collapsed) {
                  return (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z"
                        fill="black"
                      />
                    </svg>
                  );
                }
                return (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill="black"
                    />
                  </svg>
                );
              }}
            >
              <div className="collapsible-block">
                <ProTable
                  columns={columns}
                  rowKey="id"
                  editable={{
                    type: 'multiple',
                    saveText: <span className="table-action-link">Lưu</span>,
                    deleteText: <span className="table-action-link">Xoá</span>,
                    cancelText: <span className="table-action-link">Huỷ</span>,
                  }}
                  pagination={false}
                  toolBarRender={false}
                  search={false}
                  request={() => {
                    return Promise.resolve({
                      data: tableListDataSource,
                      success: true,
                    });
                  }}
                />
                <Button
                  type="dashed"
                  block
                  className="mt-2"
                  icon={
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.5013 2.6665C8.86949 2.6665 9.16797 2.96498 9.16797 3.33317V7.33317H13.168C13.5362 7.33317 13.8346 7.63165 13.8346 7.99984C13.8346 8.36803 13.5362 8.6665 13.168 8.6665H9.16797V12.6665C9.16797 13.0347 8.86949 13.3332 8.5013 13.3332C8.13311 13.3332 7.83464 13.0347 7.83464 12.6665V8.6665H3.83464C3.46645 8.6665 3.16797 8.36803 3.16797 7.99984C3.16797 7.63165 3.46645 7.33317 3.83464 7.33317H7.83464V3.33317C7.83464 2.96498 8.13311 2.6665 8.5013 2.6665Z"
                      />
                    </svg>
                  }
                >
                  Thêm nhu cầu
                </Button>
              </div>
            </ProCard>
            <ProCard
              title="Cần thuê"
              ghost
              collapsible
              defaultCollapsed
              collapsibleIconRender={({ collapsed }) => {
                if (collapsed) {
                  return (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z"
                        fill="black"
                      />
                    </svg>
                  );
                }
                return (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                      fill="black"
                    />
                  </svg>
                );
              }}
            >
              <div className="collapsible-block">
                <ProTable
                  columns={columns}
                  rowKey="id"
                  editable={{
                    type: 'multiple',
                    saveText: <span className="table-action-link">Lưu</span>,
                    cancelText: <span className="table-action-link">Huỷ</span>,
                    deleteText: <span className="table-action-link">Xoá</span>,
                  }}
                  pagination={false}
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
              </div>
            </ProCard>
          </Space>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
}

export default CustomerBuyDetails;
