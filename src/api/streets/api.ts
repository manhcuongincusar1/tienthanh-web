import BaseAPI from '@/api/baseAPI';
import Settings from '../../../config/defaultSettings';

class ApiStreet extends BaseAPI {
  /**
   * Get List Street
   * @param {Object} data
   */
  getListStreetApi = (data: any): Promise<API.ListStreetResponse> => {
    return this.httpApi(
      'street/list',
      'get',
      {
        params: {
          ...data,
        },
      },
      {},
    );
  };

  getListStreetManagementApi = (data: any): Promise<API.ListStreetResponse> => {
    return this.httpApi(
      'street/get-list',
      'get',
      {
        params: {
          ...data,
        },
      },
      {},
    );
  };

  getStreetList = (params: API.GetListStreetParams): Promise<any> => {
    return this.httpApi('street/list', 'get', { params: params }, {})
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };

  getStreetListByWardId = (ward_id: number): Promise<any> => {
    return this.httpApi(`street/list/${ward_id}`, 'get', {}, {})
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };

  /**
   * Active Deactive Street
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  activeDeActiveStreetApi = async (
    id: number,
    data: API.DataActiveStreet,
  ): Promise<API.ListStreetResponse> => {
    return this.httpApi(`street/active-deactive/${id}`, 'post', data, {});
  };

  /**
   * Active Deactive Street
   * @param {API.DistrictData} data
   */
  createStreetApi = async (data: API.StreetData): Promise<API.MpireResponse> => {
    return this.httpApi('street/create', 'post', data, {});
  };

  /**
   * Active Deactive Street
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  detailStreetApi = async (id: number, data: API.StreetData): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/street/detail/${id}`, 'get', {});
  };

  /**
   * Update Street
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  updateStreetApi = async (id: number, data: API.StreetData): Promise<API.MpireResponse> => {
    return this.httpApi(`street/update/${id}`, 'post', data, {});
  };

  /**
   * Delete Street
   * @param {Number} id
   */
  deleteStreetApi = async (
    id: number,
    branch_id: string,
  ): Promise<API.MpireResponseTuple<{ data: API.StreetData }>> => {
    return this.httpApi(`street/delete/${id}`, 'delete', { params: { branch_id: branch_id } }, {});
  };

  /**
   * checkCodeExistStreet
   * @param {string} code
   */
  checkCodeExistStreet = async (code: string): Promise<API.MpireResponse> => {
    return this.http<API.MpireResponse>(`${Settings.APP_API}/street/code-exist/${code}`, 'get', {});
  };
}

export const apiStreet = new ApiStreet();
