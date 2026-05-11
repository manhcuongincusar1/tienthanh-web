import ProForm, { ProFormInstance, ProFormText, ProFormUploadButton } from '@ant-design/pro-form';
import { ReactNode, useEffect, useRef, useState } from 'react';
import FormRealEstateSellDetail from './FormRealEstateDetail';
import FormRealEstateSellMain from './FormRealEstateMain';
import { Image, message, Row, Upload } from 'antd';
import { history, useIntl, useModel } from 'umi';
import { upload } from '@/api/upload';
import _ from 'lodash';
import CustomButton from '@/components/Custom/CustomButton';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

interface FormRealEstateSellProps {
  onFinish: (data: any) => Promise<boolean>;
}

export default function FormRealEstateSell({ onFinish }: FormRealEstateSellProps) {
  const formRef = useRef<ProFormInstance>();
  const intl = useIntl();
  const { pathname } = history.location;
  const [urlImagePreview, setUrlImagePreview] = useState<string | undefined>();
  const [imagePreviewNode, setImagePreviewNode] = useState<ReactNode>(<></>);
  const [isLoadingUpload, setIsLoadingUpload] = useState<boolean>(false);
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const {
    setFormRefRealEstate,
    handleChangePage,
    setVisibleAlert,
    typePage,
    setIsAgency,
    updateProperties,
  } = useModel('realEstateSell');
  const { getSetting, settingSystem } = useModel('setting');

  useEffect(() => {
    handleChangePage(pathname);
  }, [pathname]);

  useEffect(() => {
    getSetting(workspace_id);
    setVisibleAlert(false);
    setIsAgency(false);
    updateProperties({});
  }, []);

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

  useEffect(() => {
    if (formRef) {
      setFormRefRealEstate(formRef);
    }
  }, [formRef]);

  return (
    <ProForm
      formRef={formRef}
      onFinish={onFinish}
      submitter={{
        searchConfig: {
          resetText: intl.formatMessage({ id: 'form.cancel' }),
          submitText: 'Tạo mới',
        },
        onReset: () => {
          if (typePage) {
            history.push(`/${typePage?.path}/list`);
          } else {
            history.push(`/real-estate-sell/list`);
          }
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
                Tạo
              </CustomButton>

              <CustomButton
                onClick={() => {
                  formRef.current?.setFieldsValue({ type_submit: 'create_close' });
                  formRef.current?.submit();
                }}
                type="primary"
                loading={isLoadingUpload}
                disabled={isLoadingUpload}
              >
                {` Tạo & đóng lại`}
              </CustomButton>
            </div>
          );
        },
      }}
    >
      <Row gutter={{ xs: 12, sm: 12, md: 24 }}>
        <FormRealEstateSellMain formRef={formRef} />
        <FormRealEstateSellDetail />
        <ProFormText name="type_submit" hidden />
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
            if (file && onSuccess) {
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
  );
}
