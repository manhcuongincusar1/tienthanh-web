import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormDigitRange,
  ProFormSwitch,
  ProFormInstance,
} from '@ant-design/pro-form';
import { Row, Col, Divider, Typography, message } from 'antd';
import { STATUS_ENUM } from '@/constants';
import { useIntl, useModel, useAccess } from 'umi';
import { history } from '@@/core/history';
import { accountService } from '@/api/account/Services/accountService';
import _ from 'lodash';
import { administrativeDivision } from '@/api/administrativeDivision';
import CustomButton from '@/components/Custom/CustomButton';
import { CHECK_PHONE_NUMBER, CHECK_REAL_ESTATE_PRICE, CHECK_EMAIL } from '@/pages/expression';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import formaterRealEstatePrice from '@/helpers/formaterRealEstatePrice';

interface AccountFormValue {
  full_name: string;
  email: string;
  status: number;
  raw_phone_number: string;
  branch: number;
  districts: Array<number>;
  province_city: number;
  sale_price_range: Array<number>;
  rent_price_range: Array<number>;
  submit_type: string;
}

type Options = {
  label: string;
  value: number;
};

const AccountForm = forwardRef(({ detailAccountData, handleForm, setForceUpdate }: any, ref) => {
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const [form] = ProForm.useForm();
  const access = useAccess();
  const [listRoles, setListRoles] = useState<string[]>([]);
  const [isSales, setIsSales] = useState<boolean>(false);
  const [provinceOptions, setProvinceOptions] = useState<Options[]>();
  const [districtOptions, setDistrictOptions] = useState<Options[]>();
  const [resetPage, setResetPage] = useState<number>(0);
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const listWorkspace = initialState?.listWorkspace;
  const workspace_id = getWorkspaceId(initialState);
  const formRef = useRef<ProFormInstance>();
  const intl = useIntl();

  useImperativeHandle(ref, () => ({
    submit: () => form.submit(),
  }));

  useEffect(() => {
    accountService.getListRoles(!!detailAccountData?.id).then((result) => {
      const { data } = result;

      let list_role = data.map((item: { title: string; id: number; role: string }) => {
        return {
          label: item.title,
          value: item.id,
          role: item.role,
        };
      });

      if (
        _.find(list_role, (item) => item.value === detailAccountData?.role && item.role === 'sale')
      ) {
        setIsSales(true);
      }
      setListRoles(list_role);
    });
  }, []);

  useEffect(() => {
    if (listWorkspace && workspace_id) {
      const currentWorkSpaceInfo = listWorkspace.find((item) => item.id === workspace_id);
      if (currentWorkSpaceInfo) {
        const branchTitle = currentWorkSpaceInfo?.title;
        const province = currentWorkSpaceInfo?.permission_districts?.[0]?.province;
        const districts = currentWorkSpaceInfo?.permission_districts?.[0]?.districts;
        administrativeDivision
          .getProvinceListByParams({
            ids: province && Number(province) ? [province] : [],
          })
          .then((response) => {
            if (_.isArray(response)) {
              const newProvinceOptions = response.map((item) => ({
                value: item.id,
                label: item.display_title,
              }));
              setProvinceOptions(newProvinceOptions);
            }
          });

        administrativeDivision
          .getDistrictList({
            province_id: province && Number(province),
            ids: _.isArray(districts) ? districts : [],
          })
          .then((response) => {
            if (_.isArray(response)) {
              const newDistrictOptions = response.map((item) => ({
                value: item?.id,
                label: item?.display_title,
              }));
              setDistrictOptions(newDistrictOptions);
            }
          });

        formRef.current?.setFieldsValue({
          branch: branchTitle,
          province_city: detailAccountData?.province_city?.[0] || province,
          districts: detailAccountData?.districts.filter((district: any) => district) || districts,
        });
      }
    }
  }, [listWorkspace, workspace_id, resetPage]);

  const _bindEvent = {
    onFinish: async (values: AccountFormValue) => {
      let status = values.status ? STATUS_ENUM.ACTIVE : STATUS_ENUM.PENDING;

      const { keyResponse } = await handleForm({
        ...values,
        status,
        branch_id: workspace_id,
      });
      if (keyResponse) {
        handleResponseFromCallApi({ response: keyResponse }, { localeActionFailedId: 'Thất bại' });
      } else {
        message.success(`Thành công`, MESSAGE_DISPLAY_SECONDS.SUCCESS, () => {
          if (values.submit_type === 'save' && !detailAccountData?.id) {
            setIsSales(false);
            form.resetFields();
            setResetPage((prv) => prv + 1);
          } else if (values.submit_type === 'save_return') {
            history.push('/account/list');
          }
          setForceUpdate && setForceUpdate((prv: number) => prv + 1);
        });
      }
    },
  };

  const renderFieldEmail = () => {
    return (
      <ProFormText
        name="email"
        label="Email"
        hasFeedback
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'form.field.required' }),
          },
          {
            pattern: CHECK_EMAIL,
            message: intl.formatMessage({ id: 'form.field.incorrect.email' }),
          },
          {
            max: 250,
            message: intl.formatMessage({ id: 'pages.account.field.email.length' }),
          },
          {
            validator: async (rule, value) => {
              if (!detailAccountData?.id && value?.toString()?.match(CHECK_EMAIL)) {
                const response = await accountService.checkUserNameExistByEmailOrPhoneNumber({
                  email: value.toLowerCase().trim(),
                  user_id: detailAccountData?.id,
                });
                if (response?.is_duplicate) {
                  return Promise.reject(
                    new Error(intl.formatMessage({ id: 'form.field.duplicate.email' })),
                  );
                }
              }
              return Promise.resolve();
            },
          },
        ]}
        placeholder="Nhập email"
        disabled={detailAccountData?.id}
      />
    );
  };

  const renderFieldPhoneNumber = () => {
    return (
      <ProFormText
        name="raw_phone_number"
        label={intl.formatMessage({ id: 'pages.account.field.phone_number' })}
        rules={[
          {
            required: true,
            message: intl.formatMessage({ id: 'form.field.required' }),
          },
          {
            pattern: CHECK_PHONE_NUMBER,
            message: intl.formatMessage({ id: 'form.field.incorrect.phone_number' }),
          },
          ({ getFieldValue }) => ({
            async validator(rule, value) {
              if (_.isEmpty(value) || value?.length < 10) return Promise.resolve();
              const response = await accountService.checkUserNameExistByEmailOrPhoneNumber({
                raw_phone_number: value,
                user_id: detailAccountData?.id,
              });
              if (response?.is_duplicate) {
                return Promise.reject(
                  new Error(intl.formatMessage({ id: 'form.field.duplicate.phone_number' })),
                );
              }

              return Promise.resolve();
            },
          }),
        ]}
        placeholder="Nhập số điện thoại"
      />
    );
  };

  return (
    <ProForm
      form={form}
      formRef={formRef}
      disabled={detailAccountData?.id && !detailAccountData?.is_editable}
      initialValues={detailAccountData}
      submitter={{
        searchConfig: {
          submitText: 'Lưu',
          resetText: 'Hủy',
        },
        render: (props, dom) => {
          return (
            <div className="form-footer">
              <CustomButton
                onClick={() => {
                  history.push('/account/list');
                }}
              >
                Hủy
              </CustomButton>
              {detailAccountData?.id && access?.accountChangePassword && (
                <CustomButton
                  type={'default'}
                  onClick={() => {
                    history.push(`/account/edit/${detailAccountData.id}/password`);
                  }}
                >
                  Cập nhật mật khẩu
                </CustomButton>
              )}
              <CustomButton
                type={detailAccountData?.id ? 'primary' : 'default'}
                onClick={() => {
                  form.setFieldsValue({ submit_type: 'save' });
                  form.submit();
                }}
              >
                {detailAccountData?.id ? 'Lưu' : 'Tạo'}
              </CustomButton>
              {!detailAccountData?.id && (
                <CustomButton
                  type={'primary'}
                  onClick={() => {
                    form.setFieldsValue({ submit_type: 'save_return' });
                    form.submit();
                  }}
                >
                  {detailAccountData?.id ? 'Lưu' : 'Tạo'} & đóng lại
                </CustomButton>
              )}
            </div>
          );
        },
      }}
      onFinish={_bindEvent.onFinish}
    >
      {detailAccountData?.id && <ProFormText hidden={true} name="id" />}
      <ProFormText hidden name="submit_type" />
      {detailAccountData?.id && (
        <Row gutter={16}>
          <Col span={12}>
            <ProFormText label="Lần cuối đăng nhập" disabled name="last_login" placeholder="" />
          </Col>
          <Col span={12}>
            <ProFormSwitch name="status" label={intl.formatMessage({ id: 'global.status' })} />
          </Col>
        </Row>
      )}
      <Row gutter={16}>
        <Col span={24} lg={{ span: 12 }}>
          <ProFormText
            label="Họ tên"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập Họ tên',
              },
              {
                max: 250,
                message: intl.formatMessage({ id: 'form.over_length' }),
              },
            ]}
            placeholder="Nhập họ tên"
            name="full_name"
          />
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          {renderFieldEmail()}
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          {renderFieldPhoneNumber()}
        </Col>
        <Col span={24} lg={{ span: 12 }}>
          <ProFormSelect
            label="Chức vụ"
            disabled={detailAccountData?.id}
            options={listRoles || []}
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn chức vụ',
              },
            ]}
            placeholder="Chọn chức vụ"
            name="role"
            fieldProps={{
              autoClearSearchValue: true,
              onChange: (value) => {
                if (
                  _.find(listRoles, (item: any) => item?.value === value && item.role === 'sale')
                ) {
                  setIsSales(true);
                } else {
                  setIsSales(false);
                }
              },
            }}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} xl={24}>
          <Typography.Title level={5} style={{ color: '#3169b3' }}>
            Phân quyền thành viên
          </Typography.Title>
          <Divider />
        </Col>
      </Row>
      {/* isSales */}
      <Row gutter={16}>
        <Col span={24} lg={{ span: 12 }}>
          <ProFormText
            disabled
            label="Chi nhánh"
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn chi nhánh',
              },
            ]}
            placeholder="Chi nhánh"
            name="branch"
          />
        </Col>
        {isSales && (
          <Col span={24} hidden={!isSales} lg={{ span: 12 }}>
            <ProFormSelect
              label="Tỉnh/Thành phố"
              options={provinceOptions}
              showSearch
              allowClear
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn Tỉnh/Thành phố',
                },
              ]}
              placeholder="Chọn Tỉnh/Thành phố"
              name="province_city"
              fieldProps={{
                autoClearSearchValue: true,
                onChange: (value) => {
                  form?.setFieldsValue({ districts: [] });
                },
              }}
            />
          </Col>
        )}
      </Row>
      {isSales && (
        <Row gutter={16}>
          <Col span={24}>
            <ProFormSelect
              name="districts"
              label="Quận/Huyện"
              showSearch
              mode="multiple"
              options={districtOptions}
              fieldProps={{ autoClearSearchValue: true }}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn Quận/Huyện',
                },
              ]}
              placeholder="Chọn Quận/Huyện"
            />
          </Col>
          <Col span={24} lg={{ span: 12 }}>
            <ProFormDigitRange
              label="Khoảng giá bán (tỷ)"
              placeholder={intl.formatMessage({ id: 'form.enter_data' })}
              name="sell_price_range"
              separator="-"
              rules={[
                {
                  validator: (_re, value) => {
                    if (
                      (value?.[0] && !value[0].toString().match(CHECK_REAL_ESTATE_PRICE)) ||
                      (value?.[1] && !value[1].toString().match(CHECK_REAL_ESTATE_PRICE)) ||
                      value?.[0] > value?.[1]
                    ) {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.price.invalid' })),
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
              fieldProps={{
                formatter: (value) => formaterRealEstatePrice(value),
              }}
              separatorWidth={60}
            />
          </Col>
          <Col span={24} lg={{ span: 12 }}>
            <ProFormDigitRange
              label="Khoảng giá thuê (triệu)"
              placeholder={intl.formatMessage({ id: 'form.enter_data' })}
              name="rent_price_range"
              fieldProps={{
                formatter: (value) => formaterRealEstatePrice(value),
              }}
              rules={[
                {
                  validator: (_re, value) => {
                    if (
                      (value?.[0] && !value[0].toString().match(CHECK_REAL_ESTATE_PRICE)) ||
                      (value?.[1] && !value[1].toString().match(CHECK_REAL_ESTATE_PRICE)) ||
                      value?.[0] > value?.[1]
                    ) {
                      return Promise.reject(
                        new Error(intl.formatMessage({ id: 'form.price.invalid' })),
                      );
                    }

                    return Promise.resolve();
                  },
                },
              ]}
              separator="-"
              separatorWidth={60}
            />
          </Col>
        </Row>
      )}
    </ProForm>
  );
});

export default AccountForm;
