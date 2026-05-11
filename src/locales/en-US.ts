import component from './en-US/component';
import globalHeader from './en-US/globalHeader';
import menus from './en-US/menus';
import pages from './vi-VN/pages';
import pwa from './en-US/pwa';
import settingDrawer from './en-US/settingDrawer';
import settings from './en-US/settings';
import global from './en-US/global';
import forms from './en-US/forms';

export default {
  'navBar.lang': 'Languages',
  'layout.user.link.help': 'Help',
  'layout.user.link.privacy': 'Privacy',
  'layout.user.link.terms': 'Terms',
  'app.copyright.produced': 'Produced by Ant Financial Experience Department',
  'app.preview.down.block': 'Download this page to your local project',
  'app.welcome.link.fetch-blocks': 'Get all block',
  'app.welcome.link.block-list': 'Quickly build standard, pages based on `block` development',
  ...globalHeader,
  ...menus,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
  ...global,
  ...forms,
};
