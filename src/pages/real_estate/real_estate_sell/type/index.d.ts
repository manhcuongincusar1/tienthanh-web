declare namespace RealEstateSell {
  interface CategoryOptions {
    value: string | undefined;
    label: string | undefined;
  }
  interface RealEstateStatusOptions {
    value: string | undefined;
    label: ReactNode | string | undefined;
    color: string | undefined;
    type: number | undefined;
    isDefault: boolean | undefined;
    isEditableRe: boolean | undefined;
    isShowInternal: boolean | undefined;
  }

  interface Options {
    value: string;
    label: string;
    id: string;
    full_name: string;
  }
  interface PhoneList {
    phone: string;
    id: string;
    full_name: string;
  }
  type FormRef = ProFormInstance;
}
