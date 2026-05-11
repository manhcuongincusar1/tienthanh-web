import { apiImportExport } from '@/api/import_export/api';
import BaseService from './baseService';

class ImportExportService extends BaseService {
  /**
   *
   * @param data
   */
  getListExport = (data: Record<string, any>[] | any): Promise<API.MpireResponse | any> => {
    return apiImportExport
      .getListExport(data)
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
   *
   * @param data
   */
  getListImport = (data: Record<string, any>[] | any): any => {
    return apiImportExport
      .getListImport(data)
      .then((res) => {
        if (res.status === 200) {
          return res;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };
}

export const importExportService = new ImportExportService();
