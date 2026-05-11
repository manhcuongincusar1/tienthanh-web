import { message, Modal, Space } from 'antd';
import _ from 'lodash';
import { useIntl, useModel } from 'umi';

type PopupConfirmDeleteSingleRealEstateProps = {
  realEstateId: string;
  hidden?: boolean;
  handlePushPageToPageList: () => void;
  handleRefreshPage: () => void;
  localePage: string;
  realEstateService: any;
};

export default function PopupConfirmDeleteSingleRealEstate({
  realEstateId,
  hidden,
  handlePushPageToPageList,
  handleRefreshPage,
  localePage,
  realEstateService,
}: PopupConfirmDeleteSingleRealEstateProps) {
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
        if (realEstateId) {
          const response: string | any = await realEstateService.deleteSingleRealEstate(
            realEstateId,
            workspace_id,
          );

          handleResponseEditRealEstate(
            {
              response: response,
              handleRefreshPage: handleRefreshPage,
              handlePushPageToPageList: handlePushPageToPageList,
              intl: intl,
            },
            {
              localeActionSuccessId: 'pages.real_estate_sale.delete_success',
              localeForbiddenId: `pages.${localePage}.delivered_detail`,
              localeActionFailedId: 'pages.real_estate_sale.delete_failed',
              localeDuplicateId: `pages.${localePage}.duplicated_detail`,
              localeDeleteId: `pages.${localePage}.deleted_detail`,
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
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <svg
            width="14"
            height="16"
            viewBox="0 0 14 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.66732 1.99984C5.49051 1.99984 5.32094 2.07007 5.19591 2.1951C5.07089 2.32012 5.00065 2.48969 5.00065 2.6665V3.33317H9.00065V2.6665C9.00065 2.48969 8.93041 2.32012 8.80539 2.1951C8.68036 2.07007 8.5108 1.99984 8.33398 1.99984H5.66732ZM10.334 3.33317V2.6665C10.334 2.13607 10.1233 1.62736 9.7482 1.25229C9.37313 0.877218 8.86442 0.666504 8.33398 0.666504H5.66732C5.13688 0.666504 4.62818 0.877218 4.2531 1.25229C3.87803 1.62736 3.66732 2.13607 3.66732 2.6665V3.33317H1.00065C0.632461 3.33317 0.333984 3.63165 0.333984 3.99984C0.333984 4.36803 0.632461 4.6665 1.00065 4.6665H1.66732V13.3332C1.66732 13.8636 1.87803 14.3723 2.2531 14.7474C2.62818 15.1225 3.13688 15.3332 3.66732 15.3332H10.334C10.8644 15.3332 11.3731 15.1225 11.7482 14.7474C12.1233 14.3723 12.334 13.8636 12.334 13.3332V4.6665H13.0007C13.3688 4.6665 13.6673 4.36803 13.6673 3.99984C13.6673 3.63165 13.3688 3.33317 13.0007 3.33317H10.334ZM3.00065 4.6665V13.3332C3.00065 13.51 3.07089 13.6795 3.19591 13.8046C3.32094 13.9296 3.49051 13.9998 3.66732 13.9998H10.334C10.5108 13.9998 10.6804 13.9296 10.8054 13.8046C10.9304 13.6795 11.0007 13.51 11.0007 13.3332V4.6665H3.00065ZM5.66732 6.6665C6.03551 6.6665 6.33398 6.96498 6.33398 7.33317V11.3332C6.33398 11.7014 6.03551 11.9998 5.66732 11.9998C5.29913 11.9998 5.00065 11.7014 5.00065 11.3332V7.33317C5.00065 6.96498 5.29913 6.6665 5.66732 6.6665ZM7.66732 7.33317C7.66732 6.96498 7.96579 6.6665 8.33398 6.6665C8.70218 6.6665 9.00065 6.96498 9.00065 7.33317V11.3332C9.00065 11.7014 8.70218 11.9998 8.33398 11.9998C7.96579 11.9998 7.66732 11.7014 7.66732 11.3332V7.33317Z"
              fill="#D92128"
            />
          </svg>
        </span>
        Xoá BĐS
      </Space>
    </>
  );
}
