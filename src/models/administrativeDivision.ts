import { useState } from 'react';
import { administrativeDivision } from '@/api/administrativeDivision';

interface ProvinceList {
  id: number;
  code: string;
  title: string;
  alias: string;
  display_title: string;
  value: string;
  label: string;
}
interface DistrictList extends ProvinceList {
  province_city: ProvinceList;
}
interface WardList extends DistrictList {
  districts: ProvinceList;
}

export default () => {
  const [provinceList, setProvinceList] = useState<ProvinceList[]>();
  const [districtList, setDistrictList] = useState<DistrictList[]>();
  const [wardList, setWardList] = useState<WardList[]>();

  const getProvinceList = async () => {
    return await administrativeDivision.getProvinceList().then((data) => {
      let preparedData = data.map((item: ProvinceList) => {
        return {
          ...item,
          label: item.display_title,
          value: item.id,
        };
      });
      setProvinceList(preparedData);
      return preparedData;
    });
  };

  const getDistrictList = async (variables: any) => {
    await administrativeDivision.getDistrictList(variables).then((data) => {
      let preparedData = data.map((item: DistrictList) => {
        return {
          ...item,
          label: item.display_title,
          value: item.id,
        };
      });
      setDistrictList(preparedData);
    });
  };

  const getWardList = async (variables: any) => {
    await administrativeDivision.getWardList(variables).then((response) => {
      if (response?.status === 200) {
        setWardList(response.data);
      }
    });
  };

  return {
    provinceList,
    districtList,
    wardList,
    getDistrictList,
    getProvinceList,
    getWardList,
  };
};
