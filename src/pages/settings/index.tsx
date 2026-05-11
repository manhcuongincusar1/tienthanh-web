import { PageContainer } from '@ant-design/pro-layout';
import { useIntl, useModel } from 'umi';
import ProCard from '@ant-design/pro-card';
import itemRender from '@/helpers/breadcrumbHelper';
import ProForm, { ProFormDigit, ProFormInstance } from '@ant-design/pro-form';
import Col from 'antd/es/grid/col';
import { v4 as uuidv4 } from 'uuid';
import { Row, Divider, message, Form, Button } from 'antd';
import { settingService } from '@/services/settingService';
import { history } from '@@/core/history';
import CustomButton from '@/components/Custom/CustomButton';
import { useRef, useState } from 'react';
import { UploadFile } from 'antd/es/upload/interface';
import _ from 'lodash';
import { apiMasterData } from '@/api/master_data/api';
import { CHECK_VALUE_NUMBER } from '@/pages/expression';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';

export default function Setting() {
  const intl = useIntl();
  const [form] = Form.useForm();
  const { refresh } = useModel('@@initialState');
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const [forceUpdate, setForceUpdate] = useState<number>(0);
  const formRef = useRef<ProFormInstance>();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const onFinish = async (data: any) => {
    const result = await settingService.updateSetting({
      data: {
        ...data,
      },
      branch_id: workspace_id,
    });
    if (result?.keyResponse) {
      handleResponseFromCallApi({ response: result?.keyResponse });
      return;
    }
    if (!result?.data) {
      message.error(
        intl.formatMessage({ id: 'pages.settings.edit_failed' }),
        MESSAGE_DISPLAY_SECONDS.ERROR,
      );
      return;
    } else {
      message.success(
        intl.formatMessage({ id: 'pages.settings.edit_success' }),
        MESSAGE_DISPLAY_SECONDS.SUCCESS,
      );
      refresh();
      setForceUpdate((prv) => prv + 1);
    }
  };
  const _bindEvent = {
    generateMasterData: async () => {
      await apiMasterData.generateMasterData();
      message.success(
        intl.formatMessage({ id: 'pages.settings.generate_master_data' }),
        MESSAGE_DISPLAY_SECONDS.SUCCESS,
      );
    },
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.settings.title' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.settings.title' }),
            },
          ],
        },
        extra: [],
      }}
    >
      <ProCard>
        <ProForm
          // className={Styles.settingSystem}
          params={{ forceUpdate }}
          formRef={formRef}
          onFinish={onFinish}
          request={async () => {
            const res = await settingService.getSetting(workspace_id);
            if (res?.keyResponse) {
              handleResponseFromCallApi({ response: res?.keyResponse });
              return;
            }
            const { image_real_estate, avatar } = res?.data;
            let realEstatePath: UploadFile[] | undefined;
            let avatarPath: UploadFile[] | undefined;
            if (image_real_estate && !_.isEmpty(image_real_estate)) {
              realEstatePath = [
                {
                  uid: uuidv4(),
                  name: image_real_estate?.cdn_path,
                  url: image_real_estate?.cdn_path,
                  status: 'done',
                  thumbUrl: image_real_estate?.cdn_path,
                },
              ];
            } else {
              realEstatePath = undefined;
            }
            if (avatar && !_.isEmpty(avatar)) {
              avatarPath = [
                {
                  uid: uuidv4(),
                  name: avatar?.cdn_path,
                  url: avatar?.cdn_path,
                  status: 'done',
                  thumbUrl: avatar?.cdn_path,
                },
              ];
            } else {
              avatarPath = undefined;
            }
            return (
              {
                ...res?.data,
                image_real_estate: realEstatePath,
                avatar: avatarPath,
              } || {}
            );
          }}
          form={form}
          layout={'vertical'}
          submitter={{
            searchConfig: {
              submitText: 'Lưu',
              resetText: 'Huỷ',
            },
            render: (props, dom) => {
              return (
                <div className="form-footer">
                  <CustomButton
                    onClick={() => {
                      history.push('/real-estate-sell/list');
                    }}
                  >
                    Hủy
                  </CustomButton>
                  <CustomButton
                    type={'primary'}
                    onClick={() => {
                      form.setFieldsValue({ submit_type: 'save' });
                      form.submit();
                    }}
                  >
                    Lưu
                  </CustomButton>
                </div>
              );
            },
          }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <div>
                <Divider orientation="left" style={{ borderColor: '#ccc' }}>
                  {intl.formatMessage({ id: 'pages.settings.general_information' })}
                </Divider>
                <ProFormDigit
                  label={intl.formatMessage({ id: 'pages.settings.image_size' })}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'form.enter_info' }),
                    },
                    {
                      pattern: CHECK_VALUE_NUMBER,
                      message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
                    },
                    {
                      max: 250,
                      type: 'number',
                      message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
                    },
                  ]}
                  name="image_size"
                  placeholder={intl.formatMessage({ id: 'form.enter_data' })}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24} lg={{ span: 24 }}>
              <div>
                <Divider orientation="left" style={{ borderColor: '#ccc' }}>
                  {intl.formatMessage({ id: 'pages.settings.real_estate' })}
                </Divider>
                <ProFormDigit
                  label={intl.formatMessage({ id: 'pages.settings.image_capacity' })}
                  name="image_capacity"
                  initialValue={6}
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'form.enter_info' }),
                    },
                    {
                      pattern: CHECK_VALUE_NUMBER,
                      message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
                    },
                    {
                      max: 250,
                      type: 'number',
                      message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
                    },
                  ]}
                  placeholder={intl.formatMessage({ id: 'form.enter_data' })}
                />
                <ProFormDigit
                  label={intl.formatMessage({ id: 'pages.settings.import_file_size' })}
                  name="import_size"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({ id: 'form.enter_info' }),
                    },
                    {
                      pattern: CHECK_VALUE_NUMBER,
                      message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
                    },
                    {
                      max: 250,
                      type: 'number',
                      message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
                    },
                  ]}
                  initialValue={5}
                  placeholder={intl.formatMessage({ id: 'form.enter_data' })}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24} lg={{ span: 24 }}>
              <div>
                <Divider orientation="left" style={{ borderColor: '#ccc' }}>
                  {intl.formatMessage({ id: 'pages.settings.report' })}
                </Divider>
                <Row gutter={16}>
                  <Col span={12}>
                    <ProFormDigit
                      label={intl.formatMessage({ id: 'pages.settings.item_select_chart' })}
                      name="amount_select"
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'form.enter_info' }),
                        },
                        {
                          pattern: CHECK_VALUE_NUMBER,
                          message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
                        },
                        {
                          max: 250,
                          type: 'number',
                          message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
                        },
                      ]}
                      placeholder={intl.formatMessage({ id: 'form.enter_data' })}
                    />
                  </Col>
                  <Col span={12}>
                    <ProFormDigit
                      label={intl.formatMessage({ id: 'pages.settings.limit_filter_time' })}
                      name="limit_time"
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({ id: 'form.enter_info' }),
                        },
                        {
                          pattern: CHECK_VALUE_NUMBER,
                          message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
                        },
                        {
                          max: 10000,
                          type: 'number',
                          message: intl.formatMessage({ id: 'form.field.number_incorrect' }),
                        },
                      ]}
                      placeholder={intl.formatMessage({ id: 'form.enter_data' })}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24} lg={{ span: 24 }}>
              <div>
                <Divider orientation="left" style={{ borderColor: '#ccc' }}>
                  {intl.formatMessage({ id: 'pages.settings.masterData' })}
                </Divider>
                <Button type="primary" onClick={_bindEvent.generateMasterData}>
                  Generate MasterData
                </Button>
              </div>
            </Col>
          </Row>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
}
