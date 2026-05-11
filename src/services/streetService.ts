import BaseService from './baseService';
import { apiStreet } from '@/api/streets/api';

class StreetService extends BaseService {
  /**
   * Get List Street
   * @param {Object} data
   */
  getListStreet = (data: object): Promise<API.ListStreetResponse> => {
    return apiStreet.getListStreetApi(data);
  };

  getListStreetManagement = (data: object): Promise<API.ListStreetResponse | any> => {
    return apiStreet
      .getListStreetManagementApi(data)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  /**
   * Get List Street Select
   * @param data
   */
  getStreetListSelect = async (data: object, isHasParent: boolean = false) => {
    return this.getListStreet(data).then((res: API.ListStreetResponse) => {
      let preparedData = [];
      const { data } = res;

      preparedData = data?.map((item) => {
        let label = `${item?.display_title}`;
        const { districts } = item;

        if (isHasParent) {
          label = `${item?.display_title}, ${districts?.display_title}`;
        } else if (districts) {
          label = `${item?.display_title}, ${districts?.display_title}`;
        }
        return {
          label: label,
          value: item?.id,
        };
      });
      return preparedData;
    });
  };

  /**
   * Active Deactive Street
   * @param {Number} id
   * @param {API.DistrictData} data
   */
  activeDeActiveStreet = (
    id: number,
    data: API.DataActiveStreet,
  ): Promise<API.ListStreetResponse | any> => {
    return apiStreet.activeDeActiveStreetApi(id, data).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  createStreet = async (data: API.StreetData): Promise<API.MpireResponse> => {
    return apiStreet.createStreetApi(data);
  };

  detailStreet = (id: number, data: API.StreetData): Promise<any> => {
    return apiStreet.detailStreetApi(id, data);
  };

  updateStreet = (id: number, data: API.StreetData): Promise<API.MpireResponse> => {
    return apiStreet.updateStreetApi(id, data);
  };

  deleteStreet = (id: number, branch_id: string): Promise<{ data: API.StreetData } | any> => {
    return apiStreet
      .deleteStreetApi(id, branch_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  checkCodeExistStreet = (code: string): Promise<API.MpireResponse> => {
    return apiStreet.checkCodeExistStreet(code);
  };
}

export const streetService = new StreetService();
