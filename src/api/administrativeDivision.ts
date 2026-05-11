import BaseAPI from '@/api/baseAPI';
import Settings from '../../config/defaultSettings';

interface BodyDistrict {
  province_id: number;
}
interface BodyWard {
  district_id: number;
}

class AdministrativeDivision extends BaseAPI {
  getProvinceList = async (): Promise<any> => {
    return await this.http<API.MpireResponse>(`${Settings.APP_API}/province/list`, 'get', {
      params: {
        limit: 500,
      },
    }).then((res) => {
      if (res.status == 200) {
        return res.data;
      }
    });
  };
  getDistrictList = async (params: object): Promise<any> => {
    return await this.http<API.MpireResponse>(
      `${Settings.APP_API}/district/list`,
      'get',
      {
        params: {
          limit: 500,
          ...params,
        },
      },
      {},
    ).then((res) => {
      if (res.status == 200) {
        return res.data;
      }
    });
  };
  getWardList = (params: object): Promise<any> => {
    return this.http<API.MpireResponse>(
      `${Settings.APP_API}/ward/list`,
      'get',
      {
        params: {
          limit: 500,
          ...params,
        },
      },
      {},
    ).then((res) => {
      if (res.status == 200) {
        return res.data;
      }
    });
  };
  getProvinceListByParams = async (params: object): Promise<any> => {
    return await this.http<API.MpireResponse>(`${Settings.APP_API}/province/list`, 'get', {
      params: {
        limit: 500,
        ...params,
      },
    }).then((res) => {
      if (res.status == 200) {
        return res.data;
      }
    });
  };
}

export const administrativeDivision = new AdministrativeDivision();
