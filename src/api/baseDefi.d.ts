// @ts-ignore
/* eslint-disable */

declare namespace API {
  type MpireResponse = {
    status?: number;
    message?: string;
    data?: object | Array<object> | any;
    total?: number;
    keyResponse?: string;
  };
  type MpireResponseTuple<T> = {
    status?: number;
    message?: string;
    data?: T | undefined;
    total?: number;
  };
}
