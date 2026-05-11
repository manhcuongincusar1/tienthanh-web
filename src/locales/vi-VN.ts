import global from './vi-VN/global';
import forms from './vi-VN/forms';
import menus from './vi-VN/menus';
import pages from './vi-VN/pages';
import component from './vi-VN/component';
import globalHeader from './vi-VN/globalHeader';
import pwa from './vi-VN/pwa';
import settings from './vi-VN/settings';
import settingDrawer from './vi-VN/settingDrawer';

export default {
  'navBar.lang': 'Ngôn ngữ',
  'layout.user.link.help': 'Trợ giúp',
  'layout.user.link.privacy': 'Chính sách',
  'layout.user.link.terms': 'Terms',
  'app.copyright.produced': 'Produced by Ant Financial Experience Department',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...global,
  ...forms,
  ...globalHeader,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...menus,
  ...pages,
  ...component,
};
