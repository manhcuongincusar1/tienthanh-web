import { getIntl, getLocale } from 'umi';

const intl = getIntl(getLocale());
export * from './real_estate';
export const STATUS_ENUM = {
  DELETED: -1,
  ACTIVE: 1,
  PENDING: 2,
};

export const EXPORT_STATUS_ENUM = {
  0: intl.formatMessage({ id: 'pages.import_export.export.fail' }),
  1: intl.formatMessage({ id: 'pages.import_export.export.checking' }),
  2: intl.formatMessage({ id: 'pages.import_export.export.execution' }),
  3: intl.formatMessage({ id: 'pages.import_export.export.success' }),
};

export const IMPORT_STATUS_ENUM = {
  0: intl.formatMessage({ id: 'pages.import_export.import.fail' }),
  1: intl.formatMessage({ id: 'pages.import_export.import.checking' }),
  2: intl.formatMessage({ id: 'pages.import_export.import.execution' }),
  3: intl.formatMessage({ id: 'pages.import_export.import.success' }),
};

export const STATUS_BOOLEAN_ENUM = {
  1: `Có`,
  2: `Không`,
};

export const STATUS_ENUM_SELECT = {
  1: intl.formatMessage({ id: 'global.active' }),
  2: intl.formatMessage({ id: 'global.not_active' }),
};

export const DATE_FORMATS = {
  DD_MM_YYYY: 'DD/MM/YYYY',
  YYYY_MM_DD: 'YYYY/MM/DD',
  YYYY_MM_DD_HH_MM_SS: 'YYYY/MM/DD HH:mm:ss',
  DD_MM_YYYY_HH_MM: 'DD/MM/YYYY HH:mm',
  DD_DD_MM_YY: 'dd, DD/MM/YYYY',
  DD_DD_MM_YY_HH_MM: 'dd, DD/MM/YYYY HH:mm',
  HH_MM: 'HH:mm',
};

export const REAL_ESTATE_PRICE_GROUP = {
  p1_10: 'Từ 1 - 10',
  p10_15: 'Trên 10 - 15',
  p15_20: 'Trên 15 - 20',
  p20_50: 'Trên 20 - 50',
  p50: 'Trên 50',
};

export const MESSAGE_DISPLAY_SECONDS = {
  ERROR: 5,
  SUCCESS: 1.5,
};

export const TOKEN = 'auth_token';

export const HOME_PAGE_PATH = '/real-estate-sell/list';
