declare namespace Customer {
  interface Deal {
    id: string;
    created_at: string;
    uses?: string;
    price_from?: number;
    price_to?: number;
    province_city_title?: string;
    district_title?: string;
    province_city_id?: number;
    districts_id?: number;
    note?: string;
    type: number;
    status?: number;
  }
  interface Params {
    id: string;
  }
}
