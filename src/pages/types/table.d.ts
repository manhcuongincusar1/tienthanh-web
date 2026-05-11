import { ProFormInstance } from '@ant-design/pro-form';

interface TableRef extends ProFormInstance {
  reloadTable: () => void;
  submitFormSearch: () => void;
  resetFieldsValue: () => void;
  getSearchParams: () => void;
}

export { TableRef };
