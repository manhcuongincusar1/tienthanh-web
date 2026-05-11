declare namespace RealEstate {
  interface Params {
    id: string;
  }
  interface ParentRealEstate {
    id: string;
    code?: string;
  }
  interface ItemPath {
    id: string;
    path?: string;
    cdn_path?: string;
  }
  interface ReadOnlyStatus {
    status: boolean;
  }
  type RealEstateListToAssign = {
    real_estate_status: string;
    real_estate_status_id: string;
    creator: string;
    id: string;
    code: string;
    sale_full_name: string;
    sale_phone: string;
    broker_full_name: string;
    broker_phone_number: string;
  };
  type RealEstateListToAssignList = RealEstateListToAssign[];
}
