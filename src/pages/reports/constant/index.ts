const REAL_ESTATE_TYPE = {
  sell: 1,
  rent: 2,
};

export const REAL_ESTATE_TYPE_ENUM = {
  [REAL_ESTATE_TYPE.sell]: 'Bán',
  [REAL_ESTATE_TYPE.rent]: 'Thuê',
};

export const REAL_ESTATE_TYPE_OPTION = [
  {
    value: REAL_ESTATE_TYPE.sell,
    label: 'Bán',
  },
  {
    value: REAL_ESTATE_TYPE.rent,
    label: 'Thuê',
  },
];
