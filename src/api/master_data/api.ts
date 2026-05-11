import BaseAPI from '@/api/baseAPI';

class ApiMasterData extends BaseAPI {
  rootAPI = `common`;
  generateMasterData = (): Promise<API.MpireResponse> => {
    return this.httpApi(`${this.rootAPI}/generate-master-data`, 'post', {}, {});
  };
}

export const apiMasterData = new ApiMasterData();
