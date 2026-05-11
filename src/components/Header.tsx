import { Button, Select } from 'antd';
import Styles from './header-style.less';
import AvatarDropdown from './RightContent/AvatarDropdown';
import { useModel } from 'umi';
import _ from 'lodash';
import { confirm } from '@/components/popup';
import { useIntl } from '@@/plugin-locale/localeExports';
import { history } from '@@/core/history';
import { useEffect, useState } from 'react';
import SelectArrowIcon from './Icon/SelectArrowIcon';

function Header({ onCollapse, collapsed }: any) {
  const intl = useIntl();
  const { initialState, setInitialState, refresh } = useModel('@@initialState');
  const currentUser = initialState?.currentUser;
  const listWorkspace = initialState?.listWorkspace;
  const [listWorkspaceOptions, setListWorkspaceOptions] = useState<[] | any>([]);
  useEffect(() => {
    if (listWorkspace) {
      setListWorkspaceOptions(listWorkspace);
    }
  }, [listWorkspace]);

  const _bindEvent = {
    onChangeWorkspace: (value: string) => {
      confirm(
        intl.formatMessage({ id: 'global.caution' }),
        intl.formatMessage({ id: 'global.world_space.confirm_description' }),
        () => {
          const workSpaceIndex = _.findIndex(listWorkspace, { id: value });
          if (value) {
            localStorage.setItem('currentWorkSpaceId', value);
          }

          if (workSpaceIndex > -1 && currentUser) {
            currentUser.currentWorkSpace = listWorkspace?.[workSpaceIndex];
          }
          setInitialState((s: any) => ({
            ...s,
            currentUser,
          }));

          refresh();
          history.push('/real-estate-sell/list');
        },
        () => {},
      );
    },
  };
  return (
    <div className={Styles.header_container}>
      <div className={Styles.logo}>
        <img src="/images/logo-header.png" alt="" />
      </div>
      <div className={Styles.toggleSidebar}>
        <Button
          type="text"
          className={Styles.btnToggleSidebar}
          onClick={() => onCollapse(!collapsed)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.0001 18C20.5524 18 21.0001 18.4477 21.0001 19C21.0001 19.5128 20.6141 19.9355 20.1167 19.9933L20.0001 20H4.00015C3.44786 20 3.00015 19.5523 3.00015 19C3.00015 18.4872 3.38618 18.0645 3.88353 18.0067L4.00015 18H20.0001ZM20.0002 13C20.5524 13 21.0002 13.4477 21.0002 14C21.0002 14.5523 20.5524 15 20.0002 15H11.0001C10.4479 15 10.0001 14.5523 10.0001 14C10.0001 13.4477 10.4479 13 11.0001 13H20.0002ZM3.64311 9.17279L3.93327 9.32447L4.27756 9.5128C4.33916 9.54727 4.40281 9.58329 4.46838 9.62086L4.88417 9.86507C4.95704 9.90892 5.03163 9.95434 5.10783 10.0013L5.58348 10.3025C5.83972 10.4689 6.07717 10.63 6.29444 10.7823L6.70164 11.0744C6.76488 11.1208 6.82578 11.166 6.88427 11.2098L7.20606 11.4559L7.46778 11.664C7.68255 11.838 7.67312 12.1851 7.44731 12.3672L7.18679 12.5734L6.86818 12.8161L6.49336 13.09C6.42631 13.138 6.357 13.187 6.28546 13.2371L5.82988 13.5481L5.58267 13.7107C5.41374 13.8204 5.25101 13.9232 5.09531 14.0193L4.65012 14.2873L4.25205 14.5154L3.90605 14.7045L3.61707 14.8552C3.36363 14.9843 3.09147 14.8194 3.06505 14.5228L3.02527 14.0126L2.9891 13.3625L2.97112 12.8586L2.96094 12.3031L2.9611 11.6944L2.97244 11.109L2.99229 10.5818L3.0177 10.118L3.05978 9.55205C3.0871 9.2354 3.38561 9.04127 3.64311 9.17279ZM20.0002 8C20.5524 8 21.0002 8.44772 21.0002 9C21.0002 9.55228 20.5524 10 20.0002 10H11.0001C10.4479 10 10.0001 9.55228 10.0001 9C10.0001 8.44772 10.4479 8 11.0001 8H20.0002ZM20.0001 3C20.5524 3 21.0001 3.44772 21.0001 4C21.0001 4.55228 20.5524 5 20.0001 5H4.00015C3.44786 5 3.00015 4.55228 3.00015 4C3.00015 3.44772 3.44786 3 4.00015 3H20.0001Z"
              fill="#1D1E20"
            />
          </svg>
        </Button>
      </div>

      <div className={Styles.header__notice}>
        {currentUser?.currentWorkSpace && (
          <Select
            style={{ width: '100%' }}
            defaultValue={currentUser?.currentWorkSpace?.id || listWorkspace?.[0]?.id}
            suffixIcon={<SelectArrowIcon />}
            value={currentUser?.currentWorkSpace?.id || listWorkspace?.[0]?.id}
            onChange={_bindEvent.onChangeWorkspace}
          >
            {_.isArray(listWorkspaceOptions) &&
              listWorkspaceOptions?.map((branch: any) => {
                return <Select.Option value={branch.id}>{branch?.title}</Select.Option>;
              })}
          </Select>
        )}
      </div>
      <div className={Styles.header__user}>
        <AvatarDropdown menu />
      </div>
    </div>
  );
}

export default Header;
