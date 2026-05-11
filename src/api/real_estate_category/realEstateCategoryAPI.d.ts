// @ts-ignore
/* eslint-disable */

declare namespace API {
  type RealEstateCategoryResponse = RealEstateStatusData & {
    display_status?: boolean;
    listRE?: string;
  };

  type RealEstateCategoryRequest = {
    id?: string;
    code?: string;
    title?: string;
    status?: number;
    branch_id?: string;
  };

  type RealEstateCategoryData = {
    id?: string;
    code?: string;
    title?: string;
    status?: number;
  };

  type ListRealEstateCategoryResponse = {
    data: RealEstateCategoryResponse[];
    total: number;
  };
}
