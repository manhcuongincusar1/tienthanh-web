import { apiRealEstateStatus } from '@/api/real_estate_status/api';
import BaseService from './baseService';
import _ from 'lodash';
import { STATUS_ENUM } from '@/constants';

class RealEstateStatusService extends BaseService {
  /**
   * Get List Real Estate Status
   * @param {Object} data
   */
  getListRealEstateStatus = async (
    data: object,
  ): Promise<API.ListRealEstateStatusResponse | undefined> => {
    return apiRealEstateStatus.getListRealEstateStatusApi(data).then((res) => {
      if (res.status == 200) {
        const { data: listRealEstateStatus, total } = res;
        const listEstate: API.RealEstateStatusResponse[] = [];
        if (!_.isEmpty(listRealEstateStatus)) {
          _.each(listRealEstateStatus, (realEstate: API.RealEstateStatusData) => {
            listEstate.push({
              ...realEstate,
              display_status: realEstate.status === STATUS_ENUM.ACTIVE,
            });
          });
        }
        return {
          data: listEstate,
          total,
        } as API.ListRealEstateStatusResponse;
      }
    });
  };
  getListRealEstateStatusManagement = async (data: object) => {
    return apiRealEstateStatus
      .getListRealEstateStatusManagementApi(data)
      .then((res) => {
        if (res.status == 200) {
          const { data: listRealEstateStatus, total } = res;
          const listEstate: API.RealEstateStatusResponse[] = [];
          if (!_.isEmpty(listRealEstateStatus)) {
            _.each(listRealEstateStatus, (realEstate: API.RealEstateStatusData) => {
              listEstate.push({
                ...realEstate,
                display_status: realEstate.status === STATUS_ENUM.ACTIVE,
              });
            });
          }
          return {
            data: listEstate,
            total,
          } as API.ListRealEstateStatusResponse;
        }
      })
      .catch((error) => {
        return { keyResponse: error?.response?.data?.message };
      });
  };

  getListRealEstateStatusSelect = async (data: object): Promise<any> => {
    return apiRealEstateStatus.getListRealEstateStatusApi(data).then((res) => {
      if (res.status == 200) {
        const { data: listRealEstateStatus } = res;
        const listEstate: API.RealEstateStatusResponse[] = [];
        if (!_.isEmpty(listRealEstateStatus)) {
          _.each(listRealEstateStatus, (realEstateStatus: API.RealEstateStatusData) => {
            listEstate.push({
              label: realEstateStatus.title,
              value: realEstateStatus.id,
              color: realEstateStatus.color,
            });
          });
        }
        return listEstate;
      }
    });
  };

  /**
   * Active Deactive Real Estate Status
   * @param {Number} id
   * @param {API.RealEstateStatusData} data
   */
  activeDeActiveRealEstateStatus = (
    id: number,
    data: API.RealEstateStatusData,
  ): Promise<API.MpireResponse> => {
    return apiRealEstateStatus.activeDeActiveRealEstateStatusApi(id, data);
  };

  /**
   *
   * @param data
   */
  createRealEstateStatus = async (
    data: API.RealEstateStatusRequest,
  ): Promise<API.RealEstateStatusResponse | {}> => {
    return apiRealEstateStatus.createApi(data).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  /**
   *
   * @param id
   */
  detail = (
    id: number,
    branch_id: string,
  ): Promise<API.RealEstateStatusResponse | {} | undefined> => {
    return apiRealEstateStatus
      .detailApi(id, branch_id)
      .then((res) => {
        if (res.status == 200) {
          return { ...res.data } as API.RealEstateStatusResponse;
        }
      })
      .catch((error) => {
        return { keyResponse: error?.response?.data?.message };
      });
  };

  /**
   *
   * @param id
   * @param data
   */
  update = (
    id: number,
    data: API.RealEstateStatusRequest,
  ): Promise<API.RealEstateStatusResponse | {}> => {
    return apiRealEstateStatus.updateApi(id, data).catch((err) => {
      return { keyResponse: err?.response?.data?.message };
    });
  };

  /**
   *
   * @param id
   */
  delete = (id: number, branch_id: string): Promise<API.MpireResponse> => {
    return apiRealEstateStatus.deleteApi(id, branch_id).catch((err) => {
      return { keyResponse: err?.response?.data?.message };
    });
  };

  activeDeactive = (id: number, data: API.RealEstateStatusRequest): Promise<API.MpireResponse> => {
    return apiRealEstateStatus.activeDeactiveApi(id, data).catch((err) => {
      return { keyResponse: err?.response?.data?.message };
    });
  };

  isEditableRe = (id: number, data: API.RealEstateStatusRequest): Promise<API.MpireResponse> => {
    return apiRealEstateStatus.isEditableReApi(id, data).catch((err) => {
      return { keyResponse: err?.response?.data?.message };
    });
  };

  isDefault = (id: number, data: API.RealEstateStatusRequest): Promise<API.MpireResponse> => {
    return apiRealEstateStatus.isDefaultApi(id, data).catch((err) => {
      return { keyResponse: err?.response?.data?.message };
    });
  };

  checkDuplicateRealEstateStatus = (
    data: API.CheckDuplicateRealEstateStatus,
  ): Promise<API.MpireResponse | undefined> => {
    return apiRealEstateStatus
      .checkDuplicateRealEstateStatus(data)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        } else {
          return undefined;
        }
      })
      .catch((res) => undefined);
  };
}

export const realEstateStatusService = new RealEstateStatusService();
