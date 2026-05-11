import { PageContainer } from '@ant-design/pro-layout';
import { useIntl, Link } from 'umi';
import itemRender from '@/helpers/breadcrumbHelper';
import ProCard from '@ant-design/pro-card';
import Styles from './index.less';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { permissionService } from '@/services/permissonService';

export default function Permission() {
  const intl = useIntl();

  const columns: ProColumns<any>[] = [
    {
      title: intl.formatMessage({ id: 'pages.permission.role_name' }),
      dataIndex: 'title',
      render: (dom: any, record: any) => {
        return <Link to={`/permission/${record.id}`}>{dom}</Link>;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.permission.feature_title' }),
      dataIndex: 'amount',
    },
  ];
  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.permission.title' }),
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
          columns={columns}
          search={false}
          toolBarRender={false}
          pagination={false}
          className={Styles.permissionTable}
          request={async () => {
            const response = await permissionService.getPermissionList();
            return {
              data: response || [],
            };
          }}
        />
      </ProCard>
    </PageContainer>
  );
}
