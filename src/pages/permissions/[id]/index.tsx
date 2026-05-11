import itemRender from '@/helpers/breadcrumbHelper';
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl, history, useParams } from 'umi';
import ProCard from '@ant-design/pro-card';
import Styles from '../index.less';
import { message, Button, Space, Table } from 'antd';
import {
  PERMISSION_LIST,
  PERMISSION_TITLE_LIST,
  PERMISSION_TITLE_ACTION,
  PERMISSION_SUB_TITLE_LIST,
} from '../constants';
import _ from 'lodash';
import { permissionService } from '@/services/permissonService';
import { useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

interface Params {
  id: string;
}
export default function EditPermisson() {
  const intl = useIntl();
  const { id } = useParams<Params>();
  const [roleTitle, setRoleTitle] = useState<string | undefined>();
  const [resetForm, setResetForm] = useState<boolean>(false);
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const [isRealOnlyTable, setIsRealOnlyTable] = useState<boolean>(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[] | undefined>();

  const onFinish = async (selectedRowKeys: any) => {
    if (selectedRowKeys) {
      const newDataUpdate = selectedRowKeys.reduce((acc: {}, item: any) => {
        const itemNew = item ? item.split('_') : undefined;
        if (itemNew) {
          if (acc[itemNew[0]]?.length > 0) {
            return { ...acc, [itemNew[0]]: [...acc[itemNew[0]], itemNew[1]] };
          } else {
            return { ...acc, [itemNew[0]]: [itemNew[1]] };
          }
        }
        return acc;
      }, {});

      const response = await permissionService.updatePermission(
        { id, title: roleTitle || '' },
        newDataUpdate,
      );

      if (response) {
        message.success(
          intl.formatMessage({ id: 'pages.permission.update_success' }),
          MESSAGE_DISPLAY_SECONDS.SUCCESS,
          () => {
            setResetForm(!resetForm);
          },
        );
      } else {
        message.error(
          intl.formatMessage({ id: 'pages.permission.update_failed' }),
          MESSAGE_DISPLAY_SECONDS.ERROR,
        );
      }
    }
  };

  const columns: ProColumns<any, 'text'>[] = [
    {},
    Table.EXPAND_COLUMN,
    { title: intl.formatMessage({ id: 'pages.permission.feature' }), dataIndex: 'title' },
    Table.SELECTION_COLUMN,
    {},
  ];

  return (
    <PageContainer
      header={{
        title: intl.formatMessage(
          { id: 'pages.permission.role_title' },
          { title: roleTitle || '' },
        ),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.permission.title' }),
            },
          ],
        },
        extra: [],
      }}
    >
      <ProCard>
        <ProTable
          key="permission-table"
          tableAlertRender={false}
          params={{ resetForm }}
          rowSelection={{
            checkStrictly: false,
            selectedRowKeys: selectedRowKeys,
            getCheckboxProps: (record) => {
              return {
                disabled: true,
              };
            },
            onChange: (value) => {
              if (value && _.isEmpty(value)) {
                setSelectedRowKeys([]);
              }
            },
            onSelect: (row, value, record) => {
              if (row.children && !_.isEmpty(row.children)) {
                if (value) {
                  const newChildrenSelected = row.children.map((item: { key: string }) => {
                    return item.key;
                  });
                  selectedRowKeys
                    ? setSelectedRowKeys([...selectedRowKeys, ...newChildrenSelected])
                    : setSelectedRowKeys(newChildrenSelected);
                } else {
                  const newSelectedRowKeys = selectedRowKeys?.filter((item) => {
                    const newItem = item?.split('_');
                    return newItem[0] !== row.key;
                  });
                  setSelectedRowKeys(newSelectedRowKeys);
                }
              } else {
                if (value) {
                  selectedRowKeys
                    ? setSelectedRowKeys([...selectedRowKeys, row.key])
                    : setSelectedRowKeys([row.key]);
                } else {
                  const newRowSelected = selectedRowKeys?.filter((item) => item !== row.key);
                  setSelectedRowKeys(newRowSelected);
                }
              }
            },
            onSelectAll: (value, row, record) => {
              if (value) {
                const newSelectedRowKeys = record?.reduce((acc, item) => {
                  if (item.children) {
                    const newChildren: string[] = item.children?.reduce(
                      (accChid: string[], child: { key: string }) => {
                        if (child.key) {
                          return [...accChid, child.key];
                        }
                        return accChid;
                      },
                      [],
                    );
                    return [...acc, ...newChildren];
                  }
                  return acc;
                }, []);

                selectedRowKeys
                  ? setSelectedRowKeys([...selectedRowKeys, ...newSelectedRowKeys])
                  : setSelectedRowKeys(newSelectedRowKeys);
              } else {
                setSelectedRowKeys([]);
              }
            },
          }}
          // rowSelection={false}
          request={async () => {
            const response = await permissionService.getPermissionById(id);
            if (response?.keyResponse) {
              handleResponseFromCallApi({ response: response?.keyResponse });
              return {};
            }
            const permission_data = response?.permission_data;
            let selectedRowList: string[] = [];
            const title = response?.title;
            if (title) {
              setRoleTitle(title);
            }

            const newData = Object.entries(PERMISSION_LIST).map((item) => {
              if (item[1]) {
                const newChildren = item[1]?.map((child) => {
                  if (permission_data?.[item[0]]?.includes(child)) {
                    selectedRowList.push(`${item[0]}_${child}`);
                  }
                  return {
                    key: `${item[0]}_${child}`,
                    feature: child,
                    title: `${PERMISSION_TITLE_ACTION[child]} ${
                      PERMISSION_SUB_TITLE_LIST[item[0]]
                    }`,
                    status: permission_data?.[item[0]]?.includes(child),
                    parent: item[0],
                  };
                });

                return {
                  title: PERMISSION_TITLE_LIST[item[0]],
                  key: item[0],
                  children: newChildren,
                };
              }
              return item;
            });
            setSelectedRowKeys(selectedRowList);
            return {
              data: newData || [],
              success: true,
            };
          }}
          toolBarRender={false}
          search={false}
          defaultExpandAllRows={true}
          tableClassName={Styles.permissionTable}
          pagination={false}
          columns={columns}
        />
        <Space align="end" className={Styles.wrapButton}>
          {/* <Button
            className={Styles.button}
            shape="circle"
            disabled={isRealOnlyTable}
            onClick={() => {
              history.push('/permission');
            }}
          >
            Huỷ
          </Button> */}
          {/* <Button
            className={Styles.button}
            onClick={() => {
              onFinish(selectedRowKeys);
            }}
            disabled={isRealOnlyTable}
            shape="circle"
            type="primary"
          >
            Lưu
          </Button> */}
        </Space>
      </ProCard>
    </PageContainer>
  );
}
