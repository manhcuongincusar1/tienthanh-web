import BaseAPI from '@/api/baseAPI';
import Settings from '../../../config/defaultSettings';

class ApiProvince extends BaseAPI {
  /**
   * Get List Province
   * @param {Object} data
   */
  getListProvinceApi = (data: object): Promise<API.ListDistrictResponse> | any => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/province/list`,
      'get',
      {
        params: {
          ...data,
        },
      },
      {},
    ).then((res) => {
      if (res.status == 200) {
        const { data, total } = res;
        return { data, total };
      }
    });
  };
  getListProvinceManagementApi = (data: object): Promise<API.ListDistrictResponse> | any => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/province/get-list`,
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
   * Active Deactive Province
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  activeDeActiveProvinceApi = async (
    id: number,
    data: API.DistrictData,
  ): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/province/active-deactive/${id}`,
      'post',
      data,
      {},
    );
  };

  /**
   * Active Deactive Province
   * @param {API.DistrictData} data
   */
  createProvinceApi = async (data: API.DistrictData): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/province/create`, 'post', data, {});
  };

  /**
   * Active Deactive Province
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  detailProvinceApi = async (id: number, data: API.DistrictData): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/province/detail/${id}`, 'get', {});
  };

  /**
   * Update Province
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  updateProvinceApi = async (id: number, data: API.DistrictData): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/province/update/${id}`,
      'post',
      data,
      {},
    );
  };

  /**
   * Delete Province
   * @param {Number} id
   */
  deleteProvinceApi = async (id: number, branch_id: string): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/province/delete/${id}`,
      'post',
      { params: { branch_id: branch_id } },
      {},
    );
  };

  /**
   * checkCodeExistProvince
   * @param {string} code
   */
  checkCodeExistProvince = async (code: string): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/province/code-exist/${code}`,
      'get',
      {},
    );
  };
}

export const apiProvince = new ApiProvince();
