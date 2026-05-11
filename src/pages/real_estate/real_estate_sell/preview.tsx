import itemRender from '@/helpers/breadcrumbHelper';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, message, Modal, Row, Col } from 'antd';
import { useIntl, useModel, history } from 'umi';
import FormRealEstateSellPreview from '../components/FormRealEstatePreview';
import { realEstateService } from '@/services/realEstateService';
import { REAL_ESTATE_TYPE_ENUM } from '../constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';
import { useEffect } from 'react';

export default function Preview() {
  const intl = useIntl();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const {
    visibleAlert,
    setVisibleAlert,
    realEstateStatus,
    checkDuplicateRealEstate,
    formRefRealEstate,
    parentRealEstateId,
    isVisibleModalNote,
    setIsVisibleModalNote,
    handleRealEstateStatus,
    listPathUrl,
  } = useModel('realEstateSell');
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const onFinish = async (data: any) => {
    const { image_list } = data;
    const insertCloneRealEstate = async () => {
      let listPath: RealEstate.ItemPath[] | undefined = undefined;
      if (image_list && image_list.length > 0) {
        listPath = image_list.map((value: any) => {
          if (value.response) {
            return {
              id: value.response.id,
              cdn_path: value.response.cdn_path,
            };
          }
          if (value.name.includes('https://')) {
            return { id: value.uid, cdn_path: value.name };
          }
          return { id: value.uid, path: value.name };
        });
      } else {
        listPath = listPathUrl?.map((value) => {
          if (value.name.includes('https://')) {
            return { id: value.uid, cdn_path: value.name };
          }
          return { id: value.uid, path: value.name };
        });
      }
      const realEstateStatusDefault = realEstateStatus.find((value) => value.isDefault);
      const noteChange = formRefRealEstate?.current?.getFieldValue('note_change');

      const { data: real_estate_id, keyResponse } = await realEstateService
        .insertRealEstateSell({
          ...data,
          listPath: listPath,
          type: REAL_ESTATE_TYPE_ENUM.SELL,
          real_estate_status_id: realEstateStatusDefault?.value,
          parent_real_estate_id: parentRealEstateId,
          previous_real_estate_status: realEstateStatusDefault?.label,
          note_change: noteChange,
          category_id:
            data.category_id && typeof data.category_id === 'object'
              ? data.category_id.value
              : data.category_id,
          branch_id: workspace_id,
        })
        .then((res) => {
          setVisibleAlert(false);
          return res;
        });

      if (typeof real_estate_id === 'string') {
        message.success(
          intl.formatMessage({ id: 'pages.real_estate_sale.create_success' }),
          MESSAGE_DISPLAY_SECONDS.SUCCESS,
          async () => {
            setIsVisibleModalNote(false);
            history.push(`/real-estate-sell/${real_estate_id}`);
          },
        );
      } else if (keyResponse) {
        handleResponseFromCallApi(
          { response: keyResponse },
          { localeActionFailedId: 'pages.real_estate_sale.create_failed' },
        );
      }
    };
    insertCloneRealEstate();
    return true;
  };

  const handleConfirmation = async (data: any) => {
    const response = await checkDuplicateRealEstate(
      formRefRealEstate,
      parentRealEstateId,
      REAL_ESTATE_TYPE_ENUM.SELL,
      workspace_id,
    );
    if (!response) {
      Modal.confirm({
        width: 500,
        icon: (
          <svg
            className="icon"
            width="36"
            height="36"
            viewBox="0 0 36 36"
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
        ),
        okText: 'Tiếp tục',
        cancelText: 'Nhập lại',
        title: (
          <span className="ant-modal-warning-title">
            {intl.formatMessage({ id: 'pages.real_estate_sale.real_estate_exist' })}
          </span>
        ),
        content: (
          <span>
            Bạn có muốn tiếp tục tạo mới BĐS? <br />
            BĐS chỉ được lưu vào BĐS của tôi.
          </span>
        ),
        onOk() {
          formRefRealEstate?.current?.setFields([
            {
              name: 'real_estate_status_id',
              errors: [],
              validating: true,
            },
          ]);
          onFinish({ ...data, duplicate: true });
        },
        onCancel() {
          setVisibleAlert(true);
        },
      });
    } else if (isVisibleModalNote) {
      onFinish({ ...data, duplicate: false });
    } else {
      setIsVisibleModalNote(true);
    }
    return true;
  };

  useEffect(() => {
    handleRealEstateStatus(REAL_ESTATE_TYPE_ENUM.SELL);
  }, []);
  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.real_estate_sale.preview' }),
        ghost: true,
        breadcrumb: {
          itemRender: itemRender,
          routes: [
            {
              path: '/',
              breadcrumbName: intl.formatMessage({ id: 'global.home' }),
            },
            {
              path: 'real-estate-sell/list',
              breadcrumbName: intl.formatMessage({ id: 'pages.real_estate_sale.list' }),
            },
            {
              path: '',
              breadcrumbName: intl.formatMessage({ id: 'pages.real_estate_sale.preview' }),
            },
          ],
        },
        extra: [],
      }}
    >
      <ProCard
        headerBordered
        direction="column"
        title={intl.formatMessage({ id: 'pages.real_estate_sale.info' })}
      >
        <Row>
          <Col sm={{ span: 24 }} xs={{ span: 24 }} md={{ span: 0 }}>
            <Alert
              message="Thông tin BĐS bị trùng."
              type="warning"
              showIcon
              className="mb-4"
              style={{ display: visibleAlert ? 'flex' : 'none' }}
              icon={
                <svg
                  width="24"
                  height="24"
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
              }
            />
          </Col>
          <Col sm={{ span: 0 }} xs={{ span: 0 }} md={{ span: 24 }}>
            <Alert
              message="BĐS đã có trong hệ thống và chỉ được lưu vào BĐS của tôi."
              type="warning"
              showIcon
              className="mb-4"
              style={{ display: visibleAlert ? 'flex' : 'none' }}
              icon={
                <svg
                  width="24"
                  height="24"
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
              }
            />
          </Col>
        </Row>
        <FormRealEstateSellPreview handleConfirmation={handleConfirmation} />
      </ProCard>
    </PageContainer>
  );
}
