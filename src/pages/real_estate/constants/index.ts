export const REAL_ESTATE_TYPE_ENUM = {
  SELL: 1,
  RENT: 2,
};
const REAL_LOCATION = {
  facede: 1,
  alley_moto: 2,
  alley_car: 3,
};

export const REAL_LOCATION_ENUM = {
  [REAL_LOCATION.facede]: 'Mặt tiền',
  [REAL_LOCATION.alley_moto]: 'Hẻm xe máy',
  [REAL_LOCATION.alley_car]: 'Hẻm xe hơi',
};

export const DIRECTION_ENUM = {
  west: 'Tây',
  north_west: 'Tây Bắc',
  north: 'Bắc',
  north_east: 'Đông Bắc',
  east: 'Đông',
  south_east: 'Đông Nam',
  south: 'Nam',
  south_west: 'Tây Nam',
};
