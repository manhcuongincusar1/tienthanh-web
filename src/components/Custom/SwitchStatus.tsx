import {Switch} from "antd";
import {STATUS_ENUM} from "@/constants";

export default ({ entity, onChangeStatus, ...rest }) => {
  let defaultChecked = entity.status === STATUS_ENUM.ACTIVE;
  return (
    <Switch
      defaultChecked={defaultChecked}
      onChange={(val) => onChangeStatus(val, entity)}
      {...rest}
    />
  );
}
