// @ts-ignore
/* eslint-disable */

declare namespace API {
  type LoginResponse = {
    token: string;
    active: boolean;
    update_password: string;
  };

  type CurrentUser = {
    full_name?: string;
    avatar?: string;
    userid?: string;
    email?: string;
    title?: string;
    group?: string;
    id?: string;
    province_city_id: string;
    currentWorkSpace?: Record<string, any> | null;
    district_id?: number | number[];
    prices: any;
    permission_data: {};
    branch_id?: string[];
    role?: string;
    // tags?: { key?: string; label?: string }[];
    notifyCount?: number;
    unreadCount?: number;
    // country?: string;
    // access?: string;
    // geographic?: {
    //   province?: { label?: string; key?: string };
    //   city?: { label?: string; key?: string };
    // };
    // address?: string;
    phone?: string;
  };
  type UserExist = {
    username: string;
  };
  type UserToken = {
    activation_key: string;
  };
  type ResetPassword = {
    password: string;
    activation_key: string;
  };

  type ChangePassword = {
    password?: string;
    new_password: string;
    username?: string;
  };
  type CheckPhoneExist = {
    raw_phone_number: string;
    username: string;
  };
  type UpdatePersonalInfo = {
    raw_phone_number: string;
    username: string;
    full_name: string;
  };
}
