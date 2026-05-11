import { ProFormCheckbox, ProFormDigit, ProFormFieldSet } from '@ant-design/pro-form';
import { ProColumns } from '@ant-design/pro-table';
import { Col, Row } from 'antd';
import { useIntl, useModel } from 'umi';
import { realEstateCategoryService } from '@/services/realEstateCategoryService';
import { accountService } from '@/api/account/Services/accountService';
import _ from 'lodash';
import { REAL_LOCATION_ENUM, DIRECTION_ENUM } from '@/pages/real_estate/constants';
import formaterRealEstatePrice from './formaterRealEstatePrice';

const useFilterColumnTableRealEstate = (
  tableKey: string,
  actionRef: any,
  defaultFilter: string | null,
  permissionPrice: {
    permission_to_price: number;
    permission_from_price: number;
    regex_check_price: any;
  },
) => {
  const filterDefault =
    !_.isUndefined(defaultFilter) && !_.isEmpty(defaultFilter) ? defaultFilter : {};
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const filterColumn: ProColumns[] = [
    {
      title: intl.formatMessage({ id: `pages.${tableKey}.price` }),
      dataIndex: 'price',
      editable: false,
      colSize: 2,
      order: 5,
      align: 'right',
      sorter: true,
      hideInTable: true,
      initialValue: _.isUndefined(filterDefault?.price) ? [] : filterDefault?.price,
      render: (dom, entity, index, action, schema) => {
        const { price } = entity;
        return price.replace('.', ',');
      },
      formItemProps: {
        className: `custom-digit-range`,
      },
      fieldProps: {
        onChange: _.debounce((values: any) => {
          const { permission_to_price, permission_from_price } = permissionPrice;
          if (!_.isUndefined(values)) {
            if (values?.[0] < permission_from_price || values?.[1] > permission_to_price) {
              return false;
            }
            actionRef.current?.submitFormSearch();
          }
        }, 300),
      },
      renderFormItem: (
        item,
        { type, defaultRender, formItemProps, fieldProps, ...rest }: any,
        form,
      ) => {
        return (
          <ProFormFieldSet>
            <ProFormDigit
              name={`from_price`}
              fieldProps={{
                formatter: (value) => formaterRealEstatePrice(value),
              }}
              rules={[
                {
                  pattern: permissionPrice?.regex_check_price,
                  message: intl.formatMessage({ id: 'form.price.form_over_to' }),
                },
                {
                  validator: async (_, value) => {
                    const { permission_to_price, permission_from_price } = permissionPrice;
                    if ((value && value < permission_from_price) || value > permission_to_price) {
                      return Promise.reject(
                        new Error(
                          intl.formatMessage(
                            { id: 'pages.real_estate_sale.filter.from_to_bil' },
                            {
                              from: permission_from_price,
                              to: permission_to_price,
                            },
                          ),
                        ),
                      );
                    }
                  },
                },
              ]}
              placeholder="Từ"
              label="Từ"
            />
            <ProFormDigit
              name={`to_price`}
              fieldProps={{
                formatter: (value) => formaterRealEstatePrice(value),
              }}
              rules={[
                {
                  validator: (rule, value) => {
                    const priceFrom = actionRef.current?.getFieldValue('from_price');
                    const { permission_to_price, permission_from_price } = permissionPrice;
                    if (value) {
                      if (
                        value < priceFrom ||
                        !value?.toString().match(permissionPrice?.regex_check_price)
                      ) {
                        return Promise.reject(
                          new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                        );
                      } else if (
                        (value && value > permission_to_price) ||
                        (value && value < permission_from_price)
                      ) {
                        return Promise.reject(
                          new Error(
                            intl.formatMessage(
                              { id: 'pages.real_estate_sale.filter.from_to_bil' },
                              {
                                from: permission_from_price,
                                to: permission_to_price,
                              },
                            ),
                          ),
                        );
                      }
                    } else if (value === 0) {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              placeholder="Đến"
              label="Đến"
              required={false}
            />
          </ProFormFieldSet>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.sale' }),
      order: 2,
      colSize: 1,
      dataIndex: 'creator',
      initialValue: _.isUndefined(filterDefault?.creator) ? [] : filterDefault?.creator,
      editable: false,
      valueType: 'select',
      hideInTable: true,
      fieldProps: {
        showSearch: true,
        showArrow: true,
        autoClearSearchValue: true,
        maxTagCount: 'responsive',
        mode: 'multiple',
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
      request: async ({ keyWords }) => {
        const listAccount = await accountService.getListAccountSelect(
          {
            keyword: keyWords,
            branch_id: workspace_id,
          },
          true,
        );
        return listAccount;
      },
    },
    {
      order: 11,
      hideInTable: true,
      colSize: 4,
      renderFormItem: (item, { type, defaultRender, record, ...rest }, form) => {
        return (
          <Row>
            <Col span={12} lg={{ span: 12 }} xl={{ span: 6 }}>
              <ProFormCheckbox.Group
                name="mySubscribe"
                layout="horizontal"
                initialValue={
                  _.isUndefined(filterDefault?.mySubscribe) ? [] : filterDefault?.mySubscribe
                }
                fieldProps={{
                  onChange: (value: any) => {
                    actionRef.current?.submitFormSearch();
                  },
                }}
                options={[
                  {
                    label: intl.formatMessage({
                      id: 'pages.real_estate_sale.my_subscribe',
                    }),
                    value: true,
                  },
                ]}
              />
            </Col>
            <Col span={12} lg={{ span: 12 }} xl={{ span: 6 }} style={{ paddingLeft: '8px' }}>
              <ProFormCheckbox.Group
                name="myRecord"
                layout="horizontal"
                initialValue={_.isUndefined(filterDefault?.myRecord) ? [] : filterDefault?.myRecord}
                fieldProps={{
                  onChange: (value: any) => {
                    actionRef.current?.submitFormSearch();
                  },
                }}
                options={[
                  {
                    label: intl.formatMessage({
                      id: 'pages.real_estate_sale.my_real_estate',
                    }),
                    value: true,
                  },
                ]}
              />
            </Col>
          </Row>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.location' }),
      order: 1,
      dataIndex: 'location',
      initialValue: _.isUndefined(filterDefault?.location) ? [] : filterDefault?.location,
      // initialValue: filterDefault?.location,
      editable: false,
      hideInTable: true,
      valueType: 'select',
      valueEnum: REAL_LOCATION_ENUM,
      fieldProps: {
        mode: 'multiple',
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.direction' }),
      order: 1,
      dataIndex: 'direction',
      initialValue: _.isUndefined(filterDefault?.direction) ? [] : filterDefault?.direction,
      editable: false,
      hideInTable: true,
      valueType: 'select',
      valueEnum: DIRECTION_ENUM,
      fieldProps: {
        mode: 'multiple',
        placeholder: intl.formatMessage({ id: 'global.all' }),
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
    },
    {
      title: intl.formatMessage({
        id: 'pages.real_estate_sale.category',
      }),
      dataIndex: 'category',
      initialValue: _.isUndefined(filterDefault?.category) ? [] : filterDefault?.category,
      order: 3,
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
        maxTagCount: 'responsive',
        showSearch: true,
        showArrow: true,
        placeholder: intl.formatMessage({
          id: 'global.all',
        }),
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
      request: async () => {
        return (
          (await realEstateCategoryService.getListRealEstateCategorySelect({
            limit: 500,
          })) || []
        );
      },
      hideInTable: true,
    },
  ];

  return filterColumn;
};

export default useFilterColumnTableRealEstate;
