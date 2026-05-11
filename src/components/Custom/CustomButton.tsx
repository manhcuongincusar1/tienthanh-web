import {Button} from "antd";

export default ({ ...rest }) => {
  return (
    <Button
      onMouseUp={ e => {
        e.currentTarget.blur();
      }}
      onMouseLeave={ e => {
        e.currentTarget.blur();
      }}
      {...rest}
    />
  );
}
