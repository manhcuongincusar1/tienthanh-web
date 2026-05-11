import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import Icon, { UploadOutlined } from '@ant-design/icons';
import { ProFormDependency, ProFormDigit, ProFormSelect } from '@ant-design/pro-form';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, message, Space, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useIntl, Link, useAccess } from 'umi';
import { TableRef } from '@/pages/types';
import { accountService } from '@/api/account/Services/accountService';
import { administrativeDivision } from '@/api/administrativeDivision';
import SwitchStatus from '@/components/Custom/SwitchStatus';
import { STATUS_ENUM, STATUS_ENUM_SELECT } from '@/constants';
import itemRender from '@/helpers/breadcrumbHelper';
import { history } from '@@/core/history';
import { useModel } from '@@/plugin-model/useModel';
import { PageContainer } from '@ant-design/pro-layout';
import _ from 'lodash';
import { EditFormIcon, SyncIcon } from '@/../public/icons';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import formaterRealEstatePrice from '@/helpers/formaterRealEstatePrice';
import { CHECK_REAL_ESTATE_PRICE } from '../expression';

type DataSource = {
  full_name: string;
  branch: string;
  area: string;
  sell_price_range: string;
  rent_price_range: string;
  role: string;
  status: number;
};

interface ProvinceList {
  id: number;
  code: string;
  title: string;
  alias: string;
  display_title: string;
}

interface DistrictList extends ProvinceList {
  province_city: ProvinceList;
}

