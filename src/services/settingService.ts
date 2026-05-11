import BaseService from './baseService';
import { apiSetting } from '@/api/settings/api';

class SettingService extends BaseService {
  getSetting = (branch_id: string): Promise<any> => {
    return apiSetting
      .getSetting(branch_id)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
  updateSetting = (data: any): Promise<any> => {
    return apiSetting
      .updateSetting(data)
      .then((res) => {
        if (res.status == 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
  insertSetting = (data: any): Promise<any> => {
    return apiSetting
      .insertSetting(data)
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
}

export const settingService = new SettingService();
