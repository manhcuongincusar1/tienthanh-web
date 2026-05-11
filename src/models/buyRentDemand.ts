import { FormInstance } from 'antd';
import { useState } from 'react';
import _ from 'lodash';
import { CHECK_REAL_ESTATE_PRICE } from '@/pages/expression';
export default () => {
  const [dataSourceBuy, setDataSourceBuy] = useState<Customer.Deal[] | undefined>([]);
  const [dataSourceRent, setDataSourceRent] = useState<Customer.Deal[] | undefined>([]);
  const [resetForm, setResetForm] = useState<number>(1);
  const [isVisiableConfirm, setIsVisibleConfirm] = useState<boolean>(false);
  const func = {
    validateCustomerDemand: (rowRef: FormInstance, type: number) => {
      if (rowRef.getFieldsValue() && !_.isEmpty(rowRef.getFieldsValue())) {
        const pattern = type === 1 ? CHECK_REAL_ESTATE_PRICE : CHECK_REAL_ESTATE_PRICE;
        const fieldsValue = rowRef.getFieldsValue();
        let price_from: any;
        let price_to: any;
        let requiredData: any;
        fieldsValue &&
          Object.entries(fieldsValue).forEach((item) => {
            if (item[0].includes('price_from')) {
              price_from = item[1] && item[1].toString();
            } else if (item[0].includes('price_to')) {
              price_to = item[1] && item[1].toString();
            } else {
              requiredData = item[1];
            }
          });

        const { province_city_id, district_title, uses } = requiredData;

        if (!province_city_id || !district_title || !uses) {
          return false;
        } else if (price_from && !price_from?.match(pattern)) {
          return false;
        } else if (price_to && !price_to?.match(pattern)) {
          return false;
        } else if (price_to && price_to && Number(price_from) > Number(price_to)) {
          return false;
        }
      }
      return true;
    },
  };
  return {
    dataSourceBuy,
    setDataSourceBuy,
    dataSourceRent,
    setDataSourceRent,
    resetForm,
    func,
    setResetForm,
    isVisiableConfirm,
    setIsVisibleConfirm,
  };
};
