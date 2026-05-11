/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import _ from 'lodash';
import { PERMISSION_LIST } from '@/pages/permissions/constants';
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined): any {
  const { currentUser } = initialState ?? {};
  const permission_data = currentUser?.permission_data || undefined;
  let permissionList;
  let newAccessList;
  const ADMINISTRATION_LIST = ['province', 'district', 'ward', 'street'];

  const CUSTOMER_LIST = ['customerBuyRent', 'customerSellRent'];

  const generatePermission = (PERMISSON_LIST: any, permissonStatus: boolean) => {
    const newPermission = Object.entries(PERMISSON_LIST).reduce((acc, item: any) => {
      const newItem =
        item[1] &&
        item[1].reduce((accChild: any, child: any) => {
          return {
            ...accChild,
            [`${item[0]}${child.charAt(0).toUpperCase()}${child.slice(1)}`]: permissonStatus,
          };
        }, {});
      return { ...acc, ...newItem };
    }, {});
    return {
      ...newPermission,
      permissionList: permissonStatus,
      administrative: permissonStatus,
      customer: permissonStatus,
    };
  };
  if (permission_data === true) {
    permissionList = generatePermission(PERMISSION_LIST, true);
  } else if (permission_data) {
    let administrative = false;
    let customer = false;
    permissionList = generatePermission(PERMISSION_LIST, false);
    newAccessList =
      (permission_data &&
        Object.entries(permission_data)?.reduce((acc, item: any) => {
          if (CUSTOMER_LIST.includes(item[0])) {
            customer = true;
          }
          if (ADMINISTRATION_LIST.includes(item[0])) {
            administrative = true;
          }

          const newItem =
            item[1] &&
            _.isArray(item[1]) &&
            item[1].reduce((acc: any, children: any) => {
              return {
                ...acc,
                [`${item[0]}${children.charAt(0).toUpperCase()}${children.slice(1)}`]: true,
              };
            }, {});
          return { ...acc, ...newItem };
        }, {})) ||
      {};
    newAccessList = {
      ...newAccessList,
      customer: customer,
      administrative: administrative,
    };
  } else {
    permissionList = generatePermission(PERMISSION_LIST, false);
  }

  return {
    ...permissionList,
    ...newAccessList,
  };
}
