import type { ProTableProps } from '@ant-design/pro-table';

import BaseProTable from './BaseProTable';
import { forwardRef } from 'react';

const CustomTable = forwardRef((props: ProTableProps<any, any> | any, ref) => {
  return <BaseProTable {...props} ref={ref} />;
});

export default CustomTable;
