import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { DATE_FORMATS } from '@/constants';

/**
 *
 * @param dateTime
 * @returns {string}
 */
export const format = (dateTime: string) => {
  return dayjs(dateTime).utc(true).format('DD-MM-YYYY HH:mm:ss');
};

/**
 *
 * @param {String} date
 * @param  {String} formatParse
 * @returns {dayjs.Dayjs}
 */
export const toDayJS = (date = '', formatParse = '') => {
  return dayjs(date, formatParse);
};

export const toDayJsWithoutFormat = (date = '') => {
  return dayjs(date);
};

export const toDayJsUTC = (date = '') => {
  return dayjs(date).utc(true);
};

/**
 * @param dateTime
 * @returns {string|null}
 */
export const formatDate = (dateTime: string | undefined) => {
  if (dayjs(dateTime).utc(true).isValid()) {
    return dayjs(dateTime).format('DD/MM/YYYY');
  } else {
    return null;
  }
};

/**
 * @param {String} dateTime
 * @returns {string|null}
 */
export const formatDateTime = (dateTime: string) => {
  if (dayjs(dateTime).utc(true).isValid()) {
    return dayjs(dateTime).format('DD/MM/YYYY HH:mm');
  } else {
    return null;
  }
};

/**
 * @param {String} dateTime
 * @returns {string|null}
 */
export const formatTime = (dateTime: string) => {
  if (dayjs(dateTime).utc(true).isValid()) {
    return dayjs(dateTime).format('HH:mm');
  } else {
    return null;
  }
};

/**
 * Remove Hour, Minute, Second
 * @param Moment
 * @return Moment
 */
export const cleanDate = (dateTime: Date) => {
  if (!dateTime) {
    return dateTime;
  }
  return dateTime.setHours(0);
};

export const relativeTime = (dateTime: string) => {
  let day = dayjs().diff(dateTime, 'day');
  let hour = dayjs().diff(dateTime, 'hour');
  let min = dayjs().diff(dateTime, 'minute');
  if (day > 3) {
    return formatDateTime(dateTime);
  } else if (day > 0) {
    return day + ' ngày';
  } else if (hour > 0) {
    return hour + 'h';
  } else {
    return min + 'm';
  }
};

/**
 *
 * @param {f_school_day} date
 * @returns {f_start_day, f_end_day}
 */

export const convertSchoolDayToString = (date_range: Date[]) => {
  let start_day = null;
  let end_day = null;
  if (date_range) {
    start_day = date_range[0];
    end_day = date_range[1];

    if (dayjs(start_day, DATE_FORMATS.YYYY_MM_DD).isValid()) {
      start_day = dayjs(start_day, DATE_FORMATS.YYYY_MM_DD).format();
    } else {
      start_day = dayjs(start_day).format();
    }

    if (dayjs(end_day, DATE_FORMATS.YYYY_MM_DD).isValid()) {
      end_day = dayjs(end_day, DATE_FORMATS.YYYY_MM_DD).format();
    } else {
      end_day = dayjs(end_day).format();
    }
  }

  return { start_day, end_day };
};
