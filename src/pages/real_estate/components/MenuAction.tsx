import { Menu } from 'antd';
import ModalAsignSingleRealEstate from './ModalAsignSingleRealEstate';
import PopupConfirmConvertSingleRealEstateToDuplicate from './PopupConfirmConvertSingleRealEstateToDuplicate';
import { useParams } from 'umi';
import PopupConfirmDeleteSingleRealEstate from './PopupConfirmDeleteSingleRealEstate';

type MenuActionProps = {
  hiddeAssignButton?: boolean;
  hiddeDuplicateButton?: boolean;
  hiddeDeleteButton?: boolean;
  handlePushPageToPageList: () => void;
  handleRefreshPage: () => void;
  localePage: string;
  realEstateService: any;
};

export default function MenuAction({
  hiddeAssignButton,
  hiddeDuplicateButton,
  hiddeDeleteButton,
  handlePushPageToPageList,
  handleRefreshPage,
  localePage,
  realEstateService,
}: MenuActionProps) {
  const { id } = useParams<RealEstate.Params>();

  return (
    <Menu>
      <Menu.Item hidden={hiddeDuplicateButton} style={{ lineHeight: '25px', padding: '4px 24px' }}>
        <PopupConfirmConvertSingleRealEstateToDuplicate
          handlePushPageToPageList={handlePushPageToPageList}
          handleRefreshPage={handleRefreshPage}
          realEstateId={id}
          localePage={localePage}
          realEstateService={realEstateService}
        />
      </Menu.Item>
      <Menu.Item hidden={hiddeAssignButton} style={{ lineHeight: '25px', padding: '4px 24px' }}>
        <ModalAsignSingleRealEstate
          handlePushPageToPageList={handlePushPageToPageList}
          handleRefreshPage={handleRefreshPage}
          realEstateId={id}
          realEstateService={realEstateService}
          localePage={localePage}
        />
      </Menu.Item>
      <Menu.Item hidden={hiddeDeleteButton} style={{ lineHeight: '25px', padding: '4px 24px' }}>
        <PopupConfirmDeleteSingleRealEstate
          realEstateId={id}
          handlePushPageToPageList={handlePushPageToPageList}
          handleRefreshPage={handlePushPageToPageList}
          localePage={localePage}
          realEstateService={realEstateService}
        />
      </Menu.Item>
    </Menu>
  );
}
