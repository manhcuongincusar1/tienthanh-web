const CUSTOMER_SELL_RENT_VALUE = {
  sell: 1,
  rent: 2,
  no: 3,
};
const CUSTOMER_SELL_RENT_VALUE_MAPPING = {
  sell: 'Bán',
  rent: 'Cho thuê',
  no: 'Không có nhu cầu',
};
export const CUSTOMER_SELL_RENT_VALUE_ENUM = {
  [CUSTOMER_SELL_RENT_VALUE.sell]: [CUSTOMER_SELL_RENT_VALUE_MAPPING.sell],
  [CUSTOMER_SELL_RENT_VALUE.no]: [CUSTOMER_SELL_RENT_VALUE_MAPPING.no],
  [CUSTOMER_SELL_RENT_VALUE.rent]: [CUSTOMER_SELL_RENT_VALUE_MAPPING.rent],
};

const CUSTOMER_BUY_RENT_VALUE = {
  buy: 1,
  rent: 2,
};

export const CUSTOMER_TYPE_ENUM = {
  SELL: 1,
  BUY: 2,
};
const CUSTOMER_BUY_RENT_VALUE_MAPPING = {
  buy: 'Cần mua',
  rent: 'Cần thuê',
};
export const CUSTOMER_BUY_RENT_VALUE_ENUM = {
  [CUSTOMER_BUY_RENT_VALUE.buy]: [CUSTOMER_BUY_RENT_VALUE_MAPPING.buy],
  [CUSTOMER_BUY_RENT_VALUE.rent]: [CUSTOMER_BUY_RENT_VALUE_MAPPING.rent],
};

const CUSTOMER_GOODWILL_VALUE = {
  goodwill: 1,
  not_goodwill: 2,
};
const CUSTOMER_GOODWILL_VALUE_MAPPING = {
  goodwill: 'Thiện chí',
  not_goodwill: 'Không thiện chí',
};
export const CUSTOMER_GOODWILL_VALUE_ENUM = {
  [CUSTOMER_GOODWILL_VALUE.goodwill]: [CUSTOMER_GOODWILL_VALUE_MAPPING.goodwill],
  [CUSTOMER_GOODWILL_VALUE.not_goodwill]: [CUSTOMER_GOODWILL_VALUE_MAPPING.not_goodwill],
};

const REAL_ESTATE_STATUS = {
  on_sale: 1,
  for_rent: 2,
  rented: 4,
  sold: 3,
};

const REAL_ESTATE_STATUS_LABEL = {
  [REAL_ESTATE_STATUS.on_sale]: 'Đang bán',
  [REAL_ESTATE_STATUS.for_rent]: 'Đang cho thuê',
  [REAL_ESTATE_STATUS.rented]: 'Đã cho thuê',
  [REAL_ESTATE_STATUS.sold]: 'Đã bán',
};
const REAL_ESTATE_STATUS_COLOR = {
  [REAL_ESTATE_STATUS.on_sale]: 'processing',
  [REAL_ESTATE_STATUS.for_rent]: 'warning',
  [REAL_ESTATE_STATUS.rented]: 'error',
  [REAL_ESTATE_STATUS.sold]: 'success',
};

export const REAL_ESTATE_STATUS_MAPPING = {
  [REAL_ESTATE_STATUS.on_sale]: {
    label: REAL_ESTATE_STATUS_LABEL[REAL_ESTATE_STATUS.on_sale],
    color: REAL_ESTATE_STATUS_COLOR[REAL_ESTATE_STATUS.on_sale],
  },
  [REAL_ESTATE_STATUS.for_rent]: {
    label: REAL_ESTATE_STATUS_LABEL[REAL_ESTATE_STATUS.for_rent],
    color: REAL_ESTATE_STATUS_COLOR[REAL_ESTATE_STATUS.for_rent],
  },
  [REAL_ESTATE_STATUS.rented]: {
    label: REAL_ESTATE_STATUS_LABEL[REAL_ESTATE_STATUS.rented],
    color: REAL_ESTATE_STATUS_COLOR[REAL_ESTATE_STATUS.rented],
  },
  [REAL_ESTATE_STATUS.sold]: {
    color: REAL_ESTATE_STATUS_COLOR[REAL_ESTATE_STATUS.sold],
    label: REAL_ESTATE_STATUS_LABEL[REAL_ESTATE_STATUS.sold],
  },
};
