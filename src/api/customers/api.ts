import BaseAPI from '@/api/baseAPI';
import _ from 'lodash';

class ApiCustomer extends BaseAPI {
  getCustomerSellRentList = (params: API.GetCustomerListSell): Promise<any> => {
    return this.httpApi('customer/sell-rent', 'get', { params: params }, {});
  };
  getListCustomerReport = (params: API.GetListCustomerReport): Promise<any> => {
    return this.httpApi(
      'customer/list-report',
      'get',
      { params: { params: JSON.stringify(params), branch_id: params.branch_id } },
      {},
    );
  };

  getListCustomerDataReport = (params: API.GetListCustomerDataReport): Promise<any> => {
    return this.httpApi(
      'customer/data-report',
      'get',
      { params: { params: JSON.stringify(params), branch_id: params.branch_id } },
      {},
    );
  };
  getCustomerBuyRent = (params: API.GetCustomerBuyRent): Promise<any> => {
    return this.httpApi(
      'customer/buy-rent',
      'get',
      {
        params: {
          params: JSON.stringify(params),
          branch_id: params?.branch_id,
        },
      },
      {},
    );
  };

  getDemandBuyRentByCustomerId = (
    customer_id: string,
    params: API.GetCustomerBuyRentById,
  ): Promise<any> => {
    return this.httpApi(
      `customer/demand-buy-rent/${customer_id}`,
      'get',
      {
        params: {
          params: JSON.stringify(params),
          branch_id: params?.branch_id,
        },
      },
      {},
    );
  };

  updateCustomerDemand = (data: API.DataDemandUpdate): Promise<any> => {
    return this.httpApi('customer/update-demand', 'post', data, {});
  };

  deleteCustomerDemand = (id: string, branch_id: string): Promise<any> => {
    return this.httpApi('customer/delete-demand', 'post', { id, branch_id }, {});
  };

  updateCustomerBuyRent = (data: API.UpdateCustomerBuyRent): Promise<any> => {
    return this.httpApi(`customer/update-buy-rent/${data.id}`, 'put', data, {});
  };

  getTransactionHistory = ({
    customer_id,
    offset,
    limit,
    sorter,
    branch_id,
  }: API.GetTransactionHistory): Promise<any> => {
    return this.httpApi(
      'customer/get-transaction-history',
      'get',
      {
        params: {
          customer_id,
          offset,
          limit,
          sorter: JSON.stringify(sorter),
          branch_id: branch_id,
        },
      },
      {},
    )
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  getCustomerSellRentInfoById = (customer_id: string, branch_id: string): Promise<any> => {
    return this.httpApi(
      `customer/sell-rent-info/${customer_id}`,
      'get',
      { params: { branch_id: branch_id } },
      {},
    );
  };

  getCustomerBuyRentInfoById = (customer_id: string, branch_id: string): Promise<any> => {
    return this.httpApi(
      `customer/buy-rent-info/${customer_id}`,
      'get',
      { params: { branch_id: branch_id } },
      {},
    );
  };

  checkExistPhoneNumberOfCustomer = (params: API.CheckExistPhoneNumberOfCustomer) => {
    return this.httpApi(
      'customer/check-exist-phone-number',
      'get',
      {
        params: {
          ...params,
        },
      },
      {},
    );
  };
  updateCustomerSellRentById = (dataUpdate: API.DataUpdateCustomer, customer_id: string) => {
    return this.httpApi(
      `customer/update-sell-rent/${customer_id}`,
      'post',
      {
        ...dataUpdate,
      },
      {},
    );
  };

  insertCustomerBuyRent = (data: API.InsertCustomerBuyRent) => {
    return this.httpApi('customer/create', 'post', data, {});
  };

  getListPhoneNumber = (phone_number: string, branch_id: string) => {
    return this.httpApi(
      'customer/phone-list',
      'get',
      { params: { phone_number: phone_number, branch_id } },
      {},
    );
  };
}

export const apiCustomer = new ApiCustomer();
