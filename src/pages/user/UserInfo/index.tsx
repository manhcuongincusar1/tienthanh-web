import { PageContainer } from '@ant-design/pro-layout';
import { useIntl, useModel } from 'umi';
import ProForm, { ProFormInstance, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Row, Col, message, Avatar } from 'antd';
import { apiUser } from '@/api/users/api';
import Styles from './index.less';
import { useState, useRef, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import _ from 'lodash';
import Settings from '../../../../config/defaultSettings';
import { upload } from '@/api/upload';
import { DeleteOutlined, UserOutlined } from '@ant-design/icons';
import itemRender from '@/helpers/breadcrumbHelper';
import { CHECK_PHONE_NUMBER } from '@/pages/expression';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import formaterRealEstatePrice from '@/helpers/formaterRealEstatePrice';

interface DataCheckPhoneExist {
  username: string;
  raw_phone_number: string;
  full_name: string;
}
export default function index() {
  const intl = useIntl();
  const { refresh, initialState } = useModel('@@initialState');
  const { getSetting } = useModel('setting');
  const { currentUser } = initialState || {};
  const formRef = useRef<ProFormInstance>();
  const { getWorkspaceId } = useModel('infoCurrentUser');
  let workspace_id: string = getWorkspaceId(initialState);
  const [fileAvatar, setFileAvatar] = useState<File>();
  const [urlAvatar, setUrlAvatar] = useState<string>('');

  useEffect(() => {
    getSetting(workspace_id);
  }, []);

  useEffect(() => {
    if (!_.isUndefined(fileAvatar)) {
      const objectUrl = URL.createObjectURL(fileAvatar);
      setUrlAvatar(objectUrl);
    }
  }, [fileAvatar]);

  const onFinish = async (data: DataCheckPhoneExist) => {
    const { username, raw_phone_number, full_name } = data;
    await apiUser
      .checkPhoneExist({ username, raw_phone_number })
      .then(async (res) => {
        if (res.status === 200) {
          await apiUser
            .updatePersonalInfo({ username, raw_phone_number, full_name })
            .then((res) => {
              if (res.status === 200) {
                message.success(
                  intl.formatMessage({ id: 'pages.user.info.update_success' }),
                  MESSAGE_DISPLAY_SECONDS.SUCCESS,
                  () => {
                    refresh();
                  },
                );
              } else {
                message.error(
                  intl.formatMessage({ id: 'pages.user.info.update_error' }),
                  MESSAGE_DISPLAY_SECONDS.ERROR,
                );
              }
            });
        } else {
          formRef.current?.setFields([
            {
              name: 'raw_phone_number',
              errors: [
                intl.formatMessage({
                  id: 'form.field.duplicate.phone',
                }),
              ],
            },
          ]);
        }
      })
      .catch((error) => error);
  };

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.user.personal_info' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.user.personal_info' }),
            },
          ],
        },
        extra: [],
      }}
    >
      <ProCard>
        <Row gutter={16}>
          <Col span={24} xxl={{ span: 5 }}>
            <div className={Styles.avatarWrapper}>
              <div>
                <div className={Styles.avatarTop}>
                  <div className={Styles.avatarImg}>
                    <Avatar src={urlAvatar || 'error'} size={240} icon={<UserOutlined />}></Avatar>
                    {urlAvatar && (
                      <div className={Styles.avatarDelete}>
                        <span
                          className={Styles.avatarDeleteIcon}
                          onClick={async () => {
                            setFileAvatar(undefined);
                            await apiUser
                              .updateUrlAvatar({
                                path: null,
                              })
                              .then((res) => {
                                if (res) {
                                  refresh();
                                  if (res.data.includes('https://')) {
                                    setUrlAvatar(res.data);
                                  } else if (res.data) {
                                    setUrlAvatar(`${Settings.APP_ROOT}/${res.data}`);
                                  }
                                }
                              });
                          }}
                        >
                          <DeleteOutlined />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={Styles.avatarBottom}>
                  <label className="ant-btn ant-btn-primary">
                    {intl.formatMessage({ id: 'pages.user.info.enter_image' })}
                    <input
                      type="file"
                      name="avatar"
                      hidden
                      multiple={false}
                      onChange={async (e) => {
                        if (e.target?.files) {
                          const file = e.target.files[0];
                          const isvalidType =
                            file.type === 'image/jpeg' ||
                            file.type === 'image/jpg' ||
                            file.type === 'image/png';
                          const isValidSize = file.size > 2000000;
                          if (!isvalidType) {
                            message.error(
                              intl.formatMessage({ id: 'pages.user.info.file_type_error' }),
                              MESSAGE_DISPLAY_SECONDS.ERROR,
                            );
                            setFileAvatar(undefined);
                          } else if (isValidSize) {
                            message.error(
                              intl.formatMessage({ id: 'pages.user.info.file_size_error' }),
                              MESSAGE_DISPLAY_SECONDS.ERROR,
                            );
                            setFileAvatar(undefined);
                          } else {
                            setFileAvatar(e.target?.files[0]);
                            await upload.uploadFile(e.target?.files[0]).then(async (res) => {
                              if (res) {
                                await apiUser.updateUrlAvatar({
                                  path: res?.cdn_path ? res?.cdn_path : res?.path,
                                });
                                refresh();
                              }
                            });
                          }
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </Col>
          <Col span={24} xxl={{ span: 19 }}>
            <ProForm
              onFinish={onFinish}
              formRef={formRef}
              request={async () => {
                const data = await apiUser
                  .getPersonalInfo()
                  .then((res) => {
                    if (res.status === 200) {
                      const data = res.data;
                      const textRentPriceTo = data.rent_price_to
                        ? `${formaterRealEstatePrice(data.rent_price_to)} triệu`
                        : 'lớn nhất';
                      const textRentPriceFrom = data.rent_price_from
                        ? `${formaterRealEstatePrice(data.rent_price_from)} triệu`
                        : 'thấp nhất';
                      const textSellPriceTo = data.sell_price_to
                        ? `${formaterRealEstatePrice(data.sell_price_to)} tỷ`
                        : 'lớn nhất';
                      const textSellPriceFrom = data.sell_price_from
                        ? `${formaterRealEstatePrice(data.sell_price_from)} tỷ`
                        : 'thấp nhất';
                      return {
                        ...data,
                        rent_price_range:
                          data.rent_price_to || data.rent_price_from
                            ? `Từ ${textRentPriceFrom} đến ${textRentPriceTo}`
                            : '',
                        sell_price_range:
                          data.sell_price_to || data.sell_price_from
                            ? `Từ ${textSellPriceFrom} đến ${textSellPriceTo}`
                            : '',
                      };
                    }
                  })
                  .catch((error) => {
                    return error;
                  });

                if (data?.avatar?.includes('https://')) {
                  setUrlAvatar(data.avatar);
                } else if (data?.avatar) {
                  setUrlAvatar(`${Settings.APP_ROOT}/${data?.avatar}`);
                }

                return {
                  ...data,
                  district_title: data?.district_title?.join(', '),
                };
              }}
              className={Styles.proformUserInfo}
              layout="vertical"
              submitter={{
                submitButtonProps: {
                  shape: 'circle',
                },
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                searchConfig: {
                  submitText: intl.formatMessage({ id: 'form.card.operation.save' }),
                },
              }}
            >
              <h3 className="section-title">Thông tin cá nhân</h3>
              <Row gutter={16}>
                <Col span={24} md={{ span: 12 }}>
                  <ProFormText
                    name="full_name"
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'form.enter_info' }),
                      },
                    ]}
                    label={intl.formatMessage({ id: 'pages.user.full_name' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.full_name' })}
                  />
                </Col>

                <Col span={24} md={{ span: 12 }}>
                  <ProFormText
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({ id: 'form.enter_info' }),
                      },
                      {
                        pattern: CHECK_PHONE_NUMBER,
                        message: intl.formatMessage({ id: 'form.phone_err' }),
                      },
                    ]}
                    name="raw_phone_number"
                    label={intl.formatMessage({ id: 'pages.user.phone' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.phone' })}
                  />
                </Col>
                <Col span={24} md={{ span: 12 }}>
                  <ProFormText
                    disabled={true}
                    name="username"
                    label={intl.formatMessage({ id: 'pages.user.email' })}
                    placeholder={intl.formatMessage({ id: 'pages.user.email' })}
                  />
                </Col>
              </Row>
              <h3 className="section-title">Quyền truy cập dữ liệu</h3>
              <Row gutter={16}>
                <Col span={24} md={{ span: 12 }}>
                  <ProFormText
                    disabled={true}
                    name="sell_price_range"
                    label={intl.formatMessage({
                      id: 'pages.user.range_price_sell',
                    })}
                    placeholder={
                      currentUser?.role !== 'sale'
                        ? intl.formatMessage({
                            id: 'global.all',
                          })
                        : intl.formatMessage({
                            id: 'pages.user.range_price_sell',
                          })
                    }
                  />
                </Col>
                <Col span={24} md={{ span: 12 }}>
                  <ProFormText
                    disabled={true}
                    name="rent_price_range"
                    label={intl.formatMessage({ id: 'pages.user.range_price_rent' })}
                    placeholder={
                      currentUser?.role !== 'sale'
                        ? intl.formatMessage({
                            id: 'global.all',
                          })
                        : intl.formatMessage({ id: 'pages.user.range_price_rent' })
                    }
                  />
                </Col>
                <Col span={24} md={{ span: 12 }}>
                  <ProFormText
                    disabled={true}
                    name="province_city_title"
                    label={intl.formatMessage({ id: 'pages.user.province' })}
                    placeholder={
                      currentUser?.role !== 'sale'
                        ? intl.formatMessage({
                            id: 'global.all',
                          })
                        : intl.formatMessage({ id: 'pages.user.province' })
                    }
                  />
                </Col>
                <Col span={24} md={{ span: 12 }}>
                  <ProFormText
                    disabled={true}
                    name="branch_title"
                    label={intl.formatMessage({ id: 'pages.user.branch' })}
                    placeholder={
                      currentUser?.role !== 'sale'
                        ? intl.formatMessage({
                            id: 'global.all',
                          })
                        : intl.formatMessage({ id: 'pages.user.branch' })
                    }
                  />
                </Col>
                <Col span={24} md={{ span: 12 }}>
                  <ProFormTextArea
                    disabled={true}
                    name="district_title"
                    label={intl.formatMessage({ id: 'pages.user.district' })}
                    fieldProps={{
                      // readOnly: true,
                      autoSize: { minRows: 1, maxRows: 4 },
                    }}
                    placeholder={
                      currentUser?.role !== 'sale'
                        ? intl.formatMessage({
                            id: 'global.all',
                          })
                        : intl.formatMessage({ id: 'pages.user.district' })
                    }
                  />
                </Col>
              </Row>
            </ProForm>
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
}
