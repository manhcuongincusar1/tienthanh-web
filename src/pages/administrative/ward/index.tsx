import React, { useRef, useState } from 'react';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { ProColumns, RequestData } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { wardService } from '@/services/wardService';
import { useIntl } from '@@/plugin-locale/localeExports';
import { STATUS_ENUM } from '@/constants';
import { message, Space, Typography } from 'antd';
import WardForm from '@/pages/administrative/ward/components/form';
import { ProFormSwitch } from '@ant-design/pro-form';
import { confirm } from '@/components/popup';
import { provinceService } from '@/services/provinceService';
import { RequestOptionsType } from '@ant-design/pro-utils';
import _ from 'lodash';
import { useAccess, useModel } from 'umi';
import { districtService } from '@/services/districtService';
import itemRender from '@/helpers/breadcrumbHelper';
import { TableRef } from '@/pages/types';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

const WardList: React.FC = () => {
  const actionRef = useRef<TableRef>();
  const [editableKeys, setEditableRowKeys] = useState([]);
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const intl = useIntl();
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
        id: 'pages.administrative.ward_code',
      }),
      dataIndex: 'code',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.administrative.ward.form.title',
      }),
      dataIndex: 'display_title',
      hideInSearch: true,
      width: 300,
      render: (dom, entity: any) => {
        return access.wardEdit ? (
          <WardForm
            defaultData={{
              id: entity.id,
              code: entity.code,
              title: entity.display_title,
              status: entity.display_status,
              province_city_id: entity?.province_city.id,
              district_id: entity?.districts.id,
            }}
            afterSubmit={_func.afterSubmit}
            handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
            branch_id={workspace_id}
            title={intl.formatMessage(
              { id: 'pages.administrative.ward.edit.title' },
              {
                name: entity.display_title,
              },
            )}
            linkAnchor={
              <Typography.Text ellipsis={{ tooltip: `${dom}` }} style={{ width: 300 }}>
                <Typography.Link>{dom}</Typography.Link>
              </Typography.Text>
            }
          />
        ) : (
          <Typography.Text ellipsis={{ tooltip: `${dom}` }} style={{ width: 300 }}>
            {dom}
          </Typography.Text>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.administrative.district.form.title',
      }),
      order: 1,
      dataIndex: ['districts', 'display_title'],
      dependencies: ['province_city', 'display_title'],
      width: 300,
      render: (dom, entity) => {
        return (
          <Typography.Text ellipsis={{ tooltip: dom }} style={{ width: 300 }}>
            {dom}
          </Typography.Text>
        );
      },
      fieldProps: {
        showSearch: true,
        showArrow: true,
        mode: 'multiple',
        maxTagCount: 'responsive',
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
      request: async ({ province_city, keyWords }) => {
        let listDistrict: RequestOptionsType[] | PromiseLike<RequestOptionsType[]> = [];
        if (!_.isUndefined(province_city)) {
          const { display_title: province_id } = province_city;
          let dataFilter = {};
          listDistrict = await districtService.getDistrictListSelect(
            {
              limit: 500,
              province_id: province_id,
              search: keyWords,
              ...dataFilter,
            },
            true,
          );
        }
        return listDistrict;
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.administrative.province.form.title',
      }),
      dataIndex: ['province_city', 'display_title'],
      valueType: 'select',
      order: 2,
      width: 300,
      render: (dom, entity) => {
        return (
          <Typography.Text ellipsis={{ tooltip: dom }} style={{ width: 300 }}>
            {dom}
          </Typography.Text>
        );
      },
      fieldProps: {
        showSearch: true,
        placeholder: intl.formatMessage({
          id: 'global.all',
        }),
        onChange: (value: any) => {
          actionRef?.current?.setFieldsValue({
            districts: undefined,
          });
          actionRef.current?.submitFormSearch();
        },
      },
      request: async ({ keyWords }) => {
        let dataFilter = {};
        const listProvince = await provinceService.getProvinceListSelect({
          limit: 500,
          search: keyWords,
          ...dataFilter,
        });
        return listProvince;
      },
    },
    {
      title: intl.formatMessage({
        id: 'global.status',
      }),
      dataIndex: 'display_status',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <ProFormSwitch
            disabled={!access?.wardEdit}
            fieldProps={{
              checked: !!dom,
              onChange: async (value: boolean) => {
                const response = await wardService.activeDeActiveWard(entity.id, {
                  status: value,
                  branch_id: workspace_id,
                });

                const { status, keyResponse }: any = response;
                if (keyResponse) {
                  _func.handleResponseErrorFromCallApi(keyResponse);
                  return;
                }
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
              {!(entity.streets.length > 0) && access.wardDelete ? (
                <a
                  key={'delete'}
                  onClick={() => {
                    confirm(
                      `Bạn muốn xoá Phường/Xã ${entity.display_title}?`,
                      '',
                      async () => {
                        const response = await wardService.deleteWard(entity.id, workspace_id);
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
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 20 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M8 2C7.73478 2 7.48043 2.10536 7.29289 2.29289C7.10536 2.48043 7 2.73478 7 3V4H13V3C13 2.73478 12.8946 2.48043 12.7071 2.29289C12.5196 2.10536 12.2652 2 12 2H8ZM15 4V3C15 2.20435 14.6839 1.44129 14.1213 0.87868C13.5587 0.31607 12.7956 0 12 0H8C7.20435 0 6.44129 0.31607 5.87868 0.87868C5.31607 1.44129 5 2.20435 5 3V4H1C0.447715 4 0 4.44772 0 5C0 5.55228 0.447715 6 1 6H2V19C2 19.7957 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H15C15.7957 22 16.5587 21.6839 17.1213 21.1213C17.6839 20.5587 18 19.7957 18 19V6H19C19.5523 6 20 5.55228 20 5C20 4.44772 19.5523 4 19 4H15ZM4 6V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H15C15.2652 20 15.5196 19.8946 15.7071 19.7071C15.8946 19.5196 16 19.2652 16 19V6H4Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              ) : (
                <Typography.Link style={{ padding: '0 8px' }}></Typography.Link>
              )}
              {access.wardEdit ? (
                <WardForm
                  defaultData={{
                    id: entity.id,
                    code: entity.code,
                    title: entity.display_title,
                    status: entity.display_status,
                    province_city_id: entity?.province_city.id,
                    district_id: entity?.districts.id,
                  }}
                  afterSubmit={_func.afterSubmit}
                  handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
                  branch_id={workspace_id}
                  title={intl.formatMessage(
                    { id: 'pages.administrative.ward.edit.title' },
                    {
                      name: entity.display_title,
                    },
                  )}
                  linkAnchor={
                    <a>
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
                    </a>
                  }
                />
              ) : undefined}
            </Space>
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.administrative.ward.title' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.administrative.ward.title' }),
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
          tooltip: intl.formatMessage({ id: 'pages.administrative.ward.tooltip_search' }),
        }}
        table={{
          columns: columns,
          request: async (params: any): Promise<Partial<RequestData<any>>> => {
            let dataFilter: any = {
              district_id: undefined,
              province_city_id: undefined,
            };
            const { current, pageSize, keyword, districts, province_city } = params;
            const offset = pageSize * current - pageSize;

            if (!_.isUndefined(districts)) {
              const { display_title } = districts;
              dataFilter.district_id = display_title;
            }
            if (!_.isUndefined(province_city)) {
              const { display_title } = province_city;
              dataFilter.province_city_id = Number(display_title);
            }
            const response = await wardService.getListWardManagement({
              offset,
              limit: pageSize,
              search: keyword,
              streets: true,
              status: [STATUS_ENUM.ACTIVE, STATUS_ENUM.PENDING],
              orderBy: 'code',
              branch_id: workspace_id,
              ...dataFilter,
            });
            const { data: wardList, total, keyResponse } = response;
            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }

            return {
              data: wardList,
              success: true,
              total: total,
            };
          },
          toolBarRender: () => {
            return [
              access.wardCreate && (
                <WardForm
                  title={intl.formatMessage({ id: 'pages.administrative.ward.form.create' })}
                  afterSubmit={_func.afterSubmit}
                  handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
                  branch_id={workspace_id}
                />
              ),
            ];
          },

          rowKey: 'id',
          dateFormatter: 'string',
          editable: {
            type: 'multiple',
            editableKeys,
            onChange: () => setEditableRowKeys,
          },
        }}
      />
    </PageContainer>
  );
};

export default WardList;
