import BaseService from './baseService';
import { apiWard } from '@/api/wards/api';
import { apiDistrict } from '@/api/districts/api';

class WardService extends BaseService {
  /**
   * Get List District
   * @param {Object} data
   */
  getListWard = (data: object): Promise<API.ListWardResponse> => {
    return apiWard.getListWardApi(data);
  };

  getListWardManagement = (data: object): Promise<API.ListWardResponse | any> => {
    return apiWard
      .getListWardManagementApi(data)
      .then((res) => {
        if (res.status == 200) {
          const { data, total } = res;
          return { data, total };
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  /**
   * Get List District Select
   * @param data
   * @param {Boolean} isHasParent
   */
  getWardListSelect = async (data: object, isHasParent: boolean = false) => {
    return this.getListWard(data).then((res: API.ListWardResponse) => {
      let preparedData = [];
      const { data } = res;
      preparedData = data?.map((item) => {
        let label = `${item.display_title}`;
        const { districts } = item;
        if (isHasParent) {
          label = `${item.display_title}, ${districts?.display_title}`;
        }
        return {
          label: label,
          value: item.id,
        };
      });
      return preparedData;
    });
  };

  /**
   * Active Deactive Ward
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  activeDeActiveWard = (id: number, data: API.WardData): Promise<API.ListWardResponse | any> => {
    return apiWard.activeDeActiveWardApi(id, data).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  createWard = async (data: API.WardData): Promise<API.MpireResponse> => {
    return apiWard.createWardApi(data);
  };

  detailWard = (id: number, data: API.WardData): Promise<API.WardResponse> => {
    return apiWard.detailWardApi(id, data);
  };

  updateWard = (id: number, data: API.WardData): Promise<API.MpireResponse> => {
    return apiWard.updateWardApi(id, data);
  };

  deleteWard = (id: number, branch_id: string): Promise<API.MpireResponse> => {
    return apiWard.deleteWardApi(id, branch_id).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  checkCodeExistWard = (code: string): Promise<API.MpireResponse> => {
    return apiWard.checkCodeExistWard(code);
  };
}

export const wardService = new WardService();
