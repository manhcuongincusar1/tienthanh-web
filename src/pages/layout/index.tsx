import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { ActionType, ProColumns, RequestData } from '@ant-design/pro-table';
import { useRef, useState, useEffect } from 'react';
import { FormInstance } from '@ant-design/pro-form';
import axios from 'axios';
import { testApi } from '@/api/testExpire';
import { Button } from 'antd';

type DataSource = {
  name: string;
  price: number;
  brand: string;
  description: string;
};

export default () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();

  const columns: ProColumns<DataSource>[] = [
    {
      title: 'STT',
      dataIndex: 'id',
      fieldProps: {
        onChange: () => {
          formRef.current?.submit();
        },
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      fieldProps: {
        onChange: () => {
          formRef.current?.submit();
        },
      },
    },
    {
      title: 'UserID',
      dataIndex: 'userId',
      fieldProps: {
        onChange: () => {
          formRef.current?.submit();
        },
      },
    },
    {
      title: 'Body',
      dataIndex: 'body',
      fieldProps: {
        onChange: () => {
          formRef.current?.submit();
        },
      },
    },
    {
      title: 'Test action',
      render: () => {
        return (
          <Button
            onClick={async () => {
              const response = await testApi.getUserApi({});
              console.log(response);
            }}
          >
            Click call api
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/photos?_start=6&_limit=10',
      );
      return response.data;
    };
    fetchData();
  }, []);

  return (
    <>
      <CustomProTableLayout
        dataTable={{
          optionToolbar: {
            setting: true,
            reload: true,
            search: true,
            layout: true,
          },
        }}
        table={{
          columns: columns,
          request: async (params: any): Promise<Partial<RequestData<any>>> => {
            const { current, pageSize, userId } = params;
            const offset = pageSize * current - pageSize;
            const newUserId = Number(userId);

            const response = await axios.get(
              `https://jsonplaceholder.typicode.com/posts?_start=${offset}&_limit=${pageSize}&userId=${
                newUserId || 2
              }`,
            );
            return Promise.resolve({
              data: response.data,
              success: true,
              total: 30,
            });
          },

          rowKey: 'id',
          dateFormatter: 'string',
        }}
      />
    </>
  );
};
