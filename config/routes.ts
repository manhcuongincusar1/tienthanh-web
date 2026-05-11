import feRoutes from './fe-routes';
import Settings from './defaultSettings';

export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
      },
      {
        name: 'login',
        path: '/user/forgot-password',
        component: './user/ForgotPassword',
      },
      {
        name: 'login',
        path: '/user/reset-password',
        component: './user/ForgotPassword/resetPassword',
      },
      {
        name: 'login',
        path: '/user/change-password-first',
        component: './user/ForgotPassword/change_password_first',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'user-manager',
    icon: 'members',
    path: '/account',
    access: 'accountList',
    routes: [
      {
        name: 'list',
        path: '/account/list',
        component: './account',
        access: 'accountList',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: '/account/create',
        component: './account/create',
        access: 'accountCreate',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: '/account/edit/:id',
        component: './account/[id]/edit',
        access: 'accountEdit',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: '/account/edit/:id/password',
        component: './account/[id]/changepassword',
        access: 'accountChangePassword',
        wrappers: ['./wrappers/check404'],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/user-info',
    exact: true,
    component: './user/UserInfo',
  },
  {
    path: '/change-password',
    exact: true,
    component: './user/UserInfo/changePassword',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'dashboard',
    hideInMenu: true,
    routes: [
      {
        name: 'analysis',
        path: '/dashboard/analysis',
        component: './list',
      },
      {
        name: 'Layout',
        path: '/dashboard/layout',
        component: './layout',
      },
      {
        name: 'monitor',
        path: '/dashboard/details',
        component: './list/details',
      },
      {
        // name: 'workplace',
        path: '/dashboard/workplace',
      },
    ],
  },
  {
    icon: 'branch',
    name: 'management_branch',
    // hideInMenu: (Settings.SHOW_BRANCH == '1') ? false : true,
    path: '/management/branch',
    component: './management/branch',
    access: 'branchList',
    wrappers: ['./wrappers/check404'],
  },
  {
    name: 'administrative',
    path: '/administrative',
    icon: 'map',
    access: 'administrative',
    routes: [
      {
        path: '/administrative/province_city/list',
        name: 'administrative_list',
        component: './administrative/province_city/index',
        access: 'provinceList',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: '/administrative/district/list',
        name: 'district_list',
        wrappers: ['./wrappers/check404'],
        component: './administrative/district/index',
        access: 'districtList',
      },
      {
        path: '/administrative/ward/list',
        name: 'ward_list',
        component: './administrative/ward/index',
        access: 'wardList',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: '/administrative/street/list',
        name: 'street_list',
        component: './administrative/street/index',
        access: 'streetList',
        wrappers: ['./wrappers/check404'],
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'real_estate_status',
    path: '/real-estate-status',
    icon: 'home_icon',
    component: './real_estate/real_estate_status/index',
    access: 'realEstateStatusList',
    wrappers: ['./wrappers/check404'],
  },
  {
    name: 'real_estate_category',
    path: '/real-estate-category',
    icon: 'real_estate_icon',
    component: './real_estate/real_estate_category/index',
    access: 'realEstateCategoryList',
    wrappers: ['./wrappers/check404'],
  },

  // real_estate_sell
  {
    name: 'real_estate_sell',
    path: '/real-estate-sell/list',
    component: './real_estate/real_estate_sell/index',
    icon: 'real_estate_sell_icon',
    access: 'realEstateSellList',
    wrappers: ['./wrappers/check404'],
  },
  {
    path: '/real-estate-sell/create',
    component: './real_estate/real_estate_sell/create',
    access: 'realEstateSellCreate',
    wrappers: ['./wrappers/check404'],
  },
  {
    path: '/real-estate-sell/preview/:id',
    component: './real_estate/real_estate_sell/preview',
    wrappers: ['./wrappers/check404'],
  },
  {
    path: '/real-estate-sell/:id',
    component: './real_estate/real_estate_sell/[id]',
    access: 'realEstateSellEdit',
    wrappers: ['./wrappers/check404'],
  },

  // real_estate_rent
  {
    name: 'real_estate_rent',
    path: '/real-estate-rent/list',
    component: './real_estate/real_estate_rent/index',
    icon: 'real_estate_rent_icon',
    access: 'realEstateRentList',
    wrappers: ['./wrappers/check404'],
  },
  {
    path: '/real-estate-rent/create',
    component: './real_estate/real_estate_rent/create',
    access: 'realEstateRentCreate',
    wrappers: ['./wrappers/check404'],
  },
  {
    path: '/real-estate-rent/preview/:id',
    component: './real_estate/real_estate_rent/preview',
    wrappers: ['./wrappers/check404'],
  },
  {
    path: '/real-estate-rent/:id',
    component: './real_estate/real_estate_rent/[id]',
    access: 'realEstateRentEdit',
    wrappers: ['./wrappers/check404'],
  },

  {
    name: 'customer-manager',
    icon: 'members',
    path: '/customer',
    access: 'customer',
    routes: [
      {
        path: '/customer/sell-rent',
        name: 'sell_rent',
        component: './customer/sellRent',
        access: 'customerSellRentList',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: '/customer/sell-rent/:id',
        component: './customer/sellRent/[id]',
        access: 'customerSellRentEdit',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: '/customer/buy-rent',
        name: 'buy_rent',
        component: './customer/buyRent',
        access: 'customerBuyRentList',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: '/customer/buy-rent/create',
        component: './customer/buyRent/create',
        access: 'customerBuyRentCreate',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: '/customer/buy-rent/:id',
        component: './customer/buyRent/[id]',
        access: 'customerBuyRentEdit',
        wrappers: ['./wrappers/check404'],
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'broker_management',
    icon: 'broker_icon',
    // hideInMenu: true,
    path: '/broker',
    access: 'brokerList',
    routes: [
      {
        path: '/broker/:id',
        component: './broker/[id]',
        access: 'brokerEdit',
        wrappers: ['./wrappers/check404'],
      },
      {
        exact: true,
        path: '/broker',
        component: './broker',
        access: 'brokerList',
        wrappers: ['./wrappers/check404'],
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'report-chart',
    icon: 'report',
    path: '/report1',
    hideInMenu: true,
    routes: [
      {
        path: '/report1/test',
        name: 'test',
        component: './reports/real_estate_sell/index',
      },
    ],
  },
  {
    name: 'report',
    icon: 'chart_icon',
    path: '/report',
    access: 'reportView',
    routes: [
      {
        path: 'new-real-estate',
        name: 'new_real_estate',
        component: './reports/new_real_estate',
        access: 'reportView',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: 'change-status-real-estate',
        name: 'change_status_real_estate',
        component: './reports/change_status_real_estate',
        access: 'reportView',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: 'customer-sale',
        name: 'customer_sale',
        component: './reports/customer_sale',
        access: 'reportView',
        wrappers: ['./wrappers/check404'],
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'import_export',
    icon: 'download_icon',
    path: '/import-export',
    access: 'importExportImport',
    routes: [
      {
        path: 'import',
        name: 'import_list',
        access: 'importExportImport',
        component: './import_export/import/index',
        wrappers: ['./wrappers/check404'],
      },
      {
        path: 'export',
        name: 'export_list',
        access: 'importExportExport',
        component: './import_export/export/index',
        wrappers: ['./wrappers/check404'],
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'setting',
    path: 'setting',
    // hideInMenu: true,
    component: './settings',
    icon: 'setting_icon',
    access: 'settingEdit',
    wrappers: ['./wrappers/check404'],
  },
  {
    name: 'permission',
    icon: 'permission_icon',
    // hideInMenu: true,
    path: '/permission',
    access: 'permissionList',
    routes: [
      {
        path: '/permission/:id',
        component: './permissions/[id]',
        access: 'permissionList',
        wrappers: ['./wrappers/check404'],
      },
      {
        exact: true,
        path: '/permission',
        component: './permissions',
        access: 'permissionList',
        wrappers: ['./wrappers/check404'],
      },
      {
        component: './404',
      },
    ],
  },

  ...feRoutes,
  {
    path: '/',
    redirect: '/real-estate-sell/list',
  },
  {
    component: './404',
  },
  {
    component: './403',
  },
];
