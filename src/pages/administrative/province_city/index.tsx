import React, { useRef } from 'react';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { ProColumns, RequestData } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { provinceService } from '@/services/provinceService';
import { useIntl } from '@@/plugin-locale/localeExports';
import { STATUS_ENUM } from '@/constants';
import { message, Space, Typography } from 'antd';
import ProvinceForm from '@/pages/administrative/province_city/components/form';
import { ProFormSwitch } from '@ant-design/pro-form';
import Icon from '@ant-design/icons';
import { DeleteIcon, EditFormIcon } from '../../../../public/icons';
import { confirm } from '@/components/popup';
import itemRender from '@/helpers/breadcrumbHelper';
import { TableRef } from '@/pages/types';
import { useAccess, useModel } from 'umi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

const ProvinceList: React.FC = (props) => {
  const actionRef = useRef<TableRef>();
  const intl = useIntl();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const access = useAccess();
  const _func = {
    afterSubmit: () => {
      actionRef.current?.reloadTable();
    },
    handleResponseErrorFromCallApi: (keyResponse: string) => {
      if (keyResponse === 'forbidden') {
        message.error(
          intl.formatMessage({ id: 'global.forbidden' }),
          MESSAGE_DISPLAY_SECONDS.ERROR,
        );
        actionRef.current?.reloadTable();
      } else {
        handleResponseFromCallApi({ response: keyResponse });
      }
    },
  };
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({
        id: 'pages.administrative.province_code',
      }),
      dataIndex: 'code',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.administrative.province.form.title',
      }),
      dataIndex: 'display_title',
      hideInSearch: true,
      width: 500,
      render: (dom, entity) => {
        return access.provinceEdit ? (
          <ProvinceForm
            defaultData={{
              id: entity.id,
              code: entity.code,
              title: entity.display_title,
              status: entity.display_status,
            }}
            handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
            branch_id={workspace_id}
            afterSubmit={_func.afterSubmit}
            title={intl.formatMessage(
              { id: 'pages.administrative.province.edit.title' },
              {
                name: entity.display_title,
              },
            )}
            linkAnchor={
              <Typography.Text ellipsis={{ tooltip: entity.display_title }} style={{ width: 500 }}>
                <Typography.Link>{entity.display_title}</Typography.Link>
              </Typography.Text>
            }
          />
        ) : (
          <Typography.Text ellipsis={{ tooltip: entity.display_title }} style={{ width: 500 }}>
            {entity?.display_title}
          </Typography.Text>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'global.status',
      }),
      dataIndex: 'display_status',
      hideInSearch: true,
      render: (dom, entity: any) => {
        return (
          <ProFormSwitch
            disabled={!access?.provinceEdit}
            fieldProps={{
              checked: !!dom,
              onChange: async (value: boolean) => {
                const response = await provinceService.activeDeActiveProvince(entity.id, {
                  status: value,
                  branch_id: workspace_id,
                });
                if (response?.keyResponse) {
                  _func.handleResponseErrorFromCallApi(response?.keyResponse);
                  return;
                }
                const { status }: any = response;
                if (status == 200) {
                  message.success(
                    intl.formatMessage({ id: 'global.success' }),
                    MESSAGE_DISPLAY_SECONDS.SUCCESS,
                  );
                  actionRef.current?.reloadTable();
                }
              },
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'form.card.operation' }),
      dataIndex: 'action',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <React.Fragment>
            <Space>
              {access.provinceEdit && (
                <ProvinceForm
                  defaultData={{
                    id: entity.id,
                    code: entity.code,
                    title: entity.display_title,
                    status: entity.display_status,
                  }}
                  branch_id={workspace_id}
                  afterSubmit={_func.afterSubmit}
                  handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
                  title={intl.formatMessage(
                    { id: 'pages.administrative.province.edit.title' },
                    {
                      name: entity.display_title,
                    },
                  )}
                  linkAnchor={
                    <a>
                      <Icon component={EditFormIcon} style={{ fontSize: '16px' }} />
                    </a>
                  }
                />
              )}
              {!(entity?.districts?.length > 0) && access.provinceDelete ? (
                <a
                  key={'delete'}
                  onClick={() => {
                    confirm(
                      `Bạn muốn xoá Tỉnh/Thành ${entity.display_title}?`,
                      '',
                      async () => {
                        const response = await provinceService.deleteProvince(
                          entity.id,
                          workspace_id,
                        );
                        if (response?.keyResponse) {
                          _func.handleResponseErrorFromCallApi(response?.keyResponse);
                          return;
                        }
                        if (response.status === 200) {
                          message.success({
                            content: `Xoá thành công`,
                            key: 'delete_success',
                            duration: MESSAGE_DISPLAY_SECONDS.SUCCESS,
                          });
                          actionRef.current?.reloadTable();
                        } else {
                          message.error({
                            content: `Xoá thất bại`,
                            duration: MESSAGE_DISPLAY_SECONDS.ERROR,
                            key: 'delete_error',
                          });
                        }
                      },
                      () => {},
                      {
                        okText: 'Xoá',
                      },
                    );
                  }}
                >
                  <Icon component={DeleteIcon} style={{ fontSize: '16px' }} />
                </a>
              ) : (
                <></>
              )}
            </Space>
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.administrative.province.title' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.administrative.province.title' }),
            },
          ],
        },
        extra: [],
      }}
    >
      <CustomProTableLayout
        ref={actionRef}
        dataTable={{
          optionToolbar: {
            search: true,
          },
          tooltip: intl.formatMessage({ id: 'pages.administrative.province.tooltip_search' }),
        }}
        table={{
          search: false,
          columns: columns,
          request: async (params: any): Promise<Partial<RequestData<any>>> => {
            const { current, pageSize, keyword } = params;
            const offset = pageSize * current - pageSize;
            const response = await provinceService.getListProvinceManagement({
              offset,
              limit: pageSize,
              search: keyword,
              status: [STATUS_ENUM.ACTIVE, STATUS_ENUM.PENDING],
              districts: true,
              orderBy: 'code',
              branch_id: workspace_id,
            });
            const { data: provinceList, total, keyResponse } = response;
            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }
            return {
              data: provinceList,
              success: true,
              total: total,
            };
          },
          toolBarRender: () => {
            return [
              access?.provinceCreate && (
                <ProvinceForm
                  title={intl.formatMessage({ id: 'pages.administrative.province.form.create' })}
                  afterSubmit={_func.afterSubmit}
                  handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
                  branch_id={workspace_id}
                />
              ),
            ];
          },

          rowKey: 'id',
          dateFormatter: 'string',
        }}
      />
    </PageContainer>
  );
};

export default ProvinceList;
