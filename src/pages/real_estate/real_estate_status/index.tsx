import React, { useRef, useState } from 'react';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { ProColumns, RequestData } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { realEstateStatusService } from '@/services/realEstateStatusService';
import { useIntl } from '@@/plugin-locale/localeExports';
import {
  REAL_ESTATE_TYPE_ENUM_SELECT,
  REAL_ESTATE_IS_EDITABLE,
  STATUS_ENUM,
  STATUS_ENUM_SELECT,
} from '@/constants';
import RealEstateStatusForm from '@/pages/real_estate/real_estate_status/components/form';
import { message, Space, Typography } from 'antd';
import _ from 'lodash';
import { confirm } from '@/components/popup';
import { ProFormInstance, ProFormSwitch } from '@ant-design/pro-form';
import itemRender from '@/helpers/breadcrumbHelper';
import { useAccess, useModel } from 'umi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

interface TableRef extends ProFormInstance {
  reloadTable: () => void;
  submitFormSearch: () => void;
}

const { Link } = Typography;
const RealEstateStatusList: React.FC = (props) => {
  const actionRef = useRef<TableRef>();
  const [editableKeys, setEditableRowKeys] = useState<(number | undefined)[]>([]);
  const access = useAccess();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const [defaultData, setDefaultData] = useState({});
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const editDataRef = React.useRef() as React.MutableRefObject<
    React.ElementRef<typeof RealEstateStatusForm>
  >;
  const intl = useIntl();
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
    },
    _bindEvent = {
      getDetail: async (id: number) => {
        const data: any = await realEstateStatusService.detail(id, workspace_id);
        const dataDefault = data as API.RealEstateStatusResponse;
        if (data?.keyResponse) {
          _func.handleResponseErrorFromCallApi(data?.keyResponse);
          return;
        }
        const { status, type } = dataDefault;
        setDefaultData({
          ...dataDefault,
          type: _.toString(type),
          status: status == STATUS_ENUM.ACTIVE ? true : false,
        });
        editDataRef.current.openModal();
      },
      deleteStatus: async (id: number): Promise<void> => {
        const data = await realEstateStatusService.delete(id, workspace_id);
        if (data?.keyResponse) {
          _func.handleResponseErrorFromCallApi(data?.keyResponse);
          return;
        }
        if (data.status == 200) {
          message.success(
            intl.formatMessage({ id: 'global.delete.success' }),
            MESSAGE_DISPLAY_SECONDS.SUCCESS,
          );
          _func.afterSubmit?.();
        }
      },
    };
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({
        id: 'pages.real_estate_status.code',
      }),
      dataIndex: 'code',
      editable: false,
      hideInSearch: true,
      render: (dom, entity, index, action) => {
        return access?.realEstateStatusEdit ? (
          <Link onClick={() => _bindEvent.getDetail(entity.id)}>{dom}</Link>
        ) : (
          dom
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.real_estate_status.title',
      }),
      dataIndex: 'title',
      editable: false,
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.real_estate_status.type',
      }),
      valueType: 'select',
      valueEnum: REAL_ESTATE_TYPE_ENUM_SELECT,
      dataIndex: 'type',
      editable: false,
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.real_estate_status.is_editable_re',
      }),
      dataIndex: 'is_editable_re',
      hideInSearch: true,
      formItemProps: {
        name: 'is_editable_re',
      },
      renderFormItem: (item, { type, defaultRender, record, ...rest }, form) => {
        return (
          <ProFormSwitch
            disabled={!access?.realEstateStatusEdit}
            fieldProps={{
              checked: record.is_editable_re,
              onChange: async (value: boolean) => {
                const response = await realEstateStatusService.isEditableRe(record.id, {
                  isEditableRe: value,
                  branch_id: workspace_id,
                });
                if (response?.keyResponse) {
                  _func.handleResponseErrorFromCallApi(response?.keyResponse);
                  return;
                }
                if (response.status === 200) {
                  message.success(
                    intl.formatMessage({ id: 'global.success' }),
                    MESSAGE_DISPLAY_SECONDS.SUCCESS,
                    () => {
                      _func.afterSubmit?.();
                    },
                  );
                } else {
                  message.success(
                    intl.formatMessage({ id: 'global.failed' }),
                    MESSAGE_DISPLAY_SECONDS.ERROR,
                  );
                }
              },
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.real_estate_status.is_default',
      }),
      dataIndex: 'is_default',
      hideInSearch: true,
      formItemProps: {
        name: 'is_default',
      },
      renderFormItem: (item, { type, defaultRender, record, ...rest }, form) => {
        return (
          <ProFormSwitch
            disabled={!access?.realEstateStatusEdit}
            fieldProps={{
              checked: record.is_default,
              onChange: async (value: boolean) => {
                if (!value) {
                  message.warning(
                    intl.formatMessage({ id: 'pages.real_estate_status.is_default.cant_off' }),
                    MESSAGE_DISPLAY_SECONDS.ERROR,
                    () => {
                      _func.afterSubmit?.();
                    },
                  );
                } else {
                  confirm(
                    intl.formatMessage({ id: 'pages.real_estate_status.is_default.confirm_on' }),
                    intl.formatMessage({
                      id: 'pages.real_estate_status.is_default.confirm_on.content',
                    }),
                    async () => {
                      const response = await realEstateStatusService.isDefault(record.id, {
                        isDefault: value,
                        branch_id: workspace_id,
                      });
                      if (response?.keyResponse) {
                        _func.handleResponseErrorFromCallApi(response?.keyResponse);
                        return;
                      }
                      if (response.status === 200) {
                        message.success(
                          intl.formatMessage({ id: 'global.success' }),
                          MESSAGE_DISPLAY_SECONDS.SUCCESS,
                          () => {
                            _func.afterSubmit?.();
                          },
                        );
                      } else {
                        message.error(
                          intl.formatMessage({ id: 'global.failed' }),
                          MESSAGE_DISPLAY_SECONDS.ERROR,
                        );
                      }
                    },
                    () => {
                      _func.afterSubmit?.();
                    },
                  );
                }
              },
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'global.status',
      }),
      dataIndex: 'display_status',
      hideInSearch: true,
      formItemProps: {
        name: 'display_status',
      },
      renderFormItem: (item, { type, defaultRender, record, ...rest }, form) => {
        return (
          <ProFormSwitch
            disabled={!access?.realEstateStatusEdit}
            fieldProps={{
              checked: record.display_status,
              onChange: async (value: boolean) => {
                const { is_default } = record;
                if (is_default) {
                  message.warning(
                    intl.formatMessage({ id: 'pages.real_estate_status.is_default.cant_off' }),
                    MESSAGE_DISPLAY_SECONDS.ERROR,
                    () => {
                      _func.afterSubmit?.();
                    },
                  );
                } else {
                  const response = await realEstateStatusService.activeDeactive(record.id, {
                    status: value,
                    branch_id: workspace_id,
                  });

                  if (response?.keyResponse) {
                    _func.handleResponseErrorFromCallApi(response?.keyResponse);
                    return;
                  }

                  if (response.status === 200) {
                    message.success(
                      intl.formatMessage({ id: 'pages.real_estate_status.change_success' }),
                      MESSAGE_DISPLAY_SECONDS.SUCCESS,
                      () => {
                        _func.afterSubmit?.();
                      },
                    );
                  } else {
                    message.error(
                      intl.formatMessage({ id: 'global.failed' }),
                      MESSAGE_DISPLAY_SECONDS.ERROR,
                    );
                  }
                }
              },
            }}
          />
        );
      },
    },
  ];
  const columnsFilter: ProColumns[] = [
    {
      title: intl.formatMessage({
        id: 'pages.real_estate_status.is_editable_re',
      }),
      dataIndex: 'is_editable_re',
      valueType: 'select',
      valueEnum: REAL_ESTATE_IS_EDITABLE,
      hideInTable: true,
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.real_estate_status.is_default',
      }),
      dataIndex: 'is_default',
      valueType: 'select',
      valueEnum: REAL_ESTATE_IS_EDITABLE,
      hideInTable: true,
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'global.status',
      }),
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: STATUS_ENUM_SELECT,
      hideInTable: true,
      fieldProps: {
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
      render: (dom) => {
        return (
          <ProFormSwitch
            fieldProps={{
              checked: true,
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'form.card.operation' }),
      hideInSearch: true,
      editable: false,
      render: (value: any, entity: API.RealEstateStatusResponse) => {
        const { id } = entity;
        return (
          <Space>
            {access.realEstateStatusEdit && (
              <Typography.Link onClick={() => _bindEvent.getDetail(id || 0)}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 23 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M19 2.87866C18.7026 2.87866 18.4174 2.9968 18.2071 3.20709L8.90296 12.5112L8.37437 14.6256L10.4888 14.097L19.7929 4.79288C20.0032 4.58259 20.1213 4.29737 20.1213 3.99998C20.1213 3.70259 20.0032 3.41738 19.7929 3.20709C19.5826 2.9968 19.2974 2.87866 19 2.87866ZM16.7929 1.79288C17.3783 1.20751 18.1722 0.878662 19 0.878662C19.8278 0.878662 20.6217 1.20751 21.2071 1.79288C21.7925 2.37824 22.1213 3.17216 22.1213 3.99998C22.1213 4.82781 21.7925 5.62173 21.2071 6.20709L11.7071 15.7071C11.5789 15.8352 11.4184 15.9262 11.2425 15.9701L7.24254 16.9701C6.90176 17.0553 6.54127 16.9555 6.29289 16.7071C6.04451 16.4587 5.94466 16.0982 6.02986 15.7574L7.02986 11.7574C7.07382 11.5816 7.16473 11.421 7.29289 11.2929L16.7929 1.79288ZM0.87868 3.87866C1.44129 3.31605 2.20435 2.99998 3 2.99998H10C10.5523 2.99998 11 3.4477 11 3.99998C11 4.55227 10.5523 4.99998 10 4.99998H3C2.73478 4.99998 2.48043 5.10534 2.29289 5.29288C2.10536 5.48041 2 5.73477 2 5.99998V20C2 20.2652 2.10536 20.5196 2.29289 20.7071C2.48043 20.8946 2.73478 21 3 21H17C17.2652 21 17.5196 20.8946 17.7071 20.7071C17.8946 20.5196 18 20.2652 18 20V13C18 12.4477 18.4477 12 19 12C19.5523 12 20 12.4477 20 13V20C20 20.7956 19.6839 21.5587 19.1213 22.1213C18.5587 22.6839 17.7957 23 17 23H3C2.20435 23 1.44129 22.6839 0.87868 22.1213C0.31607 21.5587 0 20.7956 0 20V5.99998C0 5.20433 0.31607 4.44127 0.87868 3.87866Z"
                    fill="currentColor"
                  />
                </svg>
              </Typography.Link>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.real_estate_status.list' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.real_estate_status.list' }),
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
          tooltip: intl.formatMessage({ id: 'pages.real_estate_status.tooltip.search' }),
        }}
        table={{
          columns: [...columns, ...columnsFilter],
          request: async (params: any): Promise<Partial<RequestData<any>>> => {
            const { current, pageSize, keyword, type, is_editable_re, is_default, status } = params;
            const offset = pageSize * current - pageSize;
            let dataFilter = {
              offset,
              limit: pageSize,
              keyword,
              type,
              isEditableRe: is_editable_re,
              isDefault: is_default,
            };
            if (status) {
              dataFilter.status = [status];
            } else {
              dataFilter.status = [STATUS_ENUM.ACTIVE, STATUS_ENUM.PENDING];
            }
            const response = await realEstateStatusService.getListRealEstateStatusManagement({
              ...dataFilter,
              branch_id: workspace_id,
            });

            const {
              data: realEstateStatusList,
              total,
              keyResponse,
            } = response as API.ListRealEstateStatusResponse;
            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }
            const realEstateStatusId = realEstateStatusList.map((item) => item.id);
            setEditableRowKeys(realEstateStatusId);
            return {
              data: realEstateStatusList,
              success: true,
              total: total,
            };
          },
          toolBarRender: () => {
            return [
              access.realEstateStatusCreate && (
                <RealEstateStatusForm
                  title={intl.formatMessage({ id: 'pages.real_estate_status.form.create' })}
                  afterSubmit={_func.afterSubmit}
                  tableRef={actionRef}
                  branch_id={workspace_id}
                  handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
                />
              ),
            ];
          },
          rowKey: 'id',
          dateFormatter: 'string',
          editable: {
            type: 'multiple',
            editableKeys: editableKeys,
            onChange: () => setEditableRowKeys,
          },
        }}
      />
      <RealEstateStatusForm
        ref={editDataRef}
        tableRef={actionRef}
        linkAnchor={<React.Fragment></React.Fragment>}
        defaultData={defaultData}
        afterSubmit={_func.afterSubmit}
        handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
        branch_id={workspace_id}
        title={intl.formatMessage(
          { id: 'pages.real_estate_status.edit.title' },
          {
            name: defaultData.title,
          },
        )}
      />
    </PageContainer>
  );
};

export default RealEstateStatusList;
