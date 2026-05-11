import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Space } from 'antd';
import { useParams } from 'umi';
import { realEstateService } from '@/services/realEstateService';
import _ from 'lodash';
import { useState } from 'react';
import { formatDateTime } from '@/utils/dateUtils';
import { useIntl } from 'umi';
interface ProTableHistoryEditRealEstateProps {
  forceUpdate: number;
}

export default function ProTableHistoryEditRealEstate({
  forceUpdate,
}: ProTableHistoryEditRealEstateProps) {
  const { id } = useParams<{ id: string }>();
  const intl = useIntl();
  const [hideHistory, setHideHistory] = useState<boolean>(false);

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({ id: 'global.modified_date' }),
      dataIndex: 'created_at',
      render: (dom) => {
        return formatDateTime(`${dom}`);
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.real_estate_status' }),
      dataIndex: 'status',
      render: (dom) => {
        return (
          <Space size={12}>
            {_.isArray(dom) && dom[0]}
            {_.isArray(dom) && dom[1] ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.52794 2.86177C7.78829 2.60142 8.2104 2.60142 8.47075 2.86177L13.1374 7.52843C13.3978 7.78878 13.3978 8.21089 13.1374 8.47124L8.47075 13.1379C8.2104 13.3983 7.78829 13.3983 7.52794 13.1379C7.26759 12.8776 7.26759 12.4554 7.52794 12.1951L11.0565 8.6665H3.33268C2.96449 8.6665 2.66602 8.36803 2.66602 7.99984C2.66602 7.63165 2.96449 7.33317 3.33268 7.33317H11.0565L7.52794 3.80458C7.26759 3.54423 7.26759 3.12212 7.52794 2.86177Z"
                  fill="black"
                />
              </svg>
            ) : (
              <></>
            )}

            {_.isArray(dom) && dom[1]}
          </Space>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.people_change' }),
      dataIndex: 'creator_full_name',
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.note_change_text' }),
      dataIndex: 'note_change',
      render: (dom, entity) => {
        return <>{dom || entity?.note}</>;
      },
    },
  ];
  return (
    <>
      <div style={{ display: hideHistory ? 'none' : 'block' }}>
        <h3 className="section-title">Lịch sử thay đổi BĐS</h3>
        <ProTable
          columns={columns}
          search={false}
          toolBarRender={false}
          rowKey="id"
          params={{ forceUpdate }}
          request={async () => {
            const data = await realEstateService.getHistoryRealEstateStatus(id);

            let newData = [];
            if (_.isArray(data) && data.length > 0) {
              newData = _.isArray(data)
                ? data?.map((value: any) => {
                    if (
                      !value?.previous_real_estate_status?.title &&
                      value?.next_real_estate_status?.title
                    ) {
                      return {
                        ...value,
                        status: [value?.next_real_estate_status?.title, null],
                      };
                    } else if (!value?.next_real_estate_status?.title) {
                      return {
                        ...value,
                        status: null,
                      };
                    }
                    return {
                      ...value,
                      status: [
                        value?.previous_real_estate_status?.title,
                        value?.next_real_estate_status?.title,
                      ],
                    };
                  })
                : [];
              setHideHistory(false);
            } else {
              setHideHistory(true);
            }
            const total = 10;
            return {
              data: newData,
              success: true,
              total: total,
            };
          }}
          pagination={false}
        />
      </div>
    </>
  );
}
