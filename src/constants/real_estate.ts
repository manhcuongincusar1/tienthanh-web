import { getIntl, getLocale } from 'umi';

const intl = getIntl(getLocale());

const REAL_ESTATE_TYPE_ENUM = {
  SALE: 1,
  RENT: 2,
};
const REAL_ESTATE_TYPE_ENUM_SELECT = {
  1: {
    text: intl.formatMessage({ id: 'pages.real_estate_status.sale' }),
  },
  2: {
    text: intl.formatMessage({ id: 'pages.real_estate_status.rent' }),
  },
};

const REAL_ESTATE_IS_EDITABLE = {
  true: intl.formatMessage({ id: 'global.yes' }),
  false: intl.formatMessage({ id: 'global.no' }),
};

const REAL_ESTATE_STATUS_COLOR_ENUM = [
  {
    label: 'gold',
    value: 'gold',
  },
  {
    label: 'blue',
    value: 'blue',
  },
  {
    label: 'purple',
    value: 'purple',
  },
  {
    label: 'cyan',
    value: 'cyan',
  },
  {
    label: 'green',
    value: 'green',
  },
  {
    label: 'magenta',
    value: 'magenta',
  },
  {
    label: 'pink',
    value: 'pink',
  },
  {
    label: 'red',
    value: 'red',
  },
  {
    label: 'orange',
    value: 'orange',
  },
  {
    label: 'yellow',
    value: 'yellow',
  },
  {
    label: 'volcano',
    value: 'volcano',
  },
  {
    label: 'geekblue',
    value: 'geekblue',
  },
  {
    label: 'lime',
    value: 'lime',
  },
  {
    label: 'success',
    value: 'success',
  },
  {
    label: 'processing',
    value: 'processing',
  },
  {
    label: 'error',
    value: 'error',
  },
  {
    label: 'warning',
    value: 'warning',
  },
  {
    label: 'default',
    value: 'default',
  },
];

export {
  REAL_ESTATE_IS_EDITABLE,
  REAL_ESTATE_TYPE_ENUM,
  REAL_ESTATE_TYPE_ENUM_SELECT,
  REAL_ESTATE_STATUS_COLOR_ENUM,
};
