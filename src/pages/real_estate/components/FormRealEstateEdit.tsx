import ProForm, {
  ProFormCheckbox,
  ProFormInstance,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import {ReactNode, useEffect, useRef, useState} from 'react';
import FormRealEstateSellDetail from './FormRealEstateDetail';
import FormRealEstateSellMain from './FormRealEstateMain';
import Settings from '../../../../config/defaultSettings';
import _ from 'lodash';
import {Col, Image, message, Row, Tag, Upload, UploadFile} from 'antd';
import {history, Link, useIntl, useModel, useParams} from 'umi';
import {upload} from '@/api/upload';
import ProTableHistoryEditRealEstate from './ProTableHistoryEditRealEstate';
import {formatDate} from '@/utils';
import {confirm} from '@/components/popup';
import {MESSAGE_DISPLAY_SECONDS} from '@/constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import CustomButton from '@/components/Custom/CustomButton';
import formaterRealEstatePrice from '@/helpers/formaterRealEstatePrice';
import {REAL_ESTATE_TYPE_ENUM} from "@/pages/real_estate/constants";

interface FormRealEstateEditProps {
  onFinish: (data: any) => Promise<boolean>;
  pathListPage: string;
  realEstateService: any;
}

export default function FormRealEstateSellEdit({
                                                 onFinish,
                                                 pathListPage,
                                                 realEstateService,
                                               }: FormRealEstateEditProps) {
  const formRef = useRef<ProFormInstance>();
  const intl = useIntl();
  const [isUserEdit, setIsUserEdit] = useState<boolean | undefined>(false);
  const {
    realEstateStatus,
    prevEstateStatusId,
    setPrevEstateStatusId,
    showInternal,
    setShowInternal,
    forceUpdate,
    checkDuplicateRealEstate,
    setVisibleAlert,
    typePage,
    setPreviousStatusText,
    setFormRefRealEstate,
    requiredStatus,
    setIsAgency,
    updateProperties,
  } = useModel('realEstateSell');

  const {initialState} = useModel('@@initialState');
  const {getWorkspaceId} = useModel('infoCurrentUser');
  const {getSetting, settingSystem} = useModel('setting');
  const [imagePreviewNode, setImagePreviewNode] = useState<ReactNode>(<></>);
  const {id} = useParams<RealEstate.Params>();
  const [urlImagePreview, setUrlImagePreview] = useState<string | undefined>();
  const {handleResponseFromCallApi} = useHandleResponseFromCallApi();
  const [parentRealEstate, setParentRealEstate] = useState<
    RealEstate.ParentRealEstate | undefined
  >();
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
  const [childrenRealEstate, setChildrenRealEstate] = useState<
    RealEstate.ParentRealEstate | undefined
  >();
  const [visibleUpdateInfo, setVisibleUpdateInfo] = useState<boolean>(false);
  let workspace_id: string = getWorkspaceId(initialState);

  useEffect(() => {
    getSetting(workspace_id);
    setVisibleAlert(false);
  }, []);

  useEffect(() => {
    setVisibleAlert(false);
  }, [id]);

  useEffect(() => {
    if (formRef) {
      setFormRefRealEstate(formRef);
    }
  }, [formRef]);

  useEffect(() => {
    if (urlImagePreview) {
      setImagePreviewNode(
        <Image
          src="/images/thumbnail-default.png"
          style={{display: 'none'}}
          preview={{
            visible: !!urlImagePreview,
            src: urlImagePreview,
            onVisibleChange: (visible) => {
              if (!visible) setUrlImagePreview(undefined);
            },
          }}
        />,
      );
    } else {
      setImagePreviewNode(<></>);
    }
  }, [urlImagePreview]);

  const handleUpdateInfo = () => {
    history.push(`/${pathListPage}/preview/${id}`);
  };

  return (
    <>
      <ProForm
        formRef={formRef}
        onFinish={onFinish}
        params={{forceUpdate}}
        disabled={
          !isUserEdit || (!_.isEmpty(childrenRealEstate) && !_.isUndefined(childrenRealEstate))
        }
        request={async (params) => {
          const data = await realEstateService.getRealEstateById(id, workspace_id);
          if (data?.keyResponse) {
            handleResponseFromCallApi({
              response: data?.keyResponse,
            });
            return {};
          }
          const detail = data?.detail;
          let listPathNew: UploadFile[] | undefined;
          const isEditableRe = !(!_.isUndefined(data) && !data.real_estate_status_editable);

          if (data) {
            listPathNew = detail?.listPath?.map((path: RealEstate.ItemPath) => ({
              uid: path.id,
              name: path.cdn_path ? path.cdn_path : path.path || '',
              url: path?.cdn_path ? path.cdn_path : `${Settings.APP_ROOT}/${path.path}`,
              status: 'done',
              thumbUrl: path?.cdn_path ? path.cdn_path : `${Settings.APP_ROOT}/${path.path}`,
            }));
          }
          if (data?.real_estate_status_show_internal === true) {
            setShowInternal(true);
          }

          setPrevEstateStatusId(data?.real_estate_status_id ? data?.real_estate_status_id : '');

          if (
            _.isNull(data?.real_estate_status_id) ||
            _.isUndefined(data?.real_estate_status_id) ||
            !data?.is_accessible
          ) {
            setIsUserEdit(false);
            data?.is_accessible && setVisibleAlert(true);
            setVisibleUpdateInfo(false);
          } else if (data?.is_accessible) {
            if (isEditableRe) {
              setIsUserEdit(true);
              setVisibleUpdateInfo(false);
            } else {
              setIsUserEdit(false);
              setVisibleUpdateInfo(true);
            }
          }
          if (data?.parent_real_estate_id) {
            setParentRealEstate({
              id: data.parent_real_estate_id,
              code: data.parent_code,
            });
          } else {
            setParentRealEstate(undefined);
          }
          if (data?.children_real_estate_id) {
            setChildrenRealEstate({
              id: data.children_real_estate_id,
              code: data.children_code,
            });
          } else {
            setChildrenRealEstate(undefined);
          }
          setPreviousStatusText(
            !_.isUndefined(data)
              ? {id: data.real_estate_status_id, title: data.real_estate_status}
              : undefined,
          );

          if (data?.agency) {
            setIsAgency(true);
          } else {
            setIsAgency(false);
          }
          updateProperties({
            ...data,
            ...detail,
          });
          return {
            ...data,
            ...detail,
            location: data?.location?.toString(),
            image_list: listPathNew,
            created_date: formatDate(data?.created_date),
            price: data?.price && formaterRealEstatePrice(data?.price),
            brokerage_fees: data?.brokerage_fees && data?.type === REAL_ESTATE_TYPE_ENUM.SELL ? data?.brokerage_fees : formaterRealEstatePrice(data?.brokerage_fees),
          };
        }}
        submitter={{
          searchConfig: {
            resetText: intl.formatMessage({id: 'form.cancel'}),
            submitText: intl.formatMessage({id: 'form.card.operation.save'}),
          },
          onReset: () => {
            history.push(`/${pathListPage}/list`);
          },
          render(props, dom) {
            return (
              <div className="form-footer">
                {dom[0]}
                <CustomButton
                  onClick={() => {
                    formRef.current?.submit();
                  }}
                  loading={isLoadingUpload}
                  disabled={isLoadingUpload}
                  type="primary"
                >
                  Lưu
                </CustomButton>
              </div>
            );
          },
        }}
      >
        <Row gutter={{xs: 12, sm: 12, md: 24}}>
          <Col span={12} lg={{span: 12}} xl={{span: 6}}>
            <ProFormSelect
              label={intl.formatMessage({id: 'pages.real_estate_sale.status'})}
              name="real_estate_status_id"
              options={realEstateStatus?.map((value) => ({
                ...value,
                label: <Tag color={value.color}>{value.label}</Tag>,
              }))}
              disabled={!_.isEmpty(childrenRealEstate) && !_.isUndefined(childrenRealEstate)}
              fieldProps={{
                showArrow: true,
                onChange: (value) => {
                  const prevStatusText = realEstateStatus.find(
                    (item) => item.value === prevEstateStatusId,
                  );
                  const nextStatusText = realEstateStatus.find((item) => item.value === value);
                  confirm(
                    'Xác nhận thay đổi trạng thái',
                    `Bạn có muốn thay đổi trạng thái từ "${prevStatusText?.label}" sang "${nextStatusText?.label}" không?`,
                    () => {
                      if (value) {
                        checkDuplicateRealEstate(formRef, id, typePage?.type, workspace_id);
                        const realEstateStatusSelect = realEstateStatus.find(
                          (item) => item.value === value,
                        );
                        setShowInternal(realEstateStatusSelect?.isShowInternal);
                      }
                    },
                    () => {
                      formRef.current?.setFieldsValue({
                        real_estate_status_id: prevEstateStatusId,
                      });
                    },
                  );
                },
              }}
              placeholder={
                isUserEdit ? intl.formatMessage({id: 'pages.real_estate_sale.status'}) : ''
              }
              rules={[{required: requiredStatus, message: 'Vui lòng chọn tình trạng'}]}
            />
            <ProFormTextArea name="note_change" hidden/>
          </Col>
          <Col span={12} hidden={!showInternal} lg={{span: 12}} xl={{span: 6}}>
            <div className="proform-item-button form-checkbox-end">
              <ProFormCheckbox name="is_internal">
                {intl.formatMessage({id: `pages.${typePage?.locale}.internal`})}
              </ProFormCheckbox>
            </div>
          </Col>
          <Col
            span={12}
            lg={{span: 12}}
            xl={{span: 6}}
            xs={{span: 13}}
            md={{span: 12}}
            hidden={!visibleUpdateInfo || !!childrenRealEstate}
          >
            <div className="proform-item-button proform-item-button-sm proform-item-button-update-info">
              <div
                className={
                  'ant-btn ant-btn-circle ant-btn-primary ant-btn-sm ant-btn-background-ghost'
                }
                onClick={handleUpdateInfo}
              >
                {intl.formatMessage({id: 'pages.real_estate_sale.update_info'})}
              </div>
            </div>
          </Col>
        </Row>
        <Row gutter={{xs: 12, sm: 12, md: 24}}>
          <FormRealEstateSellMain formRef={formRef}/>
          <FormRealEstateSellDetail/>
        </Row>
        <span className="section-space-top"/>
        <h3 className="section-title">
          {intl.formatMessage(
            {id: `pages.${typePage?.locale}.image`},
            {
              max: settingSystem?.image_capacity || 6,
            },
          )}
        </h3>
        <ProFormUploadButton
          name="image_list"
          label=""
          accept={`image/jpeg, image/jpg, image/png`}
          max={settingSystem?.image_capacity || 6}
          fieldProps={{
            multiple: true,
            maxCount: settingSystem?.image_capacity || 6,
            listType: 'picture-card',
            onPreview: (file) => {
              if (file?.response) {
                setUrlImagePreview(file?.response?.cdn_path);
              } else {
                setUrlImagePreview(file?.url);
              }
            },
            beforeUpload: (file) => {
              if (file) {
                const isValidSize = settingSystem?.image_size
                  ? file.size && file.size < settingSystem?.image_size * 1000000
                  : file.size < 3000000;

                if (!isValidSize) {
                  message.error(
                    intl.formatMessage({id: 'pages.user.info.file_size_error'}),
                    MESSAGE_DISPLAY_SECONDS.ERROR,
                  );

                  return Upload.LIST_IGNORE;
                }
              }
            },
            customRequest: async ({file, onSuccess}: any) => {
              setIsLoadingUpload(true);
              if (file && onSuccess && file.size) {
                const response = await upload.uploadFile(file);
                if (response) {
                  setIsLoadingUpload(false);
                }
                onSuccess(response, file);
              }
            },
          }}
          icon={
            <svg
              className="d-block mx-auto"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"
                fill="black"
              />
            </svg>
          }
          title="Upload"
          action="/"
        />

        {imagePreviewNode}
      </ProForm>
      <span className="section-space-top"/>
      <ul className="proform-info-list">
        {!_.isEmpty(parentRealEstate) &&
        !_.isUndefined(parentRealEstate) &&
        parentRealEstate?.code ? (
          <li>
            <span>BĐS trực thuộc:</span>
            <Link to={`/${typePage?.path}/${parentRealEstate.id}`} title={parentRealEstate.code}>
              {parentRealEstate.code}
            </Link>
          </li>
        ) : (
          <></>
        )}
        {!_.isEmpty(childrenRealEstate) &&
        !_.isUndefined(childrenRealEstate) &&
        childrenRealEstate?.code ? (
          <li>
            <span>BĐS liên quan:</span>
            <Link
              to={`/${typePage?.path}/${childrenRealEstate.id}`}
              title={childrenRealEstate.code}
            >
              {childrenRealEstate.code}
            </Link>
          </li>
        ) : (
          <></>
        )}
      </ul>
      <ProTableHistoryEditRealEstate forceUpdate={forceUpdate}/>
    </>
  );
}
