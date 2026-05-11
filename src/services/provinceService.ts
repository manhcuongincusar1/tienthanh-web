import { apiProvince } from '@/api/provinces/api';
import BaseService from './baseService';
import { administrativeDivision } from '@/api/administrativeDivision';

class ProvinceService extends BaseService {
  /**
   * Get List province
   * @param {Object} data
   */
  getListProvince = (data: object): Promise<API.ListDistrictResponse> => {
    return apiProvince.getListProvinceApi(data);
  };

  getListProvinceManagement = (data: object): Promise<API.ListDistrictResponse> => {
    return apiProvince
      .getListProvinceManagementApi(data)
      .then((res) => {
        if (res.status == 200) {
          const { data, total } = res;
          return { data, total };
        }
      })
      .catch((err: any) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  getProvinceListSelect = async (data: object) => {
    return this.getListProvince(data).then((res: API.ListDistrictResponse) => {
      let preparedData = [];
      const { data } = res;
      preparedData = data?.map((item) => {
        return {
          label: item.display_title,
          value: item.id,
        };
      });
      return preparedData;
    });
  };

  /**
   * Active Deactive Province
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  activeDeActiveProvince = (
    id: number,
    data: API.DistrictData,
  ): Promise<API.ListDistrictResponse | any> => {
    return apiProvince.activeDeActiveProvinceApi(id, data).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  createProvince = async (data: API.DistrictData): Promise<API.MpireResponse> => {
    return apiProvince.createProvinceApi(data).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  detailProvince = (id: number, data: API.DistrictData): Promise<API.DistrictResponse> => {
    return apiProvince.detailProvinceApi(id, data);
  };

  updateProvince = (id: number, data: API.DistrictData): Promise<API.MpireResponse> => {
    return apiProvince.updateProvinceApi(id, data).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  deleteProvince = (id: number, branch_id: string): Promise<API.MpireResponse> => {
    return apiProvince.deleteProvinceApi(id, branch_id).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  checkCodeExistProvince = (code: string): Promise<API.MpireResponse> => {
    return apiProvince.checkCodeExistProvince(code);
  };
}

export const provinceService = new ProvinceService();
