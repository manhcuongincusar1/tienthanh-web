import { apiRealEstateCategory } from '@/api/real_estate_category/api';
import BaseService from './baseService';
import _ from 'lodash';
import { STATUS_ENUM } from '@/constants';

class RealEstateCategoryService extends BaseService {
  /**
   * Get List Real Estate Category
   * @param {Object} data
   */
  getListRealEstateCategory = async (
    data: object,
  ): Promise<API.ListRealEstateCategoryResponse | undefined> => {
    return apiRealEstateCategory.getListRealEstateCategoryApi(data).then((res) => {
      if (res.status == 200) {
        const { data: listRealEstateCategory, total } = res;
        const listEstate: API.RealEstateCategoryResponse[] = [];
        if (!_.isEmpty(listRealEstateCategory)) {
          _.each(listRealEstateCategory, (realEstate: API.RealEstateCategoryData) => {
            listEstate.push({
              ...realEstate,
              display_status: realEstate.status === STATUS_ENUM.ACTIVE,
            });
          });
        }
        return {
          data: listEstate,
          total,
        } as API.ListRealEstateCategoryResponse;
      }
    });
  };

  getListRealEstateCategoryManagement = async (data: object) => {
    return apiRealEstateCategory
      .getListRealEstateCategoryManagementApi(data)
      .then((res) => {
        if (res.status == 200) {
          const { data: listRealEstateCategory, total } = res;
          const listEstate: API.RealEstateCategoryResponse[] = [];
          if (!_.isEmpty(listRealEstateCategory)) {
            _.each(listRealEstateCategory, (realEstate: API.RealEstateCategoryData) => {
              listEstate.push({
                ...realEstate,
                display_status: realEstate.status === STATUS_ENUM.ACTIVE,
              });
            });
          }
          return {
            data: listEstate,
            total,
          } as API.ListRealEstateCategoryResponse;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  getListRealEstateCategorySelect = async (data: object) => {
    return apiRealEstateCategory.getListRealEstateCategoryApi(data).then((res) => {
      if (res.status == 200) {
        const { data: listRealEstateCategory } = res;
        const listEstate: API.RealEstateCategoryResponse[] = [];
        if (!_.isEmpty(listRealEstateCategory)) {
          _.each(listRealEstateCategory, (realEstate: API.RealEstateCategoryData) => {
            listEstate.push({
              label: realEstate.title,
              value: realEstate.id,
            });
          });
        }
        return listEstate;
      }
    });
  };

  /**
   * Active Deactive Real Estate Category
   * @param {Number} id
   * @param {API.RealEstateCategoryData} data
   */
  activeDeActiveRealEstateCategory = (
    id: number,
    data: API.RealEstateCategoryData,
  ): Promise<API.MpireResponse> => {
    return apiRealEstateCategory.activeDeactiveApi(id, data);
  };
  checkDuplicateRealEstateCategory = async (data: {
    title: string;
    current_category_id?: string;
  }) => {
    return apiRealEstateCategory
      .checkDuplicateRealEstateCategory(data)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };

  /**
   *
   * @param data
   */
  createRealEstateCategory = async (
    data: API.RealEstateCategoryRequest,
  ): Promise<API.RealEstateCategoryResponse | {}> => {
    return apiRealEstateCategory.createApi(data).catch((err) => {
      return { keyResponse: err?.response?.data?.message };
    });
  };

  /**
   *
   * @param id
   */
  detail = (
    id: string,
    branch_id: string,
  ): Promise<API.RealEstateCategoryResponse | {} | undefined> => {
    return apiRealEstateCategory
      .detailApi(id, branch_id)
      .then((res) => {
        if (res.status == 200) {
          return { ...res.data } as API.RealEstateCategoryResponse;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  /**
   *
   * @param id
   * @param data
   */
  update = (
    id: number,
    data: API.RealEstateCategoryRequest,
  ): Promise<API.RealEstateCategoryResponse | {}> => {
    return apiRealEstateCategory.updateApi(id, data).catch((error) => {
      return { keyResponse: error?.response?.data?.message };
    });
  };

  /**
   *
   * @param id
   */
  delete = (id: number): Promise<API.MpireResponse> => {
    return apiRealEstateCategory.deleteApi(id);
  };

  activeDeactive = (
    id: number,
    data: API.RealEstateCategoryRequest,
  ): Promise<API.MpireResponse> => {
    return apiRealEstateCategory.activeDeactiveApi(id, data).catch((err) => {
      return { keyResponse: err.response?.data?.message };
    });
  };
}

export const realEstateCategoryService = new RealEstateCategoryService();
