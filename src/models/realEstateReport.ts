import { useRef, useState } from 'react';
import { TableRef } from '@/pages/types';

export default () => {
  const enumValue = {
    category: {
      text: 'Danh mục BĐS',
      disabled: false,
    },
    province: {
      text: 'Khu vực - Thành phố',
      disabled: true,
    },
    district: {
      text: 'Khu vực - Quận/Huyện',
      disabled: true,
    },
    ward: {
      text: 'Khu vực - Phường/Xã',
      disabled: true,
    },
    price: {
      text: 'Giá tiền',
      disabled: false,
    },
  };
  const [valueEnumChart, setValueEnumChart] = useState(enumValue);
  const [isSubmit, setIsSubmit] = useState(false);

  return {
    valueEnumChart,
    setValueEnumChart,
    enumValue,
    isSubmit,
    setIsSubmit,
  };
};
