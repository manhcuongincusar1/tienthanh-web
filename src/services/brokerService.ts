import { apiBroker } from '@/api/broker/api';
import BaseService from './baseService';

class BrokerService extends BaseService {
  getListPhoneNumber = (keyword: string, branch_id: string): Promise<any> => {
    return apiBroker
      .getListPhoneNumber(keyword, branch_id)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };

  getSaleListCreatBroker = (branch_id: string): Promise<any> => {
    return apiBroker
      .getSaleListCreatBroker(branch_id)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };

  getBrokerList = (params: API.ParamsGetBrokerList): Promise<any> => {
    return apiBroker
      .getBrokerList(params)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  getTransactionHistory = (params: API.GetTransactionHistory): Promise<any> => {
    return apiBroker
      .getTransactionHistory(params)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  getBrokerById = (id: string, branch_id: string): Promise<any> => {
    return apiBroker
      .getBrokerById(id, branch_id)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        if (err?.response?.data.status === 404) {
          return { keyResponse: 'notfound' };
        }
        return { keyResponse: err?.response?.data?.message };
      });
  };

  checkExistPhoneNumber = (params: API.ParamsCheckExistPhoneNumber): Promise<any> => {
    return apiBroker
      .checkExistPhoneNumber(params)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };
  updateBrokerById = (dataUpdate: API.DataUpdateBrokerById, id: string): Promise<any> => {
    return apiBroker
      .updateBrokerById(dataUpdate, id)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
}

export const brokerService = new BrokerService();
