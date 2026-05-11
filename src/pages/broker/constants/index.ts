const BROKER_SELL_RENT_VALUE = {
  no: 3,
  sell: 1,
  rent: 2,
};
const BROKER_SELL_RENT_VALUE_MAPPING = {
  no: 'Không có nhu cầu',
  sell: 'Bán',
  rent: 'Cho thuê',
};
export const BROKER_SELL_RENT_VALUE_ENUM = {
  [BROKER_SELL_RENT_VALUE.no]: [BROKER_SELL_RENT_VALUE_MAPPING.no],
  [BROKER_SELL_RENT_VALUE.sell]: [BROKER_SELL_RENT_VALUE_MAPPING.sell],
  [BROKER_SELL_RENT_VALUE.rent]: [BROKER_SELL_RENT_VALUE_MAPPING.rent],
};
