import BaseAPI from '@/api/baseAPI';

class ApiSetting extends BaseAPI {
  getSetting = (branch_id: string): Promise<any> => {
    return this.httpApi('setting/get', 'get', { params: { branch_id: branch_id } }, {});
  };
  updateSetting = (data: any): Promise<any> => {
    return this.httpApi('setting/update', 'post', { ...data, branch_id: data.branch_id }, {});
  };
  insertSetting = (data: any): Promise<any> => {
    return this.httpApi('setting/insert', 'post', data, {})
      .then((res) => {
        if (res.status == 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return { status: 404 };
      });
  };
}

export const apiSetting = new ApiSetting();
