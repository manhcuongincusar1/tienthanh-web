import React, { useEffect, useRef, useState } from 'react';
import CustomProTableLayout from '@/components/Custom/CustomProTableLayout';
import { ProColumns } from '@ant-design/pro-table';
import ProForm, { ProFormCheckbox, ProFormInstance } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { realEstateService } from '@/services/realEstateService';
import { realEstateRentService } from '@/services/realEstateRentService';
import { Button, message, Tag } from 'antd';
import { TagRender } from '../components/TagRender';
import _ from 'lodash';
import { history } from '@@/core/history';
import { REAL_ESTATE_TYPE_ENUM } from '../constants';
import RealEstateFormModal from '@/pages/real_estate/components/formModal';
import itemRender from '@/helpers/breadcrumbHelper';
import { realEstateStatusService } from '@/services/realEstateStatusService';
import { useAccess, useModel, useIntl, useLocation } from 'umi';
import { TableRef } from '@/pages/types';
import { CHECK_REAL_ESTATE_PRICE } from '@/pages/expression';
import PopupConfirmConvertRealEstateToDuplicate from '../components/PopupConfirmConvertMultipleRealEstateToDuplicate';
import PopupConfirmDeleteMultipleRealEstate from '../components/PopupConfirmDeleteMultipleRealEstate';
import useAdministrativeColumnTableRealEstate from '@/helpers/useAdministrativeColumnTableRealEstate';
import useDetailColumnTableRealEstate from '@/helpers/useDetailColumnTableRealEstate';
import useFilterColumnTableRealEstate from '@/helpers/useFilterColumnTableRealEstate';
import ModalAssignMultipleRealEstate from '../components/ModalAssignMultipleRealEstate';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

