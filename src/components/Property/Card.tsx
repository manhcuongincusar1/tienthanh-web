import { Image, message, Tag, Typography } from 'antd';
import Styles from './card-styles.less';
import _ from 'lodash';
import Settings from '../../../config/defaultSettings';
import { MESSAGE_DISPLAY_SECONDS, REAL_ESTATE_TYPE_ENUM } from '@/constants';
import { Tooltip } from 'antd';
import { useIntl, useModel } from 'umi';
import RealEstateFormModal from '@/pages/real_estate/components/formModal';
import React, { useRef, useState } from 'react';
import { realEstateService } from '@/services/realEstateService';
import { realEstateRentService } from '@/services/realEstateRentService';
import { TableRef } from '@/pages/types';
import { useAccess } from 'umi';

function PropertyCard({ data }) {
  const actionRef = useRef<TableRef>();
  const intl = useIntl();
  const access = useAccess();

  const { initialState } = useModel('@@initialState');
  const { getWorkspaceId } = useModel('infoCurrentUser');
  const { setForceUpdateGridLayout } = useModel('globalTable');
  let workspace_id: string = getWorkspaceId(initialState);

  const editDataRef = useRef() as React.MutableRefObject<
    React.ElementRef<typeof RealEstateFormModal>
  >;
  const [defaultData, setDefaultData] = useState<API.RealEstateResponse | {}>({});
  const _func = {
    afterSubmit: () => {
      actionRef.current?.reloadTable();
    },
    getDetail: async (id: string, type: number) => {
      const serviceRequest = type === 2 ? realEstateRentService : realEstateService;
      const data: any = await serviceRequest.getRealEstateById(id, workspace_id);

      if (data?.keyResponse) {
        if (data?.keyResponse === 'notfound') {
          message.error(
            intl.formatMessage({ id: 'pages.real_estate_sale.deleted' }),
            MESSAGE_DISPLAY_SECONDS.ERROR,
          );
        }
        setForceUpdateGridLayout((prev) => prev + 1);
        return false;
      }

      const dataDefault = data as API.RealEstateResponse;
      setDefaultData({
        ...dataDefault,
      });
      editDataRef.current.openModal();
    },
  };
  const {
    real_estate_status,
    real_estate_status_color,
    address,
    price,
    detail,
    street,
    ward,
    district,
    province_city,
    type,
  } = data;

  return (
    <div
      className={Styles.propertyCard}
      style={real_estate_status ? {} : { borderColor: '#FAAD14' }}
    >
      <div className={Styles.img}>
        {_.isUndefined(detail?.listPath) || detail?.listPath.length == 0 ? (
          <Image src="error" fallback="/images/thumbnail-default.png" />
        ) : (
          <Image
            src={
              detail?.listPath[0].cdn_path
                ? detail?.listPath[0].cdn_path
                : `${Settings.APP_ROOT}/${detail?.listPath[0].path}`
            }
          />
        )}

        {real_estate_status && (
          <Tag className={Styles.badge} color={real_estate_status_color}>
            {real_estate_status}
          </Tag>
        )}
      </div>
      <ul className={Styles.info} style={real_estate_status ? {} : { backgroundColor: '#fef8eb' }}>
        <li className={Styles.info_description}>
          <span className={Styles.icon}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.99967 1.33333C6.58519 1.33333 5.22863 1.89524 4.22844 2.89543C3.22824 3.89562 2.66634 5.25218 2.66634 6.66667C2.66634 8.73204 4.01017 10.7362 5.48364 12.2915C6.20675 13.0548 6.93212 13.6796 7.47746 14.1139C7.68042 14.2755 7.85769 14.4101 7.99967 14.5151C8.14166 14.4101 8.31893 14.2755 8.52189 14.1139C9.06723 13.6796 9.7926 13.0548 10.5157 12.2915C11.9892 10.7362 13.333 8.73204 13.333 6.66667C13.333 5.25218 12.7711 3.89562 11.7709 2.89543C10.7707 1.89524 9.41416 1.33333 7.99967 1.33333ZM7.99967 15.3333C7.62987 15.888 7.62971 15.8879 7.62951 15.8878L7.62761 15.8865L7.62317 15.8835L7.60789 15.8732C7.59491 15.8644 7.57639 15.8517 7.55271 15.8353C7.50536 15.8025 7.43732 15.7547 7.35154 15.6928C7.18004 15.5689 6.93725 15.3881 6.64689 15.1569C6.06723 14.6954 5.2926 14.0286 4.51571 13.2085C2.98918 11.5972 1.33301 9.26796 1.33301 6.66667C1.33301 4.89856 2.03539 3.20286 3.28563 1.95262C4.53587 0.702379 6.23156 0 7.99967 0C9.76778 0 11.4635 0.702379 12.7137 1.95262C13.964 3.20286 14.6663 4.89856 14.6663 6.66667C14.6663 9.26796 13.0102 11.5972 11.4836 13.2085C10.7067 14.0286 9.93212 14.6954 9.35246 15.1569C9.0621 15.3881 8.81931 15.5689 8.64781 15.6928C8.56203 15.7547 8.49399 15.8025 8.44664 15.8353C8.42296 15.8517 8.40444 15.8644 8.39146 15.8732L8.37618 15.8835L8.37174 15.8865L8.37033 15.8875C8.37014 15.8876 8.36947 15.888 7.99967 15.3333ZM7.99967 15.3333L8.36947 15.888C8.14554 16.0373 7.85345 16.0371 7.62951 15.8878L7.99967 15.3333ZM7.99967 5.33333C7.2633 5.33333 6.66634 5.93029 6.66634 6.66667C6.66634 7.40305 7.2633 8 7.99967 8C8.73605 8 9.33301 7.40305 9.33301 6.66667C9.33301 5.93029 8.73605 5.33333 7.99967 5.33333ZM5.33301 6.66667C5.33301 5.19391 6.52692 4 7.99967 4C9.47243 4 10.6663 5.19391 10.6663 6.66667C10.6663 8.13943 9.47243 9.33333 7.99967 9.33333C6.52692 9.33333 5.33301 8.13943 5.33301 6.66667Z"
                fill="#3169B3"
              />
            </svg>
          </span>
          <Tooltip
            placement="topLeft"
            title={` ${address} ${street}, ${ward}, ${district}, ${province_city}`}
          >
            <Typography.Link onClick={() => _func.getDetail(data?.id, data?.type)}>
              {address} {street}, {ward}, {district}, {province_city}
            </Typography.Link>
          </Tooltip>
        </li>
        <li className={Styles.info_description_area}>
          <span className={Styles.icon}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.9062 16C13.7769 15.9094 13.6206 15.8413 13.5241 15.7238C13.3294 15.4866 13.375 15.1591 13.6072 14.9166C13.7947 14.7212 13.9866 14.5312 14.2025 14.3125H14.0059C10.7559 14.3125 7.50656 14.3125 4.25781 14.3125C3.28344 14.3125 2.53594 13.8941 2.02688 13.0625C1.81969 12.7238 1.71719 12.3491 1.6925 11.9531C1.68687 11.8594 1.68781 11.7656 1.68781 11.6719C1.6876 8.44771 1.6875 5.22375 1.6875 2V1.78844C1.65199 1.81378 1.61778 1.84089 1.585 1.86969C1.42875 2.0225 1.27437 2.17781 1.11781 2.33031C0.716563 2.72156 0.213125 2.60938 0.019375 2.08625C0.0142006 2.07737 0.00766253 2.06935 0 2.0625L0 1.8125C0.109375 1.65875 0.205312 1.4925 0.331562 1.35406C0.530625 1.13531 0.758438 0.944063 0.959063 0.727188C1.2975 0.360625 1.67687 0.0715625 2.1875 0H2.5C3.01344 0.070625 3.39062 0.365313 3.7325 0.730313C3.97781 0.9925 4.24563 1.23344 4.49687 1.49C4.67469 1.67156 4.735 1.89187 4.65156 2.13687C4.57531 2.36187 4.41219 2.50063 4.18281 2.54844C3.95344 2.59625 3.75187 2.51281 3.58906 2.34656C3.38406 2.13937 3.18438 1.92844 2.98312 1.71875L2.94594 1.74094C2.94313 1.78125 2.9375 1.81813 2.9375 1.85656C2.9375 5.1524 2.9375 8.44833 2.9375 11.7444C2.9375 12.5256 3.47188 13.0613 4.25219 13.0619C7.5424 13.0633 10.8333 13.0635 14.125 13.0625H14.2581C14.2209 13.0159 14.2003 12.9841 14.1741 12.9578C13.9897 12.7744 13.8009 12.5944 13.6194 12.4081C13.3475 12.1297 13.3362 11.7553 13.5866 11.5019C13.8369 11.2484 14.2159 11.2488 14.4928 11.5178C14.8519 11.8656 15.2044 12.22 15.5584 12.5728C15.8159 12.8294 15.9291 13.155 15.9991 13.5009V13.8134C15.9269 14.3263 15.6356 14.7044 15.2634 15.0394C15.0359 15.2444 14.8331 15.4769 14.605 15.6816C14.4691 15.8034 14.3062 15.8956 14.1553 16.0009L13.9062 16Z"
                fill="#3169B3"
              />
              <path
                d="M16.0005 10.125C15.9817 10.1672 15.9633 10.2097 15.9442 10.2519C15.8889 10.3783 15.7932 10.4827 15.672 10.5487C15.5508 10.6148 15.4111 10.6386 15.2749 10.6165C15.1387 10.5944 15.0137 10.5277 14.9196 10.4267C14.8255 10.3258 14.7677 10.1965 14.7552 10.0591C14.7486 9.99188 14.7508 9.92375 14.7508 9.85625C14.7508 7.23812 14.7508 4.62 14.7508 2.00187C14.7505 1.48375 14.5167 1.25 13.9986 1.25C11.3805 1.25 8.76225 1.24906 6.14392 1.24719C6.01466 1.25067 5.88601 1.22836 5.76548 1.18156C5.53173 1.07969 5.40892 0.880313 5.41017 0.625C5.41142 0.369687 5.53517 0.18 5.7661 0.0625C5.81173 0.039375 5.85985 0.020625 5.90673 0H14.3442C14.3672 0.0110706 14.3913 0.0197615 14.4161 0.0259375C14.9333 0.10875 15.3405 0.369687 15.6505 0.786875C15.8442 1.04688 15.9333 1.34656 16.0005 1.65625V10.125Z"
                fill="#3169B3"
              />
              <path
                d="M4.1875 8.13494C4.1875 7.51536 4.1875 6.89567 4.1875 6.27588C4.1875 5.67588 4.65625 5.40088 5.1875 5.68682C5.2276 5.70471 5.27289 5.70716 5.31469 5.69369C5.88188 5.50619 6.41313 5.57463 6.9025 5.91838C6.98375 5.97557 7.03406 5.96119 7.1075 5.91182C7.67875 5.52776 8.28406 5.47182 8.89281 5.79338C9.50156 6.11494 9.80656 6.64401 9.81188 7.33213C9.81906 8.23276 9.815 9.13369 9.81188 10.0346C9.81188 10.4309 9.55187 10.7121 9.19125 10.7149C8.83063 10.7178 8.56344 10.4337 8.56281 10.0274C8.56281 9.13151 8.56469 8.23588 8.56125 7.33994C8.56125 6.97338 8.22781 6.73994 7.91125 6.87994C7.70813 6.96869 7.625 7.13744 7.625 7.35619C7.62667 8.23119 7.62667 9.10619 7.625 9.98119C7.6277 10.0543 7.62404 10.1275 7.61406 10.1999C7.58821 10.35 7.50828 10.4855 7.38939 10.5806C7.27049 10.6758 7.12086 10.7241 6.96875 10.7165C6.81336 10.7097 6.66629 10.6444 6.55704 10.5337C6.44778 10.423 6.38443 10.2751 6.37969 10.1196C6.36937 9.81276 6.37625 9.50526 6.37594 9.19807C6.37594 8.57838 6.37781 7.95869 6.37594 7.33901C6.37594 7.05776 6.1925 6.85776 5.93844 6.84369C5.66 6.82807 5.44375 7.03119 5.44125 7.32588C5.43687 7.83088 5.43969 8.33588 5.43969 8.84119C5.43969 9.24213 5.44156 9.64307 5.43969 10.044C5.4375 10.4396 5.17656 10.7184 4.81469 10.7174C4.45281 10.7165 4.18937 10.4374 4.1875 10.0409C4.1875 9.40619 4.1875 8.77026 4.1875 8.13494Z"
                fill="#3169B3"
              />
              <path
                d="M12.685 6.37705C12.77 6.37705 12.8413 6.37268 12.9122 6.37705C13.0701 6.38637 13.2186 6.45521 13.3277 6.56969C13.4369 6.68417 13.4986 6.83577 13.5003 6.99393C13.5038 7.3258 13.2478 7.61268 12.9097 7.61893C12.3375 7.6308 11.765 7.62861 11.1925 7.6208C10.9191 7.61736 10.7125 7.48143 10.6116 7.2233C10.5022 6.94205 10.6003 6.71049 10.8019 6.50205C11.1488 6.1433 11.4947 5.7833 11.8269 5.41049C11.9607 5.2608 12.065 5.08268 12.1653 4.90736C12.1802 4.87481 12.1874 4.83928 12.1863 4.80351C12.1852 4.76774 12.1759 4.73271 12.1591 4.70111C12.1278 4.6558 12.0257 4.62174 11.9716 4.63861C11.9091 4.65799 11.855 4.73236 11.8216 4.79486C11.7919 4.85143 11.8019 4.92736 11.7838 4.99205C11.7432 5.13626 11.6515 5.26076 11.5259 5.34231C11.4002 5.42386 11.2492 5.45687 11.101 5.43518C10.9555 5.41381 10.8222 5.34208 10.7243 5.23248C10.6263 5.12289 10.57 4.98239 10.565 4.83549C10.546 4.18611 11.0025 3.5983 11.6647 3.41861C12.2616 3.25705 12.96 3.55268 13.2619 4.08799C13.5403 4.58205 13.5278 5.07393 13.2416 5.55361C13.0766 5.82924 12.8822 6.08705 12.685 6.37705Z"
                fill="#3169B3"
              />
            </svg>
          </span>
          {detail?.recognized_area && (
            <p>
              {detail?.recognized_area + ' '}
              <span>
                m<sup>2</sup>
              </span>
            </p>
          )}
        </li>
        <li className={Styles.info_description_structure}>
          <span className={Styles.icon}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.59038 0.806936C7.83112 0.619693 8.16823 0.619693 8.40897 0.806936L14.409 5.4736C14.5714 5.59991 14.6663 5.79411 14.6663 5.99984V13.3332C14.6663 13.8636 14.4556 14.3723 14.0806 14.7474C13.7055 15.1225 13.1968 15.3332 12.6663 15.3332H3.33301C2.80257 15.3332 2.29387 15.1225 1.91879 14.7474C1.54372 14.3723 1.33301 13.8636 1.33301 13.3332V5.99984C1.33301 5.79411 1.42799 5.59991 1.59038 5.4736L7.59038 0.806936ZM6.66634 13.9998H9.33301V8.6665H6.66634V13.9998ZM10.6663 13.9998V7.99984C10.6663 7.63165 10.3679 7.33317 9.99967 7.33317H5.99967C5.63148 7.33317 5.33301 7.63165 5.33301 7.99984V13.9998H3.33301C3.1562 13.9998 2.98663 13.9296 2.8616 13.8046C2.73658 13.6795 2.66634 13.51 2.66634 13.3332V6.32589L7.99967 2.17774L13.333 6.32589V13.3332C13.333 13.51 13.2628 13.6795 13.1377 13.8046C13.0127 13.9296 12.8432 13.9998 12.6663 13.9998H10.6663Z"
                fill="#3169B3"
              />
            </svg>
          </span>
          <Tooltip placement="topLeft" title={detail?.structure}>
            {detail?.structure}
          </Tooltip>
        </li>
        <li>
          <span className={Styles.icon}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <rect width="16" height="16" fill="url(#pattern0)" />
              <defs>
                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                  <use xlinkHref="#image0_1290_1431" transform="scale(0.0166667)" />
                </pattern>
                <image
                  id="image0_1290_1431"
                  width="60"
                  height="60"
                  xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAABmJLR0QA/wD/AP+gvaeTAAAFLElEQVRoge2aX2xTVRzHP79zK3/EDUEc4gBRUGKMrNtAQzRhvEAy6UaCwUSfjEmhUx7AFxKCjhh90pCIrGyvJhohJLDi1BgUY4QYXDaqCyGGGeSPYQTRAkpY7/35sDJH29v2truFJf0kS5Zzfr9zv9/ee07P/Z1ChQoVKlSoUOFOIdkaG8M9CzVg71AlBFSXWVOpXAK+Mba1rber+XR6Z4bhhraDi1TNUeDBcqjzkaEAsvx4dM3g2EaTHuVgvcvENwtQM4yzI70xw7CoNpVHj/8I0pLeFsgSV5NjjL/7oqH7x09S6QQjsYRAlUt3xvqTcYdzoSJfFaXKRwwc9hhfMJcdy7zpUY/vJHG2AlcKjS/EcEJF9toBKxjf1XyueGn+EI+2ngqIXSewD0jki882h2+jLxqaPh7ClmzqmWvZdhilBXg01TyIEHMcOk/sCZ0vduzjHWvPAusB6iMxzRXraQ4XS/3GQxEraZ9E2Q7UMbKYVANBlO0inGyIHAqXQ4vvhusj3W8h2gHc5xYjUKVoZ0Nb9za/9fhquKEtFgJpLzReVd4Jbog1+6nJN8ON4Z/uUZUPcdmvuyAYdjW1f5t3bSkW3ww7gQsvgi7wmifwWGLo2jo/NEEBq3Q6wcihFwTtRFFEw33Rli+yBjomhORcMHMRAj4r6foueL7DoroHqEWYC9LpFqeiz3odezRXcc0t9Ppu+PZIC8wuIf2hcROShnfDomGUc8BZEeP63anglKDLPbfA67vheQ6n5sy8fHEGLigs9jp+CtddV6HXd8O3R1qht/hcLTo3H/7NYZH9JWSXkJsb3wxX10zrFviliNSTlj3n83EXlMI3w0faVyYdx9mCt8XLxrCpt2vpsF+6fN1L93e2fg28XnCCsqVvd8hTBcMrGfvc9PdJhasGDidxtsajraf8FFMsy9oOzEuqtVNhVXp9qy8aus1j3js88urGWgtzbFnbgaK/DvwiZbYfWJejmDeKl0d6hq3WB8VL84ekWjuBmYXGe6tawmrPinxGYZWX+Gw7rQTu50nV+WpGdxXCxfSmzJMHIVYeNWVAM2vWmYaT1tvAUFkE+YlwMYBsT2/OMNzb1Xw6gCxH5VMmpvEE8LFtNOPksEKFChMf15pxcEOsWYzsTpVak8DVW30KVwQSqCZUJAH6lyBDwHlULyHmD3X0zPCf/54Z2Lf+Zhl8ZLwDpO+hb+Fa4hFDF2jtmLgZo323/hdJfWJjxhYBFDEwadZUpz4SOwcMKgwYJC5GTtzQ6wMDHeuvFWOsVNxrWop6OjPIjgHmA/MFmhRFHWUSU536SGwQOAEaV0ePOVVTjsbfX3295Cvmwd2waBhkN/8fbY4nBlg08ifrxAjW9ZvD9ZHYcUGP2CLf6b2TfvDjAyjsHra3m6cvLh09J54CM26qPd2IVItItaMyU1TnqOhsQWoYqSouAGopvsgwDHyvQrdjtDv+Uctv6QHBDbHHRXgPYSXwwNg+tzlc+kObg0WbeiZPc/QRS53FoEsczBKjWqcjd9fyNJjys8J+lE/6O0O/pn5PdgyYlS38jhh2Y/nmvVNv/DP5KTUmaJRnVFgBPFFovsKPMjIdG91i7irD2ah/4+DDOLICzApRbSqhiA9MAMPpNIZ7FjqW3Qq0AM/jbQpc6YuGslZB7lrDY2kMx2apRUiVV1ILVM6FUEX29neseSlb34QwPJa6jbFaEV4WeBV4MkvI5Vw/sZpwhscS3HjwOcS8JkIzShXol8aWzb1dod/vtLYKFSr4w3+VcbLa7sa3/AAAAABJRU5ErkJggg=="
                />
              </defs>
            </svg>
          </span>
          <p>
            {price.replace('.', ',')}
            {type == REAL_ESTATE_TYPE_ENUM.SALE ? ' tỷ VNĐ' : ' triệu VNĐ'}
          </p>
        </li>
      </ul>
      <RealEstateFormModal
        ref={editDataRef}
        tableRef={actionRef}
        linkAnchor={<React.Fragment></React.Fragment>}
        accessiable={type === 1 ? access.realEstateSellEdit : access.realEstateRentEdit}
        defaultData={defaultData}
        afterSubmit={_func.afterSubmit}
        title={intl.formatMessage(
          { id: 'pages.real_estate_sale.modal.title' },
          {
            name: defaultData.title,
          },
        )}
      />
    </div>
  );
}

export default PropertyCard;
