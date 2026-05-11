import PropertyCard from '@/components/Property/Card';
import { Col, Pagination, Row, Spin } from 'antd';
import { useModel } from 'umi';
import styles from './index.less';
import EmptyDataTable from '../EmptyDataTable';
import _ from 'lodash';

interface GridLayoutProps {
  dataSource: any;
  dataGrid: any;
}

export default function GridLayout({ dataSource, dataGrid }: GridLayoutProps) {
  const { pagination } = dataGrid;
  const { visibleSpin } = useModel('globalTable');

  return (
    <Spin spinning={visibleSpin}>
      {!_.isEmpty(dataSource) ? (
        <Row gutter={24}>
          {dataSource?.map((value: any) => (
            <Col key={value.id} span={24} md={{ span: 12 }} xl={{ span: 8 }} className="col-item">
              <PropertyCard data={value} />
            </Col>
          ))}
        </Row>
      ) : (
        <EmptyDataTable height={300} />
      )}

      {!_.isEmpty(dataSource) && (
        <div className={styles.custom_pro_table_pagination}>
          <Pagination {...pagination} />
        </div>
      )}
    </Spin>
  );
}
