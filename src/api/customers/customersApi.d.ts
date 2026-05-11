// @ts-ignore
/* eslint-disable */

declare namespace API {
  interface GetCustomerListSell {
    province_city_id?: number;
    creator_sale_id?: string;
    keyword?: string;
    district_id?: number;
    real_estate_status?: number;
    offset: number;
    limit: number;
    range_price_from?: number;
    sorter?: string;
    range_price_to?: number;
    branch_id?: string | undefined;
  }

  interface GetListCustomerReport {
    offset: number;
    limit: number;
    end_day?: string;
    start_day?: string;
    price_from_sell: number;
    price_to_sell: number;
    price_from_rent: number;
    price_to_rent: number;
    creator_sale: number;
    branch_id: string;
    sort: any;
  }

  interface GetListCustomerDataReport {
    end_day?: string;
    start_day?: string;
    branch_id: string;
  }

  interface GetCustomerBuyRent {
    province_city_id?: number;
    creator_sale_id?: string;
    keyword?: string;
    demand_type?: number;
    districts_id?: number;
    offset: number;
    limit: number;
    sorter?: {};
    price_from?: number;
    goodwill?: boolean;
    price_to?: number;
    branch_id: string;
  }

  interface DataDemandUpdate {
    id: string;
    customer_id: string;
    province_city_id?: number;
    districts_id?: number;
    type: number;
    uses?: string;
    note?: string;
    price_from?: number;
    price_to?: number;
    branch_id?: string;
  }

  interface GetTransactionHistory {
    customer_id?: string;
    broker_id?: string;
    offset: number;
    limit: number;
    sorter?: any;
    branch_id: string;
  }

  interface DataInfoUpdateCustomer {
    full_name: string;
    phone: string;
  }

  interface UpdateCustomerBuyRent {
    id: string;
    phone_number_new: string[];
    phone_number_prev: string[];
    full_name: string;
    phone_number_main: string;
    goodwill?: boolean;
    branch_id: string;
  }

  interface GetCustomerBuyRentById {
    offset: number;
    limit: number;
    sorter?: {};
    type: number;
    branch_id: string;
  }

  interface DataUpdateCustomer {
    phone_number?: string;
    full_name: string;
    branch_id: string;
    phone_number_sub_list: object[];
  }

  interface CheckPhoneExist {
    username: string;
    raw_phone_number: string;
  }

  type CheckExistPhoneNumberOfCustomer = {
    customer_id?: string;
    phone_number: string;
    branch_id: string;
    type: number;
  };

  interface InsertCustomerBuyRent {
    full_name: string;
    phone_number_main: string;
    phone_number_sub: string[];
    goodwill: boolean;
    data_demand: CustomerBuyRent.Deal[] | undefined;
    branch_id?: string | undefined;
  }
}
