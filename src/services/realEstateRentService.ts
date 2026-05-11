import { apiRealEstateRent } from '@/api/real_estate_rent/api';
import BaseService from './baseService';
import _ from 'lodash';
import { STATUS_ENUM } from '@/constants';

class RealEstateService extends BaseService {
  getListRealEstate = async (
    data: object,
  ): Promise<API.ListRealEstateResponse | undefined | object> => {
    return apiRealEstateRent
      .getListRealEstateRentApi(data)
      .then((res) => {
        if (res.status == 200) {
          const { data: listRealEstate, total } = res;
          const listEstate: API.RealEstateResponse[] = [];
          if (!_.isEmpty(listRealEstate)) {
            _.each(listRealEstate, (realEstate: API.RealEstateResponse) => {
              listEstate.push({
                ...realEstate,
                display_status: realEstate.status === STATUS_ENUM.ACTIVE,
              });
            });
          }
          return {
            data: listEstate,
            total,
          } as API.ListRealEstateResponse;
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  insertRealEstateRent = async (
    data: API.DataInsertRaw,
  ): Promise<API.MpireResponse | undefined | any> => {
    const {
      type,
      address,
      agency,
      broker_full_name,
      broker_phone_number,
      saler_phone_number,
      saler_full_name,
      price,
      district_id,
      province_city_id,
      street_id,
      ward_id,
      real_estate_status_id,
      brokerage_fees,
      category_id,
      sale_id,
      goodwill,
      parent_real_estate_id,
      previous_real_estate_status,
      duplicate,
      note_change,
      location,
      branch_id,
      direction,
    } = data;
    const {
      area,
      bedroom,
      horizontal,
      book_status,
      long,
      note,
      wc,
      recognized_area,
      structure,
      listPath,
    } = data;

    return await apiRealEstateRent
      .insertRealEstateRent({
        mainData: {
          address: address?.trim(),
          agency: agency,
          goodwill: goodwill,
          branch_id,
          brokerage_fees: brokerage_fees ? Number(brokerage_fees?.toString()?.replace(',', '')) : 0,
          price: price && Number(price?.toString()?.replace(',', '')),
          category_id: category_id?.value,
          category_title: category_id?.label,
          real_estate_status_id: real_estate_status_id,
          saler_full_name,
          saler_phone_number,
          broker_full_name,
          broker_phone_number,
          sale_id,
          province_city_id: province_city_id?.value,
          province_city_title: province_city_id?.label,
          district_id: district_id?.value,
          district_title: district_id?.label,
          street_id: street_id?.value,
          street_title: street_id?.title,
          ward_id: ward_id?.value,
          ward_title: ward_id?.label,
          type,
          parent_real_estate_id,
          previous_real_estate_status,
          duplicate: duplicate,
          note_change,
          direction,
          location: location && Number(location),
        },
        detailData: {
          area: area && Number(area),
          bedroom: bedroom && Number(bedroom),
          horizontal: horizontal && Number(horizontal),
          book_status: book_status && true,
          long: long && Number(long),
          note,
          wc: wc && Number(wc),
          recognized_area: recognized_area && Number(recognized_area),
          structure,
          listPath,
        },
      })
      .then((res) => {
        if (res && res.status === 200) {
          return { data: res.data };
        }
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  subscribeRealEstate = (
    id: string,
    data: API.RealEstateSubscribeRequest,
  ): Promise<API.MpireResponse | undefined> => {
    return apiRealEstateRent.subscribeRealEstate(id, data).catch((err) => {
      return { keyResponse: err?.response?.data?.message };
    });
  };

  getRealEstateById = async (
    id: string | number,
    branch_id: string,
  ): Promise<API.RealEstateResponse | undefined | {}> => {
    return await apiRealEstateRent
      .getRealEstateById(id, branch_id)
      .then((res) => {
        if (res && res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        if (err?.response?.data.status === 404) {
          return { keyResponse: 'notfound' };
        }
        return { keyResponse: err?.response?.data?.message };
      });
  };

  updateRealEstateRent = async (
    data: API.DataInsertRaw,
    real_estate_id: string,
    previous_status?: API.PreviousStatus,
    next_status?: API.PreviousStatus,
  ): Promise<string | undefined> => {
    const {
      code,
      address,
      agency,
      broker_full_name,
      broker_phone_number,
      saler_phone_number,
      saler_full_name,
      price,
      type,
      district_id,
      province_city_id,
      street_id,
      ward_id,
      location,
      direction,
      real_estate_status_id,
      brokerage_fees,
      category_id,
      sale_id,
      goodwill,
      is_internal,
      duplicate,
      branch_id,
      creator_id,
    } = data;

    const {
      area,
      bedroom,
      horizontal,
      book_status = true,
      long,
      note,
      wc,
      recognized_area,
      structure,
      listPath,
    } = data;

    return await apiRealEstateRent
      .updateRealEstateRent(
        {
          mainData: {
            code,
            address: address?.trim(),
            agency,
            goodwill,
            branch_id,
            brokerage_fees: brokerage_fees ? Number(brokerage_fees?.toString()?.replace(',', '')) : 0,
            price: price && Number(price?.toString()?.replace(',', '')),
            category_id: category_id?.value,
            category_title: category_id?.label,
            real_estate_status_id,
            saler_full_name,
            saler_phone_number,
            sale_id,
            broker_full_name,
            broker_phone_number,
            province_city_id: province_city_id?.value,
            province_city_title: province_city_id?.label,
            district_id: district_id?.value,
            district_title: district_id?.label,
            ward_id: ward_id?.value,
            ward_title: ward_id?.label,
            street_id: street_id?.value,
            street_title: street_id?.title,
            location: location && Number(location),
            direction,
            type,
            duplicate,
            is_internal,
            creator_id,
          },
          detailData: {
            area: area && Number(area),
            bedroom: bedroom && Number(bedroom),
            horizontal: horizontal && Number(horizontal),
            book_status,
            long: long && Number(long),
            note,
            wc: wc && Number(wc),
            recognized_area: recognized_area && Number(recognized_area),
            structure,
            listPath,
          },
        },
        real_estate_id,
        previous_status,
        next_status,
      )
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return err?.response?.data?.message;
      });
  };

  assignMultipleRealEstateToUser = async (
    dataAssign: API.DataAssignRealEstateList,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return await apiRealEstateRent
      .assignMultipleRealEstateToUser(dataAssign, branch_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return err?.response?.data?.message;
      });
  };

  assignRealEstateSingleToUser = async (
    dataAssign: API.DataAssignRealEstateSingle,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return await apiRealEstateRent
      .assignRealEstateSingleToUser(dataAssign, branch_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return err?.response?.data?.message;
      });
  };

  convertSingleRealEstateToDuplicate = async (
    realEstateId: string,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return await apiRealEstateRent
      .convertSingleRealEstateToDuplicate(realEstateId, branch_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return err?.response?.data?.message;
      });
  };

  convertRealEstateListToDuplicate = async (
    realEstateList: API.DataConvertRealEstateListToDuplicate,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return await apiRealEstateRent
      .convertRealEstateListToDuplicate(realEstateList, branch_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return err?.response?.data?.message;
      });
  };

  deleteRealEstateList = async (
    realEstateList: API.DataDeleteRealEstate,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return await apiRealEstateRent
      .deleteRealEstateList(realEstateList, branch_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return err?.response?.data?.message;
      });
  };

  deleteSingleRealEstate = async (
    realEstateId: string,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return await apiRealEstateRent
      .deleteSingleRealEstate(realEstateId, branch_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return err?.response?.data?.message;
      });
  };
}

export const realEstateRentService = new RealEstateService();
