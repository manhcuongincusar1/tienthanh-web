import BaseAPI from '@/api/baseAPI';
import Settings from '../../../config/defaultSettings';

class ApiWard extends BaseAPI {
  /**
   * Get List Ward
   * @param {Object} data
   */
  getListWardApi = (data): Promise<API.ListWardResponse | any> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/ward/list`,
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

  getListWardManagementApi = (data): Promise<API.ListWardResponse | any> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/ward/get-list`,
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
   * Active Deactive Ward
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  activeDeActiveWardApi = async (
    id: number,
    data: API.DistrictData,
  ): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/ward/active-deactive/${id}`,
      'post',
      data,
      {},
    );
  };

  /**
   * Active Deactive Ward
   * @param {API.DistrictData} data
   */
  createWardApi = async (data: API.DistrictData): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/ward/create`, 'post', data, {});
  };

  /**
   * Active Deactive Ward
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  detailWardApi = async (id: number, data: API.DistrictData): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/ward/detail/${id}`, 'get', {});
  };

  /**
   * Update Ward
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  updateWardApi = async (id: number, data: API.DistrictData): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/ward/update/${id}`, 'post', data, {});
  };

  /**
   * Delete Ward
   * @param {Number} id
   */
  deleteWardApi = async (id: number, branch_id: string): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/ward/delete/${id}`,
      'post',
      { branch_id: branch_id },
      {},
    );
  };

  /**
   * checkCodeExistWard
   * @param {string} code
   */
  checkCodeExistWard = async (code: string): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/ward/code-exist/${code}`, 'get', {});
  };
}

export const apiWard = new ApiWard();
