import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { TOKEN } from '@/constants';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { MenuDataItem, Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading, SettingDrawer } from '@ant-design/pro-layout';
import { message } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import ComponentForbidden from '@/pages/403';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import durationDayjs from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import isMoment from 'dayjs/plugin/isMoment';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import objectSupport from 'dayjs/plugin/objectSupport';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import _ from 'lodash';
import {
  BranchIcon,
  ChartIcon,
  BrokerIcon,
  HomeIcon,
  Map,
  MembersIcon,
  PermissionIcon,
  RealEstateCategoryIcon,
  RealEstateRentIcon,
  RealEstateSellIcon,
  SettingIcon,
  ThumbUp,
  UserIcon,
  SystemDownloadIcon,
} from '@/../public/icons';
import { setLocale } from '@@/plugin-locale/localeExports';
import Icon from '@ant-design/icons';
import Header from './components/Header';
import { mpireServiceWorker } from './utils';
import fetchUserInfo from '@/helpers/fetchUserInfo';
import HandleLocalStorageChange from '@/pages/HandleLocalStorageChange';

message.config({
  maxCount: 1,
});
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
const forgotPasswordPath = '/user/forgot-password';
const resetPasswordPath = '/user/reset-password';
const changePasswordFirstPath = '/user/change-password-first';

dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.extend(weekYear);
dayjs.extend(weekOfYear);
dayjs.extend(localizedFormat);
dayjs.extend(isMoment);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(objectSupport);
dayjs.extend(durationDayjs);

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
const { pwa, useServiceWorker } = defaultSettings;
const IconMap = {
  thumb_up: <Icon component={ThumbUp} style={{ fontSize: '16px' }} />,
  map: <Icon component={Map} style={{ fontSize: '16px' }} />,
  members: <Icon component={MembersIcon} style={{ fontSize: '16px' }} />,
  branch: <Icon component={BranchIcon} style={{ fontSize: '16px' }} />,
  user_icon: <Icon component={UserIcon} style={{ fontSize: '16px' }} />,
  home_icon: <Icon component={HomeIcon} style={{ fontSize: '16px' }} />,
  chart_icon: <Icon component={ChartIcon} style={{ fontSize: '16px' }} />,
  broker_icon: <Icon component={BrokerIcon} style={{ fontSize: '16px' }} />,
  setting_icon: <Icon component={SettingIcon} style={{ fontSize: '16px' }} />,
  real_estate_icon: <Icon component={RealEstateCategoryIcon} style={{ fontSize: '16px' }} />,
  real_estate_sell_icon: <Icon component={RealEstateSellIcon} style={{ fontSize: '16px' }} />,
  real_estate_rent_icon: <Icon component={RealEstateRentIcon} style={{ fontSize: '16px' }} />,
  permission_icon: <Icon component={PermissionIcon} style={{ fontSize: '16px' }} />,
  download_icon: <Icon component={SystemDownloadIcon} style={{ fontSize: '16px' }} />,
};

const loopMenuItem = (menus: MenuDataItem[]): MenuDataItem[] => {
  return menus.map(({ icon, children, ...item }) => ({
    ...item,
    icon: typeof icon == 'string' ? IconMap[icon as string] : icon,
    children: children && loopMenuItem(children),
  }));
};

export const request: RequestConfig = {
  timeout: 1000,
  errorConfig: {},
  middlewares: [],
  requestInterceptors: [],
  responseInterceptors: [],
};

