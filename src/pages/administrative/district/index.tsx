import React, { useRef, useState } from 'react';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { ProColumns, RequestData } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { districtService } from '@/services/districtService';
import { useIntl } from '@@/plugin-locale/localeExports';
import { STATUS_ENUM } from '@/constants';
import { message, Space, Typography } from 'antd';
import DistrictForm from '@/pages/administrative/district/components/form';
import { ProFormSwitch } from '@ant-design/pro-form';
import Icon from '@ant-design/icons';
import { DeleteIcon, EditFormIcon } from '../../../../public/icons';
import { provinceService } from '@/services/provinceService';
import { confirm } from '@/components/popup';
import _ from 'lodash';
import itemRender from '@/helpers/breadcrumbHelper';
import { TableRef } from '@/pages/types';
import { useAccess, useModel } from 'umi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

const { Link } = Typography;

const DistrictList: React.FC = (props) => {
  const actionRef = useRef<TableRef>();
  const access = useAccess();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const [editableKeys, setEditableRowKeys] = useState([]);
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
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
        id: 'pages.administrative.district_code',
      }),
      dataIndex: 'code',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({
        id: 'pages.administrative.district.form.title',
      }),
      dataIndex: 'display_title',
      hideInSearch: true,
      width: 300,
      render: (dom, entity, index, action) => {
        return access.districtEdit ? (
          <DistrictForm
            handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
            branch_id={workspace_id}
            key={entity.id}
            defaultData={
              {
                id: entity.id,
                code: entity.code,
                title: entity.display_title,
                status: entity.display_status,
                province_city_id: entity?.province_city.id,
              } as API.DistrictData
            }
            afterSubmit={_func.afterSubmit}
            title={intl.formatMessage(
              { id: 'pages.administrative.district.edit.title' },
              {
                name: entity.display_title,
              },
            )}
            linkAnchor={
              <Typography.Text ellipsis={{ tooltip: dom }} style={{ width: 300 }}>
                <Link className="table-ellipsis-link">{dom}</Link>
              </Typography.Text>
            }
          />
        ) : (
          <Typography.Text ellipsis={{ tooltip: dom }} style={{ width: 300 }}>
            {dom}
          </Typography.Text>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.administrative.province.form.title',
      }),
      dataIndex: ['province_city', 'display_title'],
      valueType: 'select',
      width: 300,
      render: (dom) => {
        return (
          <Typography.Text ellipsis={{ tooltip: dom }} style={{ width: 300 }}>
            {dom}
          </Typography.Text>
        );
      },
      fieldProps: {
        showSearch: true,
        showArrow: true,
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: any) => {
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
            disabled={!access?.districtEdit}
            fieldProps={{
              checked: !!dom,
              onChange: async (value: boolean) => {
                const response = await districtService.activeDeActiveDistrict(entity.id, {
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
              {entity.id && access?.districtEdit && (
                <DistrictForm
                  key={entity.id}
                  defaultData={
                    {
                      id: entity.id,
                      code: entity.code,
                      title: entity.display_title,
                      status: entity.display_status,
                      province_city_id: entity?.province_city.id,
                    } as API.DistrictData
                  }
                  afterSubmit={_func.afterSubmit}
                  branch_id={workspace_id}
                  handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
                  title={intl.formatMessage(
                    { id: 'pages.administrative.district.edit.title' },
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
              {!(entity.wards.length > 0) && access.districtDelete && (
                <a
                  key={'delete'}
                  onClick={() => {
                    confirm(
                      `Bạn muốn xoá Quận/Huyện ${entity.display_title} ?`,
                      '',
                      async () => {
                        const response = await districtService.deleteDistrict(
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
        title: intl.formatMessage({ id: 'pages.administrative.district.title' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.administrative.district.title' }),
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
          tooltip: intl.formatMessage({ id: 'pages.administrative.district.tooltip_search' }),
        }}
        table={{
          columns: columns,
          request: async (params: any): Promise<Partial<RequestData<any>>> => {
            let dataFilter: any = {};
            const { current, pageSize, keyword, province_city } = params;
            if (!_.isUndefined(province_city)) {
              const { display_title } = province_city;
              dataFilter.province_id = display_title;
            }
            const offset = pageSize * current - pageSize;

            const response = await districtService.getListDistrictManagement({
              offset,
              limit: pageSize,
              search: keyword,
              status: [STATUS_ENUM.ACTIVE, STATUS_ENUM.PENDING],
              wards: true,
              orderBy: 'code',
              branch_id: workspace_id,
              ...dataFilter,
            });

            const { data: districtList, total, keyResponse } = response;
            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }
            return {
              data: districtList,
              success: true,
              total: total,
            };
          },
          toolBarRender: () => {
            return [
              access.districtCreate && (
                <DistrictForm
                  title={intl.formatMessage({ id: 'pages.administrative.district.form.create' })}
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

export default DistrictList;
