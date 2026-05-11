export type TableListItem = {
  name: string;
  price: number;
  brand: string;
  description: string;
};
export type ExpandedDataType = {
  key: string;
  department: string;
  position: string;
  leader: string;
  location: string;
  fromdate: string;
  enddate: string;
};
export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
