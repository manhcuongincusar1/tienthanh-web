// @ts-ignore
/* eslint-disable */

declare namespace API {
  type ProvinceResponse = ProvinceData & {};

  type ProvinceData = {
    id?: number,
    code?: string,
    title?: string,
    alias?: string,
    display_title?: string
    display_status?: boolean
    status?: number
  };

  type ListProvinceResponse = {
    data: ProvinceResponse[],
    total: number
  };


}
