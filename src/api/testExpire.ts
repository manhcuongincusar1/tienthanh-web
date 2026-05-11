import BaseAPI from '@/api/baseAPI';
import Settings from '../../config/defaultSettings';

class TestUser extends BaseAPI {
  getUserApi = (body: API.LoginParams): Promise<API.LoginResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/test-knex`, 'get', body, {}).then(
      (res) => {
        if (res.status == 200) {
          return res.data;
        }
      },
    );
  };
}

export const testApi = new TestUser();
