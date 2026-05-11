// @ts-ignore
/* eslint-disable */

declare namespace API {
  type StreetDataItem = {
    id?: number;
    code?: string;
    title?: string;
    alias?: string;
    display_title?: string;
    display_status?: boolean;
    status?: number;
  };

  type StreetResponse = StreetDataItem & {
    wards?: WardData;
    districts?: DistrictData;
    province_city?: DistrictData;
  };

  type ListStreetResponse = {
    data: StreetResponse[];
    total: number;
    status?: number;
  };
}
