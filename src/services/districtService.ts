import BaseService from './baseService';
import { apiDistrict } from '@/api/districts/api';
import { apiProvince } from '@/api/provinces/api';

class DistrictService extends BaseService {
  /**
   * Get List District
   * @param {Object} data
   */
  getListDistrict = (data: object): Promise<API.ListDistrictResponse> => {
    return apiDistrict.getListDistrictApi(data);
  };

  getListDistrictManagement = (data: object): Promise<API.ListDistrictResponse | any> => {
    return apiDistrict
      .getListDistrictManagementApi(data)
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
   * @param {Object} data
   * @param {Boolean} isHasParent
   */
  getDistrictListSelect = async (data: object, isHasParent: boolean = false) => {
    return this.getListDistrict(data).then((res: API.ListDistrictResponse) => {
      let preparedData = [];
      const { data } = res;

      preparedData = data?.map((item) => {
        let label = `${item.display_title}`;
        const { province_city } = item;
        if (isHasParent) {
          label = `${item.display_title}, ${province_city?.display_title}`;
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
   * Active Deactive District
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  activeDeActiveDistrict = (
    id: number,
    data: API.DistrictData,
  ): Promise<API.ListDistrictResponse | any> => {
    return apiDistrict
      .activeDeActiveDistrictApi(id, data)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((error) => {
        return { keyResponse: error?.response?.data?.message };
      });
  };

  createDistrict = async (data: API.DistrictData): Promise<API.MpireResponse> => {
    return apiDistrict.createDistrictApi(data).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  detailDistrict = (id: number, data: API.DistrictData): Promise<API.DistrictResponse> => {
    return apiDistrict.detailDistrictApi(id, data);
  };

  updateDistrict = (id: number, data: API.DistrictData): Promise<API.MpireResponse> => {
    return apiDistrict.updateDistrictApi(id, data).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  deleteDistrict = (id: number, branch_id: string): Promise<API.MpireResponse> => {
    return apiDistrict.deleteDistrictApi(id, branch_id).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  checkCodeExistDistrict = (code: string): Promise<API.MpireResponse> => {
    return apiDistrict.checkCodeExistDistrict(code);
  };
}

export const districtService = new DistrictService();
