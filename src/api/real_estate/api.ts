import BaseAPI from '@/api/baseAPI';

const path_sell = 'real-estate-sell';
const path = 'real-estate';

class ApiRealEstate extends BaseAPI {
  /**
   * Get List Real Sell Estate
   * @param {Object} data
   */
  getListRealEstateSellApi = (data: object): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_sell}/list`,
      'get',
      {
        params: {
          ...data,
        },
      },
      {},
    );
  };
  getListRealEstateReport = (
    data: object | any,
  ): Promise<API.MpireResponseTuple<API.ResponseNewRealEstate>> => {
    return this.httpApi(
      `${path_sell}/list-report`,
      'get',
      {
        params: {
          params: JSON.stringify(data),
          branch_id: data?.branch_id,
        },
      },
      {},
    );
  };
  getListChangeStatusRealEstateReport = (
    data: object | any,
  ): Promise<API.MpireResponseTuple<API.ResponseNewRealEstate>> => {
    return this.httpApi(
      `${path_sell}/list-status-report`,
      'get',
      {
        params: {
          params: JSON.stringify(data),
          branch_id: data?.branch_id,
        },
      },
      {},
    );
  };
  getListRealEstateDataReport = (
    data: object | any,
  ): Promise<API.MpireResponseTuple<API.ResponseDataReport>> => {
    return this.httpApi(
      `${path_sell}/data-report`,
      'get',
      {
        params: {
          params: JSON.stringify(data),
          branch_id: data?.branch_id,
        },
      },
      {},
    );
  };
  getListChangeStatusRealEstateDataReport = (
    data: object | any,
  ): Promise<API.MpireResponseTuple<API.ResponseDataReport>> => {
    return this.httpApi(
      `${path_sell}/data-status-report`,
      'get',
      {
        params: {
          params: JSON.stringify(data),
          branch_id: data?.branch_id,
        },
      },
      {},
    );
  };

  /**
   * Subscribe
   * @param {String} id
   * @param {API.RealEstateSubscribeRequest} data
   */
  subscribeRealEstate = (
    id: string,
    data: API.RealEstateSubscribeRequest,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(`${path_sell}/subscribe/${id}`, 'post', data, {});
  };

  /**
   * Get List Real Estate
   * @param {Object} data
   */
  getListRealEstateApi = (data: object): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path}/list`,
      'get',
      {
        params: {
          ...data,
        },
      },
      {},
    );
  };

  insertRealEstateSell = (data: API.DataInsertApi): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_sell}/insert`,
      'post',
      { ...data, branch_id: data?.mainData?.branch_id },
      {},
    );
  };

  checkDuplicateRealEstate = (
    data: API.DataCheckDuplicate,
  ): Promise<API.MpireResponseTuple<API.DataCheckDuplicateRealEstate>> => {
    return this.httpApi(`${path_sell}/check-duplicate`, 'post', data, {});
  };
  getRealEstateById = (
    id: string | number,
    branch_id: string,
  ): Promise<API.MpireResponseTuple<API.RealEstateResponse> | undefined> => {
    return this.httpApi(`${path_sell}/item/${id}`, 'get', { params: { branch_id: branch_id } }, {});
  };

  updateRealEstateSell = (
    data: API.DataInsertApi,
    real_estate_id: string,
    previous_status?: API.PreviousStatus,
    next_status?: API.PreviousStatus,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_sell}/update/${real_estate_id}`,
      'put',
      { ...data, previous_status, next_status, branch_id: data?.mainData?.branch_id },
      {},
    );
  };
  getHistoryRealEstateStatus = (real_estate_id: string): Promise<API.MpireResponse> => {
    return this.httpApi(`${path_sell}/history/${real_estate_id}`, 'get', {}, {});
  };

  assignMultipleRealEstateToUser = (
    dataAssign: API.DataAssignRealEstateList,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_sell}/assign-multiple-to-user`,
      'post',
      { data_assign: dataAssign, branch_id: branch_id },
      {},
    );
  };

  assignRealEstateSingleToUser = (
    dataAssign: API.DataAssignRealEstateSingle,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_sell}/assign-single-to-user`,
      'post',
      { data_assign: dataAssign, branch_id: branch_id },
      {},
    );
  };

  convertRealEstateListToDuplicate = (
    realEstateList: API.DataConvertRealEstateListToDuplicate,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_sell}/convert-multiple-duplicate`,
      'post',
      { real_estate_list: realEstateList, branch_id: branch_id },
      {},
    );
  };
  convertSingleRealEstateToDuplicate = (
    realEstateId: string,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_sell}/convert-single-duplicate`,
      'post',
      { real_estate_id: realEstateId, branch_id: branch_id },
      {},
    );
  };
  deleteRealEstateList = (
    realEstateList: API.DataDeleteRealEstate,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    console.log(branch_id);

    return this.httpApi(
      `${path_sell}/delete-multiple`,
      'post',
      { real_estate_list: realEstateList, branch_id: branch_id },
      {},
    );
  };

  deleteSingleRealEstate = (
    realEstateId: string,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_sell}/delete-single`,
      'post',
      { real_estate_id: realEstateId },
      { params: { branch_id: branch_id } },
    );
  };

  updateHistoryCloneRealEstate = (
    id: string,
    realEstateStatus?: { id: string | undefined; title: string | undefined },
    note?: string,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_sell}/history/${id}`,
      'post',
      { realEstateStatus: realEstateStatus, note: note },
      {},
    );
  };

  requestExportData = (data: object): Promise<API.MpireResponse> => {
    return this.httpApi(`${path_sell}/export/request`, 'post', data, {});
  };

  /**
   *
   * @param body
   */
  requestImportData = (data: any): Promise<API.MpireResponse> => {
    return this.httpApi(`${path_sell}/import/request`, 'post', data, {});
  };
}

export const apiRealEstate = new ApiRealEstate();
