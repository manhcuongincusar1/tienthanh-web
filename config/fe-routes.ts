export default [
  {
    path: '/customer-manager',
    name: 'customer-manager',
    icon: 'TeamOutlined',
    hideInMenu: true,
    routes: [
      {
        name: 'sell',
        path: '/customer-manager/sell',
        component: './html/customer/sell',
      },
      {
        name: 'sell-details',
        path: '/customer-manager/sell/details',
        component: './html/customer/sell-details',
        hideInMenu: true,
      },
      {
        name: 'buy',
        path: '/customer-manager/buy',
      },
      {
        name: 'buy-details',
        path: '/customer-manager/buy/details',
        component: './html/customer/buy-details',
      },
    ],
  },
  {
    path: '/fe-report',
    name: 'report',
    hideInMenu: true,
    routes: [
      {
        name: 'new-property',
        path: '/fe-report/new-property',
        component: './html/report/new-property',
      },
      {
        name: 'history-property',
        path: '/fe-report/history-property',
        component: './html/report/history-property',
      },
    ],
  },
  {
    name: 'property',
    path: '/property-sell',
    component: './html/property/sell',
    hideInMenu: true,
  },
  {
    name: 'property-sell-create',
    path: '/property-sell/create',
    component: './html/property/create',
    hideInMenu: true,
  },
  {
    name: 'property-sell-details',
    path: '/property-sell/details',
    component: './html/property/details',
    hideInMenu: true,
  },

  {
    layout: false,
    path: '/fe-user-login',
    component: './html/user/user-login',
  },
  {
    layout: false,
    path: '/fe-forgot-password',
    component: './html/user/forgot-password',
  },
];
