import BaseAPI from '@/api/baseAPI';
import Settings from '../../../config/defaultSettings';

class ApiAccount extends BaseAPI {
  getListAccountApi = (variables: object | undefined) => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/account/list`, 'post', variables);
  };

  getListAccountApiManagement = (variables: object | undefined) => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/account/get-list`, 'post', variables);
  };

  getAccountByIdApi = (id: string, branch_id: string) => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/account/get/` + id, 'get', {
      params: { branch_id: branch_id },
    });
  };

  checkUserNameExistByEmailOrPhoneNumber = (dataToCheck: {
    email?: string;
    raw_phone_number?: string;
    user_id?: string;
  }) => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/account/check-exist`,
      'get',
      {
        params: {
          ...dataToCheck,
        },
      },
      {},
    );
  };

  getListRolesApi = (getAll: boolean) => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/account/roles`, 'get', {
      params: {
        getAll: getAll,
      },
    }).then((res) => {
      if (res.status == 200) {
        return res;
      }
    });
  };

  getListBranches = () => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/account/branches`, 'get').then(
      (res) => {
        if (res.status == 200) {
          return res;
        }
      },
    );
  };

  insertAccountApi = (values: object | undefined) => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/account/insert`, 'post', values);
  };

  updateAccountApi = (values: object | undefined) => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/account/update`, 'post', values);
  };

  updateStatusByIdApi = (id: number, body: any): Promise<any> => {
    return this.httpApi(`account/update-status/${id}`, 'put', body, {});
  };

  updateAccountPasswordApi = (id: number, body: any): Promise<any> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/account/update-password/${id}`,
      'put',
      body,
    );
  };
}

export const apiAccount = new ApiAccount();
