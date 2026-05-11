import ProCard from '@ant-design/pro-card';
import { EditableFormInstance, EditableProTable } from '@ant-design/pro-table';
import { Space, Typography, message, Input, FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { AutoComplete } from 'antd';
import { ProFormDigit, ProFormInstance } from '@ant-design/pro-form';
import { useIntl, useModel, useParams } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import { formatDateTime } from '@/utils';
import { DistrictList } from '@/pages/types';
import { DefaultOptionType, LabelInValueType } from 'rc-select/lib/Select';
import { administrativeDivision } from '@/api/administrativeDivision';
import { customerServices } from '@/services/customerServices';
import { v4 as uuidv4 } from 'uuid';
import Styles from '../index.less';
import { confirm } from '@/components/popup';
import { CHECK_REAL_ESTATE_PRICE } from '@/pages/expression';
import _ from 'lodash';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import formaterRealEstatePrice from '@/helpers/formaterRealEstatePrice';

interface BuyRentDemandCollapProps {
  title: string;
  defaultCollapsed: boolean;
  setDataSource: (dataSource: Customer.Deal[]) => void;
  dataSource: Customer.Deal[] | undefined;
  formRowRef: FormInstance;
  saveRef: React.MutableRefObject<any>;
  type: number;
}

interface AutoCompleteDemand {
  value: string;
  label: string;
  type: number;
}

export default function BuyRentDemandCollap({
  title,
  defaultCollapsed,
  dataSource,
  formRowRef,
  saveRef,
  setDataSource,
  type,
}: BuyRentDemandCollapProps) {
  const formRef = useRef<ProFormInstance>();
  const editableFormRef = useRef<EditableFormInstance>();
  const [districtList, setDistrictList] = useState([]);
  const [provinceId, setProvinceId] = useState(0);
  const { id } = useParams<Customer.Params>();
  const { setIsVisibleConfirm } = useModel('buyRentDemand');
  const [forceUpdate, setForceUpdate] = useState(1);
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const { getProvinceList } = useModel('administrativeDivision');
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const intl = useIntl();
  useEffect(() => {
    if (_.isUndefined(id)) {
      setDataSource([]);
    }
  }, [id]);

  useEffect(() => {
    if (provinceId) {
      administrativeDivision
        .getDistrictList({
          province_id: Number(provinceId),
        })
        .then((res) => {
          const data = res.map((value: DistrictList) => ({
            label: value.display_title,
            value: value.id,
          }));
          setDistrictList(data);
        });
    }
  }, [provinceId]);

  const _func = {
    onSelectUses: (
      value: string | number | LabelInValueType,
      options: DefaultOptionType,
      recordKey: React.Key | React.Key[] | undefined,
    ) => {
      editableFormRef.current?.setRowData?.(`${recordKey}`, { uses: value });
    },
    onDeleteDemand: async (rowId: string) => {
      if (id) {
        const response = await customerServices.deleteCustomerDemand(rowId, workspace_id);
        if (response?.keyResponse) {
          handleResponseFromCallApi({ response: response?.keyResponse });
          return;
        }
        if (response?.data) {
          message.success(
            intl.formatMessage({ id: 'pages.customer_buy_rent.delete_success' }),
            MESSAGE_DISPLAY_SECONDS.SUCCESS,
            () => {
              setForceUpdate((prv) => prv + 1);
            },
          );
        } else {
          message.error(
            intl.formatMessage({ id: 'pages.customer_buy_rent.delete_failed' }),
            MESSAGE_DISPLAY_SECONDS.ERROR,
          );
        }
      } else {
        message.success(
          intl.formatMessage({ id: 'pages.customer_buy_rent.delete_success' }),
          MESSAGE_DISPLAY_SECONDS.SUCCESS,
          () => {
            const dataSourceNew = dataSource?.filter((item: any) => item.id !== rowId) || [];
            setForceUpdate((prv) => prv + 1);
            setDataSource(dataSourceNew);
          },
        );
      }
    },
  };
  const columns: ProColumns<Customer.Deal>[] = [
    {
      dataIndex: 'created_at',
      title: intl.formatMessage({ id: 'global.created_date' }),
      editable: false,
      sorter: true,
      render: (dom) => {
        return formatDateTime(`${dom}`);
      },
    },
    {
      dataIndex: 'uses',
      title: intl.formatMessage({ id: 'pages.customer_buy_rent.uses' }),
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'form.enter_data' }),
      },
      className: 'column-wrap',
      render: (dom) => {
        return dom;
      },
      formItemProps: {
        hasFeedback: false,
        rules: [
          {
            required: true,
            message: intl.formatMessage({ id: 'form.enter_info' }),
          },
          { max: 250, message: intl.formatMessage({ id: 'form.over_length' }) },
        ],
      },
      renderFormItem: (value1, { recordKey, record }) => {
        const optionsStorage =
          JSON.parse(JSON.stringify(localStorage.getItem('options-demand'))) || [];

        return (
          <AutoComplete
            options={
              !_.isEmpty(optionsStorage)
                ? JSON.parse(optionsStorage).filter(
                    (item: AutoCompleteDemand) => item.type === type,
                  )
                : []
            }
            allowClear={true}
            onSelect={(value: string | number | LabelInValueType, options: DefaultOptionType) =>
              _func.onSelectUses(value, options, recordKey)
            }
          >
            <Input
              defaultValue={record?.uses}
              suffix={<DownOutlined />}
              placeholder={intl.formatMessage({ id: 'pages.customer_sell_rent.enter_uses' })}
              name={`uses_${recordKey}`}
            />
          </AutoComplete>
        );
      },
    },
    {
      dataIndex: 'price',
      className: 'form-digit',
      title:
        type === 1
          ? intl.formatMessage({ id: 'pages.customer_sell_rent.price' })
          : intl.formatMessage({ id: 'pages.customer_buy_rent.price' }),
      width: 300,
      formItemProps: {
        rules: [
          {
            validator: async (_re: any, value) => {
              const rowkeyId = _re.field.split('.')[0];
              const pattern = CHECK_REAL_ESTATE_PRICE;
              const price_from = formRowRef.getFieldValue(`price_from_${rowkeyId}`);
              const price_to = formRowRef.getFieldValue(`price_to_${rowkeyId}`);

              if (!price_to) {
                formRowRef.setFields([
                  {
                    name: `price_to_${rowkeyId}`,
                    errors: [],
                  },
                ]);
                return Promise.resolve();
              }
              if (price_from && !String(price_from).match(pattern)) {
                formRowRef.setFields([
                  {
                    name: `price_from_${rowkeyId}`,
                    errors: [''],
                  },
                ]);
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'form.field.number_incorrect' })),
                );
              }

              if (price_to && !String(price_to).match(pattern)) {
                formRowRef.setFields([
                  {
                    name: `price_to_${rowkeyId}`,
                    errors: [''],
                  },
                ]);
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'form.field.number_incorrect' })),
                );
              }
              if (Number(price_from) > Number(price_to)) {
                formRowRef.setFields([
                  {
                    name: `price_to_${rowkeyId}`,
                    errors: [''],
                  },
                ]);
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'form.field.number_incorrect' })),
                );
              }
              formRowRef.setFields([
                {
                  name: `price_from_${rowkeyId}`,
                  errors: [],
                },
              ]);
              formRowRef.setFields([
                {
                  name: `price_to_${rowkeyId}`,
                  errors: [],
                },
              ]);
              return Promise.resolve();
            },
          },
        ],
      },
      renderFormItem: (dom, { recordKey, record }) => {
        const priceFrom = record?.price_from && record?.price_from;
        const priceTo = record?.price_to && record?.price_to;
        return (
          <Space size={12} className="custom-form-range">
            <ProFormDigit
              name={`price_from_${recordKey}`}
              placeholder={intl.formatMessage({ id: 'global.from' })}
              label={intl.formatMessage({ id: 'global.from' })}
              initialValue={priceFrom}
              fieldProps={{
                onChange: (value) => {
                  editableFormRef.current?.setRowData?.(`${recordKey}`, { price_from: value });
                },
                formatter: (value) => formaterRealEstatePrice(value),
              }}
            />{' '}
            <ProFormDigit
              name={`price_to_${recordKey}`}
              placeholder={intl.formatMessage({ id: 'global.to' })}
              label={intl.formatMessage({ id: 'global.to' })}
              initialValue={priceTo}
              fieldProps={{
                onChange: (value) => {
                  editableFormRef.current?.setRowData?.(`${recordKey}`, { price_to: value });
                },
                formatter: (value) => formaterRealEstatePrice(value),
              }}
            />
          </Space>
        );
      },
      render: (dom, record) => {
        const priceFrom = record?.price_from && record?.price_from;
        const priceTo = record?.price_to && record?.price_to;
        return (
          <Space size={24} className="table-price-range">
            <div className="item">
              <span className="item__label">{intl.formatMessage({ id: 'global.from' })}</span>{' '}
              {priceFrom && formaterRealEstatePrice(priceFrom)}
            </div>
            <div className="item">
              <span className="item__label">{intl.formatMessage({ id: 'global.to' })}</span>{' '}
              {priceTo && formaterRealEstatePrice(priceTo)}
            </div>
          </Space>
        );
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_buy_rent.province' }),
      dataIndex: 'province_city_id',
      valueType: 'select',
      width: 200,
      render: (dom) => {
        return (
          <Typography.Text
            ellipsis={{ tooltip: dom }}
            style={{
              width: 200,
            }}
          >
            {dom}
          </Typography.Text>
        );
      },
      formItemProps: {
        hasFeedback: false,
        rules: [
          {
            required: true,
            message: intl.formatMessage({ id: 'form.enter_info' }),
          },
        ],
      },
      fieldProps: (_form, { rowKey }) => {
        return {
          showSearch: true,
          rules: [{ required: true, message: intl.formatMessage({ id: 'form.enter_info' }) }],
          onChange: (value: number) => {
            formRef.current?.submit();
            if (value) {
              setProvinceId(value);
            }
            if (rowKey) {
              editableFormRef.current?.setRowData?.(rowKey[0], {
                district_title: undefined,
                districts_id: undefined,
              });
            }
          },
        };
      },
      request: async () => {
        const provinceCity = await getProvinceList();
        return provinceCity;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.customer_buy_rent.district' }),
      dataIndex: 'district_title',
      dependencies: ['province_city_id'],
      valueType: 'select',
      width: 200,
      render: (dom) => {
        return (
          <Typography.Text
            ellipsis={{ tooltip: dom }}
            style={{
              width: 200,
            }}
          >
            {dom}
          </Typography.Text>
        );
      },
      fieldProps: (_form, { rowKey }) => ({
        showSearch: true,
        options: districtList,
        onSelect: (value: any, options: DefaultOptionType) => {
          if (value && rowKey) {
            const districts_id =
              !_.isNull(options?.value) && !!options?.value ? Number(options?.value) : undefined;
            editableFormRef.current?.setRowData?.(`${rowKey}`, {
              districts_id: districts_id,
              district_title: options?.label,
            });
          }
        },
      }),
      formItemProps: {
        hasFeedback: false,
        rules: [
          {
            required: true,
            message: intl.formatMessage({ id: 'form.enter_info' }),
          },
        ],
      },
    },
    {
      dataIndex: 'note',
      title: intl.formatMessage({ id: 'pages.customer_buy_rent.note' }),
      className: 'column-wrap',
      fieldProps: {
        showSearch: true,
        placeholder: intl.formatMessage({ id: 'form.enter_data' }),
      },
      formItemProps: {
        hasFeedback: false,
        rules: [{ max: 250, message: intl.formatMessage({ id: 'form.over_length' }) }],
      },
      render: (dom) => {
        return dom;
      },
    },
    {
      title: intl.formatMessage({ id: 'global.action' }),
      key: 'option',
      valueType: 'option',
      render: (text, record, _, action) => {
        return [
          <a
            key="editable"
            onClick={() => {
              const { province_city_id } = record;
              if (province_city_id && province_city_id !== provinceId) {
                setProvinceId(province_city_id);
              }
              setIsVisibleConfirm(true);
              action?.startEditable?.(record.id);
            }}
            className="table-action-link"
          >
            Chỉnh sửa
          </a>,
          <a
            href="#"
            key="delete"
            className="table-action-link"
            onClick={() => {
              confirm(
                intl.formatMessage({ id: 'pages.customer_buy_rent.confirm_title_delete' }),
                intl.formatMessage({ id: 'pages.customer_buy_rent.confirm_info_delete' }),
                () => {
                  _func.onDeleteDemand(record.id);
                },
                () => {},
              );
            }}
          >
            Xoá
          </a>,
        ];
      },
      fieldProps: {
        placeholder: intl.formatMessage({ id: 'form.enter_data' }),
      },
    },
  ];

  return (
    <ProCard
      title={title}
      ghost
      collapsible
      defaultCollapsed={defaultCollapsed}
      className={Styles.collapsedBuyRent}
      collapsibleIconRender={({ collapsed }) => {
        if (collapsed) {
          return (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z"
                fill="black"
              />
            </svg>
          );
        }
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
              fill="black"
            />
          </svg>
        );
      }}
    >
      <EditableProTable
        rowKey={'id'}
        dataSource={dataSource}
        params={{ forceUpdate }}
        columns={columns}
        formRef={formRef}
        request={async (params, sorter) => {
          if (id) {
            const { current = 0, pageSize = 10 } = params;
            const offset = pageSize * current - pageSize;
            const {
              list: dataDemandBuy,
              count,
              keyResponse,
            } = await customerServices.getDemandBuyRentByCustomerId(id, {
              offset: offset,
              limit: pageSize,
              type: type,
              sorter: sorter,
              branch_id: workspace_id,
            });

            if (keyResponse) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }
            return {
              data: dataDemandBuy,
              total: count,
            };
          }
          return {
            data: dataSource,
            total: 0,
          };
        }}
        onChange={setDataSource}
        form={{ ignoreRules: false }}
        className={Styles.customerEditable}
        recordCreatorProps={{
          record: () => {
            return { created_at: dayjs().format(), id: uuidv4(), type: type };
          },
          onClick: () => {
            setIsVisibleConfirm(true);
          },
          creatorButtonText: 'Thêm nhu cầu',
        }}
        editableFormRef={editableFormRef}
        pagination={{
          size: 'default',
          pageSizeOptions: [10, 25, 50, 100],
          showSizeChanger: true,
          defaultPageSize: 10,
          showTotal: (total: number, range: any) => {
            return `Hiển thị ${range[0]}-${range[1]} trên ${total?.toLocaleString()} dòng`;
          },
        }}
        editable={{
          form: formRowRef,
          saveText: <span className="table-action-link">{id ? 'Lưu' : 'Tạo'}</span>,
          cancelText: <span className="table-action-link">Huỷ</span>,
          deleteText: <span className="table-action-link">Xoá</span>,
          deletePopconfirmMessage: 'Xoá nhu cầu',
          onlyAddOneLineAlertMessage: 'Chỉ được thêm mỗi lần một hàng',
          onlyOneLineEditorAlertMessage: 'Chỉ được chỉnh sửa mỗi lần một hàng',
          actionRender: (row, config, defaultDom: any) => {
            return [
              <div
                ref={saveRef}
                onClick={(e: any) => {
                  const saveButton = e.target.querySelector('a');
                  saveButton.click();
                }}
              >
                {defaultDom.save}
              </div>,
              defaultDom.delete,
              defaultDom.cancel,
            ];
          },
          onSave: async (recordKey, dataSourceRow, originRow) => {
            let dataSourceNew = dataSource?.map((item) => {
              if (item.id === recordKey) {
                return { ...originRow, ...dataSourceRow };
              }
              return item;
            });

            if (dataSourceNew) {
              setDataSource([...dataSourceNew]);
            }
            if (id) {
              const rowNew = {
                ...originRow,
                ...dataSourceRow,
              };

              const {
                type,
                districts_id,
                price_to,
                price_from,
                note,
                uses,
                id: demand_id,
                province_city_id,
              } = rowNew;
              const response = await customerServices.updateCustomerDemand({
                type,
                districts_id: districts_id,
                price_to,
                price_from,
                note,
                uses,
                customer_id: id,
                id: demand_id,
                province_city_id,
                branch_id: workspace_id,
              });
              if (response?.keyResponse) {
                handleResponseFromCallApi({ response: response?.keyResponse });
                return;
              }

              if (response?.data) {
                message.success(
                  rowNew.status
                    ? intl.formatMessage({ id: 'pages.customer_buy_rent.demand.edit_success' })
                    : intl.formatMessage({ id: 'pages.customer_buy_rent.demand.create_success' }),
                  MESSAGE_DISPLAY_SECONDS.SUCCESS,
                  () => {
                    setForceUpdate((prv) => prv + 1);
                    setIsVisibleConfirm(false);
                  },
                );
              } else {
                message.error(
                  rowNew.status
                    ? intl.formatMessage({ id: 'pages.customer_buy_rent.demand.edit_failed' })
                    : intl.formatMessage({ id: 'pages.customer_buy_rent.demand.create_failed' }),
                  MESSAGE_DISPLAY_SECONDS.ERROR,
                );
              }
            }
            const useNew = dataSourceRow.uses;
            if (useNew) {
              let optionsStorageNew = [];
              const optionsStorage = JSON.parse(
                JSON.stringify(localStorage.getItem('options-demand')),
              );
              if (optionsStorage && optionsStorage.length > 0) {
                const newOptionsStorage = JSON.parse(optionsStorage);
                optionsStorageNew = newOptionsStorage.find((item: any) => item.value.match(useNew))
                  ? newOptionsStorage
                  : [
                      ...newOptionsStorage,
                      {
                        label: useNew,
                        value: useNew,
                        type: type,
                      },
                    ];
              } else {
                optionsStorageNew = [
                  {
                    label: useNew,
                    value: useNew,
                    type: type,
                  },
                ];
              }
              localStorage.setItem('options-demand', JSON.stringify(optionsStorageNew));
            }
          },
          onDelete: async (recordKey, row) => {
            if (row.status) {
              _func.onDeleteDemand(row.id);
            } else {
              dataSource && setDataSource(dataSource?.filter((item) => item.id !== recordKey));
            }
          },
        }}
      ></EditableProTable>
    </ProCard>
  );
}
