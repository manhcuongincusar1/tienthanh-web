import itemRender from '@/helpers/breadcrumbHelper';
import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Modal, Row, Col, Button, Dropdown } from 'antd';
import { useIntl, useModel, useParams, useAccess, history } from 'umi';
import FormRealEstateEdit from '../../components/FormRealEstateEdit';
import { realEstateService } from '@/services/realEstateService';
import { useEffect } from 'react';
import { REAL_ESTATE_TYPE_ENUM } from '../../constants';
import Styles from '../styles/index.less';
import MenuAction from '../../components/MenuAction';
import _ from 'lodash';

export default function Create() {
  const intl = useIntl();
  const { id } = useParams<RealEstate.Params>();
  const {
    visibleAlert,
    checkDuplicateRealEstate,
    setVisibleAlert,
    formRefRealEstate,
    realEstateStatus,
    previousStatusText,
    handleRealEstateStatus,
    setForceUpdate,
    typePage,
    handleResponseEditRealEstate,
  } = useModel('realEstateSell');
  const access = useAccess();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  useEffect(() => {
    if (id) {
      setForceUpdate((prv) => prv + 1);
    }
  }, [id]);

  const _func = {
    handlePushToPageRealEstateList: () => {
      history.push('/real-estate-sell/list');
    },
    handleRefreshPage: () => {
      setForceUpdate((prv) => prv + 1);
      setVisibleAlert(false);
    },
    onFinish: async (data: any) => {
      const { real_estate_status_id, image_list, code } = data;
      const isDuplicateRealEstate = await checkDuplicateRealEstate(
        formRefRealEstate,
        id,
        REAL_ESTATE_TYPE_ENUM.SELL,
        workspace_id,
      );
      const updateRealEstate = async (duplicate: boolean) => {
        let listPath: RealEstate.ItemPath[] | undefined = undefined;

        if (image_list && image_list.length > 0) {
          listPath = image_list.map((value: any) => {
            if (value.response) {
              return {
                id: value.response.id,
                cdn_path: value.response.cdn_path,
                path: value.response.path,
              };
            }

            if (value.name.includes('https://')) {
              return { id: value.uid, cdn_path: value.name };
            }

            return { id: value.uid, path: value.name };
          });
        } else {
          listPath = [];
        }
        const nextStatus = realEstateStatus.find((item) => item.value === real_estate_status_id);
        let previousStatusTextNew;
        let nextStatusTextNew;
        if (previousStatusText?.id !== nextStatus?.value) {
          previousStatusTextNew = previousStatusText;
          nextStatusTextNew = { title: nextStatus?.label, id: nextStatus?.value };
        }

        const responseUpdateRealEstate: string | any = await realEstateService.updateRealEstateSell(
          {
            ...data,
            code,
            type: REAL_ESTATE_TYPE_ENUM.SELL,
            duplicate: duplicate,
            listPath: listPath,
          },
          id,
          previousStatusTextNew,
          nextStatusTextNew,
        );

        handleResponseEditRealEstate(
          {
            response: responseUpdateRealEstate,
            handleRefreshPage: _func.handleRefreshPage,
            handlePushPageToPageList: _func.handlePushToPageRealEstateList,
            intl: intl,
          },
          {
            localeActionSuccessId: 'pages.real_estate_sale.edit_success',
            localeForbiddenId: `pages.${typePage?.locale || 'real_estate_sale'}.delivered_detail`,
            localeActionFailedId: 'pages.real_estate_sale.edit_failed',
            localeDuplicateId: `pages.${typePage?.locale || 'real_estate_sale'}.duplicated_detail`,
            localeDeleteId: `pages.${typePage?.locale || 'real_estate_sale'}.deleted_detail`,
          },
        );
      };
      if (isDuplicateRealEstate) {
        updateRealEstate(false);
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
              Bạn có muốn tiếp tục chỉnh sửa BĐS? <br />
              BĐS chỉ được lưu vào BĐS của tôi.
            </span>
          ),
          onOk() {
            updateRealEstate(true);
          },
        });
      }
      return true;
    },
  };

  useEffect(() => {
    handleRealEstateStatus(REAL_ESTATE_TYPE_ENUM.SELL);
  }, []);

  return (
    <PageContainer
      header={{
        title: intl.formatMessage({ id: 'pages.real_estate_sale.detail' }),
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
              breadcrumbName: intl.formatMessage({ id: 'pages.real_estate_sale.detail' }),
            },
          ],
        },
        extra: [],
      }}
    >
      <ProCard
        headerBordered
        direction="column"
        className={Styles.cardDetailRealEstate}
        title={
          <div className={Styles.headingWrap}>
            <div className={Styles.headingLeft}>
              {intl.formatMessage({ id: 'pages.real_estate_sale.info' })}
            </div>
            {access.realEstateSellAssign && (
              <div className={Styles.headingRight}>
                <Dropdown
                  overlay={
                    <MenuAction
                      handlePushPageToPageList={_func.handlePushToPageRealEstateList}
                      handleRefreshPage={_func.handleRefreshPage}
                      hiddeDuplicateButton={!access.realEstateSellDuplicate || visibleAlert}
                      hiddeAssignButton={!access.realEstateSellAssign}
                      hiddeDeleteButton={!access.realEstateSellDelete}
                      localePage={typePage?.locale || 'real_estate_sell'}
                      realEstateService={realEstateService}
                    />
                  }
                  placement="bottomRight"
                >
                  <Button shape="circle" type="primary">
                    {intl.formatMessage({ id: 'form.card.operation' })}
                    <svg
                      width="18"
                      height="4"
                      viewBox="0 0 18 4"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0 2C0 0.89543 0.89543 0 2 0C3.10457 0 4 0.89543 4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2ZM7 2C7 0.89543 7.89543 0 9 0C10.1046 0 11 0.89543 11 2C11 3.10457 10.1046 4 9 4C7.89543 4 7 3.10457 7 2ZM14 2C14 0.89543 14.8954 0 16 0C17.1046 0 18 0.89543 18 2C18 3.10457 17.1046 4 16 4C14.8954 4 14 3.10457 14 2Z"
                        fill="white"
                      />
                    </svg>
                  </Button>
                </Dropdown>
              </div>
            )}
          </div>
        }
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

        <FormRealEstateEdit
          onFinish={_func.onFinish}
          pathListPage={'real-estate-sell'}
          realEstateService={realEstateService}
        />
      </ProCard>
    </PageContainer>
  );
}
