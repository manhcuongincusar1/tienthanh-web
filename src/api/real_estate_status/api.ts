import BaseAPI from '@/api/baseAPI';

const path = 'real-estate-status';

class ApiRealEstateStatus extends BaseAPI {
  /**
   * Get List Real Estate Status
   * @param {Object} data
   */
  getListRealEstateStatusApi = (data: object): Promise<API.MpireResponse> => {
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

  getListRealEstateStatusManagementApi = (data: object): Promise<API.MpireResponse> => {
    return this.httpApi(
      `${path}/get-list`,
      'get',
      {
        params: {
          ...data,
        },
      },
      {},
    );
  };

  /**
   * Active Deactive Real Estate Status
   * @param {Number} id
   * @param {API.RealEstateStatusData} data
   */
  activeDeActiveRealEstateStatusApi = async (
    id: number,
    data: API.RealEstateStatusData,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/update-is-active-deactive/${id}`, 'post', data, {});
  };

  /**
   * Create new Real Estate Status
   * @param {API.RealEstateStatusRequest} data
   */
  createApi = async (data: API.RealEstateStatusRequest): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/create`, 'post', data, {});
  };

  /**
   * Detail
   * @param {Number} id
   */
  detailApi = async (id: number, branch_id: string): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/detail/${id}`, 'get', { params: { branch_id: branch_id } }, {});
  };

  /**
   * Update Real Estate
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  updateApi = async (id: number, data: API.RealEstateStatusRequest): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/edit/${id}`, 'post', data, {});
  };

  /**
   * Delete
   * @param {Number} id
   */
  deleteApi = async (id: number, branch_id: string): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/delete/${id}`, 'delete', { branch_id }, {});
  };

  activeDeactiveApi = async (
    id: number,
    data: API.RealEstateStatusRequest,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/update-is-active-deactive/${id}`, 'post', data, {});
  };

  isEditableReApi = async (
    id: number,
    data: API.RealEstateStatusRequest,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/update-is-editable/${id}`, 'post', data, {});
  };

  isDefaultApi = async (
    id: number,
    data: API.RealEstateStatusRequest,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/update-is-default/${id}`, 'post', data, {});
  };

  checkDuplicateRealEstateStatus = async (
    data: API.CheckDuplicateRealEstateStatus,
  ): Promise<API.MpireResponse> => {
    console.log(data);

    return this.httpApi(`${path}/check-duplicate`, 'post', data, {});
  };
}

export const apiRealEstateStatus = new ApiRealEstateStatus();
