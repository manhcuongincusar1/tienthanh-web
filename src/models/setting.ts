import { settingService } from '@/services/settingService';
import { useState } from 'react';
interface Setting {
  image_size: number;
  image_capacity: number;
  limit_time: number;
  import_size: number;
  amount_select: number;
  image_real_estate?: { id?: string; cdn_path: string };
  avatar?: { id?: string; cdn_path: string };
}
export default () => {
  const [settingSystem, setSettingSystem] = useState<Setting | undefined>();
  const getSetting = async (branch_id: string) => {
    await settingService.getSetting(branch_id).then((res) => {
      if (res.data) {
        setSettingSystem(res.data);
      }
    });
  };
  return {
    getSetting,
    settingSystem,
  };
};
