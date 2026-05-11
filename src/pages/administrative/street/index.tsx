import React, { useRef, useEffect } from 'react';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { ProColumns, RequestData } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { streetService } from '@/services/streetService';
import { useIntl } from '@@/plugin-locale/localeExports';
import { STATUS_ENUM } from '@/constants';
import { message } from 'antd';
import { confirm } from '@/components/popup';
import ModalFormStreet from '@/pages/administrative/street/components/ModalFormStreet';
import { ProFormInstance, ProFormSwitch } from '@ant-design/pro-form';
import { Space, Typography } from 'antd';
import useAdministrative from '@/helpers/useAdministrative';
import { useModel } from 'umi';
import ButtonAddNew from '@/components/Common/ButtonAddNew';
import itemRender from '@/helpers/breadcrumbHelper';
import { useAccess } from 'umi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

const { Link } = Typography;

interface TableRef extends ProFormInstance {
  reloadTable: () => void;
  submitFormSearch: () => void;
}
interface DataForm {
  id: number;
  province_city_id: number;
  districts_id: number;
  ward_id: number;
  display_title: string;
  status: boolean;
}
interface ModalFormRef {
  onOpen: (data?: DataForm) => void;
}

const StreetList: React.FC = (props) => {
  const tableRef = useRef<TableRef>();
  const access = useAccess();
  const filter = useAdministrative(tableRef, {});
  const { getProvinceList } = useModel('administrativeDivision');
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const intl = useIntl();
  const modalRef = React.useRef() as React.MutableRefObject<ModalFormRef>;
  useEffect(() => {
    getProvinceList();
  }, []);
  const _func = {
    afterSubmit: () => {
      tableRef.current?.reloadTable();
    },
    handleResponseErrorFromCallApi: (keyResponse: string) => {
      if (keyResponse === 'forbidden') {
        message.error(
          intl.formatMessage({ id: 'global.forbidden' }),
          MESSAGE_DISPLAY_SECONDS.ERROR,
        );
        tableRef.current?.reloadTable();
      } else {
        handleResponseFromCallApi({ response: keyResponse });
      }
    },
  };
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({
        id: 'pages.administrative.street.form.title',
      }),
      dataIndex: 'display_title',
      hideInSearch: true,
      width: 200,
      render: (dom, entity) => {
        const data = {
          id: entity.id,
          display_title: entity.display_title,
          status: !(Number(entity.status) - 1),
          province_city_id: entity.province_city?.id,
          districts_id: entity.districts?.id,
          ward_id: entity.wards?.id,
        };

        return access.streetEdit ? (
          <Typography.Text ellipsis={{ tooltip: dom }} style={{ width: 200 }}>
            <Typography.Link
              onClick={() => {
                modalRef.current.onOpen(data);
              }}
            >
              {dom}
            </Typography.Link>
          </Typography.Text>
        ) : (
          <Typography.Text ellipsis={{ tooltip: dom }} style={{ width: 200 }}>
            {dom}
          </Typography.Text>
        );
      },
    },
    ...filter,
    {
      title: intl.formatMessage({
        id: 'global.status',
      }),
      dataIndex: 'status',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          <ProFormSwitch
            disabled={!access?.streetEdit}
            fieldProps={{
              defaultChecked: !(Number(dom) - 1),
              onChange: async (value: boolean) => {
                const response = await streetService.activeDeActiveStreet(entity.id, {
                  status: value,
                  branch_id: workspace_id,
                });
                if (response?.keyResponse) {
                  _func.handleResponseErrorFromCallApi(response?.keyResponse);
                  return;
                }
                const { status } = response;
                if (status == 200) {
                  message.success(
                    intl.formatMessage({ id: 'global.success' }),
                    MESSAGE_DISPLAY_SECONDS.SUCCESS,
                  );
                  tableRef.current?.reloadTable();
                }
              },
            }}
          />
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'form.card.operation' }),
      hideInSearch: true,
      render: (dom, entity) => {
        const id = entity.id;
        const data = {
          id: entity.id,
          display_title: entity.title,
          status: entity.status,
          province_city_id: entity.province_city?.id,
          districts_id: entity.districts?.id,
          ward_id: entity.wards?.id,
        };
        return (
          <Space>
            <Link
              hidden={!(entity.isDelete && access.streetDelete)}
              onClick={() => {
                confirm(
                  'Xoá đường',
                  `Bạn có muốn xoá đường "${entity.title}" không`,
                  async () => {
                    const response = await streetService.deleteStreet(id, workspace_id);

                    if (response?.keyResponse) {
                      _func.handleResponseErrorFromCallApi(response?.keyResponse);
                      return;
                    }
                    if (response) {
                      message.success(
                        'Xoá đường thành công',
                        MESSAGE_DISPLAY_SECONDS.SUCCESS,
                        () => {
                          tableRef.current?.reloadTable();
                        },
                      );
                    } else {
                      message.error('Xoá đường thất bại', MESSAGE_DISPLAY_SECONDS.ERROR);
                    }
                  },
                  () => {},
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
            </Link>
            <Link hidden={entity.isDelete} style={{ padding: '0 8px' }}></Link>
            {access.streetEdit && (
              <Link
                onClick={() => {
                  modalRef.current.onOpen(data);
                }}
              >
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
              </Link>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.administrative.street.title' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.administrative.street.title' }),
            },
          ],
        },
        extra: [],
      }}
    >
      <CustomProTableLayout
        ref={tableRef}
        dataTable={{
          optionToolbar: {
            search: true,
          },
          tooltip: intl.formatMessage({ id: 'pages.administrative.street.search_tooltip' }),
        }}
        table={{
          columns: columns,
          request: async (params: any): Promise<Partial<RequestData<any>>> => {
            const { current, pageSize, keyword, province_city_title, district_title, ward_title } =
              params;

            const offset = pageSize * current - pageSize;
            const response = await streetService.getListStreetManagement({
              offset,
              limit: pageSize,
              search: keyword,
              province_city_id: province_city_title,
              district_id: district_title,
              ward_id: ward_title,
              status: [STATUS_ENUM.ACTIVE, STATUS_ENUM.PENDING],
              orderBy: 'title',
              branch_id: workspace_id,
            });

            const { data: streetList, total, keyResponse } = response;
            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }
            const newStreetList = streetList.map((value: any) => ({
              ...value,
              province_city_title: value.province_city?.display_title,
              district_title: value.districts?.display_title,
              ward_title: value.wards?.display_title,
            }));
            return {
              data: newStreetList,
              success: true,
              total: total,
            };
          },
          toolBarRender: () => {
            return [
              access.streetCreate && (
                <ButtonAddNew
                  onClick={() => {
                    modalRef.current.onOpen();
                  }}
                />
              ),
            ];
          },
          rowKey: 'id',
          dateFormatter: 'string',
        }}
      />
      <ModalFormStreet
        ref={modalRef}
        afterSubmit={_func.afterSubmit}
        handleResponseErrorFromCallApi={_func.handleResponseErrorFromCallApi}
        branch_id={workspace_id}
      />
    </PageContainer>
  );
};

export default StreetList;
