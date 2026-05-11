import { apiCustomer } from '@/api/customers/api';
import BaseService from './baseService';
import _ from 'lodash';

class CustomerServices extends BaseService {
  insertCustomerBuyRent = async (data: API.InsertCustomerBuyRent) => {
    return apiCustomer
      .insertCustomerBuyRent(data)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
  checkExistPhoneNumberOfCustomer = async (params: API.CheckExistPhoneNumberOfCustomer) => {
    return apiCustomer
      .checkExistPhoneNumberOfCustomer(params)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };

  getListCustomerDataReport = async (params: API.GetListCustomerDataReport) => {
    return apiCustomer
      .getListCustomerDataReport(params)
      .then((res) => {
        if (res.status == 200 && res.data) {
          const newData = res.data.sort((a: any, b: any) => {
            const aa = a.month.split('-').reverse().join();
            const bb = b.month.split('-').reverse().join();
            return aa < bb ? -1 : aa > bb ? 1 : 0;
          });

          return newData;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };

  getListCustomerReport = async (params: API.GetListCustomerReport) => {
    return apiCustomer
      .getListCustomerReport(params)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  getCustomerSellRentList = async (params: API.GetCustomerListSell): Promise<any> => {
    return apiCustomer
      .getCustomerSellRentList(params)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
  getCustomerBuyRent = async (params: API.GetCustomerBuyRent) => {
    return apiCustomer
      .getCustomerBuyRent(params)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  updateCustomerDemand = async (data: API.DataDemandUpdate) => {
    return apiCustomer
      .updateCustomerDemand(data)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
  deleteCustomerDemand = async (id: string, branch_id: string) => {
    return apiCustomer
      .deleteCustomerDemand(id, branch_id)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
  updateCustomerBuyRent = async (data: API.UpdateCustomerBuyRent) => {
    return apiCustomer
      .updateCustomerBuyRent(data)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  updateCustomerSellRentById = async (dataUpdate: API.DataUpdateCustomer, customer_id: string) => {
    return apiCustomer
      .updateCustomerSellRentById(dataUpdate, customer_id)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  getCustomerSellRentInfoById = async (customer_id: string, branch_id: string) => {
    return apiCustomer
      .getCustomerSellRentInfoById(customer_id, branch_id)
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

  getCustomerBuyRentInfoById = async (customer_id: string, branch_id: string) => {
    return apiCustomer
      .getCustomerBuyRentInfoById(customer_id, branch_id)
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

  getDemandBuyRentByCustomerId = async (
    customer_id: string,
    params: API.GetCustomerBuyRentById,
  ) => {
    return apiCustomer
      .getDemandBuyRentByCustomerId(customer_id, params)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
  getListPhoneNumber = async (phone_number: string, branch_id: string) => {
    return apiCustomer
      .getListPhoneNumber(phone_number, branch_id)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
}
export const customerServices = new CustomerServices();
