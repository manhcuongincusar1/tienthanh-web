declare namespace Report {
  interface ListRealEstateReport {
    created_at: Date;
    province_city_id?: number;
    province_city_title: string;
    districts_id?: number;
    district_title: string;
    wards_id?: number;
    ward_title: string;
    real_estate_category_title: string;
  }
}
