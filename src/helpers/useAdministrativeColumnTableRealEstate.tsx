import {ProColumns} from '@ant-design/pro-table';
import {ProFormInstance} from '@ant-design/pro-form';
import {useIntl, useLocation, useModel} from 'umi';
import {MutableRefObject} from 'react';
import {Tooltip} from 'antd';
import {provinceService} from '@/services/provinceService';
import {districtService} from '@/services/districtService';
import {streetService} from '@/services/streetService';
import {wardService} from '@/services/wardService';
import {RequestOptionsType} from '@ant-design/pro-utils';
import {formatDate} from '@/utils';

import {Typography} from 'antd';
import _ from 'lodash';

interface TableRef extends ProFormInstance {
  reloadTable: () => void;
  submitFormSearch: () => void;
}

const useAdministrativeColumnTableRealEstate = (
  actionRef: MutableRefObject<TableRef | undefined>,
  getDetail: (id: string) => {},
  defaultFilter: string | null
) => {
  const currentLocation = useLocation();
  const filterDefault = !_.isUndefined(defaultFilter) && !_.isEmpty(defaultFilter)  ? defaultFilter : {};
  const intl = useIntl();
  const {initialState} = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const administrativeColumn: ProColumns[] = [
    {
      title: intl.formatMessage({id: 'pages.real_estate_sale.address'}),
      editable: false,
      dataIndex: 'address',
      hideInSearch: true,
      width: 240,
      render: (dom, entity) => {
        const createdDate = formatDate(entity.created_date);
        let today: Date = new Date();
        const todayDate = formatDate(`${today}`);
        const aa = createdDate?.split('/').reverse().join();
        const bb = todayDate?.split('/').reverse().join();
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              width: 240,
            }}
          >
            {entity.real_estate_status ? (
              ''
            ) : (
              <Tooltip title="Bất động sản đã bị trùng">
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginRight: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 7C12.5523 7 13 7.44772 13 8V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V8C11 7.44772 11.4477 7 12 7ZM11 16C11 15.4477 11.4477 15 12 15H12.01C12.5623 15 13.01 15.4477 13.01 16C13.01 16.5523 12.5623 17 12.01 17H12C11.4477 17 11 16.5523 11 16Z"
                      fill="#FAAD14"
                    />
                  </svg>
                </span>
              </Tooltip>
            )}

            <Tooltip placement="topLeft" title={dom}>
              <Typography.Link
                onClick={() => getDetail(entity.id)}
                ellipsis={true}
                style={{
                  width: 240,
                  paddingTop: '4px',
                }}
              >
                {aa === bb ? (
                  <span
                    style={{
                      marginRight: '4px',
                      position: 'relative',
                      display: 'inline-block',
                      transform: 'translateY(16%)',
                    }}
                  >
                    <svg
                      width="42"
                      height="20"
                      viewBox="0 0 42 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 18V2C0 0.895431 0.895431 0 2 0H35.5411C36.2844 0 36.9664 0.412218 37.3119 1.07033L41.5119 9.07033C41.8175 9.65244 41.8175 10.3476 41.5119 10.9297L37.3119 18.9297C36.9664 19.5878 36.2844 20 35.5411 20H2C0.89543 20 0 19.1046 0 18Z"
                        fill="url(#paint0_linear_1964_1407)"
                      />
                      <path
                        d="M12.4308 11.3L8.47078 5.6H7.39078V14H8.77078V8.3L12.7308 14H13.8108V5.6H12.4308V11.3ZM16.8684 10.412H20.2284V9.104H16.8684V6.92H20.5284V5.6H15.4884V14H20.5884V12.68H16.8684V10.412ZM25.2237 14L27.0117 7.868L28.7877 14H30.3837L32.7597 5.6H31.3077L29.5437 12.164L27.6477 5.6H26.3757L24.4677 12.164L22.7037 5.6H21.2517L23.6277 14H25.2237Z"
                        fill="white"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_1964_1407"
                          x1="1.00962"
                          y1="23.4615"
                          x2="38.4522"
                          y2="26.221"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#FE7C22"/>
                          <stop offset="1" stop-color="#FFE134"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                ) : (
                  ''
                )}{' '}
                {dom}
              </Typography.Link>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: intl.formatMessage({id: 'pages.administrative.street.form.title'}),
      dataIndex: 'street',
      valueType: 'select',
      // initialValue: filterDefault?.street,
      initialValue: _.isUndefined(filterDefault?.street) ? [] : filterDefault?.street,
      editable: false,
      order: 6,
      fieldProps: {
        showSearch: true,
        showArrow: true,
        maxTagCount: 'responsive',
        mode: 'multiple',
        autoClearSearchValue: true,
        placeholder: intl.formatMessage({id: 'global.all'}),
        onChange: () => {
          actionRef.current?.submitFormSearch();
        },
      },
      dependencies: ['district'],
      request: async ({keyWords, district}) => {
        let listStreet: RequestOptionsType[] | PromiseLike<RequestOptionsType[]> = [];

        if (!_.isUndefined(district) && !_.isEmpty(district)) {
          listStreet = await streetService.getStreetListSelect({
            limit: 20,
            district_id: district,
            search: keyWords,
          });
        }
        return listStreet;
      },
    },
    {
      title: intl.formatMessage({id: 'pages.administrative.ward.form.title'}),
      dataIndex: 'ward',
      initialValue: _.isUndefined(filterDefault?.ward) ? [] : filterDefault?.ward,
      order: 7,
      editable: false,
      dependencies: ['district'],
      render: (dom) => {
        return (
          <Typography.Text
            ellipsis={{tooltip: dom}}
            style={{
              width: 200,
            }}
          >
            {dom}
          </Typography.Text>
        );
      },
      fieldProps: {
        showSearch: true,
        showArrow: true,
        mode: 'multiple',
        autoClearSearchValue: true,
        placeholder: intl.formatMessage({id: 'global.all'}),
        maxTagCount: 'responsive',
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
        },
      },
      request: async ({district, keyWords}) => {
        let listWard: RequestOptionsType[] | PromiseLike<RequestOptionsType[]> = [];
        if (!_.isUndefined(district) && !_.isEmpty(district)) {
          listWard = await wardService.getWardListSelect(
            {
              limit: 500,
              district_id: district,
              search: keyWords,
            },
            true,
          );
        }
        return listWard;
      },
    },
    {
      title: intl.formatMessage({id: 'pages.administrative.district.form.title'}),
      dataIndex: 'district',
      valueType: 'select',
      initialValue: _.isUndefined(filterDefault?.district) ? [] : filterDefault?.district,
      editable: false,
      order: 8,
      dependencies: ['province'],
      render: (dom) => {
        return (
          <Typography.Text
            ellipsis={{tooltip: dom}}
            style={{
              width: 200,
            }}
          >
            {dom}
          </Typography.Text>
        );
      },
      fieldProps: {
        showSearch: true,
        showArrow: true,
        mode: 'multiple',
        autoClearSearchValue: true,
        maxTagCount: 'responsive',
        placeholder: intl.formatMessage({id: 'global.all'}),
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
          actionRef.current?.setFieldsValue({street: undefined});
          actionRef.current?.setFieldsValue({ward: undefined});
        },
      },
      request: async ({province, keyWords}) => {
        let listDistrict: RequestOptionsType[] | PromiseLike<RequestOptionsType[]> = [];

        if (!_.isUndefined(province)) {
          let dataFilter: any = {ids: undefined};
          if (currentUser?.province_city_id) {
            dataFilter.ids = currentUser?.district_id;
          }
          listDistrict = await districtService.getDistrictListSelect(
            {
              limit: 500,
              province_id: province,
              search: keyWords,
              ...dataFilter,
            },
            true,
          );
        }
        return listDistrict;
      },
    },
    {
      dataIndex: 'province',
      title: intl.formatMessage({
        id: 'pages.administrative.province.form.title',
      }),
      valueType: 'select',
      hideInTable: true,
      order: 9,
      initialValue: _.isUndefined(filterDefault?.province) ? null : filterDefault?.province,
      render: (dom) => {
        return (
          <Typography.Text
            ellipsis={{tooltip: dom}}
            style={{
              width: 240,
            }}
          >
            {dom}
          </Typography.Text>
        );
      },
      fieldProps: {
        showSearch: true,
        placeholder: intl.formatMessage({
          id: 'global.all',
        }),
        onChange: (value: any) => {
          actionRef.current?.submitFormSearch();
          actionRef.current?.setFieldsValue({street: undefined});
          actionRef.current?.setFieldsValue({district: undefined});
          actionRef.current?.setFieldsValue({ward: undefined});
        },
      },
      request: async ({keyWords}) => {
        let dataFilter: any = {
          ids: undefined,
        };
        if (currentUser?.province_city_id) {
          dataFilter.ids = [currentUser?.province_city_id];
        }
        const listProvince = await provinceService.getProvinceListSelect({
          limit: 500,
          search: keyWords,
          ...dataFilter,
        });
        return listProvince;
      },
    },
  ];
  return administrativeColumn;
};

export default useAdministrativeColumnTableRealEstate;
