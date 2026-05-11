export const CHECK_VALUE_STRING = new RegExp(
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\s|_0-9]+$/g,
);

export const CHECK_PHONE_NUMBER = new RegExp(
  /^(0)((3([2-9]))|(5([25689]))|(7([0|6-9]))|(8([1-9]))|(9([0-9])))([0-9]{7})$/,
);

export const CHECK_EMAIL = new RegExp(
  /^(?!\.)((?!.*\.{2})[a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~\-\d]+)@(?!\.)([a-zA-Z0-9-\.\d]+)((\.([a-zA-Z]){2,63})+)$/g,
);

export const CHECK_VALID_STRING = new RegExp(/^([a-zA-Z0-9\/\-]+\s)*[a-zA-Z0-9\/\-]+$/);

export const CHECK_INTEGER_NUMBER = new RegExp('^[0-9]{1,10}$');
export const CHECK_VALUE_NUMBER = new RegExp(/^[0-9]*$/);
export const CHECK_DECIMAL_NUMBER = new RegExp(/^[0-9]{1,3}((\.[0-9]{1,2})|)$/);
export const CHECK_MEASURE_DECIMAL_NUMBER = new RegExp(/^[0-9]{1,6}((\.[0-9]{1,3})|)$/);
export const CHECK_REAL_ESTATE_PRICE = new RegExp(/^[0-9]{1,5}((\.[0-9]{1,2})|)$/);
export const CHECK_NOT_INCLUDE_SPECIAL_CHARACTERS = new RegExp(
  /^[0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳýỵỷỹ\s|_]+$/g,
);
