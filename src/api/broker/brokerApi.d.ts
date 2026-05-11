declare namespace API {
  type ParamsGetBrokerList = {
    offset: number;
    limit: number;
    sorter: object;
    real_estate_type: number;
    province_city_id: number | number[];
    district_id: number | number[];
    creator_sale_id: string;
    keyword: string;
    to_price: number;
    from_price: number;
    branch_id?: string | undefined;
  };

  type ParamsCheckExistPhoneNumber = {
    phone_number?: string;
    broker_id: string;
  };
  type DataUpdateBrokerById = {
    phone_number?: string;
    full_name: string;
    phone_number_sub_list: object[];
    branch_id: string;
  };
}
