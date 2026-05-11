import Styles from '@/styles/page/report/styles.less';
import { Bar, Column, Line, Pie } from '@ant-design/plots';
import ProForm, { ProFormInstance, ProFormRadio } from '@ant-design/pro-form';
import { RadioChangeEvent, Space } from 'antd';
import { CheckboxOptionType } from 'antd/lib/checkbox/Group';
import _ from 'lodash';
import React, {
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
} from 'react';

export type BaseChartProps<T = any> = {
  children?: ReactNode;
  request?: (params: Record<string, any>) => Promise<Partial<ChartDef.requestData<T>>>;
  chartSwitch?: Record<string, ChartDef.chartSwitcher>;
  rightFilters?: ReactNode[];
  defaultData?: Record<string, any>[] | undefined;
  typeChart?: string;
  chartConfig?: Record<string, any> | undefined;
  filterRef?: MutableRefObject<ProFormInstance<Record<string, any>> | undefined>;
  switcherRef?: MutableRefObject<ProFormInstance<Record<string, any>> | undefined>;
  params?: {};
  optionals?:
    | {
        showFilterSubmitter: false | undefined;
      }
    | undefined;
};
type BaseChartRef = {};
const BaseChart: React.FC = (
  props: Pick<BaseChartProps, 'defaultData' | 'children' | 'typeChart'> & {
    chartConfig?: Record<string, any>;
  },
) => {
  const { defaultData, chartConfig, typeChart } = props;
  const _func = {
    renderChart: (type: string, data: Record<string, any>[], config: Record<string, any>) => {
      const configChart = {
        data,
        ...config,
      };
      switch (type) {
        case 'pie':
          return <Pie {...configChart} />;
        case 'bar':
          return <Bar {...configChart} />;
        case 'column':
          return <Column {...configChart} />;
        default:
          return <Line {...configChart} />;
      }
    },
  };
  return _func.renderChart(typeChart, defaultData, chartConfig);
};

