import { Modal, Space } from 'antd';
import _ from 'lodash';
import { useModel, useIntl } from 'umi';
type PopupConfirmConvertSingleRealEstateToDuplicateProps = {
  realEstateId: string;
  hidden?: boolean;
  handlePushPageToPageList: () => void;
  handleRefreshPage: () => void;
  localePage: string;
  realEstateService: any;
};

export default function PopupConfirmConvertSingleRealEstateToDuplicate({
  realEstateId,
  hidden,
  handlePushPageToPageList,
  handleRefreshPage,
  localePage,
  realEstateService,
}: PopupConfirmConvertSingleRealEstateToDuplicateProps) {
  const { handleResponseEditRealEstate } = useModel('realEstateSell');
  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const workspace_id = getWorkspaceId(initialState);
  const intl = useIntl();
  const confirm = () => {
    Modal.confirm({
      title:
        'Khi BĐS bị đánh dấu là trùng thì sẽ không thể thay đổi thông tin. Bạn có muốn tiếp tục quy trình không ?',
      okText: 'Tiếp tục',
      cancelText: 'Huỷ',
      width: 600,
      onOk: async () => {
        if (realEstateId) {
          const responseDuplicateRealEstate: string | any =
            await realEstateService.convertSingleRealEstateToDuplicate(realEstateId, workspace_id);

          handleResponseEditRealEstate(
            {
              response: responseDuplicateRealEstate,
              handleRefreshPage: handleRefreshPage,
              handlePushPageToPageList: handlePushPageToPageList,
              intl,
            },
            {
              localeActionSuccessId: 'pages.real_estate_sale.convert_duplicate_success',
              localeForbiddenId: `pages.${localePage}.delivered_detail`,
              localeActionFailedId: 'pages.real_estate_sale.convert_duplicate_success',
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
        style={{ fontSize: '16px' }}
      >
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.7107 9.81749C14.2835 10.0997 14.8298 10.3637 15.3712 10.6367C15.8497 10.8789 16.0737 11.3295 15.9781 11.8511C15.907 12.2393 15.6648 12.4933 15.3174 12.663C14.4005 13.1115 13.4841 13.5616 12.5684 14.0134C11.3928 14.5899 10.2171 15.1678 9.04118 15.7471C8.34868 16.0852 7.65071 16.0848 6.95866 15.7448C4.85611 14.7131 2.75416 13.6792 0.652816 12.643C0.22757 12.4345 -7.7943e-05 12.0936 0.00401972 11.6271C0.0062962 11.1679 0.231668 10.8306 0.650084 10.6258C1.18961 10.3614 1.72868 10.096 2.28915 9.82113C2.2072 9.77562 2.14482 9.74012 2.08017 9.70826C1.61167 9.47796 1.14454 9.24584 0.674215 9.01918C0.244871 8.81209 0.00493031 8.47301 0.0053856 7.99784C0.0058409 7.52267 0.245782 7.18542 0.676036 6.97787C1.16138 6.74438 1.64308 6.50316 2.12661 6.26512C2.17578 6.24054 2.22359 6.2146 2.29279 6.17865C1.72367 5.89919 1.17686 5.63612 0.635059 5.36349C-0.0984218 4.99619 -0.221352 4.03175 0.396485 3.51972C0.48057 3.45249 0.572256 3.39536 0.669662 3.34949C2.76038 2.31784 4.85201 1.28832 6.94455 0.260913C7.64251 -0.081808 8.34367 -0.0909108 9.04209 0.25363C11.1401 1.28285 13.2373 2.3136 15.3338 3.34585C15.7613 3.55567 16.0013 3.89475 15.9995 4.36992C15.9995 4.83735 15.7627 5.17415 15.3402 5.38033C14.8052 5.64158 14.2721 5.90602 13.7157 6.18047C13.7822 6.21506 13.8309 6.241 13.8801 6.26512C14.3681 6.50635 14.8565 6.74696 15.3452 6.98697C15.7682 7.19406 15.999 7.53314 15.999 8.00057C15.999 8.468 15.7654 8.80663 15.3434 9.01189C14.8098 9.27588 14.2766 9.53895 13.7107 9.81749ZM1.90351 4.36355C1.95951 4.39359 1.9841 4.40906 2.00914 4.42044C3.85096 5.32708 5.69218 6.23448 7.53279 7.14263C7.86106 7.30557 8.16383 7.2951 8.48891 7.13307C10.3028 6.23432 12.1188 5.34013 13.937 4.45048C13.9848 4.42681 14.0303 4.39859 14.0881 4.36582C14.0544 4.34398 14.0371 4.33032 14.0171 4.32031C12.1504 3.40153 10.2837 2.4826 8.41697 1.56352C8.13105 1.42243 7.85468 1.43153 7.5683 1.57308C6.16508 2.26732 4.76095 2.95823 3.35591 3.64579C2.8783 3.88064 2.40206 4.11732 1.90351 4.36355ZM1.90351 7.99739C1.97591 8.03562 2.01506 8.05701 2.05467 8.07658C3.89164 8.9814 5.72875 9.88667 7.56602 10.7924C7.86424 10.9394 8.15017 10.9344 8.44702 10.7879C10.0439 9.99894 11.6418 9.21185 13.2408 8.42658L14.0927 8.00649C14.0687 7.98867 14.0438 7.97211 14.018 7.95688C13.3975 7.65057 12.7778 7.34244 12.1536 7.04387C12.082 7.01988 12.0037 7.02512 11.936 7.05843C10.9871 7.51934 10.0399 7.98434 9.09445 8.45344C8.36826 8.81345 7.6457 8.81755 6.91814 8.45708C5.97295 7.98828 5.02593 7.52283 4.07709 7.06071C4.01745 7.03158 3.92594 7.00746 3.87403 7.03203C3.22569 7.34289 2.58145 7.66331 1.90397 7.99739H1.90351ZM14.1077 11.6349C13.4275 11.2999 12.7828 10.9795 12.134 10.6686C12.0821 10.6436 11.992 10.6654 11.9332 10.6941C10.9798 11.1586 10.0278 11.6261 9.07715 12.0964C8.36234 12.4487 7.64843 12.4528 6.93225 12.0991C6.02713 11.6522 5.1179 11.213 4.21733 10.7574C4.02291 10.659 3.87176 10.6481 3.67097 10.7537C3.09593 11.0573 2.50815 11.3331 1.90852 11.6299C1.96407 11.6622 1.99958 11.6868 2.04101 11.7063C3.85263 12.5975 5.66744 13.4814 7.4736 14.3839C7.84467 14.5692 8.17157 14.566 8.53945 14.3803C9.8721 13.7103 11.2139 13.0604 12.552 12.4004L14.1077 11.6349Z"
              fill="#1D1E20"
            />
          </svg>
        </span>
        Trùng BĐS
      </Space>
    </>
  );
}
