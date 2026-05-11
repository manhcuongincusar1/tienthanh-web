import BaseAPI from '@/api/baseAPI';
import Settings from '../../../config/defaultSettings';

class ApiDistrict extends BaseAPI {
  /**
   * Get List District
   * @param {Object} data
   */
  getListDistrictApi = (data): Promise<API.ListDistrictResponse | any> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/district/list`,
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

  getListDistrictManagementApi = (data): Promise<API.ListDistrictResponse | any> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/district/get-list`,
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
   * Active Deactive District
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  activeDeActiveDistrictApi = async (
    id: number,
    data: API.DistrictData,
  ): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/district/active-deactive/${id}`,
      'post',
      data,
      {},
    );
  };

  /**
   * Active Deactive District
   * @param {API.DistrictData} data
   */
  createDistrictApi = async (data: API.DistrictData): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/district/create`, 'post', data, {});
  };

  /**
   * Active Deactive District
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  detailDistrictApi = async (id: number, data: API.DistrictData): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/district/detail/${id}`, 'get', {});
  };

  /**
   * Update District
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  updateDistrictApi = async (id: number, data: API.DistrictData): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/district/update/${id}`,
      'post',
      data,
      {},
    );
  };

  /**
   * Delete District
   * @param {Number} id
   */
  deleteDistrictApi = async (id: number, branch_id: string): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/district/delete/${id}`,
      'post',
      { params: { branch_id: branch_id } },
      {},
    );
  };

  /**
   * checkCodeExistDistrict
   * @param {string} code
   */
  checkCodeExistDistrict = async (code: string): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/district/code-exist/${code}`,
      'get',
      {},
    );
  };
}

export const apiDistrict = new ApiDistrict();
