import ProForm, {
  ModalForm,
  ProFormInstance,
  ProFormSelect,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { ReactNode, useEffect, useRef, useState } from 'react';
import FormRealEstateSellDetail from './FormRealEstateDetail';
import { TagRender } from './TagRender';
import FormRealEstateSellMain from './FormRealEstateMain';
import Settings from '../../../../config/defaultSettings';
import _ from 'lodash';
import { realEstateService } from '@/services/realEstateService';
import { Col, Image, message, Row, Upload, UploadFile } from 'antd';
import { history, useIntl, useModel, useParams } from 'umi';
import { upload } from '@/api/upload';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import { formatDate } from '@/utils';
import dayjs from 'dayjs';
import CustomButton from '@/components/Custom/CustomButton';

interface FormRealEstateSellPreviewProps {
  handleConfirmation: (data: any) => Promise<boolean>;
}
export default function FormRealEstateSellPreview({
  handleConfirmation,
}: FormRealEstateSellPreviewProps) {
  const formRef = useRef<ProFormInstance>();
  const { id } = useParams<RealEstate.Params>();
  const { pathname } = history.location;
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  let workspace_id: string = getWorkspaceId(initialState);
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);

  const { requiredStatus, typePage, handleChangePage } = useModel('realEstateSell');

  const {
    realEstateStatus,
    setPrevEstateStatusId,
    forceUpdate,
    setForceUpdate,
    parentRealEstateId,
    isVisibleModalNote,
    setIsVisibleModalNote,
    setFormRefRealEstate,
    setListPathUrl,
    setVisibleAlert,
    setIsAgency,
    updateProperties,
    setParentRealEstateId,
  } = useModel('realEstateSell');
  const [urlImagePreview, setUrlImagePreview] = useState<string | undefined>();
  const [imagePreviewNode, setImagePreviewNode] = useState<ReactNode>(<></>);
  const { getSetting, settingSystem } = useModel('setting');

  useEffect(() => {
    if (parentRealEstateId) setForceUpdate((prv) => prv + 1);
  }, [parentRealEstateId]);

  useEffect(() => {
    getSetting(workspace_id);
    setVisibleAlert(false);
  }, []);

  useEffect(() => {
    setParentRealEstateId(id);
  }, [id]);
  useEffect(() => {
    handleChangePage(pathname);
  }, [pathname]);

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
          style={{ display: 'none' }}
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

  return (
    <>
      <ProForm
        formRef={formRef}
        onFinish={handleConfirmation}
        params={{ forceUpdate }}
        request={async (params) => {
          const data = await realEstateService.getRealEstateById(id, workspace_id);
          const detail = data?.detail;
          let listPathNew: UploadFile[] | undefined;
          if (data) {
            listPathNew = detail?.listPath?.map((path: RealEstate.ItemPath) => ({
              uid: path.id,
              name: path.cdn_path ? path.cdn_path : path.path || '',
              url: path.cdn_path ? path.cdn_path : `${Settings.APP_ROOT}/${path.path}`,
              status: 'done',
              thumbUrl: path.cdn_path ? path.cdn_path : `${Settings.APP_ROOT}/${path.path}`,
            }));
            setListPathUrl(listPathNew);
          }

          setIsAgency(false);
          setPrevEstateStatusId(data?.real_estate_status_id);
          updateProperties({
            ...data,
            ...detail,
            broker_full_name: undefined,
            broker_phone_number: undefined,
          });

          return {
            ...data,
            ...detail,
            agency: false,
            location: data?.location?.toString(),
            broker_full_name: undefined,
            broker_phone_number: undefined,
            code: null,
            image_list: listPathNew,
            category_id: {
              value: data?.category_id,
              label: data?.real_estate_category_title,
            },
            created_date: formatDate(dayjs().toString())?.toString(),
          };
        }}
        submitter={{
          searchConfig: {
            resetText: intl.formatMessage({ id: 'form.cancel' }),
            submitText: intl.formatMessage({ id: 'form.card.operation.save' }),
          },
          onReset: () => {
            history.push(`/${typePage}/list`);
          },
          render(props, dom) {
            return (
              <div className="form-footer">
                {dom[0]}{' '}
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
        <Row gutter={{ xs: 12, sm: 12, md: 24 }}>
          <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
            <ProFormSelect
              label={intl.formatMessage({ id: 'pages.real_estate_sale.status' })}
              name="real_estate_status_id"
              options={realEstateStatus}
              disabled={true}
              mode="multiple"
              fieldProps={{
                value: realEstateStatus.find(
                  (value) => value.type === typePage?.type && value.isDefault,
                )?.value,
                tagRender: (props) => TagRender(props),
              }}
              rules={[
                {
                  required: requiredStatus,
                  message: intl.formatMessage({ id: 'form.enter_info' }),
                },
              ]}
              placeholder={
                realEstateStatus ? intl.formatMessage({ id: 'pages.real_estate_sale.status' }) : ''
              }
            />
          </Col>
        </Row>
        <ProFormTextArea name="note_change" hidden />
        <Row gutter={{ xs: 12, sm: 12, md: 24 }}>
          <FormRealEstateSellMain formRef={formRef} />
          <FormRealEstateSellDetail />
        </Row>
        <span className="section-space-top" />
        <h3 className="section-title">
          {intl.formatMessage(
            { id: `pages.${typePage?.locale}.image` },
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
                    intl.formatMessage({ id: 'pages.user.info.file_size_error' }),
                    MESSAGE_DISPLAY_SECONDS.ERROR,
                  );

                  return Upload.LIST_IGNORE;
                }
              }
            },
            customRequest: async ({ file, onSuccess }: any) => {
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
      </ProForm>
      <span className="section-space-top" />
      <ModalForm
        width={480}
        title={intl.formatMessage({ id: 'pages.real_estate_sale.note_change' })}
        visible={isVisibleModalNote}
        submitter={{
          searchConfig: {
            submitText: 'Mở BĐS',
          },
        }}
        onFinish={async (data) => {
          const { note_change } = data;
          formRef.current?.setFieldsValue({ note_change: note_change });
          formRef.current?.submit();
        }}
        modalProps={{
          closable: false,
        }}
        onVisibleChange={setIsVisibleModalNote}
      >
        <ProFormTextArea
          label={intl.formatMessage({ id: 'pages.real_estate_sale.value_change' })}
          placeholder={intl.formatMessage({ id: 'pages.real_estate_sale.enter_value_change' })}
          name="note_change"
        />
      </ModalForm>
    </>
  );
}
