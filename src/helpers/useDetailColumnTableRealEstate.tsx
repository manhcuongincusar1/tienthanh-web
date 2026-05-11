import { ProColumns } from '@ant-design/pro-table';
import { Space, Tag, Typography, message } from 'antd';
import { useIntl, useModel } from 'umi';
import { formatDate } from '@/utils';
import { REAL_LOCATION_ENUM, DIRECTION_ENUM } from '@/pages/real_estate/constants';
import { ProFormSwitch } from '@ant-design/pro-form';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import formaterRealEstatePrice from './formaterRealEstatePrice';

const useDetailColumnTableRealEstate = (
  actionRef: any,
  getDetail: (id: string) => {},
  locale: string,
  realEstateService: any,
) => {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const _func = {
    afterSubmit: () => {
      actionRef.current?.reloadTable();
    },
  };

  const detailColumn: ProColumns[] = [
    {
      title: intl.formatMessage(
        { id: 'pages.real_estate_sale.area' },
        {
          name: (
            <span style={{ display: 'inline' }}>
              m<sup>2</sup>
            </span>
          ),
        },
      ),
      hideInSearch: true,
      editable: false,
      align: 'right',
      dataIndex: ['detail', 'recognized_area'],
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.structure' }),
      hideInSearch: true,
      editable: false,
      dataIndex: ['detail', 'structure'],
      render: (dom, entity, index, action, schema) => {
        return (
          <Typography.Text
            ellipsis={{ tooltip: dom }}
            style={{
              width: 240,
            }}
          >
            {dom}
          </Typography.Text>
        );
      },
    },
    {
      title: intl.formatMessage({ id: `pages.${locale}.price` }),
      dataIndex: 'price',
      editable: false,
      hideInSearch: true,
      align: 'right',
      render: (dom, entity, index, action, schema) => {
        return dom && formaterRealEstatePrice(`${dom}`);
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.location' }),
      order: 1,
      dataIndex: 'location',
      editable: false,
      valueType: 'select',
      hideInSearch: true,
      valueEnum: REAL_LOCATION_ENUM,
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.direction' }),
      order: 1,
      dataIndex: 'direction',
      editable: false,
      valueType: 'select',
      hideInSearch: true,
      valueEnum: DIRECTION_ENUM,
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.sale' }),
      dataIndex: 'creator',
      editable: false,
      hideInSearch: true,
      render: (dom) => {
        return (
          <Typography.Text
            ellipsis={{ tooltip: dom }}
            style={{
              width: 240,
            }}
          >
            {dom}
          </Typography.Text>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.sale_phone' }),
      hideInSearch: true,
      editable: false,
      dataIndex: 'creator_phone',
    },
    {
      title: intl.formatMessage({ id: `pages.${locale}.owner` }),
      hideInSearch: true,
      editable: false,
      dataIndex: 'sale_full_name',
      render: (dom, entity) => {
        let domNew = `${dom}`;
        return (
          <>
            {dom && dom !== '-' ? (
              <Typography.Text
                ellipsis={{ tooltip: domNew }}
                style={{
                  width: 240,
                }}
              >
                {domNew}
              </Typography.Text>
            ) : (
              ''
            )}
          </>
        );
      },
    },
    {
      title: intl.formatMessage({ id: `pages.${locale}.owner_phone` }),
      hideInSearch: true,
      editable: false,
      dataIndex: 'sale_phone',
      render: (dom, entity) => {
        let domNew = `${dom}`;

        return (
          <>
            {dom && dom !== '-' ? (
              <Typography.Text
                ellipsis={{ tooltip: domNew }}
                style={{
                  width: 240,
                }}
              >
                {domNew}
              </Typography.Text>
            ) : (
              ''
            )}
          </>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.real_estate_status' }),
      dataIndex: 'real_estate_status',
      valueType: 'select',
      hideInSearch: true,
      editable: false,
      render: (dom, entity) => {
        return (
          <>
            {entity.real_estate_status ? (
              <Tag color={entity.real_estate_status_color}>{entity.real_estate_status}</Tag>
            ) : (
              ''
            )}
          </>
        );
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.real_estate_sale.subscribe',
      }),
      dataIndex: 'is_subscribe',
      hideInSearch: true,
      formItemProps: {
        name: 'is_subscribe',
      },
      renderFormItem: (item, { type, defaultRender, record, ...rest }, form) => {
        return (
          <ProFormSwitch
            fieldProps={{
              checked: record.is_subscribe,
              onChange: async (value: boolean) => {
                const response = await realEstateService.subscribeRealEstate(record.id, {
                  isSubscribe: value,
                  branch_id: workspace_id,
                });
                if (response?.keyResponse === 'forbidden' || response?.keyResponse === 'notfound') {
                  _func.afterSubmit?.();
                  return;
                }
                if (response) {
                  message.success(
                    intl.formatMessage({
                      id: value
                        ? 'pages.real_estate_sale.subscribe_success'
                        : 'pages.real_estate_sale.unsubscribe_success',
                    }),
                    MESSAGE_DISPLAY_SECONDS.SUCCESS,
                  );
                  _func.afterSubmit?.();
                } else {
                  message.error(
                    intl.formatMessage({
                      id: value
                        ? 'pages.real_estate_sale.subscribe_failed'
                        : 'pages.real_estate_sale.unsubscribe_failed',
                    }),
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
      title: intl.formatMessage({ id: 'global.created_date' }),
      hideInSearch: true,
      editable: false,
      dataIndex: 'created_date',
      sorter: true,
      renderText: (text) => {
        return formatDate(text);
      },
    },
    {
      title: intl.formatMessage({ id: 'global.modified_date' }),
      hideInSearch: true,
      editable: false,
      sorter: true,
      dataIndex: 'modified_date',
      renderText: (text) => {
        return formatDate(text);
      },
    },

    {
      title: intl.formatMessage({ id: 'form.card.operation' }),
      hideInSearch: true,
      editable: false,
      render: (value: any, entity: API.RealEstateResponse) => {
        const { id } = entity;
        return (
          <Space>
            <Typography.Link onClick={() => getDetail(id)}>
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
          </Space>
        );
      },
    },
  ];
  return detailColumn;
};

export default useDetailColumnTableRealEstate;
