import { apiRealEstate } from '@/api/real_estate/api';
import BaseService from './baseService';
import _ from 'lodash';
import { STATUS_ENUM, REAL_ESTATE_PRICE_GROUP } from '@/constants';

class RealEstateService extends BaseService {
  /**
   * Get List Real Estate
   * @param {Object} data
   */

  getListRealEstate = async (
    data: object,
  ): Promise<API.ListRealEstateResponse | undefined | object> => {
    return apiRealEstate
      .getListRealEstateSellApi(data)
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

  getListChangeStatusRealEstateReport = async (
    data: object,
  ): Promise<API.ResponseNewRealEstate | undefined | any> => {
    return apiRealEstate
      .getListChangeStatusRealEstateReport(data)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
        return undefined;
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  getListChangeStatusRealEstateDataReport = async (
    data: object,
  ): Promise<API.ResponseDataReport | undefined | any> => {
    return apiRealEstate
      .getListChangeStatusRealEstateDataReport(data)
      .then((res: any) => {
        if (res.status === 200) {
          if (res.data) {
            let newData = res?.data?.map((item: any) => {
              return { ...item, value: item?.value && Number(item.value) };
            });
            newData = newData.sort((a: any, b: any) => {
              const aa = a.month.split('-').reverse().join();
              const bb = b.month.split('-').reverse().join();
              return aa < bb ? -1 : aa > bb ? 1 : 0;
            });

            return newData;
          }
        }
        return undefined;
      })
      .catch((err) => {
        return undefined;
      });
  };

  getListRealEstateReport = async (
    data: object,
  ): Promise<API.ResponseNewRealEstate | undefined | {}> => {
    return apiRealEstate
      .getListRealEstateReport(data)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
        return undefined;
      })
      .catch((err) => {
        return { keyResponse: err?.response?.data?.message };
      });
  };

  getListRealEstateDataReport = async (data: {
    category_id: string;
    type_chart: string;
    type: number;
  }): Promise<API.ResponseDataReport | undefined> => {
    return apiRealEstate
      .getListRealEstateDataReport(data)
      .then((res) => {
        if (res.status === 200 && res?.data?.data) {
          if (data.category_id === 'price' && res.data.data && data.type_chart === 'pie') {
            const newData = Object.entries(res.data.data).map((item) => {
              return {
                title: `${REAL_ESTATE_PRICE_GROUP[item[0]]} ${data.type === 1 ? 'Tỷ' : 'Triệu'}`,
                scales: item[1] && Number(item[1]),
              };
            });

            return {
              data: newData,
              total: res.data?.total,
            };
          } else if (
            data.category_id === 'price' &&
            res?.data?.data &&
            data.type_chart === 'column'
          ) {
            let newData = Object.values(res.data.data).map((item) => {
              const itemNew: any = Object.entries(item).reduce((acc, item) => {
                if (item[0] !== 'month') {
                  return {
                    ...acc,
                    title:
                      `${REAL_ESTATE_PRICE_GROUP[item[0]]} ${data.type === 1 ? 'Tỷ' : 'Triệu'}` ||
                      '',
                    value: item[1] && Number(item[1]),
                  };
                }
                return { ...acc, month: item[1] };
              }, {});
              return itemNew;
            });

            newData = newData.sort((a, b) => {
              const aa = a.month.split('-').reverse().join();
              const bb = b.month.split('-').reverse().join();
              return aa < bb ? -1 : aa > bb ? 1 : 0;
            });

            return {
              data: newData || [],
              total: 0,
            };
          }
          return res.data;
        }
        return undefined;
      })
      .catch((err) => {
        return undefined;
      });
  };

  subscribeRealEstate = (
    id: string,
    data: API.RealEstateSubscribeRequest,
  ): Promise<API.MpireResponse | undefined> => {
    return apiRealEstate.subscribeRealEstate(id, data).catch((err) => {
      return { keyResponse: err?.response?.data?.message };
    });
  };

  insertRealEstateSell = async (
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

    return await apiRealEstate
      .insertRealEstateSell({
        mainData: {
          address: address?.trim(),
          agency: agency,
          goodwill: goodwill,
          branch_id,
          brokerage_fees: brokerage_fees ? Number(brokerage_fees) : 0,
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

  checkDuplicateRealEstate = async (
    data: API.DataCheckDuplicateRaw,
  ): Promise<API.DataCheckDuplicateRealEstate | undefined> => {
    const {
      address,
      district_id,
      province_city_id,
      real_estate_id,
      real_estate_status_id,
      street_id,
      type,
      ward_id,
      branch_id,
    } = data;

    return await apiRealEstate
      .checkDuplicateRealEstate({
        address,
        real_estate_status_id,
        real_estate_id,
        type,
        district_id: district_id?.value,
        province_city_id: province_city_id?.value,
        ward_id: ward_id?.value,
        street_id: street_id?.value,
        branch_id,
      })
      .then((res) => {
        if (res && res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };

  getRealEstateById = async (
    id: string | number,
    branch_id: string,
  ): Promise<API.RealEstateResponse | undefined | {}> => {
    return await apiRealEstate
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

  updateRealEstateSell = async (
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

    return await apiRealEstate
      .updateRealEstateSell(
        {
          mainData: {
            code,
            address: address?.trim(),
            agency,
            goodwill,
            branch_id,
            brokerage_fees: brokerage_fees ? Number(brokerage_fees) : 0,
            price: price && Number(price?.toString().replace(',', '')),
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

  getHistoryRealEstateStatus = async (
    real_estate_id: string,
  ): Promise<API.GetHistoryRealEstateStatus | undefined> => {
    return await apiRealEstate
      .getHistoryRealEstateStatus(real_estate_id)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };

  updateHistoryCloneRealEstate = async (
    real_estate_id: string,
    realEstateStatus?: { id: string | undefined; title: string | undefined },
    note?: string,
  ) => {
    return await apiRealEstate
      .updateHistoryCloneRealEstate(real_estate_id, realEstateStatus, note)
      .then((res) => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .catch((err) => {
        return undefined;
      });
  };

  assignMultipleRealEstateToUser = async (
    dataAssign: API.DataAssignRealEstateList,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    return await apiRealEstate
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
    return await apiRealEstate
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
    return await apiRealEstate
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
    return await apiRealEstate
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
    console.log(branch_id);

    return await apiRealEstate
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
    return await apiRealEstate
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

  /**
   *
   * @param data
   */
  requestExportFile = async (data: object): Promise<API.MpireResponse> => {
    return await apiRealEstate.requestExportData(data).catch((err) => {
      return { keyResponse: err?.response?.data?.message };
    });
  };

  requestImportData = async (
    body: any,
    type: any,
    branch_id: string,
  ): Promise<API.MpireResponse> => {
    const data = new FormData();
    data.append('file', body);
    data.append('type', type);
    data.append('branch_id', branch_id);

    return apiRealEstate.requestImportData(data).catch((err) => {
      return { keyResponse: err?.response?.data?.message };
    });
  };
}

export const realEstateService = new RealEstateService();
