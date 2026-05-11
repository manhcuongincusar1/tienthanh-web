// @ts-ignore
/* eslint-disable */

declare namespace API {
  type WardResponse = WardData & {
    districts?: DistrictData;
    province_city?: DistrictData;
    wards?: DistrictData;
  };

  type WardData = {
    id?: number;
    code?: string;
    title?: string;
    alias?: string;
    display_title?: string;
    display_status?: boolean;
    status?: number | boolean;
    branch_id?: string;
  };

  type WardRequest = {
    code: string;
    title: string;
    status: boolean;
    id: number;
    province_city_id: number;
    district_id: number;
  };

  type ListWardResponse = {
    data: WardResponse[];
    total: number;
  };
}
