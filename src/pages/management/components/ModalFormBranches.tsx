import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import {
  ModalForm,
  ProFormDependency,
  ProFormInstance,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProForm,
} from '@ant-design/pro-form';
import { message, Divider } from 'antd';
import { useIntl, useModel, useAccess } from 'umi';
import { administrativeDivision } from '@/api/administrativeDivision';
import { branches } from '@/api/branches';
import _ from 'lodash';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

interface TypeRef {
  open: (empty?: object) => void;
}

interface TableRef extends ProFormInstance {
  reloadTable: () => void;
}

interface ModalFormBranchesProps {
  tableRef: React.MutableRefObject<TableRef | undefined>;
}

interface Access {
  branchEdit?: boolean;
  branchCreate?: boolean;
}

const ModalFormBranches = forwardRef((props: ModalFormBranchesProps, ref) => {
  const intl = useIntl();
  const { getProvinceList, provinceList } = useModel('administrativeDivision');
  const { tableRef } = props;
  const access: Access = useAccess();
  const formRef = useRef<ProFormInstance>();
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    getProvinceList();
  }, []);

  useImperativeHandle(ref, () => ({
    open: (data?: any) => {
      if (!_.isUndefined(data) && !_.isEmpty(data)) {
        setData({
          ...data,
          status: data.status === 1 ? true : false,
        });
      }
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  const handleFinish = async (formData: any) => {
    if (_.isEmpty(data)) {
      await branches
        .checkCodeTax({ tax: formData.tax })
        .then(async (res) => {
          if (res.status === 200) {
            await branches
              .createBranch({
                ...formData,
                status: formData.status ? 1 : 2,
              })
              .then((res) => {
                if (res.status == 200) {
                  message.success(
                    `Tạo chi nhánh thành công`,
                    MESSAGE_DISPLAY_SECONDS.SUCCESS,
                    () => {
                      setVisible(false);
                      tableRef.current?.reloadTable();
                    },
                  );
                }
                return res;
              });
          } else {
            formRef.current?.setFields([
              {
                name: 'tax',
                errors: ['Trùng mã số thuế.Vui lòng kiểm tra lại'],
              },
            ]);
          }
        })
        .catch((err) => {
          return false;
        });
    } else {
      const {
        id,
        code,
        title,
        address,
        province_city_id,
        district_id,
        ward_id,
        tax,
        permission_province,
        permission_districts,
      } = formData;

      await branches.checkCodeTax({ tax: tax }).then(async (res) => {
        const updateFunc = async () => {
          await branches
            .udpateBranchById(id, {
              code,
              title,
              address,
              province_city_id,
              district_id,
              ward_id,
              tax,
              permission_province,
              permission_districts,
              status: formData.status ? 1 : 2,
            })
            .then((res) => {
              if (res.status === 200) {
                message.success(
                  `Cập nhật chi nhánh ${code} thành công`,
                  MESSAGE_DISPLAY_SECONDS.SUCCESS,
                  () => {
                    setVisible(false);
                    tableRef.current?.reloadTable();
                  },
                );
              } else {
                message.error(`Cập nhật chi nhánh ${code} thất bại`, MESSAGE_DISPLAY_SECONDS.ERROR);
              }
            });
        };
        if (res.status === 200) {
          updateFunc();
        } else {
          if (res.data !== id)
            formRef.current?.setFields([
              {
                name: 'tax',
                errors: [intl.formatMessage({ id: 'pages.management.duplicate_tax' })],
              },
            ]);
          else updateFunc();
        }
      });
    }
  };

  return (
    /*<ModalForm
      visible={visible}
      onVisibleChange={setVisible}
      submitter={{
        submitButtonProps: {
          shape: 'circle',
        },
        resetButtonProps: {
          shape: 'circle',
        },
        searchConfig: {
          resetText: intl.formatMessage({id: 'form.cancel'}),
          submitText: _.isEmpty(data)
            ? intl.formatMessage({id: 'form.create'})
            : intl.formatMessage({id: 'form.card.operation.save'}),
        },
      }}
      title={
        _.isEmpty(data)
          ? intl.formatMessage({id: 'pages.management.create_branch'})
          : intl.formatMessage({id: 'pages.management.update_branch'})
      }
      formRef={formRef}
      onFinish={handleFinish}
      modalProps={{
        destroyOnClose: true,
        afterClose() {
          formRef.current?.resetFields();
          setData({});
        },
      }}
      params={data}
      request={async (params) => {
        return data;
      }}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={_.isEmpty(data) ? 24 : 12}>
              <ProFormText
                name="title"
                placeholder={intl.formatMessage({id: 'form.enter_data'})}
                label="Tên chi nhánh:"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({id: 'form.field.required'}),
                  },
                  {max: 250, message: intl.formatMessage({id: 'form.over_length'})},
                ]}
              />
            </Col>
            <Col span={_.isEmpty(data) ? 0 : 12}>
              <ProFormText
                name="code"
                hidden={_.isEmpty(data)}
                disabled={true}
                placeholder={intl.formatMessage({id: 'form.enter_data'})}
                label="Mã chi nhánh:"
              />
            </Col>
            <Col span={12}>
              <ProFormText
                name="tax"
                placeholder={intl.formatMessage({id: 'form.enter_data'})}
                label="Mã số thuế:"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({id: 'form.field.required'}),
                  },
                  {max: 250, message: intl.formatMessage({id: 'form.over_length'})},
                ]}
              />
            </Col>
            <Col span={12}>
              <ProFormSwitch name="status" label="Trạng thái"/>
              <ProFormText name="id" hidden/>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <ProFormSelect
                name="province_city_id"
                placeholder={intl.formatMessage({id: 'form.select_data'})}
                label={intl.formatMessage({id: 'global.province'})}
                options={provinceList}
                showSearch
                fieldProps={{
                  onChange: () => {
                    formRef.current?.setFields([
                      {name: 'street_id', value: undefined},
                      {name: 'district_id', value: undefined},
                      {name: 'ward_id', value: undefined},
                    ]);
                  },
                }}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({id: 'form.field.required'}),
                  },
                ]}
              />
            </Col>
            <Col span={12}>
              <ProFormDependency name={['province_city_id']}>
                {({province_city_id}) => {
                  return (
                    <ProFormSelect
                      name={'district_id'}
                      params={province_city_id}
                      label={intl.formatMessage({id: 'global.district'})}
                      request={async () => {
                        const response = province_city_id
                          ? await administrativeDivision.getDistrictList({
                            province_id: Number(province_city_id),
                          })
                          : {};

                        return (
                          response &&
                          response?.map((value: any) => ({
                            label: value.display_title,
                            value: value.id,
                          }))
                        );
                      }}
                      placeholder={intl.formatMessage({id: 'form.select_data'})}
                      showSearch
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({id: 'form.field.required'}),
                        },
                      ]}
                      fieldProps={{
                        onChange: (value: number) => {
                          formRef.current?.setFields([
                            {name: 'street_id', value: undefined},
                            {name: 'ward_id', value: undefined},
                          ]);
                        },
                      }}
                    />
                  );
                }}
              </ProFormDependency>
            </Col>
            <Col span={12}>
              <ProFormDependency name={['district_id']}>
                {({district_id}) => {
                  return (
                    <ProFormSelect
                      name={'ward_id'}
                      params={district_id}
                      label={intl.formatMessage({id: 'global.ward'})}
                      request={async (params) => {
                        const response = district_id
                          ? await administrativeDivision.getWardList({
                            district_id: Number(district_id),
                          })
                          : {};

                        return (
                          response &&
                          response?.map((value: any) => ({
                            label: value.display_title,
                            value: value.id,
                          }))
                        );
                      }}
                      placeholder={intl.formatMessage({id: 'form.select_data'})}
                      showSearch
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({id: 'form.field.required'}),
                        },
                      ]}
                      fieldProps={{
                        onChange: (value: number) => {
                        },
                      }}
                    />
                  );
                }}
              </ProFormDependency>
            </Col>
            <Col span={12}>
              <ProFormText
                name="address"
                placeholder={intl.formatMessage({id: 'form.enter_data'})}
                label="Địa chỉ:"
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({id: 'form.field.required'}),
                  },
                  {max: 250, message: intl.formatMessage({id: 'form.over_length'})},
                ]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <ProForm.Group>
        <ProFormSelect
          placeholder={intl.formatMessage({id: 'form.select_data'})}
          label={intl.formatMessage({id: 'global.province'})}
          options={provinceList}
          showSearch
          fieldProps={{
            onChange: () => {
              formRef.current?.setFields([
                {name: 'street_id', value: undefined},
                {name: 'district_id', value: undefined},
                {name: 'ward_id', value: undefined},
                ]);
              },
          }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({id: 'form.field.required'}),
            },
            ]}
        />
        <ProFormDependency name={['province_city_id']}>
          {({province_city_id}) => {
            return (
              <ProFormSelect
                params={province_city_id}
                mode={`multiple`}
                label={intl.formatMessage({id: 'global.district'})}
                request={async () => {
                  const response = province_city_id
                  ? await administrativeDivision.getDistrictList({
                    province_id: Number(province_city_id),
                  })
                  : {};

                  return (
                    response &&
                    response?.map((value: any) => ({
                      label: value.display_title,
                      value: value.id,
                    }))
                    );
                }}
                placeholder={intl.formatMessage({id: 'form.select_data'})}
                showSearch
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({id: 'form.field.required'}),
                  },
                  ]}
                fieldProps={{
                  onChange: (value: number) => {
                    formRef.current?.setFields([
                      {name: 'street_id', value: undefined},
                      {name: 'ward_id', value: undefined},
                      ]);
                    },
                }}
              />
              );
          }}
        </ProFormDependency>
      </ProForm.Group>


    </ModalForm>*/

    <ModalForm
      visible={visible}
      onVisibleChange={setVisible}
      submitter={{
        submitButtonProps: {
          shape: 'circle',
        },
        resetButtonProps: {
          shape: 'circle',
        },
        searchConfig: {
          resetText: intl.formatMessage({ id: 'form.cancel' }),
          submitText: _.isEmpty(data)
            ? intl.formatMessage({ id: 'form.create' })
            : intl.formatMessage({ id: 'form.card.operation.save' }),
        },
      }}
      title={
        _.isEmpty(data)
          ? intl.formatMessage({ id: 'pages.management.create_branch' })
          : intl.formatMessage({ id: 'pages.management.update_branch' })
      }
      formRef={formRef}
      onFinish={handleFinish}
      modalProps={{
        destroyOnClose: true,
        afterClose() {
          formRef.current?.resetFields();
          setData({});
        },
      }}
      params={data}
      request={async (params) => {
        let { permission_districts } = data;
        let permissionsData = {};
        if (!_.isEmpty(permission_districts)) {
          const first_permissions = _.head(permission_districts);

          permissionsData = {
            permission_province: first_permissions?.province,
            permission_districts: first_permissions?.districts,
          };
        }
        return {
          ...data,
          ...permissionsData,
        };
      }}
    >
      <Divider>{intl.formatMessage({ id: 'pages.management.information' })}</Divider>
      <ProForm.Group>
        <ProFormText
          name="title"
          width={`md`}
          placeholder={intl.formatMessage({ id: 'form.enter_data' })}
          label="Tên chi nhánh:"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'form.field.required' }),
            },
            { max: 250, message: intl.formatMessage({ id: 'form.over_length' }) },
          ]}
        />

        <ProFormText
          name="code"
          width={`md`}
          hidden={_.isEmpty(data)}
          disabled={true}
          placeholder={intl.formatMessage({ id: 'form.enter_data' })}
          label="Mã chi nhánh:"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width={'md'}
          name="tax"
          placeholder={intl.formatMessage({ id: 'form.enter_data' })}
          label="Mã số thuế:"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'form.field.required' }),
            },
            { max: 250, message: intl.formatMessage({ id: 'form.over_length' }) },
          ]}
        />
        <ProFormSwitch name="status" label="Trạng thái" />
        <ProFormText name="id" hidden />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormSelect
          width={`md`}
          name="province_city_id"
          placeholder={intl.formatMessage({ id: 'form.select_data' })}
          label={intl.formatMessage({ id: 'global.province' })}
          options={provinceList}
          showSearch
          fieldProps={{
            onChange: () => {
              formRef.current?.setFields([
                { name: 'street_id', value: undefined },
                { name: 'district_id', value: undefined },
                { name: 'ward_id', value: undefined },
              ]);
            },
          }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'form.field.required' }),
            },
          ]}
        />
        <ProFormDependency name={['province_city_id']}>
          {({ province_city_id }) => {
            return (
              <ProFormSelect
                width={`md`}
                name={'district_id'}
                params={province_city_id}
                label={intl.formatMessage({ id: 'global.district' })}
                request={async () => {
                  const response = province_city_id
                    ? await administrativeDivision.getDistrictList({
                        province_id: Number(province_city_id),
                      })
                    : {};

                  return (
                    response &&
                    response?.map((value: any) => ({
                      label: value.display_title,
                      value: value.id,
                    }))
                  );
                }}
                placeholder={intl.formatMessage({ id: 'form.select_data' })}
                showSearch
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.field.required' }),
                  },
                ]}
                fieldProps={{
                  onChange: (value: number) => {
                    formRef.current?.setFields([
                      { name: 'street_id', value: undefined },
                      { name: 'ward_id', value: undefined },
                    ]);
                  },
                }}
              />
            );
          }}
        </ProFormDependency>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormDependency name={['district_id']}>
          {({ district_id }) => {
            return (
              <ProFormSelect
                width={`md`}
                name={'ward_id'}
                params={district_id}
                label={intl.formatMessage({ id: 'global.ward' })}
                request={async (params) => {
                  const response = district_id
                    ? await administrativeDivision.getWardList({
                        district_id: Number(district_id),
                      })
                    : {};

                  return (
                    response &&
                    response?.map((value: any) => ({
                      label: value.display_title,
                      value: value.id,
                    }))
                  );
                }}
                placeholder={intl.formatMessage({ id: 'form.select_data' })}
                showSearch
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.field.required' }),
                  },
                ]}
                fieldProps={{
                  onChange: (value: number) => {},
                }}
              />
            );
          }}
        </ProFormDependency>
        <ProFormText
          width={`md`}
          name="address"
          placeholder={intl.formatMessage({ id: 'form.enter_data' })}
          label="Địa chỉ:"
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'form.field.required' }),
            },
            { max: 250, message: intl.formatMessage({ id: 'form.over_length' }) },
          ]}
        />
      </ProForm.Group>
      <Divider>{intl.formatMessage({ id: 'pages.management.permissions' })}</Divider>
      <ProForm.Group>
        <ProFormSelect
          width={`md`}
          name={`permission_province`}
          placeholder={intl.formatMessage({ id: 'form.select_data' })}
          label={intl.formatMessage({ id: 'global.province' })}
          options={provinceList}
          showSearch
          fieldProps={{
            onChange: () => {
              formRef.current?.setFields([{ name: 'permission_districts', value: [] }]);
            },
          }}
          rules={[
            {
              required: true,
              message: intl.formatMessage({ id: 'form.field.required' }),
            },
          ]}
        />
        <ProFormDependency name={['permission_province']}>
          {({ permission_province }) => {
            return (
              <ProFormSelect
                params={permission_province}
                width={`md`}
                mode={`multiple`}
                name={`permission_districts`}
                label={intl.formatMessage({ id: 'global.district' })}
                request={async () => {
                  const response = permission_province
                    ? await administrativeDivision.getDistrictList({
                        province_id: Number(permission_province),
                      })
                    : {};

                  return (
                    response &&
                    response?.map((value: any) => ({
                      label: value.display_title,
                      value: value.id,
                    }))
                  );
                }}
                placeholder={intl.formatMessage({ id: 'form.select_data' })}
                showSearch
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'form.field.required' }),
                  },
                ]}
              />
            );
          }}
        </ProFormDependency>
      </ProForm.Group>
    </ModalForm>
  );
});

export { TypeRef };

export default ModalFormBranches;
