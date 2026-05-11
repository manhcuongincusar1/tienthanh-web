import React, { useRef } from 'react';
import { ProColumns, RequestData } from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { useIntl } from '@@/plugin-locale/localeExports';
import itemRender from '@/helpers/breadcrumbHelper';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { importExportService } from '@/services/importExportService';
import Styles from '@/styles/page/property/sell-styles.less';
import Settings from '../../../../config/defaultSettings';
import { EXPORT_STATUS_ENUM, REAL_ESTATE_TYPE_ENUM_SELECT } from '@/constants';
import { formatDateTime } from '@/utils';
import moment from 'moment';
import { ProFormInstance } from '@ant-design/pro-form';
import { useModel } from 'umi';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

interface TableRef extends ProFormInstance {
  reloadTable: () => void;
  submitFormSearch: () => void;
}
const ExportList: React.FC = (props) => {
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
      sorter: true,
      valueType: 'dateRange',
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
        return (
          <a
            href={`${Settings.APP_ROOT}/${record.file_path}`}
            className={Styles.iconDownload}
            download="download"
          >
            {record.file_name}
          </a>
        );
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
      valueEnum: EXPORT_STATUS_ENUM,
      dataIndex: 'status',
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
  ];

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.import_export.export_list' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.import_export.export_list' }),
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

            const { data: dataResponse, keyResponse } = await importExportService.getListExport({
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
            }

            return {
              data: dataResponse?.exportList,
              success: true,
              total: dataResponse?.count,
            };
          },
          rowKey: 'id',
          dateFormatter: 'string',
        }}
      />
    </PageContainer>
  );
};

export default ExportList;
