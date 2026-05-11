import {apiUser} from '@/api/users/api';
import BaseService from "./baseService";

class AuthService extends BaseService {
  /**
   * login with username and password
   * @param {API.LoginParams} body
   */
  login = (body: API.LoginParams): Promise<API.LoginResponse> => {
    return apiUser.loginApi(body);
  }

  getUserInfo = (): Promise<API.CurrentUser> => {
    return apiUser.getCurrentUserApi();
  }
}

export const authService = new AuthService();
