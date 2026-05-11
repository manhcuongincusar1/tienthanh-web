import { message } from 'antd';
import { useModel, useIntl } from 'umi';
import { MESSAGE_DISPLAY_SECONDS } from '@/constants';

type DataHandleResponse = {
  response?: string;
  handleCallApiSuccess?: () => void;
  handleCallApiFailed?: () => void;
};

type LocaleMessageIdHandleResponse = {
  localeActionFailedId?: string;
};

const useHandleResponseFromCallApi = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const handleResponseFromCallApi = (
    dataHandleResponse: DataHandleResponse,
    localeMessageId?: LocaleMessageIdHandleResponse,
  ) => {
    const { response, handleCallApiSuccess, handleCallApiFailed } = dataHandleResponse;
    const localeActionFailedId = localeMessageId?.localeActionFailedId;

    switch (response) {
      case 'success':
        message.success(
          intl.formatMessage({ id: 'localeActionSuccessId' }),
          MESSAGE_DISPLAY_SECONDS.SUCCESS,
          () => {
            handleCallApiSuccess && handleCallApiSuccess();
          },
        );
        break;
      case 'forbidden':
        message.error(
          intl.formatMessage({ id: 'global.forbidden' }),
          MESSAGE_DISPLAY_SECONDS.ERROR,
        );
        setInitialState((s: any) => ({ ...s, show403: true }));
        break;
      case 'forbidden_branch':
        message.error(
          intl.formatMessage({ id: 'global.forbidden' }),
          MESSAGE_DISPLAY_SECONDS.ERROR,
        );
        let currentUser = initialState?.currentUser;
        if (currentUser) {
          currentUser.permission_data = false;
        }
        setInitialState((s: any) => ({ ...s, currentUser }));
        break;
      case 'notfound':
        message.error(intl.formatMessage({ id: 'global.notfound' }), MESSAGE_DISPLAY_SECONDS.ERROR);
        setInitialState((s: any) => ({ ...s, show404: true }));
        break;
      case 'user_not_active':
        message.error(
          intl.formatMessage({ id: 'global.user_not_active' }),
          MESSAGE_DISPLAY_SECONDS.ERROR,
        );
        break;
      default:
        message.error(
          intl.formatMessage({ id: localeActionFailedId || 'global.failed' }),
          MESSAGE_DISPLAY_SECONDS.ERROR,
          () => {
            handleCallApiFailed && handleCallApiFailed();
          },
        );
        break;
    }
  };
  return { handleResponseFromCallApi };
};

export default useHandleResponseFromCallApi;
