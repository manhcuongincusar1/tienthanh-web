import BaseService from './baseService';
import { apiUser } from '@/api/users/api';

class UserService extends BaseService {
  getRole = (): Promise<any> => {
    return apiUser
      .getRole()
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };

  getUserInfoToAssignRealEstate = async (keyword: string, branch_id: string): Promise<any> => {
    return apiUser
      .getUserInfoToAssignRealEstate(keyword, branch_id)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };
}

export const userService = new UserService();
