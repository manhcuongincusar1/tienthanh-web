import BaseAPI from '@/api/baseAPI';

const path = 'real-estate-category';

class ApiRealEstateCategory extends BaseAPI {
  /**
   * Get List Real Estate Category
   * @param {Object} data
   */
  getListRealEstateCategoryApi = (data: object): Promise<API.MpireResponse> => {
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

  getListRealEstateCategoryManagementApi = (data: object): Promise<API.MpireResponse> => {
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
   * Create new Real Estate Category
   * @param {API.RealEstateCategoryRequest} data
   */
  createApi = async (data: API.RealEstateCategoryRequest): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/create`, 'post', data, {});
  };

  checkDuplicateRealEstateCategory = async (
    data: API.RealEstateCategoryRequest,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/check-duplicate`, 'post', data, {});
  };
  /**
   * Detail
   * @param {Number} id
   */
  detailApi = async (id: string, branch_id: string): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/detail/${id}`, 'get', { params: { branch_id: branch_id } }, {});
  };

  /**
   * Update Real Estate
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  updateApi = async (
    id: number,
    data: API.RealEstateCategoryRequest,
  ): Promise<API.MpireResponse> => {
    console.log(data);

    return this.httpApi(`${path}/edit/${id}`, 'post', data, {});
  };

  /**
   * Delete
   * @param {Number} id
   */
  deleteApi = async (id: number): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/delete/${id}`, 'delete', {}, {});
  };

  activeDeactiveApi = async (
    id: number,
    data: API.RealEstateCategoryRequest,
  ): Promise<API.MpireResponse> => {
    return this.httpApi(`${path}/active-deactive/${id}`, 'post', data, {});
  };
}

export const apiRealEstateCategory = new ApiRealEstateCategory();
