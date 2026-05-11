import { confirm, error, info, success, warning } from '@/components/popup';
import { AppstoreOutlined, UploadOutlined } from '@ant-design/icons';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Col, Input, message, Row, Table, TableColumnsType } from 'antd';
import React, { useRef, useState } from 'react';
import CustomProTable from '../../components/Custom/CustomProTable';
import type { FormValueType } from './components/UpdateForm';
import type { ExpandedDataType, TableListItem, TableListPagination } from './data';
import { addRule, removeRule, updateRule } from './service';
/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Mã nhân viên',
      dataIndex: 'id',
      hideInSearch: true,
      render: (dom) => {
        return <a href="/list/details">{dom}</a>;
      },
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullname',
      valueType: 'textarea',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phonenumber',
      sorter: true,

      renderText: (val: string) => `${val}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: false,

      renderText: (val: string) => `${val}`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',

      valueEnum: {
        0: {
          text: 'Default',
          status: 'Default',
        },
        1: {
          text: 'Processing',
          status: 'Processing',
        },
        2: {
          text: 'Success',
          status: 'Success',
        },
        3: {
          text: 'Error',
          status: 'Error',
        },
      },
    },
    {
      title: 'Cập nhật',
      sorter: true,
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
      hideInSearch: true,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        const status = form.getFieldValue('status');

        if (`${status}` === '0') {
          return false;
        }

        if (`${status}` === '3') {
          return <Input {...rest} placeholder="请输入异常原因！" />;
        }

        return defaultRender(item);
      },
    },
    {
      title: 'Tùy chọn',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          Tùy chỉnh
        </a>,
      ],
    },
  ];
  const expandedRowRender = (record) => {
    const columnsExpanded: TableColumnsType<ExpandedDataType> = [
      { title: 'Phòng ban', dataIndex: 'department', key: 'department' },
      { title: 'Chức vụ', dataIndex: 'position', key: 'position' },
      { title: 'Leader', dataIndex: 'leader', key: 'leader' },
      { title: 'Chi nhánh', dataIndex: 'location', key: 'location' },
      { title: 'Ngày làm việc', dataIndex: 'fromdate', key: 'fromdate' },
      { title: 'Ngày hết HĐLĐ', dataIndex: 'enddate', key: 'enddate' },
    ];

    const data = [...record.more];

    return <Table columns={columnsExpanded} dataSource={data} pagination={false} />;
  };
  const onPaginationChange = (page: number, pageSize: number) => {
    console.log(page, pageSize);
  };
  const demoData = [
    {
      id: 'ABCD1231',
      fullname: 'Lê Văn Tuấn',
      phonenumber: '0827633815',
      email: 'tuanvanle@gmail.com',
      status: 'Default',
      updatedAt: new Date('15/06/2022'),
      more: [
        {
          key: 0,
          department: 'Sales',
          position: 'Nhân viên',
          leader: 'Lê Thuỵ',
          location: 'Nguyễn Trãi',
          fromdate: '08/03/2022',
          enddate: '08/03/2023',
        },
      ],
    },
    {
      id: 'ABCD1232',
      fullname: 'Trần Duy Minh',
      phonenumber: '0986130615',
      email: 'duyminh.tran@gmail.com',
      status: 'Processing',
      updatedAt: new Date('15/06/2022'),
      more: [
        {
          key: 0,
          department: 'Sales',
          position: 'Nhân viên',
          leader: 'Lê Thuỵ',
          location: 'Nguyễn Trãi',
          fromdate: '08/03/2022',
          enddate: '08/03/2023',
        },
        {
          key: 1,
          department: 'Sales',
          position: 'Nhân viên',
          leader: 'Lê Thuỵ',
          location: 'Nguyễn Trãi',
          fromdate: '08/03/2022',
          enddate: '08/03/2023',
        },
      ],
    },
    {
      id: 'ABCD1233',
      fullname: 'Bùi Vân Anh',
      phonenumber: '0827633815',
      email: 'tuanvanle@gmail.com',
      status: 'Processing',
      updatedAt: new Date('15/06/2022'),
      more: [
        {
          key: 0,
          department: 'Sales',
          position: 'Nhân viên',
          leader: 'Lê Thuỵ',
          location: 'Nguyễn Trãi',
          fromdate: '08/03/2022',
          enddate: '08/03/2023',
        },
        {
          key: 1,
          department: 'Sales',
          position: 'Nhân viên',
          leader: 'Lê Thuỵ',
          location: 'Nguyễn Trãi',
          fromdate: '08/03/2022',
          enddate: '08/03/2023',
        },
        {
          key: 2,
          department: 'Sales',
          position: 'Nhân viên',
          leader: 'Lê Thuỵ',
          location: 'Nguyễn Trãi',
          fromdate: '08/03/2022',
          enddate: '08/03/2023',
        },
      ],
    },
  ];

  return (
    <PageContainer>
      <CustomProTable<TableListItem, TableListPagination>
        optionToolbar={{
          search: true,
          setting: true,
          reload: true,
          layout: true,
          upload: {
            onChange: () => {
              console.log('change');
            },
            templace: 'example',
          },
        }}
        headerTitle={
          <div className="table-input-search">
            <input type={'text'} placeholder="Tìm kiếm" />
          </div>
        }
        expandable={{ expandedRowRender }}
        actionRef={actionRef}
        rowKey="id"
        defaultData={demoData}
        toolbar={{
          description: <div>TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT</div>,
        }}
        toolBarRender={() => {
          return [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleModalVisible(true);
              }}
              size="small"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.99984 2.66667C8.36803 2.66667 8.6665 2.96514 8.6665 3.33333V7.33333H12.6665C13.0347 7.33333 13.3332 7.63181 13.3332 8C13.3332 8.36819 13.0347 8.66667 12.6665 8.66667H8.6665V12.6667C8.6665 13.0349 8.36803 13.3333 7.99984 13.3333C7.63165 13.3333 7.33317 13.0349 7.33317 12.6667V8.66667H3.33317C2.96498 8.66667 2.6665 8.36819 2.6665 8C2.6665 7.63181 2.96498 7.33333 3.33317 7.33333H7.33317V3.33333C7.33317 2.96514 7.63165 2.66667 7.99984 2.66667Z"
                  fill="white"
                />
              </svg>
              Tạo mới
            </Button>,
            <Button
              type="default"
              key="export"
              onClick={() => {
                handleModalVisible(true);
              }}
              size="small"
              icon={<UploadOutlined />}
            >
              Export
            </Button>,
            <Button
              type="text"
              key="grid"
              onClick={() => {
                handleModalVisible(true);
              }}
              size="large"
              icon={<AppstoreOutlined />}
            />,
          ];
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        pagination={{
          total: 100,
          size: 'default',
          pageSize: 10,
          showTotal: undefined,
          showSizeChanger: true,
          onChange: (page, pageSize) => onPaginationChange(page, pageSize),
        }}
        // request={rule}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Đã chọn{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              mục
            </div>
          }
        >
          <Button
            type="primary"
            danger
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Xóa
          </Button>
        </FooterToolbar>
      )}
      <Button
        onClick={() =>
          confirm('Đây là cho confirm', 'Input short description.', () => {
            console.log('test');
          })
        }
      >
        Confirm
      </Button>
      <Button onClick={() => info('Đây là cho info', 'Input short description.')}>Info</Button>
      <Button onClick={() => success('Đây là cho success!', 'Input short description.')}>
        Success
      </Button>
      <Button onClick={() => error('Đây là cho error!', 'Input short description.')}>Error</Button>
      <Button onClick={() => warning('Đây là cho warning!', 'Input short description.')}>
        Warning
      </Button>
      <ModalForm
        title="Thêm nhân viên"
        width="1000px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        modalProps={{
          closeIcon: (
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
                d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                fill="black"
              />
            </svg>
          ),
        }}
        submitter={{
          searchConfig: {
            resetText: 'Huỷ',
            submitText: 'Lưu',
          },
        }}
        onFinish={async (value) => {
          const success = await handleAdd(value as TableListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <Row gutter={16}>
          <Col span={12} lg={{ span: 8 }}>
            <ProFormText
              label="Mã nhân viên"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mã nhân viên*',
                },
              ]}
              placeholder="Nhập mã nhân viên"
              name="id"
            />
          </Col>
          <Col span={12} lg={{ span: 16 }}>
            <ProFormText
              label="Họ tên"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập Họ tên*',
                },
              ]}
              placeholder="Nhập họ tên"
              name="name"
            />
          </Col>
          <Col span={12} lg={{ span: 8 }}>
            <ProFormText
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              name="phonenumber"
            />
          </Col>
          <Col span={12} lg={{ span: 8 }}>
            <ProFormText label="Email" placeholder="Nhập email" name="email" />
          </Col>
          <Col span={12} lg={{ span: 8 }}>
            <ProFormSelect
              label="Giới tính"
              placeholder="Chọn giới tính"
              name="gender"
              options={[
                { label: 'Nam', value: 'male' },
                { label: 'Nữ', value: 'female' },
              ]}
            />
          </Col>
        </Row>
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
