import itemRender from '@/helpers/breadcrumbHelper';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Modal, message, Row, Col } from 'antd';
import { useIntl, useModel, history } from 'umi';
import FormRealEstateSell from '../components/FormRealEstate';
import { realEstateService } from '@/services/realEstateService';
import { useEffect } from 'react';
import { REAL_ESTATE_TYPE_ENUM } from '../constants';
import useHandleResponseFromCallApi from '@/helpers/handleResponseFromApi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

export default function Create() {
  const intl = useIntl();
  const { handleResponseFromCallApi } = useHandleResponseFromCallApi();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');

  const {
    visibleAlert,
    setVisibleAlert,
    realEstateStatus,
    formRefRealEstate,
    handleRealEstateStatus,
    checkDuplicateRealEstate,
    setIsAgency,
  } = useModel('realEstateSell');
  useEffect(() => {
    setDefaultData();
  }, [realEstateStatus]);
  const setDefaultData = () => {
    formRefRealEstate?.current?.setFieldsValue({
      real_estate_status_id: realEstateStatus.find(
        (value) => value.type === REAL_ESTATE_TYPE_ENUM.SELL && value.isDefault,
      )?.value,
    });
    formRefRealEstate?.current?.setFields([
      {
        name: 'agency',
        value: false,
      },
      {
        name: 'goodwill',
        value: true,
      },
      {
        name: 'book_status',
        value: true,
      },
    ]);
  };
  useEffect(() => {
    handleRealEstateStatus(REAL_ESTATE_TYPE_ENUM.SELL);
  }, []);

  const onFinish = async (data: any) => {
    console.log(data);

    const { image_list, type_submit } = data;
    const workspace_id = getWorkspaceId(initialState);
    let listPath: RealEstate.ItemPath[] | undefined = undefined;
    if (image_list && image_list.length > 0) {
      listPath = image_list.map((value: any) => {
        if (value.response) {
          return {
            id: value.response.id,
            cdn_path: value.response.cdn_path,
          };
        }
        return { id: value.uid, cdn_path: value.name };
      });
    }
    const previousRealEstateStatus = realEstateStatus.find(
      (value) => value.type === REAL_ESTATE_TYPE_ENUM.SELL && value.isDefault,
    )?.label;
    const response = await checkDuplicateRealEstate(
      formRefRealEstate,
      undefined,
      REAL_ESTATE_TYPE_ENUM.SELL,
      workspace_id,
    );

    const onInsertRealEstate = async (duplicate: boolean) => {
      const { keyResponse, data: dataResponse } = await realEstateService.insertRealEstateSell({
        ...data,
        type: REAL_ESTATE_TYPE_ENUM.SELL,
        listPath: listPath,
        duplicate: duplicate,
        branch_id: workspace_id,
        previous_real_estate_status: previousRealEstateStatus,
      });
      if (dataResponse) {
        message.success(
          intl.formatMessage({ id: 'pages.real_estate_sale.create_success' }),
          MESSAGE_DISPLAY_SECONDS.SUCCESS,
          () => {
            formRefRealEstate?.current?.resetFields();
            setVisibleAlert(false);
            setIsAgency(false);
            setDefaultData();
            if (type_submit === 'create_close') {
              history.push(`/real-estate-sell/list`);
            }
          },
        );
      } else if (keyResponse) {
        handleResponseFromCallApi(
          { response: keyResponse },
          {
            localeActionFailedId: 'pages.real_estate_sale.create_failed',
          },
        );
      }
    };

    if (response) {
      onInsertRealEstate(false);
    } else {
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
          onInsertRealEstate(true);
        },
        onCancel() {
          setVisibleAlert(true);
        },
      });
    }

    return true;
  };
  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.real_estate_sale.create' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.real_estate_sale.create' }),
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

        <FormRealEstateSell onFinish={onFinish} />
      </ProCard>
    </PageContainer>
  );
}
