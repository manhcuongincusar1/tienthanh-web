import { useEffect } from 'react';
import { Col, Tooltip } from 'antd';
import { administrativeDivision } from '@/api/administrativeDivision';
import { DistrictList, WardList } from '@/pages/types';
import { useIntl, useModel, useParams } from 'umi';
import { ProFormDependency, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { streetService } from '@/services/streetService';
import { CHECK_VALID_STRING } from '@/pages/expression';

export default function FormRealEstateAdministrative() {
  const intl = useIntl();
  const { id } = useParams<RealEstate.Params>();
  const { initialState } = useModel('@@initialState');
  const { formRefRealEstate, visibleAlert, handleHideAlert, typePage, checkDuplicateRealEstate } =
    useModel('realEstateSell');
  const { getProvinceList, provinceList } = useModel('administrativeDivision');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);

  useEffect(() => {
    getProvinceList();
  }, []);

  return (
    <>
      <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
        <ProFormSelect
          rules={[{ required: true, message: intl.formatMessage({ id: 'form.enter_info' }) }]}
          name={'province_city_id'}
          placeholder={intl.formatMessage({ id: 'form.select' })}
          label={intl.formatMessage({ id: 'form.province' })}
          options={provinceList}
          fieldProps={{
            labelInValue: true,
            onChange: () => {
              formRefRealEstate?.current?.setFields([
                { name: 'street_id', value: undefined },
                { name: 'district_id', value: undefined },
                { name: 'ward_id', value: undefined },
              ]);

              if (visibleAlert) {
                handleHideAlert(formRefRealEstate, !!id);
              }
            },
          }}
          showSearch
        />
      </Col>
      <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
        <ProFormDependency name={['province_city_id']}>
          {({ province_city_id: province_city }) => {
            const province_city_id = province_city?.value;
            return (
              <ProFormSelect
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.enter_info' }),
                  },
                ]}
                fieldProps={{
                  labelInValue: true,
                  onChange: () => {
                    formRefRealEstate?.current?.setFields([
                      { name: 'street_id', value: undefined },
                      { name: 'ward_id', value: undefined },
                    ]);
                    if (visibleAlert) {
                      handleHideAlert(formRefRealEstate, !!id);
                    }
                  },
                }}
                placeholder={intl.formatMessage({ id: 'form.select' })}
                label={intl.formatMessage({ id: 'form.district' })}
                name={'district_id'}
                params={province_city_id}
                request={async ({ keyWords }) => {
                  const response = province_city_id
                    ? await administrativeDivision.getDistrictList({
                        province_id: Number(province_city_id),
                        search: keyWords,
                        limit: 50,
                      })
                    : {};
                  return (
                    response &&
                    response?.map((value: DistrictList) => ({
                      label: value.display_title,
                      value: value.id,
                    }))
                  );
                }}
                showSearch
              />
            );
          }}
        </ProFormDependency>
      </Col>
      <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
        <ProFormDependency name={['district_id']}>
          {({ district_id: district }) => {
            const district_id = district?.value;

            return (
              <ProFormSelect
                name={'ward_id'}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.enter_info' }),
                  },
                ]}
                fieldProps={{
                  labelInValue: true,
                  onChange: (value) => {
                    if (value) {
                      checkDuplicateRealEstate(formRefRealEstate, id, typePage?.type, workspace_id);
                    }
                    if (visibleAlert) {
                      handleHideAlert(formRefRealEstate, !!id);
                    }
                  },
                }}
                params={district_id}
                request={async ({ keyWords }) => {
                  const response = district_id
                    ? await administrativeDivision.getWardList({
                        district_id: Number(district_id),
                        search: keyWords,
                        limit: 50,
                      })
                    : {};
                  return (
                    response &&
                    response?.map((value: WardList) => ({
                      label: value.display_title,
                      value: value.id,
                    }))
                  );
                }}
                label={intl.formatMessage({ id: 'form.ward' })}
                placeholder={intl.formatMessage({ id: 'form.select' })}
                showSearch
              />
            );
          }}
        </ProFormDependency>
      </Col>
      <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
        <ProFormDependency name={['district_id']}>
          {({ district_id: district }) => {
            const district_id = district?.value;
            return (
              <ProFormSelect
                name={'street_id'}
                params={{ district_id }}
                request={async ({ keyWords }) => {
                  let streetList;
                  if (district_id) {
                    const responseByDistrict = await streetService.getListStreet({
                      limit: 20,
                      district_id: district_id,
                      search: keyWords,
                    });
                    const { data } = responseByDistrict && responseByDistrict;
                    streetList = data?.map((item) => {
                      if (item?.wards) {
                        return {
                          label: `${item?.display_title}`,
                          title: item?.display_title,
                          value: item?.id,
                        };
                      }

                      return {
                        label: item?.display_title,
                        value: item?.id,
                        title: item?.display_title,
                      };
                    });
                  }

                  return streetList || [];
                }}
                fieldProps={{
                  labelInValue: true,
                  onChange: (value) => {
                    if (value) {
                      checkDuplicateRealEstate(formRefRealEstate, id, typePage?.type, workspace_id);
                    }
                    if (visibleAlert) {
                      handleHideAlert(formRefRealEstate, !!id);
                    }
                  },
                }}
                label={intl.formatMessage({ id: 'global.street' })}
                rules={[{ required: true, message: intl.formatMessage({ id: 'form.enter_info' }) }]}
                placeholder={intl.formatMessage({ id: 'form.select' })}
                showSearch
              />
            );
          }}
        </ProFormDependency>
      </Col>
      <Col span={24}>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              display: 'block',
              position: 'absolute',
              left: '70px',
              zIndex: 100,
              cursor: 'pointer',
            }}
          >
            <Tooltip title={intl.formatMessage({id: "pages.real_estate_sale.create_tooltip"})} placement="right">
              <svg
                width="18"
                height="18"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2ZM0 11C0 4.92487 4.92487 0 11 0C17.0751 0 22 4.92487 22 11C22 17.0751 17.0751 22 11 22C4.92487 22 0 17.0751 0 11ZM11 6C11.5523 6 12 6.44772 12 7V11C12 11.5523 11.5523 12 11 12C10.4477 12 10 11.5523 10 11V7C10 6.44772 10.4477 6 11 6ZM10 15C10 14.4477 10.4477 14 11 14H11.01C11.5623 14 12.01 14.4477 12.01 15C12.01 15.5523 11.5623 16 11.01 16H11C10.4477 16 10 15.5523 10 15Z"
                  fill="#5f5f5f"
                />
              </svg>
            </Tooltip>
          </span>
          <ProFormText
            rules={[
              { required: true, message: intl.formatMessage({ id: 'form.enter_info' }) },
              {
                validator: (rule, value) => {
                  if (value) {
                    const str = value;
                    const newStr = str
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/đ/g, 'd')
                      .replace(/Đ/g, 'D');
                    if (!newStr?.toString().match(CHECK_VALID_STRING)) {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.incorrect_format' })),
                      );
                    }
                  }
                  return Promise.resolve();
                },
              },
              { max: 250, message: intl.formatMessage({ id: 'form.over_length' }) },
            ]}
            fieldProps={{
              onBlur: async (event) => {
                if (event.currentTarget.value) {
                  checkDuplicateRealEstate(formRefRealEstate, id, typePage?.type, workspace_id);
                }
              },
            }}
            label={intl.formatMessage({ id: 'form.address' })}
            name="address"
            placeholder={intl.formatMessage({
              id: intl.formatMessage({ id: 'form.enter_address' }),
            })}
          />
        </div>
      </Col>
    </>
  );
}
