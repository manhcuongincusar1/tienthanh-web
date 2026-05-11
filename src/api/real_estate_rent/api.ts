import BaseAPI from '@/api/baseAPI';

const path_rent = 'real-estate-rent';
const path = 'real-estate';

class ApiRealEstate extends BaseAPI {
  getListRealEstateRentApi = (data: object): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_rent}/list`,
      'get',
      {
        params: {
          ...data,
        },
      },
      {},
    );
  };

  subscribeRealEstate = (
    id: string,
    data: API.RealEstateSubscribeRequest,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(`${path_rent}/subscribe/${id}`, 'post', data, {});
  };

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

  insertRealEstateRent = (data: API.DataInsertApi): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_rent}/insert`,
      'post',
      { ...data, branch_id: data?.mainData?.branch_id },
      {},
    );
  };

  getRealEstateById = (
    id: string | number,
    branch_id: string,
  ): Promise<API.MpireResponseTuple<API.RealEstateResponse> | undefined> => {
    return this.httpApi(`${path_rent}/item/${id}`, 'get', { params: { branch_id: branch_id } }, {});
  };

  updateRealEstateRent = (
    data: API.DataInsertApi,
    real_estate_id: string,
    previous_status?: API.PreviousStatus,
    next_status?: API.PreviousStatus,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_rent}/update/${real_estate_id}`,
      'put',
      { ...data, previous_status, next_status, branch_id: data?.mainData?.branch_id },
      {},
    );
  };

  assignMultipleRealEstateToUser = (
    dataAssign: API.DataAssignRealEstateList,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_rent}/assign-multiple-to-user`,
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
      `${path_rent}/assign-single-to-user`,
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
      `${path_rent}/convert-multiple-duplicate`,
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
      `${path_rent}/convert-single-duplicate`,
      'post',
      { real_estate_id: realEstateId, branch_id: branch_id },
      {},
    );
  };
  deleteRealEstateList = (
    realEstateList: API.DataDeleteRealEstate,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path_rent}/delete-multiple`,
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
      `${path_rent}/delete-single`,
      'post',
      { real_estate_id: realEstateId },
      { params: { branch_id: branch_id } },
    );
  };

  requestExportData = (data: object): Promise<API.MpireResponse> => {
    return this.httpApi(`${path_rent}/export/request`, 'post', data, {});
  };

  /**
   *
   * @param body
   */
  requestImportData = (data: any): Promise<API.MpireResponse> => {
    return this.httpApi(`${path_rent}/import/request`, 'post', data, {});
  };
}

export const apiRealEstateRent = new ApiRealEstate();
