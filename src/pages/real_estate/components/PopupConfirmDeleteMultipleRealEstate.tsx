import { Button, message, Modal, Space } from 'antd';
import _ from 'lodash';
import { useIntl, useModel } from 'umi';

type PopupConfirmDeleteRealEstateProps = {
  realEstateList: string[];
  hidden?: boolean;
  handleRefreshPage: () => void;
  localePage: string;
  realEstateService: any;
};

export default function PopupConfirmDeleteRealEstate({
  realEstateList,
  hidden,
  handleRefreshPage,
  localePage,
  realEstateService,
}: PopupConfirmDeleteRealEstateProps) {
  const intl = useIntl();
  const { handleResponseEditRealEstate } = useModel('realEstateSell');
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const confirm = () => {
    Modal.confirm({
      title: 'BĐS sẽ bị xoá vĩnh viễn. Bạn có đồng ý xoá BĐS không ?',
      okText: 'Đồng ý',
      cancelText: 'Huỷ',
      width: 600,
      onOk: async () => {
        if (_.isArray(realEstateList) && !_.isEmpty(realEstateList)) {
          const response: string | any = await realEstateService.deleteRealEstateList(
            realEstateList,
            workspace_id,
          );

          const isMultipleAssignItem = realEstateList?.length > 1;
          handleResponseEditRealEstate(
            {
              response: response,
              handleRefreshPage: handleRefreshPage,
              handlePushPageToPageList: handleRefreshPage,
              intl,
            },
            {
              localeActionSuccessId: 'pages.real_estate_sale.delete_success',
              localeActionFailedId: 'pages.real_estate_sale.delete_failed',
              localeForbiddenId: 'pages.real_estate_sale.delivered',
              localeDuplicateId: isMultipleAssignItem
                ? `pages.${localePage}.duplicated_multiple`
                : `pages.${localePage}.duplicated`,
              localeDeleteId: isMultipleAssignItem
                ? `pages.${localePage}.deleted_multiple`
                : `pages.${localePage}.deleted`,
            },
          );
        }
      },
    });
  };
  return (
    <>
      <Space
        hidden={hidden}
        onClick={() => {
          confirm();
        }}
        size="middle"
        align="center"
        style={{ fontSize: '16px', color: '#D92128' }}
      >
        <Button style={{ marginRight: '16px' }} shape="circle">
          Xoá BĐS
        </Button>
      </Space>
    </>
  );
}
