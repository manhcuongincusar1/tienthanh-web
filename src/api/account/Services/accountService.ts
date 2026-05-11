import { apiAccount } from '@/api/account/api';
import BaseService from '@/services/baseService';
import _ from 'lodash';

class AccountService extends BaseService {
  getListAccount = (body: object | undefined): Promise<API.MpireResponse> => {
    return apiAccount
      .getListAccountApi(body)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
  getListAccountManagement = (body: object | undefined): Promise<API.MpireResponse> => {
    return apiAccount
      .getListAccountApiManagement(body)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  /**
   *
   * @param data
   * @param usingUser
   */
  getListAccountSelect = async (
    data: object | undefined,
    usingUser: boolean = false,
  ): Promise<API.AccountSelect[]> => {
    const { data: listAccount } = await this.getListAccount(data);
    let listAccounts = [] as API.AccountSelect[];
    if (!_.isEmpty(listAccount)) {
      _.map(listAccount, (value: API.Account) => {
        let valueId = value.sales_id;
        if (usingUser) {
          valueId = value.user_id;
        }
        listAccounts.push({
          label: value.full_name + ' - ' + value?.raw_phone_number,
          value: valueId,
        } as API.AccountSelect);
      });
    }
    return listAccounts;
  };

  getAccountById = (id: string, branch_id: string) => {
    return apiAccount
      .getAccountByIdApi(id, branch_id)
      .then((res) => {
        if (res.status == 200) {
          return { data: res.data };
        }
      })
      .catch((err) => {
        if (err?.response?.data.status === 404) {
          return { keyResponse: 'notfound' };
        }
        return { keyResponse: err?.response?.data?.message };
      });
  };

  checkUserNameExistByEmailOrPhoneNumber = (dataToCheck: {
    email?: string;
    raw_phone_number?: string;
    user_id?: string;
  }) => {
    return apiAccount
      .checkUserNameExistByEmailOrPhoneNumber(dataToCheck)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };

  getListRoles = (getAll: boolean) => {
    return apiAccount.getListRolesApi(getAll);
  };

  getListBranches = () => {
    return apiAccount.getListBranches();
  };

  insertAccount = (values: object) => {
    return apiAccount
      .insertAccountApi(values)
      .then((res) => {
        if (res.status === 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message || 'error' };
      });
  };

  updateAccount = (values: object) => {
    return apiAccount
      .updateAccountApi(values)
      .then((res) => {
        if (res.status === 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message || 'error' };
      });
  };

  updateStatusById = (id: number, body: any) => {
    return apiAccount
      .updateStatusByIdApi(id, body)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  updateAccountPassword = (id: number, body: any) => {
    return apiAccount
      .updateAccountPasswordApi(id, body)
      .then((res) => {
        if (res.status === 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message || 'error' };
      });
  };
}

export const accountService = new AccountService();
