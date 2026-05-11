import React, { useRef } from 'react';
import { ProColumns, RequestData } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl } from '@@/plugin-locale/localeExports';
import itemRender from '@/helpers/breadcrumbHelper';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { importExportService } from '@/services/importExportService';
import Styles from '@/styles/page/property/sell-styles.less';
import Settings from '../../../../config/defaultSettings';
import { IMPORT_STATUS_ENUM, REAL_ESTATE_TYPE_ENUM_SELECT } from '@/constants';
import { formatDateTime } from '@/utils';
import moment from 'moment';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

import { ProFormInstance } from '@ant-design/pro-form';
import { ERROR_IMPORT_ENUM } from './constant';
import { useModel } from 'umi';
interface TableRef extends ProFormInstance {
  reloadTable: () => void;
  submitFormSearch: () => void;
}
const ImportList: React.FC = (props) => {
  const actionRef = useRef<TableRef>();
  const intl = useIntl();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const _func = {
    afterSubmit: () => {
      actionRef.current?.reloadTable();
    },
  };
  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({
        id: 'pages.import_export.export.request_date',
      }),
      dataIndex: 'created_at',
      valueType: 'dateRange',
      sorter: true,
      renderText: (text, record, index, action) => {
        return formatDateTime(text);
      },
      render: (text, record) => {
        return formatDateTime(record.created_at);
      },
      fieldProps: {
        format: 'DD/MM/YYYY',
        disabledDate: (current) => {
          let customDate = moment().format('YYYY-MM-DD');
          return current && current > moment(customDate, 'YYYY-MM-DD').add(1, 'days');
        },
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
      initialValue: [moment().subtract(1, 'month'), moment()],
    },
    {
      title: intl.formatMessage({
        id: 'pages.import_export.export.file_title',
      }),
      dataIndex: 'file_name',
      hideInSearch: true,
      render: (text, record, index) => {
        switch (record.status) {
          case 0:
            return (
              <a
                href={`${Settings.APP_ROOT}/${record.error_file_path}`}
                className={Styles.iconDownload}
                download="download"
              >
                File import thất bại
              </a>
            );
          case 1:
            return 'File đang kiểm tra';
          case 2:
            return 'File đang xử lý';
          case 3:
            return record?.error_file_path ? (
              <>
                File gốc:{' '}
                <a
                  href={`${Settings.APP_ROOT}/${record?.file_path?.replace('public/', '')}`}
                  className={Styles.iconDownload}
                  download="download"
                >
                  {record.file_name}
                </a>
                <br />
                File lỗi:{' '}
                <a
                  href={`${Settings.APP_ROOT}/${record.error_file_path}`}
                  className={Styles.iconDownload}
                  download="download"
                >
                  {record?.error_file_name}
                </a>
              </>
            ) : (
              <>
                File gốc:{' '}
                <a
                  href={`${Settings.APP_ROOT}/${record?.file_path?.replace('public/', '')}`}
                  className={Styles.iconDownload}
                  download="download"
                >
                  {record.file_name}
                </a>
              </>
            );
          default:
            return (
              <a
                href={`${Settings.APP_ROOT}/${record.error_file_path}`}
                className={Styles.iconDownload}
                download="download"
              >
                text
              </a>
            );
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.new_real_estate.type' }),
      dataIndex: 'type',
      valueEnum: REAL_ESTATE_TYPE_ENUM_SELECT,
      fieldProps: {
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.import_export.export.status',
      }),
      valueEnum: IMPORT_STATUS_ENUM,
      dataIndex: 'status',
      render: (text, record) => {
        switch (record.status) {
          case 3:
            return (
              <React.Fragment>
                {text} ({record.info})
              </React.Fragment>
            );
          default:
            return text;
        }
      },
      fieldProps: {
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.import_export.export.requester',
      }),
      dataIndex: 'full_name',
      hideInSearch: true,
    },

    {
      title: intl.formatMessage({
        id: 'pages.import_export.export.note',
      }),
      dataIndex: 'note',
      hideInSearch: true,
      render: (dom: any) => {
        return dom === '-' ? '' : ERROR_IMPORT_ENUM[dom];
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.import_export.import_list' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.import_export.import_list' }),
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
        }}
        table={{
          search: false,
          columns: columns,
          request: async (params: any, sort): Promise<Partial<RequestData<any>>> => {
            const { current, pageSize, keyword, type, status, created_at } = params;
            const offset = pageSize * current - pageSize;
            let start_day;
            let end_day;
            if (created_at) {
              start_day = moment(created_at[0], 'DD-MM-YYYY')?.format('YYYY-MM-DD');
              end_day = moment(created_at[1], 'DD-MM-YYYY')?.format('YYYY-MM-DD');
            }

            const { data, keyResponse } = await importExportService.getListImport({
              offset,
              limit: pageSize,
              keyword,
              type,
              status,
              start_day,
              end_day,
              sort,
              branch_id: workspace_id,
            });

            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }

            if (data) {
              const { exportList, count } = data;

              return {
                data: exportList,
                success: true,
                total: count,
              };
            }
            return {
              data: [],
              success: false,
              total: 0,
            };
          },
          rowKey: 'id',
          dateFormatter: 'string',
        }}
      />
    </PageContainer>
  );
};

export default ImportList;
