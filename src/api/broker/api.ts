import BaseAPI from '@/api/baseAPI';

class ApiBroker extends BaseAPI {
  getListPhoneNumber = (keyword: string, branch_id: string): Promise<any> => {
    return this.httpApi(
      'broker/phone-number-list',
      'get',
      { params: { keyword: keyword, branch_id } },
      {},
    );
  };

  getSaleListCreatBroker = (branch_id: string): Promise<any> => {
    return this.httpApi('broker/sale-list', 'get', { params: { branch_id } }, {});
  };

  getBrokerList = (params: API.ParamsGetBrokerList): Promise<any> => {
    return this.httpApi(
      'broker/list',
      'get',
      { params: { params: JSON.stringify(params), branch_id: params.branch_id } },
      {},
    );
  };

  getBrokerById = (id: string, branch_id: string): Promise<any> => {
    return this.httpApi(`broker/item/${id}`, 'get', { params: { branch_id: branch_id } }, {});
  };

  checkExistPhoneNumber = (params: API.ParamsCheckExistPhoneNumber): Promise<any> => {
    return this.httpApi(`broker/check-phone-number`, 'get', { params: { ...params } }, {});
  };

  getTransactionHistory = ({
    broker_id,
    offset,
    limit,
    sorter,
    branch_id,
  }: API.GetTransactionHistory): Promise<any> => {
    return this.httpApi(
      'broker/get-transaction-history',
      'get',
      {
        params: {
          broker_id,
          offset,
          limit,
          branch_id,
          sorter: JSON.stringify(sorter),
        },
      },
      {},
    );
  };

  updateBrokerById = (dataUpdate: API.DataUpdateBrokerById, id: string) => {
    return this.httpApi(`broker/update/${id}`, 'put', dataUpdate, {});
  };
}

export const apiBroker = new ApiBroker();