const RealEstateSaleList: React.FC = () => {
  const actionRef = useRef<TableRef>();
  // const storageRent = localStorage.getItem('real-estate-rent');
  // const filterDefault = !_.isUndefined(storageRent) ? JSON.parse(storageRent) : {};
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [defaultData, setDefaultData] = useState<API.RealEstateResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formEmptyRef = useRef<ProFormInstance>();

  const { initialState } = useModel('@@initialState');
  const { getSetting, settingSystem } = useModel('setting');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const { forceUpdateGridLayout, setTableClear } = useModel('globalTable');
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const [realEstateListToAssign, setRealEstateListToAssign] = useState<
    RealEstate.RealEstateListToAssignList | []
  >([]);
  const [realEstateListToConvertDuplicate, setRealEstateListToConvertDuplicate] = useState<
    string[] | []
  >([]);
  const { handleChangePage, handleRealEstateStatus, typePage } = useModel('realEstateSell');
  const [realStatusDefault, setRealStatusDefault] = useState<string | undefined>(undefined);
  const [resetTable, setResetTable] = useState<boolean>(false);
  const access = useAccess();
  const { pathname } = history.location;
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const currentUser = initialState?.currentUser;
  const workspace_id = getWorkspaceId(initialState);
  const [realEstateListToDelete, setRealEstateListToDelete] = useState<string[] | []>([]);
  const intl = useIntl();
  const editDataRef = React.useRef() as React.MutableRefObject<
    React.ElementRef<typeof RealEstateFormModal>
  >;

  useEffect(() => {
    getSetting(workspace_id);
    handleRealEstateStatus(REAL_ESTATE_TYPE_ENUM.RENT);
    const unlisten = history.listen((location) => {
      const { query } = location;
      const myFilter =
        _.isEmpty(location?.query) || _.isUndefined(location?.query?.queryFilter)
          ? {}
          : JSON.parse(location?.query?.queryFilter);
      actionRef.current?.setFieldsValue({
        location: myFilter?.location,
        direction: myFilter?.direction,
        creator: myFilter?.creator,
        category: myFilter?.category,
        price: myFilter?.price,
        from_price: myFilter?.from_price,
        to_price: myFilter?.to_price,
        mySubscribe: myFilter?.mySubscribe,
        myRecord: myFilter?.myRecord,
        province: myFilter?.province,
        district: _.isUndefined(myFilter?.district) ? [] : myFilter?.district,
        ward: myFilter?.ward,
        street: myFilter?.street,
        real_estate_status: myFilter?.real_estate_status,
      });
      if (_.isEmpty(location?.query)) {
        actionRef.current?.reloadTable();
      }
    });
    return () => {
      // Clean up the history listener
      unlisten();
    };
  }, []);

  useEffect(() => {
    handleChangePage(pathname);
  }, [pathname]);

  const currentLocation = useLocation();

  let defaultTableQuery = _.isEmpty(currentLocation?.query)
    ? {}
    : _.isUndefined(currentLocation?.query?.queryFilter) ||
      _.isEmpty(currentLocation?.query?.queryFilter)
    ? {}
    : JSON.parse(currentLocation?.query?.queryFilter);
  const _func = {
      afterSubmit: () => {
        actionRef.current?.reloadTable();
      },
      generateDataFilterRealEstate: (params: any) => {
        const {
          keyword,
          real_estate_status,
          category,
          creator,
          province,
          district,
          ward,
          street,
          myRecord,
          mySubscribe,
          location,
          direction,
          realStatusDefault,
          to_price,
          from_price,
        } = params;
        let dataFilter = {
          keyword,
          realEstateStatus: real_estate_status || realStatusDefault,
          categoryId: _.isUndefined(defaultTableQuery?.category)
            ? _.isEmpty(defaultTableQuery?.category)
              ? category
              : []
            : _.isEmpty(defaultTableQuery?.category)
            ? category
            : defaultTableQuery?.category,
          creator: _.isUndefined(defaultTableQuery?.creator)
            ? _.isEmpty(defaultTableQuery?.creator)
              ? creator
              : []
            : _.isEmpty(defaultTableQuery?.creator)
            ? creator
            : defaultTableQuery?.creator,
          province: _.isUndefined(defaultTableQuery?.province)
            ? _.isEmpty(defaultTableQuery?.province)
              ? province
              : null
            : _.isEmpty(defaultTableQuery?.province)
            ? province
            : defaultTableQuery?.province,
          district: _.isUndefined(defaultTableQuery?.district)
            ? _.isEmpty(defaultTableQuery?.district)
              ? district
              : []
            : _.isEmpty(defaultTableQuery?.district)
            ? district
            : defaultTableQuery?.district,
          ward: _.isUndefined(defaultTableQuery?.ward)
            ? _.isEmpty(defaultTableQuery?.ward)
              ? ward
              : []
            : _.isEmpty(defaultTableQuery?.ward)
            ? ward
            : defaultTableQuery?.ward,
          street: _.isUndefined(defaultTableQuery?.street)
            ? _.isEmpty(defaultTableQuery?.street)
              ? street
              : []
            : _.isEmpty(defaultTableQuery?.street)
            ? street
            : defaultTableQuery?.street,
          location: _.isUndefined(defaultTableQuery?.location)
            ? _.isEmpty(defaultTableQuery?.location)
              ? params.location
              : []
            : _.isEmpty(defaultTableQuery?.location)
            ? params.location
            : defaultTableQuery?.location,
          direction: _.isUndefined(defaultTableQuery?.direction)
            ? _.isEmpty(defaultTableQuery?.direction)
              ? direction
              : []
            : _.isEmpty(defaultTableQuery?.direction)
            ? direction
            : defaultTableQuery?.direction,
          mySubscribe: _.isUndefined(defaultTableQuery?.mySubscribe)
            ? _.isEmpty(defaultTableQuery?.mySubscribe)
              ? mySubscribe
              : []
            : _.isEmpty(defaultTableQuery?.mySubscribe)
            ? mySubscribe
            : defaultTableQuery?.mySubscribe,
          myRecord: _.isUndefined(defaultTableQuery?.myRecord)
            ? _.isEmpty(defaultTableQuery?.myRecord)
              ? myRecord
              : []
            : _.isEmpty(defaultTableQuery?.myRecord)
            ? myRecord
            : defaultTableQuery?.myRecord,
          branch_id: workspace_id,
          to_price: _.isUndefined(defaultTableQuery?.to_price)
            ? _.isEmpty(defaultTableQuery?.to_price)
              ? to_price
              : undefined
            : _.isEmpty(defaultTableQuery?.to_price)
            ? to_price
            : defaultTableQuery?.to_price,
          from_price: _.isUndefined(defaultTableQuery?.from_price)
            ? _.isEmpty(defaultTableQuery?.from_price)
              ? from_price
              : undefined
            : _.isEmpty(defaultTableQuery?.from_price)
            ? from_price
            : defaultTableQuery?.from_price,
        };

        if (!_.isEmpty(mySubscribe)) {
          dataFilter.mySubscribe = mySubscribe[0];
        }
        if (!_.isEmpty(myRecord)) {
          dataFilter.myRecord = myRecord[0];
        }
        return dataFilter;
      },
      handleDeleteRealEstateSuccess: () => {
        setForceUpdate((prv) => prv + 1);
      },
      handleRefreshPage: () => {
        setSelectedRowKeys([]);
        setForceUpdate((prv) => prv + 1);
      },
    },
    _bindEvent = {
      getDetail: async (id: string | number) => {
        const data: any = await realEstateRentService.getRealEstateById(id, workspace_id);
        if (data?.keyResponse) {
          setForceUpdate((prv) => prv + 1);
          if (data?.keyResponse === 'notfound') {
            message.error(
              intl.formatMessage({ id: 'pages.real_estate_sale.deleted' }),
              MESSAGE_DISPLAY_SECONDS.ERROR,
            );
          }
          return false;
        }

        const dataDefault = data as API.RealEstateResponse;
        setDefaultData({
          ...dataDefault,
        });
        editDataRef.current.openModal();
      },
      onClickExport: async () => {
        const isEmptyData = formEmptyRef.current?.getFieldValue('is_empty_data');

        if (isEmptyData) {
          message.error(
            'Dữ liệu cần export bị trống. Vui lòng kiểm tra lại',
            MESSAGE_DISPLAY_SECONDS.ERROR,
          );
        } else {
          setIsLoading(true);
          let params = actionRef.current?.getFieldsValue();
          const dataKeyword: any = actionRef.current?.getSearchParams();
          params.real_estate_id = selectedRowKeys;
          const { real_estate_id } = params;
          const dataFilter = _func.generateDataFilterRealEstate({
            ...params,
            keyword: dataKeyword?.keyword,
          });

          const { data, keyResponse } = await realEstateService.requestExportFile({
            ...dataFilter,
            real_estate_id: real_estate_id,
            type: REAL_ESTATE_TYPE_ENUM.RENT,
            branch_id: workspace_id,
          });

          if (keyResponse) {
            handleResponseFromCallApi({ response: keyResponse });
            setIsLoading(false);
            return {};
          }
          if (data) {
            message.success(
              intl.formatMessage({ id: 'pages.new_real_estate.export_request.success' }),
              MESSAGE_DISPLAY_SECONDS.SUCCESS + 1,
              () => {
                setIsLoading(false);
              },
            );
          }
        }
      },
    };

  const administrativeColumn = useAdministrativeColumnTableRealEstate(
    actionRef,
    _bindEvent.getDetail,
    defaultTableQuery,
  );

  const detailColumn = useDetailColumnTableRealEstate(
    actionRef,
    _bindEvent.getDetail,
    'real_estate_rent',
    realEstateRentService,
  );

  const filterColumn = useFilterColumnTableRealEstate(
    'real_estate_rent',
    actionRef,
    defaultTableQuery,
    {
      permission_to_price: currentUser?.prices?.rent_price_to,
      permission_from_price: currentUser?.prices.rent_price_from,
      regex_check_price: CHECK_REAL_ESTATE_PRICE,
    },
  );

  const columns: ProColumns[] = [
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.code_table' }),
      dataIndex: 'code',
      valueType: 'text',
      editable: false,
      hideInSearch: true,
    },
    ...administrativeColumn,
    ...detailColumn,
    {
      title: intl.formatMessage({ id: 'pages.real_estate_sale.real_estate_status' }),
      dataIndex: 'real_estate_status',
      valueType: 'select',
      initialValue: _.isUndefined(defaultTableQuery?.real_estate_status)
        ? []
        : defaultTableQuery?.real_estate_status,
      hideInTable: true,
      editable: false,
      fieldProps: {
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
        tagRender: (props) => {
          return TagRender(props);
        },
        mode: 'multiple',
        maxTagCount: 'responsive',
        showArrow: true,
        showSearch: true,
        placeholder: intl.formatMessage({ id: 'global.all' }),
        optionItemRender: (dom) => {
          return <Tag color={dom.color}>{dom.label}</Tag>;
        },
      },
      request: async ({ keyWords }) => {
        const response =
          (await realEstateStatusService.getListRealEstateStatus({
            type: REAL_ESTATE_TYPE_ENUM.RENT,
          })) || undefined;
        const data = response?.data || [];
        const newData = data.map((item: API.RealEstateStatusResponse) => ({
          value: item.id,
          label: item.title,
          color: item.color,
          is_default: item.is_default,
        }));

        const defaultStatuss = newData?.find(
          (item: API.RealEstateStatusResponse) => item.is_default,
        )?.value;
        setRealStatusDefault(defaultStatuss);
        if (_.isUndefined(defaultTableQuery?.real_estate_status)) {
          actionRef.current?.setFieldsValue({
            real_estate_status: [defaultStatuss],
          });
          actionRef.current?.submitFormSearch();
        }
        return newData;
      },
      order: 4,
    },
    ...filterColumn,
  ];

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.real_estate_rent.list' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.real_estate_rent.list' }),
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
            layout: true,
            setting: true,
            reload: true,
            // upload: false,
            upload: access?.realEstateRentImport && {
              type: REAL_ESTATE_TYPE_ENUM.RENT,
              setting: settingSystem?.import_size,
            },
          },
          tooltip: intl.formatMessage({ id: 'pages.real_estate_rent.tooltip.search' }),
        }}
        tableKey={'real-estate-rent'}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys: React.Key[], recordList: any) => {
            setRealEstateListToAssign(recordList);
            recordList &&
              setRealEstateListToConvertDuplicate(
                recordList?.map((item: any) => {
                  if (item?.real_estate_status_id) {
                    return item?.id;
                  }
                  return '';
                }),
              );
            recordList &&
              setRealEstateListToDelete(
                recordList?.map((item: any) => {
                  return item?.id;
                }),
              );
            setSelectedRowKeys(newSelectedRowKeys);
          },
        }}
        table={{
          columns: [...columns],
          form: {
            ignoreRules: false,
          },
          params: { forceUpdate, forceUpdateGridLayout },
          tableAlertOptionRender: ({ onCleanSelected }) => {
            return (
              <div>
                <ModalAssignMultipleRealEstate
                  realEstateListToAssign={realEstateListToAssign}
                  handleRefreshPage={_func.handleRefreshPage}
                  hidden={!access?.realEstateRentAssign}
                  localePage={typePage?.locale || 'real_estate_sale'}
                  realEstateService={realEstateRentService}
                />
                <PopupConfirmConvertRealEstateToDuplicate
                  realEstateList={realEstateListToConvertDuplicate}
                  hidden={!access.realEstateRentDuplicate}
                  handleRefreshPage={_func.handleRefreshPage}
                  localePage={typePage?.locale || 'real_estate_rent'}
                  realEstateService={realEstateRentService}
                />
                <PopupConfirmDeleteMultipleRealEstate
                  realEstateList={realEstateListToDelete}
                  hidden={!access.realEstateRentDelete}
                  handleRefreshPage={_func.handleRefreshPage}
                  localePage={typePage?.locale || 'real_estate_rent'}
                  realEstateService={realEstateRentService}
                />
                <Button shape="circle" onClick={onCleanSelected}>
                  Bỏ chọn
                </Button>
              </div>
            );
          },
          rowClassName: (record, index) => {
            return record.real_estate_status ? '' : 'tr-hightlight';
          },
          search: {
            optionRender: (searchConfig, formProps, dom) => {
              return [
                <Button
                  key="reset"
                  shape="circle"
                  onClick={() => {
                    actionRef.current?.resetFieldsValue();
                    formProps?.form?.setFieldsValue({
                      province: null,
                      district: [],
                      ward: [],
                      street: [],
                      from_price: null,
                      to_price: null,
                      price: [],
                      location: [],
                      direction: [],
                      category: [],
                      creator: [],
                      real_estate_status: [realStatusDefault],
                      myRecord: [],
                      mySubscribe: [],
                    });
                    localStorage.removeItem(`real-estate-rent`);
                    setTableClear(true);
                    actionRef.current?.submitFormSearch();
                  }}
                >
                  Xoá bộ lọc
                </Button>,
              ];
            },
          },

          request: async (params: any, sort: any) => {
            const { current, pageSize } = params;
            let newDefaultTableQuery = { ...defaultTableQuery };
            if (!_.isEmpty(selectedRowKeys)) {
              setSelectedRowKeys([]);
            }
            newDefaultTableQuery['district'] = !newDefaultTableQuery['district']
              ? []
              : newDefaultTableQuery['district'];
            newDefaultTableQuery['ward'] = !newDefaultTableQuery['ward']
              ? []
              : newDefaultTableQuery['ward'];
            newDefaultTableQuery['street'] = !newDefaultTableQuery['street']
              ? []
              : newDefaultTableQuery['street'];
            newDefaultTableQuery['province'] = !newDefaultTableQuery['province']
              ? null
              : newDefaultTableQuery['province'];
            const dataFilter = _func.generateDataFilterRealEstate({
              ...params,
              ...newDefaultTableQuery,
            });
            const { realEstateStatus } = dataFilter;
            //Nếu chưa có status default thì không gửi request xuống BE
            if (
              _.isUndefined(newDefaultTableQuery.real_estate_status) &&
              _.isEmpty(realEstateStatus) &&
              !realStatusDefault
            )
              return {
                data: [],
                total: 0,
                success: true,
              };
            const offset = pageSize * current - pageSize;

            let newDataFilter = {
              ...dataFilter,
            };

            if (_.isEmpty(defaultTableQuery) && realEstateStatus) {
              newDataFilter = {
                realEstateStatus: dataFilter.realEstateStatus,
                branch_id: dataFilter.branch_id,
              };
            }

            actionRef.current?.setFieldsValue({
              real_estate_status: newDataFilter.realEstateStatus,
            });

            const response = await realEstateRentService.getListRealEstate({
              ...newDataFilter,
              type: REAL_ESTATE_TYPE_ENUM.RENT,
              offset,
              limit: pageSize,
              sort: sort,
            });

            const {
              data: realEstateList,
              total,
              keyResponse,
            } = response as API.ListRealEstateResponse;
            if (keyResponse && workspace_id) {
              handleResponseFromCallApi({ response: keyResponse });
              return {};
            }
            const realEstateId = realEstateList.map((item) => item.id);
            setEditableRowKeys(realEstateId as React.Key[]);
            if (_.isEmpty(realEstateList)) {
              formEmptyRef.current?.setFieldsValue({ is_empty_data: true });
            } else {
              formEmptyRef.current?.setFieldsValue({ is_empty_data: false });
            }

            return {
              data: realEstateList || [],
              success: true,
              total: total,
            };
          },
          rowKey: 'id',
          dateFormatter: 'string',
          toolBarRender: () => {
            return [
              <div
                key="export"
                className="d-none d-md-block"
                hidden={!access?.realEstateRentExport}
              >
                <Button
                  onClick={_bindEvent.onClickExport}
                  type="default"
                  shape="circle"
                  size="small"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.52827 1.52876C7.78862 1.26841 8.21073 1.26841 8.47108 1.52876L11.8044 4.86209C12.0648 5.12244 12.0648 5.54455 11.8044 5.8049C11.5441 6.06525 11.122 6.06525 10.8616 5.8049L8.66634 3.60964V10.0002C8.66634 10.3684 8.36786 10.6668 7.99967 10.6668C7.63148 10.6668 7.33301 10.3684 7.33301 10.0002V3.60964L5.13775 5.8049C4.8774 6.06525 4.45529 6.06525 4.19494 5.8049C3.93459 5.54455 3.93459 5.12244 4.19494 4.86209L7.52827 1.52876ZM1.99967 9.3335C2.36786 9.3335 2.66634 9.63197 2.66634 10.0002V12.6668C2.66634 12.8436 2.73658 13.0132 2.8616 13.1382C2.98663 13.2633 3.1562 13.3335 3.33301 13.3335H12.6663C12.8432 13.3335 13.0127 13.2633 13.1377 13.1382C13.2628 13.0132 13.333 12.8436 13.333 12.6668V10.0002C13.333 9.63197 13.6315 9.3335 13.9997 9.3335C14.3679 9.3335 14.6663 9.63197 14.6663 10.0002V12.6668C14.6663 13.1973 14.4556 13.706 14.0806 14.081C13.7055 14.4561 13.1968 14.6668 12.6663 14.6668H3.33301C2.80257 14.6668 2.29387 14.4561 1.91879 14.081C1.54372 13.706 1.33301 13.1973 1.33301 12.6668V10.0002C1.33301 9.63197 1.63148 9.3335 1.99967 9.3335Z"
                    />
                  </svg>
                  Export
                </Button>
              </div>,
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  history.push('/real-estate-rent/create');
                }}
                hidden={!access.realEstateRentCreate}
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
                {intl.formatHTMLMessage({ id: 'global.create_new' })}
              </Button>,
            ];
          },
          editable: {
            type: 'multiple',
            editableKeys: editableKeys,
            onChange: () => setEditableRowKeys,
          },
        }}
      />
      <ProForm formRef={formEmptyRef} hidden>
        <ProFormCheckbox name="is_empty_data" />
      </ProForm>
      <RealEstateFormModal
        ref={editDataRef}
        tableRef={actionRef}
        linkAnchor={<React.Fragment></React.Fragment>}
        defaultData={defaultData}
        accessiable={access.realEstateRentEdit}
        afterSubmit={_func.afterSubmit}
        title={intl.formatMessage(
          { id: 'pages.real_estate_sale.modal.title' },
          {
            name: !_.isUndefined(defaultData) && defaultData.title,
          },
        )}
      />
    </PageContainer>
  );
};

export default RealEstateSaleList;