const MpireChart = forwardRef<BaseChartRef, BaseChartProps>(({ children, ...otherConfig }, ref) => {
  const {
    chartSwitch,
    rightFilters,
    defaultData,
    typeChart,
    chartConfig,
    request,
    filterRef: propRef,
    switcherRef,
    optionals,
    params,
    ...rest
  } = otherConfig;

  const formFilterRef = propRef || useRef<ProFormInstance>();
  const formSwitchRef = switcherRef || useRef<ProFormInstance>();
  const funcReducer = (state, action) => {
    switch (action.type) {
      case 'updateChart':
        let newState = {};
        if (action.defaultData) {
          newState.defaultData = action.defaultData;
        }
        return {
          ...state,
          typeChart: action.typeChart,
          chartConfig: action.chartConfig,
          ...newState,
        };
        break;
      case 'updateChartConfig':
        return { ...state, chartConfig: action.chartConfig };
        break;
      case 'updateChartData':
        return { ...state, defaultData: action.chartData };
        break;
      case 'updateTypeChart':
        return {
          ...state,
          typeChart: action.typeChart,
          chartConfig: action.chartConfig,
          filterParams: { ...state.filterParams, ...action.filterParams },
        };
        break;
      case 'updateFilters':
        return { ...state, filterParams: { ...action.params } };
        break;
      default:
        throw new Error();
    }
  };
  const initialStateChart = {
    defaultData: [],
    chartConfig: {},
    typeChart: null,
    filterParams: {},
  };
  const [state, dispatch] = useReducer(funcReducer, initialStateChart);
  const {
    defaultData: defaultDataChart,
    chartConfig: chartConfigRender,
    typeChart: typeChartRender,
    filterParams,
  } = state;

  const fetchData = useMemo(() => {
    if (!request) return undefined;
    return async (pageParams?: Record<string, any>) => {
      const actionParams = {
        ...pageParams,
        ...params,
      };

      const response = await request(actionParams);
      console.log(response);

      return response;
    };
  }, [request, params]);
  useEffect(() => {
    let dataRender = [];

    if (!request) {
      dataRender = defaultData;
    } else {
      _func.useFetchData(fetchData);
    }

    if (chartSwitch && !_.isEmpty(chartSwitch)) {
      if (_.isNull(typeChartRender)) {
        const switchChartConfig = chartSwitch[Object.keys(chartSwitch)[0]];
        dispatch({
          type: 'updateChart',
          typeChart: switchChartConfig.typeChart,
          defaultData: dataRender,
          chartConfig: switchChartConfig.config,
        });
      }
      return;
    }
    console.log('useEffect', defaultData);

    dispatch({
      type: 'updateChart',
      typeChart: typeChart ? typeChart : 'line',
      defaultData: dataRender,
      chartConfig: chartConfig ? chartConfig : {},
    });
  }, [defaultData, filterParams]);
  useImperativeHandle(ref, () => ({
    resetSwitch(defaultChart: string) {
      formSwitchRef.current?.resetFields();
      if (chartSwitch && !_.isEmpty(chartSwitch)) {
        const switchChartConfig = chartSwitch[Object.keys(chartSwitch)[0]];
        dispatch({
          type: 'updateChart',
          typeChart: switchChartConfig.typeChart,
          chartConfig: switchChartConfig.config,
        });
      }
      return;
      // formSwitchRef.current?.setFieldsValue({ type: defaultChart });
      // dispatch({
      //   type: 'updateTypeChart',
      //   typeChart: switchChartConfig?.typeChart,
      //   chartConfig: switchChartConfig?.config,
      //   filterParams: {
      //     type_chart: switchChartConfig?.typeChart
      //   }
      // });
    },
  }));

  const _func = {
      renderChartSwitcher: () => {
        let listOptions = [] as Array<CheckboxOptionType | string | number>;
        let firstSwitchChart;
        if (chartSwitch) {
          firstSwitchChart = chartSwitch[Object.keys(chartSwitch)[0]];
          _.map(chartSwitch, (switcherData, indexSwitcher) => {
            listOptions.push({
              label: switcherData.title,
              value: indexSwitcher,
            });
          });
        }

        return (
          <Space size={0}>
            <ProForm
              submitter={false}
              formRef={formSwitchRef}
              initialValues={{
                type: firstSwitchChart?.typeChart,
              }}
            >
              {listOptions && listOptions.length > 1 && (
                <ProFormRadio.Group
                  name={`type`}
                  fieldProps={{
                    buttonStyle: 'solid',
                    onChange: _bindEvent.onChangeChart,
                  }}
                  radioType="button"
                  options={listOptions}
                ></ProFormRadio.Group>
              )}
            </ProForm>
          </Space>
        );
      },
      useFetchData: <T extends ChartDef.requestData<any>>(
        getData: undefined | ((params?: {}) => Promise<T>),
      ) => {
        getData(filterParams).then((data) => {
          if (!_.isUndefined(data)) {
            dispatch({
              type: 'updateChartData',
              chartData: data,
            });
          }
        });
      },
    },
    _bindEvent = {
      onFinish: (values: Record<string, any>): Promise<boolean | undefined | void> => {
        dispatch({
          type: 'updateFilters',
          params: values,
        });
        // formSwitchRef.current?.resetFields();
      },
      onChangeChart: (e: RadioChangeEvent) => {
        const switchChartConfig = chartSwitch?.[e.target.value];
        dispatch({
          type: 'updateTypeChart',
          typeChart: switchChartConfig?.typeChart,
          chartConfig: switchChartConfig?.config,
          filterParams: {
            type_chart: switchChartConfig?.typeChart,
          },
        });
        // formFilterRef.current?.submit();
      },
    };
  console.log(defaultDataChart);

  return (
    <>
      <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
        {chartSwitch && _func.renderChartSwitcher()}
        <ProForm
          onFinish={_bindEvent.onFinish}
          formRef={formFilterRef}
          submitter={optionals?.showFilterSubmitter}
        >
          {rightFilters && rightFilters.length > 0 && (
            <div className={Styles.propertyCategory}>{rightFilters}</div>
          )}
        </ProForm>
      </Space>
      {defaultDataChart && !_.isEmpty(defaultDataChart) ? (
        <BaseChart
          {...rest}
          defaultData={defaultDataChart}
          typeChart={typeChartRender}
          chartConfig={chartConfigRender}
        >
          {children}
        </BaseChart>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg
            width="170"
            height="136"
            viewBox="0 0 170 136"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M61.6753 125.92L55.4353 116.8H54.4753V128H55.5953V118.88L61.8353 128H62.7953V116.8H61.6753V125.92ZM72.3943 126.992C73.2103 126.176 73.6263 125.184 73.6263 124C73.6263 122.816 73.2103 121.824 72.3943 121.024C71.5783 120.208 70.5863 119.808 69.4183 119.808C68.2503 119.808 67.2423 120.208 66.4263 121.024C65.6103 121.824 65.2103 122.816 65.2103 124C65.2103 125.184 65.6103 126.176 66.4263 126.992C67.2423 127.792 68.2503 128.192 69.4183 128.192C70.5863 128.192 71.5783 127.792 72.3943 126.992ZM67.1783 126.256C66.5703 125.632 66.2663 124.88 66.2663 124C66.2663 123.12 66.5703 122.368 67.1783 121.76C67.7863 121.136 68.5383 120.832 69.4183 120.832C70.2983 120.832 71.0503 121.136 71.6583 121.76C72.2663 122.368 72.5703 123.12 72.5703 124C72.5703 124.88 72.2663 125.632 71.6583 126.256C71.0503 126.864 70.2983 127.168 69.4183 127.168C68.5383 127.168 67.7863 126.864 67.1783 126.256ZM87.2734 121.568C86.5374 120.4 85.4654 119.808 84.0414 119.808C82.9054 119.808 81.9294 120.208 81.1134 121.024C80.3134 121.84 79.9134 122.832 79.9134 124C79.9134 125.168 80.3134 126.16 81.1134 126.976C81.9294 127.792 82.9054 128.192 84.0414 128.192C85.4654 128.192 86.5374 127.6 87.2734 126.432V128H88.3294V116.8H87.2734V121.568ZM81.8814 126.256C81.2734 125.632 80.9694 124.88 80.9694 124C80.9694 123.12 81.2734 122.368 81.8814 121.76C82.4894 121.136 83.2414 120.832 84.1214 120.832C85.0014 120.832 85.7534 121.136 86.3614 121.76C86.9694 122.368 87.2734 123.12 87.2734 124C87.2734 124.88 86.9694 125.632 86.3614 126.256C85.7534 126.864 85.0014 127.168 84.1214 127.168C83.2414 127.168 82.4894 126.864 81.8814 126.256ZM97.9453 121.568C97.2093 120.4 96.1373 119.808 94.7133 119.808C93.5773 119.808 92.6013 120.208 91.7853 121.024C90.9853 121.84 90.5853 122.832 90.5853 124C90.5853 125.168 90.9853 126.16 91.7853 126.976C92.6013 127.792 93.5773 128.192 94.7133 128.192C96.1373 128.192 97.2093 127.6 97.9453 126.432V128H99.0013V120H97.9453V121.568ZM92.5533 126.256C91.9453 125.632 91.6413 124.88 91.6413 124C91.6413 123.12 91.9453 122.368 92.5533 121.76C93.1613 121.136 93.9133 120.832 94.7933 120.832C95.6733 120.832 96.4253 121.136 97.0333 121.76C97.6413 122.368 97.9453 123.12 97.9453 124C97.9453 124.88 97.6413 125.632 97.0333 126.256C96.4253 126.864 95.6733 127.168 94.7933 127.168C93.9133 127.168 93.1613 126.864 92.5533 126.256ZM105.977 120H103.673V117.76L102.617 118.08V120H100.937V121.024H102.617V125.872C102.617 127.728 103.737 128.336 105.977 128V127.072C104.441 127.136 103.673 127.248 103.673 125.872V121.024H105.977V120ZM114.633 121.568C113.897 120.4 112.825 119.808 111.401 119.808C110.265 119.808 109.289 120.208 108.473 121.024C107.673 121.84 107.273 122.832 107.273 124C107.273 125.168 107.673 126.16 108.473 126.976C109.289 127.792 110.265 128.192 111.401 128.192C112.825 128.192 113.897 127.6 114.633 126.432V128H115.689V120H114.633V121.568ZM109.241 126.256C108.633 125.632 108.329 124.88 108.329 124C108.329 123.12 108.633 122.368 109.241 121.76C109.849 121.136 110.601 120.832 111.481 120.832C112.361 120.832 113.113 121.136 113.721 121.76C114.329 122.368 114.633 123.12 114.633 124C114.633 124.88 114.329 125.632 113.721 126.256C113.113 126.864 112.361 127.168 111.481 127.168C110.601 127.168 109.849 126.864 109.241 126.256Z"
              fill="#C6CCD3"
            />
            <path
              d="M68.4139 64.152L68.6299 61.344H73.7419V59.4H66.7219L66.2359 66.168H69.9079C71.2939 66.168 72.2119 66.942 72.2119 68.184C72.2119 69.426 71.2939 70.218 69.8719 70.218C68.5399 70.218 67.7119 69.642 67.3699 68.508L65.5879 69.534C66.2359 71.28 67.8739 72.234 69.8719 72.234C71.1139 72.234 72.1579 71.874 73.0039 71.154C73.8499 70.434 74.2819 69.444 74.2819 68.184C74.2819 66.924 73.8679 65.934 73.0399 65.232C72.2119 64.512 71.2039 64.152 69.9979 64.152H68.4139ZM81.7909 62.046C81.7909 61.236 81.5029 60.552 80.9449 59.994C80.3869 59.436 79.7029 59.166 78.8569 59.166C78.0109 59.166 77.3089 59.454 76.7509 60.012C76.1929 60.57 75.9049 61.236 75.9049 62.046C75.9049 62.856 76.1929 63.54 76.7509 64.098C77.3089 64.656 78.0109 64.926 78.8569 64.926C79.7029 64.926 80.3869 64.656 80.9449 64.098C81.5029 63.54 81.7909 62.856 81.7909 62.046ZM78.8389 63.342C78.1009 63.342 77.5609 62.766 77.5609 62.046C77.5609 61.308 78.1009 60.732 78.8389 60.732C79.6129 60.732 80.1349 61.308 80.1349 62.046C80.1349 62.766 79.6129 63.342 78.8389 63.342ZM77.9389 70.722L86.2369 61.47L85.2649 60.912L76.9669 70.146L77.9389 70.722ZM84.6169 72.216C85.4449 72.216 86.1469 71.946 86.7049 71.388C87.2629 70.83 87.5509 70.146 87.5509 69.336C87.5509 68.526 87.2629 67.86 86.7049 67.302C86.1469 66.744 85.4449 66.456 84.6169 66.456C83.7709 66.456 83.0689 66.744 82.5109 67.302C81.9529 67.86 81.6649 68.526 81.6649 69.336C81.6649 70.146 81.9529 70.83 82.5109 71.388C83.0689 71.946 83.7709 72.216 84.6169 72.216ZM84.5989 70.632C83.8609 70.632 83.3209 70.056 83.3209 69.336C83.3209 68.598 83.8609 68.022 84.5989 68.022C85.3729 68.022 85.8949 68.598 85.8949 69.336C85.8949 70.056 85.3729 70.632 84.5989 70.632Z"
              fill="white"
            />
            <path
              opacity="0.8"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M33.3532 19.5101C35.1001 14.0081 36.7258 10.5824 38.2277 9.23187C42.3868 5.49385 48.1374 7.52824 49.36 7.81962C53.6548 8.846 52.2584 2.09184 55.9432 0.718955C58.3989 -0.195862 60.4186 0.922394 62.0034 4.07372C63.4065 1.13371 65.5447 -0.212924 68.418 0.0272642C72.7287 0.390829 74.2372 14.8953 80.1603 11.7204C86.0849 8.54412 93.3479 7.8183 96.4504 12.5381C97.121 13.5592 97.3779 11.975 101.939 6.56617C106.5 1.15602 111.048 -1.22749 120.378 1.92252C124.62 3.35316 128.108 7.23161 130.847 13.5566C130.847 22.584 137.514 27.9285 150.843 29.5862C170.841 32.0734 155.319 53.4922 130.847 59.7647C106.375 66.0385 50.0319 69.4247 19.4568 53.5749C-0.926539 43.0105 3.70557 31.6547 33.3518 19.5101H33.3532Z"
              fill="url(#paint0_linear_294_1099)"
            />
            <path
              d="M84 99C104.435 99 121 95.1944 121 90.5C121 85.8056 104.435 82 84 82C63.5655 82 47 85.8056 47 90.5C47 95.1944 63.5655 99 84 99Z"
              fill="url(#paint1_linear_294_1099)"
            />
            <path
              opacity="0.675"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M146.602 101.292C118.86 108.12 24.1666 100.31 14.0878 96.7431C9.18219 95.0057 4.76044 91.739 0.823842 86.942C0.383249 86.4056 0.106308 85.7578 0.0250227 85.0735C-0.056263 84.3892 0.0614241 83.6963 0.364484 83.0749C0.667545 82.4534 1.14361 81.9288 1.73766 81.5617C2.33172 81.1945 3.01952 80.9998 3.72158 81H169.193C172.628 89.9757 165.097 96.7392 146.602 101.292Z"
              fill="url(#paint2_linear_294_1099)"
            />
            <path
              d="M112.204 67.9046L99.5948 53.2347C99.2966 52.8847 98.926 52.6028 98.5084 52.4083C98.0907 52.2137 97.6358 52.1111 97.1746 52.1074H70.061C69.1309 52.1074 68.2468 52.5321 67.6408 53.2347L55.0312 67.9046V75.9579H112.204V67.9046Z"
              fill="url(#paint3_linear_294_1099)"
            />
            <path
              d="M108.629 76.2545L97.5922 63.4773C97.3254 63.1756 96.9965 62.9345 96.6278 62.7706C96.259 62.6066 95.8591 62.5235 95.4553 62.527H71.775C70.9621 62.527 70.1677 62.8625 69.638 63.4773L58.6016 76.2545V83.2722H108.629V76.2545Z"
              fill="url(#paint4_linear_294_1099)"
            />
            <path
              d="M112.204 85.1871C112.204 86.3052 111.698 87.3105 110.9 87.9843L110.738 88.1153C110.105 88.5927 109.332 88.8505 108.538 88.8494H58.6991C58.2485 88.8494 57.8177 88.7681 57.4198 88.6187L57.2222 88.54C56.5702 88.2514 56.0163 87.781 55.6275 87.1857C55.2386 86.5904 55.0315 85.8958 55.0312 85.1858V67.9927H68.9029C70.4352 67.9927 71.6696 69.2471 71.6696 70.7688V70.7885C71.6696 72.3116 72.9186 73.5398 74.4508 73.5398H92.7848C93.5213 73.5391 94.2275 73.2481 94.7487 72.7304C95.27 72.2128 95.5639 71.5108 95.566 70.778C95.566 69.2497 96.8018 67.9927 98.3327 67.9927H112.206L112.204 85.1871Z"
              fill="url(#paint5_linear_294_1099)"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M103.789 46.9026L99.2954 48.6461C99.18 48.6909 99.0542 48.7023 98.9326 48.6789C98.811 48.6555 98.6984 48.5982 98.6079 48.5137C98.5174 48.4292 98.4526 48.3208 98.4209 48.2011C98.3893 48.0813 98.392 47.9551 98.4289 47.8368L99.7033 43.7533C98 41.8164 97 39.4546 97 36.9059C97 30.3303 103.657 25 111.868 25C120.078 25 126.736 30.3303 126.736 36.9059C126.736 43.4816 120.079 48.8118 111.868 48.8118C108.889 48.8118 106.115 48.1105 103.789 46.9026Z"
              fill="url(#paint6_linear_294_1099)"
            />
            <path
              d="M117.726 39.056C118.761 39.056 119.6 38.2268 119.6 37.204C119.6 36.1812 118.761 35.3521 117.726 35.3521C116.691 35.3521 115.852 36.1812 115.852 37.204C115.852 38.2268 116.691 39.056 117.726 39.056Z"
              fill="white"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M107.885 38.8243H104.137L106.043 35.5835L107.885 38.8243ZM110.228 35.5835H113.508V38.8243H110.228V35.5835Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_294_1099"
                x1="87.0924"
                y1="48.4972"
                x2="87.0924"
                y2="-11.4628"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#DEDEDE" stop-opacity="0" />
                <stop offset="1" stop-color="#A9A9A9" stop-opacity="0.3" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_294_1099"
                x1="80.1446"
                y1="99"
                x2="80.1446"
                y2="82"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="1" stop-color="#96A1C5" stop-opacity="0.373" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_294_1099"
                x1="85"
                y1="104"
                x2="85"
                y2="76.4747"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="white" stop-opacity="0" />
                <stop offset="1" stop-color="#919191" stop-opacity="0.15" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_294_1099"
                x1="83.6178"
                y1="52.1074"
                x2="83.6178"
                y2="62.8282"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#5389F5" />
                <stop offset="1" stop-color="#416FDC" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_294_1099"
                x1="90.2912"
                y1="83.2722"
                x2="90.2912"
                y2="61.424"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#DCE9FF" />
                <stop offset="1" stop-color="#B6CFFF" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_294_1099"
                x1="83.6185"
                y1="67.9927"
                x2="83.6185"
                y2="88.8494"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#7CA5F7" />
                <stop offset="1" stop-color="#C4D6FC" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_294_1099"
                x1="115.836"
                y1="48.8118"
                x2="115.836"
                y2="23.7342"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#DCE9FF" />
                <stop offset="1" stop-color="#B6CFFF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </>
  );
});

export default MpireChart;
