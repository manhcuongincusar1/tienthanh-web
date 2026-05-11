// @ts-ignore
/* eslint-disable */

declare namespace API {
  type RealEstateStatusResponse = RealEstateStatusData & {
    display_status?: boolean;
  };

  type RealEstateStatusRequest = {
    id?: number;
    code?: string;
    title?: string;
    isEditableRe?: boolean;
    isDefault?: boolean;
    isShowInternal?: boolean;
    isAllowDuplicate?: boolean;
    type?: number;
    status?: number;
    color?: string;
    branch_id?: string;
  };
  type CheckDuplicateRealEstateStatus = {
    title: string;
    current_status_id?: string;
  };

  type RealEstateStatusData = {
    id?: string;
    code?: string;
    title?: string;
    is_editable_re?: boolean;
    is_default?: boolean;
    is_show_internal?: boolean;
    type?: number;
    status?: number;
    color?: string;
    label?: string;
    value?: string;
  };

  type ListRealEstateStatusResponse = {
    data: RealEstateStatusResponse[];
    total: number;
  };
}