export default () => {
  const intl = useIntl();
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const tableRef = useRef<TableRef>();
  const [listRoles, setListRoles] = useState<Array<object>>([]);
  const [listBranches, setListBranches] = useState<Array<object>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const csvRef = useRef<any>();
  const [csvData, setCSVData] = useState([]);
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const { getProvinceList, provinceList } = useModel('administrativeDivision');
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();

  const csvHeaders = [
    { label: intl.formatMessage({ id: 'pages.account.col.name' }), key: 'full_name' },
    { label: intl.formatMessage({ id: 'pages.account.col.branch' }), key: 'branch' },
    { label: intl.formatMessage({ id: 'pages.account.col.province_city' }), key: 'province_city' },
    { label: intl.formatMessage({ id: 'pages.account.col.districts' }), key: 'districts' },
    {
      label: intl.formatMessage({ id: 'pages.account.col.sell_price_from' }),
      key: 'sell_price_from',
    },
    { label: intl.formatMessage({ id: 'pages.account.col.sell_price_to' }), key: 'sell_price_to' },
    {
      label: intl.formatMessage({ id: 'pages.account.col.rent_price_from' }),
      key: 'rent_price_from',
    },
    { label: intl.formatMessage({ id: 'pages.account.col.rent_price_to' }), key: 'rent_price_to' },
    { label: intl.formatMessage({ id: 'pages.account.col.role' }), key: 'role' },
    { label: intl.formatMessage({ id: 'pages.account.col.status' }), key: 'status' },
  ];

  useEffect(() => {
    accountService.getListRoles().then((result) => {
      const { data } = result;
      setListRoles(
        data.map((item: { title: string; id: number }) => {
          return {
            label: item.title,
            value: item.id,
          };
        }),
      );
    });

    accountService.getListBranches().then((result) => {
      const { data } = result;
      setListBranches(
        data.map((item: { title: string; id: number }) => {
          return {
            label: item.title,
            value: item.id,
          };
        }),
      );
    });

    getProvinceList();
  }, []);

  const onChangeStatus = async (val: boolean, entity: any) => {
    const response = await accountService.updateStatusById(entity?.user_id, {
      status: val ? STATUS_ENUM.ACTIVE : STATUS_ENUM.PENDING,
      branch_id: workspace_id,
    });

    if (response?.keyResponse) {
      handleResponseFromCallApi({ response: response?.keyResponse });
      return {};
    }
    if (response.status === 200) {
      message.success(
        `Cập nhật trạng thái ${entity.full_name} thành công`,
        MESSAGE_DISPLAY_SECONDS.SUCCESS,
      );
      actionRef.current?.reload();
    } else {
      message.error(
        `Cập nhật trạng thái ${entity.full_name} thất bại`,
        MESSAGE_DISPLAY_SECONDS.ERROR,
      );
    }
  };

  const _bindEvent = {
    onClickExport: async () => {
      setIsLoading(true);
      let params = tableRef.current?.getFieldsValue();

      let search_params = tableRef.current?.getSearchParams() || {};

      const { data, total, keyResponse }: any = await accountService.getListAccountManagement({
        ...params,
        ...search_params,
        branch_id: workspace_id,
      });
      if (keyResponse) {
        handleResponseFromCallApi({ response: keyResponse });
        return {};
      }
      if (data && _.isArray(data)) {
        let processedData = data.map((record: any, index: number) => {
          const {
            full_name,
            branches,
            province_city,
            districts,
            sell_price_from,
            sell_price_to,
            rent_price_from,
            rent_price_to,
            roles,
            status,
          } = record;

          return {
            index: index + 1,
            full_name,
            branch: branches.join(', '),
            province_city: province_city.join(', '),
            districts: districts.join(', '),
            sell_price_from,
            sell_price_to,
            rent_price_from,
            rent_price_to,
            role: roles.join(', '),
            status: status === STATUS_ENUM.ACTIVE ? 'Có' : 'Không',
          };
        });
        setCSVData(processedData);
        csvRef.current?.link.click();
      } else {
        message.error(intl.formatMessage({ id: 'global.fail' }), MESSAGE_DISPLAY_SECONDS.ERROR);
      }
      setIsLoading(false);
    },
  };

  const columns: ProColumns<DataSource>[] = [
    {
      title: intl.formatMessage({ id: 'pages.account.col.name' }),
      dataIndex: 'full_name',
      hideInSearch: true,
      width: 240,
      render: (dom, entity: any) => {
        let newString = entity.full_name;
        if (newString.length > 25) {
          newString = `${newString.slice(0, 25)}...`;
        }
        return access?.accountEdit ? (
          <Link
            key={'name_edit'}
            to={`/account/edit/${entity.user_id}`}
            className="table-ellipsis-link"
          >
            <Tooltip placement="topLeft" title={entity.full_name}>
              {newString}
            </Tooltip>
          </Link>
        ) : (
          newString
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.account.col.phone_number' }),
      dataIndex: 'raw_phone_number',
      hideInSearch: true,
    },
    {
      title: intl.formatMessage({ id: 'pages.account.col.branch' }),
      dataIndex: 'branches',
      hideInSearch: true,
      render: (dom, entity: any) => {
        return entity.branches.map((item: string) => (
          <>
            {item}
            <br />
          </>
        ));
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.account.col.province_city' }),
      dataIndex: 'province_city',
      renderFormItem: (
        item,
        { type, defaultRender, formItemProps, fieldProps, ...rest }: any,
        form,
      ) => {
        return (
          <ProFormSelect
            {...fieldProps}
            name="f_province_cities"
            showSearch
            mode="multiple"
            options={provinceList}
            placeholder={intl.formatMessage({ id: 'global.all' })}
            fieldProps={{
              maxTagCount: 'responsive',
              onChange: (value) => {
                form.setFieldsValue({
                  f_province_city: value,
                });
                form.resetFields(['f_districts']);
                form.submit();
              },
            }}
          />
        );
      },
      render: (dom, entity: any) => {
        const title = entity.province_city.reduce((prev: any, value: any, index: any) => {
          return `${prev} ${index === 0 ? '' : ','} ${value}`;
        }, '');
        return (
          <Tooltip placement="topLeft" title={title}>
            {entity.province_city.map((item: any) => {
              return (
                <>
                  <Typography.Text style={{ width: 200 }} ellipsis={true}>
                    {item}
                  </Typography.Text>
                  <br />
                </>
              );
            })}
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.account.col.districts' }),
      dataIndex: 'districts',
      width: 240,
      renderFormItem: (
        item,
        { type, defaultRender, formItemProps, fieldProps, ...rest }: any,
        form,
      ) => {
        return (
          <ProFormDependency name={['f_province_cities']}>
            {({ f_province_cities }) => {
              return (
                <ProFormSelect
                  {...fieldProps}
                  name="f_districts"
                  showSearch
                  mode="multiple"
                  params={f_province_cities}
                  request={async () => {
                    if (!f_province_cities?.length) {
                      return [];
                    }
                    let result_data: DistrictList[] = [];
                    for (let f_province_id of f_province_cities) {
                      let this_data = await administrativeDivision.getDistrictList({
                        province_id: f_province_id && Number(f_province_id),
                      });
                      result_data = [...result_data, ...this_data];
                    }

                    return result_data?.map((value) => ({
                      label: value.display_title,
                      value: value.id,
                    }));
                  }}
                  placeholder={intl.formatMessage({ id: 'global.all' })}
                  fieldProps={{
                    maxTagCount: 'responsive',
                    onChange: (value) => {
                      form.setFieldsValue({
                        f_district: value,
                      });
                      form.submit();
                    },
                  }}
                />
              );
            }}
          </ProFormDependency>
        );
      },
      render: (dom, entity: any) => {
        const title = entity.districts.reduce((prev: any, value: any, index: number) => {
          return `${prev} ${index === 0 ? '' : ','} ${value}`;
        }, '');
        return (
          <Tooltip placement="topLeft" style={{ height: 100 }} title={title}>
            {entity.districts.reduce((acc: [], item: string, index: number) => {
              if (index < 5) {
                return [
                  ...acc,
                  <>
                    <Typography.Text key={index} style={{ width: 200 }} ellipsis={true}>
                      {item}
                      {index === 4 && ' ...+'}
                    </Typography.Text>
                    <br />
                  </>,
                ];
              }
              return acc;
            }, [])}
          </Tooltip>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.account.col.sell_price_range' }),
      dataIndex: 'sell_price_range',
      hideInSearch: true,
      width: '15%',
      render: (dom, entity: any) => {
        if (!_.isNil(entity.sell_price_from) && _.isNil(entity.sell_price_to)) {
          return `Trên ${formaterRealEstatePrice(entity.sell_price_from)}`;
        } else if (_.isNil(entity.sell_price_from) && !_.isNil(entity.sell_price_to)) {
          return `Dưới ${formaterRealEstatePrice(entity.sell_price_to)}`;
        } else if (!_.isNil(entity.sell_price_from) && !_.isNil(entity.sell_price_to)) {
          return `${formaterRealEstatePrice(entity.sell_price_from)} - ${formaterRealEstatePrice(
            entity.sell_price_to,
          )}`;
        } else {
          return '';
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.account.col.rent_price_range' }),
      dataIndex: 'rent_price_range',
      hideInSearch: true,
      width: '15%',
      render: (dom, entity: any) => {
        if (!_.isNil(entity.rent_price_from) && _.isNil(entity.rent_price_to)) {
          return `Trên ${formaterRealEstatePrice(entity.rent_price_from)}`;
        } else if (_.isNil(entity.rent_price_from) && !_.isNil(entity.rent_price_to)) {
          return `Dưới ${formaterRealEstatePrice(entity.rent_price_to)}`;
        } else if (!_.isNil(entity.rent_price_from) && !_.isNil(entity.rent_price_to)) {
          return `${formaterRealEstatePrice(entity.rent_price_from)} - ${formaterRealEstatePrice(
            entity.rent_price_to,
          )}`;
        } else {
          return '';
        }
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.account.col.role' }),
      dataIndex: 'roles',
      renderFormItem: (
        item,
        { type, defaultRender, formItemProps, fieldProps, ...rest }: any,
        form,
      ) => {
        return (
          <ProFormSelect
            {...fieldProps}
            name="f_roles"
            mode="multiple"
            options={listRoles}
            placeholder={intl.formatMessage({ id: 'global.all' })}
            fieldProps={{
              maxTagCount: 'responsive',
              onChange: (value) => {
                form.setFieldsValue({
                  f_role: value,
                });
                form.submit();
              },
            }}
          />
        );
      },
      render: (dom: any, entity) => {
        return dom.map((item: string) => (
          <>
            {item}
            <br />
          </>
        ));
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.account.col.status' }),
      dataIndex: 'status',
      render: (dom, entity: any) => {
        const currentUser = initialState?.currentUser;
        const isChangeStatus =
          currentUser?.role === 'super_admin' ||
          (entity.role_type?.[0] === 'sale' &&
            currentUser?.role === 'admin' &&
            access?.accountEdit);

        return (
          <SwitchStatus
            disabled={!isChangeStatus}
            entity={entity}
            onChangeStatus={onChangeStatus}
          />
        );
      },
      renderFormItem: (
        _,
        { type, defaultRender, formItemProps, fieldProps, ...rest }: any,
        form,
      ) => {
        return (
          <ProFormSelect
            {...fieldProps}
            name="f_status"
            valueEnum={STATUS_ENUM_SELECT}
            placeholder={intl.formatMessage({ id: 'global.all' })}
            fieldProps={{
              onChange: (value) => {
                form.setFieldsValue({
                  f_status: value,
                });
                form.submit();
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
      render: (dom, entity: any) => {
        const currentUser = initialState?.currentUser;
        const isChangeStatus =
          currentUser?.role === 'super_admin' ||
          (entity.role_type?.[0] === 'sale' &&
            currentUser?.role === 'admin' &&
            access?.accountChangePassword);
        return (
          <React.Fragment>
            <Space>
              <a
                key={'edit'}
                onClick={() => {
                  history.push('/account/edit/' + entity.user_id);
                }}
              >
                <Icon component={EditFormIcon} style={{ fontSize: '16px' }} />
              </a>
              {isChangeStatus && (
                <a
                  key={'change_password'}
                  onClick={() => {
                    history.push(`/account/edit/${entity.user_id}/password`);
                  }}
                >
                  <Icon component={SyncIcon} style={{ fontSize: '16px' }} />
                </a>
              )}
            </Space>
          </React.Fragment>
        );
      },
    },
  ];

  const filterColumns: ProColumns<DataSource>[] = [
    {
      title: 'Khoảng giá bán (tỷ)',
      dataIndex: 'f_sell_price_range',
      hideInTable: true,
      renderFormItem: (
        _,
        { type, defaultRender, formItemProps, fieldProps, ...rest }: any,
        form,
      ) => {
        return (
          <Space>
            <ProFormDigit
              name="f_sell_price_from"
              placeholder={intl.formatMessage({ id: 'global.from' })}
              min={0}
              rules={[
                {
                  pattern: CHECK_REAL_ESTATE_PRICE,
                  message: intl.formatMessage({ id: 'form.price.form_over_to' }),
                },
                {
                  validator: (rule, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              fieldProps={{
                onChange: (value) => {
                  form.setFieldsValue({
                    f_sell_price_from: value,
                  });
                  form.submit();
                },
                formatter: (value: any) => formaterRealEstatePrice(value),
              }}
            />
            <ProFormDigit
              name="f_sell_price_to"
              placeholder={intl.formatMessage({ id: 'global.to' })}
              min={0}
              fieldProps={{
                onChange: (value) => {
                  form.setFieldsValue({
                    f_sell_price_to: value,
                  });
                  form.submit();
                },
                formatter: (value: any) => formaterRealEstatePrice(value),
              }}
              rules={[
                {
                  pattern: CHECK_REAL_ESTATE_PRICE,
                  message: intl.formatMessage({ id: 'form.price.form_over_to' }),
                },
                {
                  validator: (rule, value) => {
                    const priceFrom = tableRef.current?.getFieldValue('f_sell_price_from');
                    if ((!!value && value < priceFrom) || value < 0) {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            />
          </Space>
        );
      },
    },
    {
      title: 'Khoảng giá thuê (triệu)',
      dataIndex: 'f_rent_price_range',
      hideInTable: true,
      renderFormItem: (
        _,
        { type, defaultRender, formItemProps, fieldProps, ...rest }: any,
        form,
      ) => {
        return (
          <Space>
            <ProFormDigit
              name="f_rent_price_from"
              placeholder={intl.formatMessage({ id: 'global.from' })}
              min={0}
              rules={[
                {
                  pattern: CHECK_REAL_ESTATE_PRICE,
                  message: intl.formatMessage({ id: 'form.price.form_over_to' }),
                },
                {
                  validator: (rule, value) => {
                    if (value < 0) {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              fieldProps={{
                onChange: (value) => {
                  form.setFieldsValue({
                    f_rent_price_from: value,
                  });
                  form.submit();
                },
                formatter: (value: any) => formaterRealEstatePrice(value),
              }}
            />
            <ProFormDigit
              name="f_rent_price_to"
              placeholder={intl.formatMessage({ id: 'global.to' })}
              min={0}
              rules={[
                {
                  pattern: CHECK_REAL_ESTATE_PRICE,
                  message: intl.formatMessage({ id: 'form.price.form_over_to' }),
                },
                {
                  validator: (rule, value) => {
                    const priceFrom = tableRef.current?.getFieldValue('f_rent_price_from');
                    if ((!!value && value < priceFrom) || value < 0) {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.price.form_over_to' })),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              fieldProps={{
                onChange: (value) => {
                  form.setFieldsValue({
                    f_rent_price_to: value,
                  });
                  form.submit();
                },
                formatter: (value: any) => formaterRealEstatePrice(value),
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <PageContainer
      header={{
        breadcrumb: {
          itemRender,
          routes: [
            {
              path: '/',
              breadcrumbName: 'Trang chủ',
            },
            {
              path: 'account',
              breadcrumbName: intl.formatMessage({
                id: 'pages.account.list',
              }),
            },
          ],
        },
      }}
      title={intl.formatMessage({ id: 'pages.account.list' })}
    >
      <CustomProTableLayout
        tableKey="account_table"
        ref={tableRef}
        dataTable={{
          optionToolbar: {
            setting: true,
            reload: true,
            search: true,
            layout: false,
          },
          tooltip: intl.formatMessage({ id: 'pages.account.tooltip.search' }),
        }}
        table={{
          columns: [...columns, ...filterColumns],
          actionRef: actionRef,

          request: async (params: any): Promise<any> => {
            const { current, pageSize } = params;
            const offset = pageSize * current - pageSize;

            const { data, total, keyResponse } = await accountService.getListAccountManagement({
              ...params,
              branch_id: workspace_id,
              offset,
              limit: pageSize,
            });

            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }

            return Promise.resolve({
              data: data,
              success: true,
              total: total,
            });
          },

          toolBarRender: () => {
            return [
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  history.push('/account/create');
                }}
                hidden={!access?.accountCreate}
                shape="circle"
                size="small"
              >
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
                    d="M7.99984 2.66667C8.36803 2.66667 8.6665 2.96514 8.6665 3.33333V7.33333H12.6665C13.0347 7.33333 13.3332 7.63181 13.3332 8C13.3332 8.36819 13.0347 8.66667 12.6665 8.66667H8.6665V12.6667C8.6665 13.0349 8.36803 13.3333 7.99984 13.3333C7.63165 13.3333 7.33317 13.0349 7.33317 12.6667V8.66667H3.33317C2.96498 8.66667 2.6665 8.36819 2.6665 8C2.6665 7.63181 2.96498 7.33333 3.33317 7.33333H7.33317V3.33333C7.33317 2.96514 7.63165 2.66667 7.99984 2.66667Z"
                    fill="white"
                  />
                </svg>
                Tạo mới
              </Button>,
              <Button
                type="default"
                key="export"
                onClick={_bindEvent.onClickExport}
                size="small"
                shape="circle"
                icon={<UploadOutlined />}
                loading={isLoading}
                disabled={isLoading}
              >
                Export
              </Button>,
              <CSVLink
                key="csv"
                ref={csvRef}
                data={csvData}
                headers={csvHeaders}
                filename={`Danh sách thành viên ${dayjs().format('DD-MM-YYYY')}`}
                style={{ display: 'none' }}
              />,
            ];
          },

          rowKey: 'user_id',
        }}
        actions={{
          isSearchHeader: true,
        }}
      />
    </PageContainer>
  );
};
