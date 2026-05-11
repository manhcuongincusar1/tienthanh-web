import { useState } from 'react';
import { apiSale } from '@/api/sales/api';

interface Sale {
  full_name: string;
  id: string;
  raw_phone_number: string;
}

export default () => {
  const [saleList, setSaleList] = useState<string[]>([]);
  const getSaleList = async () => {
    await apiSale
      .getSaleList()
      .then((res) => {
        if (res.status === 200) {
          setSaleList(
            res.data.map((value: Sale) => ({
              ...value,
              label: `${value.full_name} - ${value.raw_phone_number}`,
              value: value.id,
            })),
          );
        }
      })
      .catch((err) => {
        return err;
      });
  };
  return {
    saleList,
    getSaleList,
  };
};
