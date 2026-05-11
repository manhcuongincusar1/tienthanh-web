import { ProColumns } from '@ant-design/pro-table';
import { ProFormInstance } from '@ant-design/pro-form';
import { useIntl } from 'umi';
import { useModel } from '@@/plugin-model/useModel';
import { MutableRefObject } from 'react';
import { districtService } from '@/services/districtService';
import { wardService } from '@/services/wardService';

import { Typography } from 'antd';
import _ from 'lodash';
interface TableRef extends ProFormInstance {
  reloadTable: () => void;
  submitFormSearch: () => void;
}
interface OptionItem {
  hideInSearch?: boolean;
  hideInTable?: boolean;
  order?: number;
  mode?: string;
  max?: number;
  onChange?: (value: [] | string | undefined | number) => void;
}
interface Option {
  province?: OptionItem;
  district?: OptionItem;
  ward?: OptionItem;
}
const useAdministrative = (tableRef: MutableRefObject<TableRef | undefined>, option: Option) => {
  const intl = useIntl();
  const { province, district, ward } = option;
  const { getProvinceList } = useModel('administrativeDivision');

  const filterColumns: ProColumns[] = [
    {
      title: intl.formatMessage({ id: 'pages.management.ward_name' }),
      dataIndex: 'ward_title',
      hideInTable: ward && ward.hideInTable && ward.hideInTable,
      hideInSearch: ward && ward.hideInSearch && ward.hideInSearch,
      valueType: 'select',
      dependencies: ['district_title'],
      order: 1,
      width: 200,
      render: (dom) => {
        let domNew: any = dom;
        domNew = {
          ...domNew,
          props: { ...domNew.props, proFieldProps: { ...domNew.proFieldProps, emptyText: '' } },
        };

        return (
          <Typography.Text
            ellipsis={{ tooltip: dom }}
            style={{
              width: 200,
            }}
          >
            {domNew}
          </Typography.Text>
        );
      },
      formItemProps: {
        rules: [
          {
            max: ward?.max ? ward?.max : 11,
            type: 'array',
            message: intl.formatMessage(
              { id: 'pages.management.over_item_select' },
              { max: `${ward?.max ? ward?.max : 10} Phường/Xã` },
            ),
          },
        ],
      },
      fieldProps: {
        mode: ward?.mode,
        maxTagCount: 'responsive',
        autoClearSearchValue: true,
        onChange: (value: number) => {
          if (ward?.onChange) {
            return ward?.onChange(value);
          } else {
            tableRef?.current?.submitFormSearch();
          }
        },
        placeholder: intl.formatMessage({ id: 'global.all' }),
        showSearch: true,
      },
      request: async ({ district_title, keyWords }) => {
        const response =
          district_title || !_.isEmpty(district_title)
            ? await wardService.getWardListSelect(
                {
                  limit: 500,
                  district_id: district_title.length > 0 ? district_title : Number(district_title),
                  search: keyWords,
                },
                true,
              )
            : [];

        return response;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.management.district_name' }),
      dataIndex: 'district_title',
      hideInTable: district && district.hideInTable && district.hideInTable,
      hideInSearch: district && district.hideInSearch && district.hideInSearch,
      valueType: 'select',
      dependencies: ['province_city_title'],
      order: 2,
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
        rules: [
          {
            max: district?.max ? district?.max : 10,
            type: 'array',
            message: intl.formatMessage(
              { id: 'pages.management.over_item_select' },
              { max: `${district?.max ? district?.max : 10} Quận/Huyện` },
            ),
          },
        ],
      },
      fieldProps: {
        mode: district?.mode,
        maxTagCount: 'responsive',
        autoClearSearchValue: true,
        onChange: (value: number | []) => {
          tableRef?.current?.setFieldsValue({ ward_title: undefined });
          if (district?.onChange) {
            return district?.onChange(value);
          } else {
            tableRef?.current?.submitFormSearch();
          }
        },
        placeholder: intl.formatMessage({ id: 'global.all' }),
        showSearch: true,
      },
      request: async ({ province_city_title, keyWords }) => {
        const response =
          province_city_title || !_.isEmpty(province_city_title)
            ? await districtService.getDistrictListSelect(
                {
                  limit: 500,
                  province_id:
                    province_city_title.length > 0
                      ? province_city_title
                      : Number(province_city_title),
                  search: keyWords,
                },
                true,
              )
            : [];

        return response;
      },
    },
    {
      title: intl.formatMessage({ id: 'pages.management.province_city_name' }),
      dataIndex: 'province_city_title',
      hideInTable: province && province.hideInTable && province.hideInTable,
      hideInSearch: province && province.hideInSearch && province.hideInSearch,
      order: 3,
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
      request: async () => {
        const provinceCity = await getProvinceList();
        return provinceCity;
      },
      formItemProps: {
        rules: [
          {
            max: province?.max ? province?.max : 10,
            type: 'array',
            message: intl.formatMessage(
              { id: 'pages.management.over_item_select' },
              { max: `${province?.max ? province?.max : 10} Tỉnh/Thành phố` },
            ),
          },
        ],
      },
      fieldProps: {
        mode: province?.mode,
        autoClearSearchValue: true,
        maxTagCount: 'responsive',
        onChange: (value: number | []) => {
          tableRef?.current?.setFieldsValue({ district_title: undefined });
          tableRef?.current?.setFieldsValue({ ward_title: undefined });

          if (province?.onChange) {
            return province?.onChange(value);
          } else {
            tableRef?.current?.submitFormSearch();
          }
        },
        placeholder: intl.formatMessage({ id: 'global.all' }),
        showSearch: true,
      },
    },
  ];
  return filterColumns;
};

export default useAdministrative;
