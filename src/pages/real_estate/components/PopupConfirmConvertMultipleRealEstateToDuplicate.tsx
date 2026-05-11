import { Button, message, Modal, Space } from 'antd';
import _ from 'lodash';
import { useIntl, useModel } from 'umi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

type PopupConfirmConvertSingleRealEstateToDuplicateProps = {
  realEstateList: string[];
  hidden?: boolean;
  handleRefreshPage: () => void;
  localePage: string;
  realEstateService: any;
};

export default function PopupConfirmConvertSingleRealEstateToDuplicate({
  realEstateList,
  hidden,
  handleRefreshPage,
  localePage,
  realEstateService,
}: PopupConfirmConvertSingleRealEstateToDuplicateProps) {
  const intl = useIntl();
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const { handleResponseEditRealEstate } = useModel('realEstateSell');
  const confirm = () => {
    Modal.confirm({
      title:
        'Khi BĐS bị đánh dấu là trùng thì sẽ không thể thay đổi thông tin. Bạn có muốn tiếp tục quy trình không ?',
      okText: 'Tiếp tục',
      cancelText: 'Huỷ',
      width: 600,
      onOk: async () => {
        if (_.isArray(realEstateList) && !_.isEmpty(realEstateList)) {
          const response: string | any = await realEstateService.convertRealEstateListToDuplicate(
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
              localeActionSuccessId: 'pages.real_estate_sale.convert_duplicate_success',
              localeForbiddenId: 'pages.real_estate_sale.delivered',
              localeActionFailedId: 'pages.real_estate_sale.convert_duplicate_failed',
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
          const checkIsValidRealEstateList = realEstateList?.every((item) => item !== '');
          if (checkIsValidRealEstateList) {
            confirm();
          } else {
            const messageError =
              _.isArray(realEstateList) && realEstateList?.length > 1
                ? 'pages.real_estate_sale.invalid_real_estate_list_action'
                : 'pages.real_estate_sale.invalid_real_estate_action';
            message.error(
              intl.formatMessage({
                id: messageError,
              }),
              MESSAGE_DISPLAY_SECONDS.ERROR,
            );
          }
        }}
        size="middle"
        align="center"
        style={{ fontSize: '16px' }}
      >
        <Button style={{ marginRight: '16px' }} shape="circle">
          Trùng BĐS
        </Button>
      </Space>
    </>
  );
}
