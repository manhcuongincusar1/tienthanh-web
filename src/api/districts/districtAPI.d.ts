// @ts-ignore
/* eslint-disable */

declare namespace API {
  type DistrictResponse = DistrictData & {
    province_city?: ProvinceData;
  };

  type StreetData = {
    id?: string;
    title: string;
    ward_id: number;
    province_city_id: number;
    districts_id: number;
    status: boolean;
    code?: string;
    branch_id: string;
  };
  type DataActiveStreet = {
    status: boolean;
    branch_id: string;
  };

  type DistrictData = {
    id?: number;
    code?: string;
    title?: string;
    alias?: string;
    display_title?: string;
    display_status?: boolean;
    branch_id?: string;
    status?: any;
    provinceCityId?: string | number | undefined;
  };

  type DistrictRequest = {
    code: string;
    title: string;
    status: boolean;
    province_city_id: string;
  };

  type ListDistrictResponse = {
    data: DistrictResponse[];
    total: number;
  };
}
