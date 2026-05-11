import type {ProTableProps} from '@ant-design/pro-table';
import {Button} from 'antd';
import {forwardRef, useMemo, useState, useEffect} from 'react';
import {useModel, useHistory, useLocation} from 'umi';
import GridLayout from './GridLayout';
import Styles from './index.less';
import _ from "lodash";
import BaseProTable from '@/components/Custom/CustomProTable/BaseProTable';
import ProCard from '@ant-design/pro-card';
import {RequestData} from "@ant-design/pro-table";

interface DataTable {
  optionToolbar?: any;
  tooltip?: string;
}

interface CustomProTableLayoutProps {
  table: ProTableProps<any, any>;
  dataTable: DataTable;
  actions?: object;
  searchSpan?: number;
  rowSelection?: any;
  tableKey?: string;
}

const CustomProTableLayout = forwardRef(
  (
    {table, dataTable, actions, searchSpan, rowSelection, tableKey}: CustomProTableLayoutProps,
    ref,
  ) => {
    const {optionToolbar, tooltip} = dataTable;
    const [hasPush, setHasPush] = useState<boolean>(false);
    const {tableClear, setTableClear} = useModel('globalTable');
    const history = useHistory();
    const currentLocation = useLocation();
    let defaultTableQuery = _.isEmpty(currentLocation?.query) ? {
      current: 1,
      pageSize: 10,
      layout: false,
      queryFilter: {},
    } : {
      current: Number(currentLocation?.query?.page),
      pageSize: Number(currentLocation?.query?.pageSize),
      layout: _.toString(currentLocation?.query?.layout) == 'true',
      queryFilter: _.isUndefined(currentLocation?.query?.queryFilter) ? {} : JSON.parse(currentLocation?.query?.queryFilter),
    };
    const [myPagination, setMyPagination] = useState(defaultTableQuery);
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    useEffect(() => {
      // Listen for changes to the browser history
      const unlisten = history.listen((location) => {
        scrollToTop();
        const {query} = location;
        if (query && query.page) {
          //   // Update the pagination state with the page number from the query string
          setMyPagination((prevPagination) => ({
            ...prevPagination,
            current: Number(query.page),
            pageSize: Number(query.pageSize),
            layout: _.toString(query.layout) == 'true',
            queryFilter: _.isUndefined(query?.queryFilter) ? {} : JSON.parse(query?.queryFilter),
          }));
          // setLayout(_.toString(query.layout) == 'true');
          ref.current?.reloadTable();
        } else {
          setMyPagination((prevPagination) => ({
            ...prevPagination,
            current: 1,
            pageSize: 10,
            layout: false,
            queryFilter: {},
          }));
          // setLayout(false);
        }
      });
      window.addEventListener('popstate', scrollToTop);
      return () => {
        // Clean up the history listener
        unlisten();
        window.removeEventListener('popstate', scrollToTop);
      };
    }, []);
    const {toolBarRender} = table;


    const {visibleSpin, onChangeVisibleSpin} = useModel('globalTable');

    const paginationConfig = useMemo(() => {
      const paginationDefault = {
        size: 'default',
        showSizeChanger: true,
        showTotal: (total: number, range: any) => {
          return `Hiển thị ${range[0]}-${range[1]} trên ${total?.toLocaleString()} dòng`;
        },
        onChange: (page: number, pageSize: number) => {
          const queryValue = _.isUndefined(ref.current?.getFieldsValue()) ? myPagination.queryFilter : ref.current?.getFieldsValue();
          if (_.toNumber(myPagination.current) != page || _.toNumber(myPagination.pageSize) != pageSize) {
            history.push({
              pathname: currentLocation.pathname,
              query: {
                page,
                pageSize,
                layout: myPagination.layout,
                queryFilter: JSON.stringify(queryValue)
              }
            })
            setHasPush(true);
          }
        }
      };
      return myPagination.layout
        ? {
          ...paginationDefault,
          pageSizeOptions: [9, 18, 27],
          // defaultPageSize: 9,
          // pageSize: 9,
          // current: 1,
          defaultPageSize: myPagination.pageSize,
          ...myPagination
        }
        : {
          ...paginationDefault,
          pageSizeOptions: [10, 25, 50, 100],
          defaultPageSize: myPagination.pageSize,
          // pageSize: 10,
          // current: 1,
          ...myPagination
        };
    }, [myPagination]);

    return (
      <BaseProTable
        {...table}
        tooltip={tooltip}
        rowSelection={rowSelection}
        onSubmit={(params: any) => {
          try {
            const pageInfo = ref.current?.pageInfo();
            setMyPagination((prevPagination) => ({
              ...prevPagination,
              current: pageInfo.current,
              pageSize: pageInfo.pageSize,
              queryFilter: params,
            }));
            if (hasPush) {
              history.replace({
                pathname: currentLocation.pathname,
                query: {
                  page: pageInfo.current,
                  pageSize: pageInfo.pageSize,
                  layout: myPagination.layout,
                  queryFilter: JSON.stringify(params)
                }
              })
            } else {
              if(tableClear){
                history.replace({
                  pathname: currentLocation.pathname,
                  query: {
                    page: pageInfo.current,
                    pageSize: pageInfo.pageSize,
                    layout: myPagination.layout,
                    queryFilter: JSON.stringify(params)
                  }
                })
                setTableClear(false);
              }else{
                history.push({
                  pathname: currentLocation.pathname,
                  query: {
                    page: pageInfo.current,
                    pageSize: pageInfo.pageSize,
                    layout: myPagination.layout,
                    queryFilter: JSON.stringify(params)
                  }
                })
              }
            }

            setHasPush(false);
            if (!_.isUndefined(tableKey)) {
              // localStorage.setItem(tableKey, JSON.stringify(params));
            } else {
            }
          } catch (error) {
            console.warn(error);
          }
        }}
        searchSpan={searchSpan}
        ref={ref}
        optionToolbar={optionToolbar}
        actions={actions}
        tableRender={(props: any, dom: any, domList: any) => {
          const dataSource = domList?.table?.props.dataSource;
          const {pagination} = props;
          const content: any = myPagination?.layout ? (
            <ProCard key="table" bodyStyle={{paddingTop: 0}}>
              {domList.toolbar}
              <GridLayout dataGrid={{pagination}} dataSource={dataSource}/>
            </ProCard>
          ) : (
            <div key="table-default">{dom}</div>
          );
          return [content];
        }}
        pagination={paginationConfig}
        options={{
          reload: optionToolbar?.reload && !myPagination?.layout,
          setting: optionToolbar?.setting && !myPagination?.layout,
          density: false,
        }}
        onLoadingChange={(loading: any) => {
          if (myPagination?.layout && loading !== visibleSpin) {
            onChangeVisibleSpin(loading);
          }
        }}
        className={`${Styles.custom_pro_table_layout} ${table?.className}`}
        toolBarRender={() => {
          const defaultToolbar = !!toolBarRender ? toolBarRender(undefined, {}) : [];

          const toolbarExt = [
            ...defaultToolbar,
            <Button
              key="setlayout"
              type="text"
              size="large"
              style={{
                display: optionToolbar?.layout ? 'inline-flex' : 'none',
                padding: 0,
                backgroundColor: 'transparent',
              }}
              icon={
                myPagination?.layout ? (
                  <svg
                    width="24"
                    height="18"
                    viewBox="0 0 24 18"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className={Styles.layout_icon}
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M0 1.28571C0 0.575634 0.537258 0 1.2 0H1.212C1.87474 0 2.412 0.575634 2.412 1.28571C2.412 1.99579 1.87474 2.57143 1.212 2.57143H1.2C0.537258 2.57143 0 1.99579 0 1.28571ZM6 1.28571C6 0.575634 6.53726 0 7.2 0H22.8C23.4627 0 24 0.575634 24 1.28571C24 1.99579 23.4627 2.57143 22.8 2.57143H7.2C6.53726 2.57143 6 1.99579 6 1.28571ZM0 9C0 8.28992 0.537258 7.71429 1.2 7.71429H1.212C1.87474 7.71429 2.412 8.28992 2.412 9C2.412 9.71008 1.87474 10.2857 1.212 10.2857H1.2C0.537258 10.2857 0 9.71008 0 9ZM6 9C6 8.28992 6.53726 7.71429 7.2 7.71429H22.8C23.4627 7.71429 24 8.28992 24 9C24 9.71008 23.4627 10.2857 22.8 10.2857H7.2C6.53726 10.2857 6 9.71008 6 9ZM0 16.7143C0 16.0042 0.537258 15.4286 1.2 15.4286H1.212C1.87474 15.4286 2.412 16.0042 2.412 16.7143C2.412 17.4244 1.87474 18 1.212 18H1.2C0.537258 18 0 17.4244 0 16.7143ZM6 16.7143C6 16.0042 6.53726 15.4286 7.2 15.4286H22.8C23.4627 15.4286 24 16.0042 24 16.7143C24 17.4244 23.4627 18 22.8 18H7.2C6.53726 18 6 17.4244 6 16.7143Z"
                    />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2 3C2 2.44772 2.44772 2 3 2H10C10.5523 2 11 2.44772 11 3V10C11 10.5523 10.5523 11 10 11H3C2.44772 11 2 10.5523 2 10V3ZM4 4V9H9V4H4ZM13 3C13 2.44772 13.4477 2 14 2H21C21.5523 2 22 2.44772 22 3V10C22 10.5523 21.5523 11 21 11H14C13.4477 11 13 10.5523 13 10V3ZM15 4V9H20V4H15ZM2 14C2 13.4477 2.44772 13 3 13H10C10.5523 13 11 13.4477 11 14V21C11 21.5523 10.5523 22 10 22H3C2.44772 22 2 21.5523 2 21V14ZM4 15V20H9V15H4ZM13 14C13 13.4477 13.4477 13 14 13H21C21.5523 13 22 13.4477 22 14V21C22 21.5523 21.5523 22 21 22H14C13.4477 22 13 21.5523 13 21V14ZM15 15V20H20V15H15Z"
                    />
                  </svg>
                )
              }
              onClick={() => {
                const changeLayout = !(_.toString(myPagination.layout) == 'true');
                const queryValue = ref.current?.getFieldsValue();
                setMyPagination((prevPagination) => ({
                  ...prevPagination,
                  layout: changeLayout,
                  queryFilter: queryValue
                }));
                if (changeLayout) {
                  ref?.current?.setPageInfo({
                    current: 1,
                    pageSize: 9
                  })
                } else {
                  ref?.current?.setPageInfo({
                    current: 1,
                    pageSize: 10
                  })
                }

              }}
            />,
          ];

          return toolbarExt.length > 0 ? toolbarExt : false;
        }}
        columnsState={{
          persistenceKey: tableKey,
          persistenceType: 'sessionStorage',
        }}
      />
    );
  },
);

export default CustomProTableLayout;
