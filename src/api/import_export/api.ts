import BaseAPI from '@/api/baseAPI';

class ApiImportExport extends BaseAPI {
  rootAPI = `import-export`;
  /**
   *
   * @param data
   */
  getListExport = (data: Record<string, any>[]): Promise<API.MpireResponse> => {
    return this.httpApi(`${this.rootAPI}/export/request`, 'get', { params: data }, {});
  };

  /**
   *
   * @param data
   */
  getListImport = (data: Record<string, any>[]): Promise<API.MpireResponseTuple<any>> => {
    return this.httpApi(`${this.rootAPI}/import/request`, 'get', { params: data }, {});
  };
}

export const apiImportExport = new ApiImportExport();
