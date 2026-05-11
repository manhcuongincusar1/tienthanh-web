interface ProvinceList {
  id: number;
  code: string;
  title: string;
  alias: string;
  display_title: string;
}
interface DistrictList extends ProvinceList {
  province_city: ProvinceList;
}
interface WardList extends DistrictList {
  districts: ProvinceList;
}

export { ProvinceList, DistrictList, WardList };
