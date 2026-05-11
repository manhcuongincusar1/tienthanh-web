// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Account = {
    user_id: number;
    created_at: string;
    full_name: string;
    status: number;
    sales_id: number;
    sell_price_from: number;
    sell_price_to: number;
    rent_price_from: number;
    rent_price_to: number;
    raw_phone_number: string;
  };

  type AccountSelect = {
    label: string;
    value: string | number;
  };
}
