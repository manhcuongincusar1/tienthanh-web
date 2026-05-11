import BaseAPI from '@/api/baseAPI';
import Settings from '../../../config/defaultSettings';

class ApiUser extends BaseAPI {
  loginApi = (body: API.LoginParams): Promise<API.LoginResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/auth/generate`, 'post', body, {}).then(
      (res) => {
        if (res.status == 200) {
          return res.data;
        } else if (res.status == 206) {
          return res.data;
        }
      },
    );
  };

  getCurrentUserApi = (): Promise<API.CurrentUser> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/auth/get-login-info`,
      'get',
      {},
      {},
    ).then((res) => {
      if (res.status == 200) {
        return res.data;
      }
    });
  };
  checkUserExist = (body: API.UserExist): Promise<any> => {
    return this.httpApi('user/check-exist', 'post', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        } else if (res.status === 206) {
          return res.data;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
  sendEmailResetPassword = (body: API.UserExist): Promise<any> => {
    return this.httpApi('email/reset-password', 'post', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
  checkTokenResetPassword = (body: API.UserToken): Promise<any> => {
    return this.httpApi('user/check-activation-key', 'post', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
  resetPassword = (body: API.ResetPassword): Promise<any> => {
    return this.httpApi('user/reset-password', 'post', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
  changePassword = (body: API.ChangePassword): Promise<any> => {
    return this.httpApi('user/change-password', 'post', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
  changePasswordFirst = (body: API.ChangePassword): Promise<any> => {
    return this.httpApi('user/change-password-first', 'post', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
  getPersonalInfo = (): Promise<any> => {
    return this.httpApi('user/personal-info', 'get', {}, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
  checkPhoneExist = (body: API.CheckPhoneExist): Promise<any> => {
    return this.httpApi('user/check-phone', 'post', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
  updatePersonalInfo = (body: API.UpdatePersonalInfo): Promise<any> => {
    return this.httpApi('user/update-personal-info', 'post', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
  updateUrlAvatar = (body: any): Promise<any> => {
    return this.httpApi('user/update-url-avatar', 'put', body, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
  getRole = (): Promise<any> => {
    return this.httpApi('user/get-role', 'get', {}, {})
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };

  getUserInfoToAssignRealEstate = (keyword: string, branch_id: string): Promise<any> => {
    return this.httpApi(
      'user/search-info',
      'get',
      {
        params: {
          keyword: keyword,
          branch_id: branch_id,
        },
      },
      {},
    );
  };
}

export const apiUser = new ApiUser();
