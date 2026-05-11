declare namespace API {
  interface PathItem {
    id: string;
    path: string;
  }

  interface ResponseGetRealEstateById {
    detail?: {
      listPath?: PathItem[];
    };
    real_estate_status_editable: boolean;
    real_estate_status: string;
    real_estate_status_id: string;
    parent_real_estate_id?: string;
    parent_code?: string;
    children_real_estate_id?: string;
    children_code?: string;
  }
  interface DataCheckDuplicateRealEstate {
    is_duplicate: boolean;
    real_estate_id?: string;
  }
  interface DataUpdateRealEstate {
    id?: string;
  }
  interface GetHistoryRealEstateStatus {
    next_real_estate_status?: string;
    previous_real_estate_status?: string;
  }
}
