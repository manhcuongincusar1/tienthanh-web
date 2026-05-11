import BaseAPI from '@/api/baseAPI';
import Settings from '../../../config/defaultSettings';

class ApiNotifications extends BaseAPI {
  postSubscriptionApi = (data: object): Promise<API.MpireResponse | any> => {
    return this.httpApi(`common/subscription`, 'post', data, {}).then((res) => {
      if (res.status == 200) {
        localStorage.setItem('notification_auth', res.data);
        return res.data;
      }
    });
  };

  getNotification = (subscriptionId: string): Promise<API.MpireResponse | any> => {
    return this.httpApi(`common/subscription/${subscriptionId}`, 'get', {}, {}).then((res) => {
      if (res.status == 200) {
        const { data } = res;
        return { data };
      }
    });
  };
  deleteSubscription = (authSubscription: string | undefined): Promise<API.MpireResponse> => {
    return this.httpApi(`common/subscription/${authSubscription}`, 'delete', {}, {}).then((res) => {
      if (res.status == 200) {
        const { data } = res;
        return data;
      }
    });
  };
}

export const apiNotifications = new ApiNotifications();
