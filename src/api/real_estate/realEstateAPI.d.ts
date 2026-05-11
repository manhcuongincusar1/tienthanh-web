// @ts-ignore
/* eslint-disable */

declare namespace API {
  type RealEstateResponse = RealEstateData & {
    code?: string;
    display_status?: boolean;
    category_title?: string;
    province_city?: string;
    district?: string;
    ward?: string;
    street?: string;
    type: number;
    price?: string;
    location?: number;
    creator?: string;
    creator_phone?: string;
    modified_date?: string;
    creator_id?: string;
    real_estate_status?: string;
    real_estate_status_color?: string;
    created_at?: string;
    created_date?: string;
    detail?: DetailDataInsert;
    agency?: boolean;
    brokerage_fees?: number;
    category_id?: string;
    address?: string;
    real_estate_status_editable: boolean;
    real_estate_status_id: string;
    real_estate_category_title: string;
    real_estate_status_show_internal: boolean;
    parent_real_estate_id?: string;
    parent_code?: string;
    children_real_estate_id?: string;
    children_code?: string;
    is_accessible?: boolean;
    title: string;
    id: string | number;
  };

  type RealEstateRequest = {
    id?: string;
    title?: string;
    status?: number;
  };

  type RealEstateSubscribeRequest = {
    isSubscribe: boolean;
    branch_id: string;
  };

  type RealEstateData = {
    id?: string;
    title?: string;
    status?: number;
    code?: string;
  };

  type OptionAdministrative = {
    value: number;
    key: number;
    label: string;
  };

  type ItemPath = {
    id: string;
    path?: string;
    cdn_path?: string;
  };
  type ListRealEstateResponse = {
    data: RealEstateResponse[];
    total: number;
    keyResponse?: string;
  };

  type ProvinceCityId = {
    value: number;
    label: string;
  };

  type DistrictId = {
    value: number;
    label: string;
  };

  type WardId = {
    value: number;
    label: string;
  };
  type StreetId = {
    value: number;
    label: string;
  };

  interface ListRealEstateReport {
    created_at: Date;
    province_city_ids?: number[];
    province_city_title: string;
    district_ids?: number[];
    district_title: string;
    ward_ids?: number[];
    ward_title: string;
    start_day: string;
    end_day: string;
    price_from: number;
    price_to: number;
    offset: number;
    limit: number;
    type: number;
    sorter?: {};
    real_estate_category_title: string;
  }

  interface ListRealEstateDataReport {
    type: number;
    province_city_ids?: number[];
    district_ids?: number[];
    ward_ids?: number[];
    price_from: number;
    price_to: number;
    category_id: string;
    type_chart: string;
  }

  interface ResponseDataReport {
    data: { title: string; scales?: number; value?: number; id?: string }[];
    total?: number;
  }

  interface ResponseNewRealEstate {
    data: ListRealEstateReport[];
    count: number;
  }

  interface MainDataInsert {
    address: string;
    agency: 1 | 0;
    goodwill: 1 | 0;
    duplicate: boolean;
    saler_phone_number: string;
    price: number;
    brokerage_fees?: number;
    category_id: string;
    real_estate_status_id?: string;
    saler_full_name: string;
    sale_id: string;
    location: number;
    type: 1 | 2;
    parent_real_estate_id?: string;
    is_internal?: boolean;
    previous_real_estate_status?: string;
    note_change?: string;
    code?: string;
    image_list?: any;
    owner_full_name?: string;
    owner_phone_number?: string;
    branch_id?: string;
    broker_full_name?: string;
    broker_phone_number?: string;
    creator_id?: string;
    direction?: string;
  }
  type OptionCategory = {
    label: string;
    value: string;
    key: string;
  };

  type MainDataInsertApi = MainDataInsert & {
    province_city_id: number;
    province_city_title: string;
    district_id: number;
    district_title: string;
    ward_id: number;
    ward_title: string;
    street_id: number;
    street_title: string;
    category_id: string;
    category_title: string;
  };

  type MainDataInsertRaw = MainDataInsert & {
    province_city_id: OptionAdministrative;
    district_id: OptionAdministrative;
    ward_id: OptionAdministrative;
    street_id: OptionAdministrative & { title: string };
    category_id: OptionCategory;
  };

  interface DetailDataInsert {
    area?: number;
    bedroom?: number;
    horizontal?: number;
    location?: string;
    long?: number;
    note?: string;
    wc?: number;
    book_status?: boolean;
    recognized_area?: number;
    structure?: string;
    listPath?: ItemPath[];
  }

  type DataInsertApi = {
    mainData: MainDataInsertApi;
    detailData: DetailDataInsert;
  };

  type DataInsertRaw = DetailDataInsert & MainDataInsertRaw;

  interface DataCheckDuplicateRaw {
    province_city_id: OptionAdministrative;
    district_id: OptionAdministrative;
    street_id: OptionAdministrative;
    ward_id: OptionAdministrative;
    type: number;
    address: string;
    real_estate_status_id: string;
    real_estate_id?: string;
    branch_id?: string;
  }

  interface DataCheckDuplicate {
    province_city_id: number;
    district_id: number;
    street_id: number;
    ward_id: number;
    type: number;
    address: string;
    real_estate_status_id: string;
    real_estate_id?: string;
    branch_id?: string;
  }

  interface PreviousStatus {
    id?: string;
    title?: string;
  }

  type DataAssignRealEstateItem = {
    real_estate_id: string;
    real_estate_status_id: string;
    real_estate_status_title: string;
    branch_id: string;
    broker_phone_number: string;
    broker_full_name: string;
    saler_phone_number: string;
    saler_full_name: string;
    next_saler_full_name: string;
    user_id: string;
  };

  type DataAssignRealEstateList = DataAssignRealEstateItem[];
  type DataAssignRealEstateSingle = DataAssignRealEstateItem;

  type DataConvertRealEstateListToDuplicate = string[];
  type DataDeleteRealEstate = string[];
}