/**

 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  listWorkspace?: Record<string, any>[];
  loading?: boolean;
  show404: boolean;
  show403: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const blankPath = [loginPath, forgotPasswordPath, resetPasswordPath, changePasswordFirstPath];
  const isBlankPath = blankPath.includes(history.location.pathname);

  if (!isBlankPath) {
    const { currentUser, listWorkspace }: any = await fetchUserInfo();
    // const listWorkspace = await branchesService.getListWorkspace();
    // const branches_list = listWorkspace?.branches_list;
    // if (currentUser) {
    //   currentUser.currentWorkSpace = null;
    // }
    //
    if (_.isUndefined(currentUser.currentWorkSpace) || _.isEmpty(currentUser.currentWorkSpace)) {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem('currentWorkSpaceId');
      history.push(loginPath);
      message.warn('Bạn không có quyền vào hệ thống này', 5);
    }

    return {
      fetchUserInfo,
      listWorkspace: listWorkspace,
      currentUser,
      settings: defaultSettings,
      show404: false,
      show403: currentUser?.permission_data ? false : true,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState, refresh }) => {
  setLocale('vi-VN', true);
  const blankPath = [loginPath, forgotPasswordPath, resetPasswordPath, changePasswordFirstPath];
  const isBlankPath = blankPath.includes(history.location.pathname);
  return {
    rightContentRender: () => <RightContent />,
    menuRender: (props, defaultDom) => {
      const permission_data = initialState?.currentUser?.permission_data;
      if (!permission_data) return false;
      return defaultDom;
    },
    disableContentMargin: false,
    // waterMarkProps: {
    //   content: initialState?.currentUser?.full_name,
    // },
    footerRender: () => <Footer />,
    onPageChange: async () => {
      if (!initialState?.currentUser && !isBlankPath) {
        localStorage.removeItem(TOKEN);
        localStorage.removeItem('currentWorkSpaceId');
        history.push(loginPath);
      }
      setInitialState((preInitialState) => ({
        ...preInitialState,
        settings: defaultSettings,
        show404: false,
        show403: false,
      }));
      if (useServiceWorker) {
        mpireServiceWorker.register();
        mpireServiceWorker.getUserSubscription().then((res) => {
          if (Notification.permission === 'granted') {
            if (res == null) {
              const previousAuth = localStorage.getItem('notification_auth');
              if (previousAuth) {
                return mpireServiceWorker.deleteSubscription(previousAuth).then((res) => {
                  if (res.status === 200) {
                    localStorage.removeItem('notification_auth');
                  }
                });
              }
              mpireServiceWorker
                .createNotificationSubscription()
                .then((subscrition) => {
                  mpireServiceWorker.onSendSubscriptionToPushServer(subscrition);
                })
                .catch((err) => {
                  console.log(false);
                  console.error(
                    "Couldn't create the notification subscription",
                    err,
                    'name:',
                    err.name,
                    'message:',
                    err.message,
                    'code:',
                    err.code,
                  );
                });
            } else {
            }
          } else {
            const previousAuth = localStorage.getItem('notification_auth');
            if (previousAuth) {
              return mpireServiceWorker.deleteSubscription(previousAuth).then((res) => {
                if (res.status === 200) {
                  localStorage.removeItem('notification_auth');
                }
              });
            }
          }
        });
      }
    },

    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],

    menuHeaderRender: () => {
      return (
        <div className="d-block d-md-none">
          <img src="/images/logo-header.png" alt="" />
        </div>
      );
    },
    unAccessible: <ComponentForbidden />,
    menuDataRender: loopMenuItem,
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          <HandleLocalStorageChange />
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
    headerHeight: 80,
    headerRender: ({ collapsed, onCollapse }) => {
      return <Header collapsed={collapsed} onCollapse={onCollapse} />;
    },
    siderWidth: 312,

    collapsedButtonRender: (collapsed) => {
      return (
        <button type="button" className={`btnToggleSideBar ${collapsed ? 'collapsed' : ''}`}>
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.80466 0.195262C5.06501 0.455612 5.06501 0.877722 4.80466 1.13807L1.94273 4L4.80466 6.86193C5.06501 7.12228 5.06501 7.54439 4.80466 7.80474C4.54431 8.06509 4.1222 8.06509 3.86185 7.80474L0.528514 4.4714C0.268165 4.21106 0.268165 3.78894 0.528514 3.5286L3.86185 0.195262C4.1222 -0.0650874 4.54431 -0.0650874 4.80466 0.195262Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.47132 0.195262C9.73167 0.455612 9.73167 0.877722 9.47132 1.13807L6.60939 4L9.47132 6.86193C9.73167 7.12228 9.73167 7.54439 9.47132 7.80474C9.21097 8.06509 8.78886 8.06509 8.52851 7.80474L5.19518 4.4714C4.93483 4.21106 4.93483 3.78894 5.19518 3.5286L8.52851 0.195262C8.78886 -0.0650874 9.21097 -0.0650874 9.47132 0.195262Z"
              fill="white"
            />
          </svg>
          <span>{!collapsed ? 'Thu gọn' : null}</span>
        </button>
      );
    },
  };
};
