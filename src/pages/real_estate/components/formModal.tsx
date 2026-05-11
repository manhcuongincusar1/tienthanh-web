import { ProFormInstance } from '@ant-design/pro-form';
import { Row, Col, Tag, Button, Image } from 'antd';
import React, { ReactNode, useImperativeHandle, useState, useEffect, useRef } from 'react';
import { Link, useIntl, history } from 'umi';
import { GlobalModalForm } from '../../../components/GlobalForm';
import _ from 'lodash';
import Styles from '@/styles/page/property/sell-styles.less';
import SwiperCore, { Navigation, Thumbs } from 'swiper';
import 'swiper/components/navigation/navigation.min.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import { formatDate } from '@/utils';
import { REAL_LOCATION_ENUM, DIRECTION_ENUM } from '../constants';
import SwiperClass from 'swiper/types/swiper-class';
import { REAL_ESTATE_IS_EDITABLE } from '@/constants';
import Settings from '../../../../config/defaultSettings';
import { useModel } from '@@/plugin-model/useModel';

SwiperCore.use([Navigation, Thumbs]);

interface TableRef extends ProFormInstance {
  reloadTable: () => void;
}

type RealEstateFormModalProps = {
  title?: string;
  accessiable: boolean;
  idData?: number;
  linkAnchor?: ReactNode;
  afterSubmit?: () => void;
  defaultData?: API.RealEstateResponse;
  tableRef: React.MutableRefObject<TableRef | undefined>;
};

type ModalFormRef = {
  openModal: () => void;
  closeModal: () => void;
};

const RealEstateFormModal = React.forwardRef<ModalFormRef, RealEstateFormModalProps>(
  (props, ref) => {
    const modalRef = React.useRef() as React.MutableRefObject<
      React.ElementRef<typeof GlobalModalForm>
    >;
    const intl = useIntl();
    const formRef = useRef<ProFormInstance<any> | undefined>();
    const { typePage, handleChangePage } = useModel('realEstateSell');
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
    const [currentPreview, setCurrentPreview] = useState(0);
    const [visible, setVisible] = useState(false);
    const { title, linkAnchor, defaultData, accessiable } = props;
    const { pathname } = history.location;
    useEffect(() => {
      handleChangePage(pathname);
    }, [pathname]);

    useImperativeHandle(ref, () => ({
      openModal() {
        modalRef.current.openModal();
      },
      closeModal() {
        modalRef.current.closeModal();
      },
    }));

    const _bindEvent = {
      handlePreview: (current: number) => {
        setVisible(true);
        setCurrentPreview(current);
      },
    };

    return (
      <GlobalModalForm
        width={1181}
        modalProps={{
          className: Styles.propertyModal,
        }}
        formRef={formRef}
        ref={modalRef}
        submitter={false}
        initialValues={{
          ...defaultData,
        }}
        title={title}
        trigger={linkAnchor ?? linkAnchor}
      >
        <Row>
          <Col lg={{ span: 5 }} span={12}>
            <p className={Styles.date}>Ngày tạo: {formatDate(defaultData?.created_date)}</p>
          </Col>

          <Col lg={{ span: 5 }} span={12}>
            <p className={Styles.date}>Ngày cập nhật: {formatDate(defaultData?.modified_date)}</p>
          </Col>
        </Row>

        <Row gutter={30}>
          <Col span={24} md={{ span: 10 }} lg={{ span: 8 }}>
            {defaultData?.detail?.listPath && defaultData?.detail?.listPath?.length > 0 ? (
              <div className={Styles.imageSlider}>
                <div className={Styles.sliderMain}>
                  <div className={Styles.sliderWrapper}>
                    <Swiper
                      slidesPerView={1}
                      navigation
                      thumbs={{
                        swiper: thumbsSwiper && !thumbsSwiper?.destroyed ? thumbsSwiper : null,
                      }}
                      loop={true}
                    >
                      {defaultData?.detail?.listPath?.map((item, index) => {
                        const image = item.cdn_path
                          ? item.cdn_path
                          : `${Settings.APP_ROOT}/${item.path}`;

                        return (
                          <SwiperSlide key={index}>
                            <div className={Styles.sliderItem}>
                              <div className={Styles.img}>
                                <div className={Styles.overlay}>
                                  <a
                                    href="#"
                                    onClick={() => _bindEvent.handlePreview(index)}
                                    className={Styles.iconPreview}
                                  >
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M2.14074 12C2.25003 12.1889 2.39492 12.4296 2.57441 12.7075C3.03543 13.4213 3.71817 14.3706 4.60454 15.3161C6.39552 17.2264 8.89951 19 12 19C15.1005 19 17.6045 17.2264 19.3955 15.3161C20.2818 14.3706 20.9646 13.4213 21.4256 12.7075C21.6051 12.4296 21.75 12.1889 21.8593 12C21.75 11.8111 21.6051 11.5704 21.4256 11.2925C20.9646 10.5787 20.2818 9.6294 19.3955 8.68394C17.6045 6.77356 15.1005 5 12 5C8.89951 5 6.39552 6.77356 4.60454 8.68394C3.71817 9.6294 3.03543 10.5787 2.57441 11.2925C2.39492 11.5704 2.25003 11.8111 2.14074 12ZM23 12C23.8944 11.5528 23.8943 11.5524 23.8941 11.5521L23.8925 11.5489L23.889 11.542L23.8777 11.5198C23.8681 11.5013 23.8546 11.4753 23.8372 11.4424C23.8025 11.3767 23.752 11.2832 23.686 11.166C23.5542 10.9316 23.3601 10.6015 23.1057 10.2075C22.5979 9.42131 21.8432 8.3706 20.8545 7.31606C18.8955 5.22644 15.8995 3 12 3C8.10049 3 5.10448 5.22644 3.14546 7.31606C2.15683 8.3706 1.40207 9.42131 0.894336 10.2075C0.63985 10.6015 0.445792 10.9316 0.313971 11.166C0.248023 11.2832 0.19754 11.3767 0.162753 11.4424C0.145357 11.4753 0.131875 11.5013 0.122338 11.5198L0.11099 11.542L0.107539 11.5489L0.10637 11.5512C0.106186 11.5516 0.105573 11.5528 1 12L0.105573 11.5528C-0.0351909 11.8343 -0.0351909 12.1657 0.105573 12.4472L1 12C0.105573 12.4472 0.105389 12.4468 0.105573 12.4472L0.107539 12.4511L0.11099 12.458L0.122338 12.4802C0.131875 12.4987 0.145357 12.5247 0.162753 12.5576C0.19754 12.6233 0.248023 12.7168 0.313971 12.834C0.445792 13.0684 0.63985 13.3985 0.894336 13.7925C1.40207 14.5787 2.15683 15.6294 3.14546 16.6839C5.10448 18.7736 8.10049 21 12 21C15.8995 21 18.8955 18.7736 20.8545 16.6839C21.8432 15.6294 22.5979 14.5787 23.1057 13.7925C23.3601 13.3985 23.5542 13.0684 23.686 12.834C23.752 12.7168 23.8025 12.6233 23.8372 12.5576C23.8546 12.5247 23.8681 12.4987 23.8777 12.4802L23.889 12.458L23.8925 12.4511L23.8936 12.4488C23.8938 12.4484 23.8944 12.4472 23 12ZM23 12L23.8944 12.4472C24.0352 12.1657 24.0348 11.8336 23.8941 11.5521L23 12ZM12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10ZM8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12Z"
                                      />
                                    </svg>
                                  </a>
                                  <a className={Styles.iconDownload} href={image} download>
                                    <svg
                                      width="24"
                                      height="24"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M12 2C12.5523 2 13 2.44772 13 3V12.5858L16.2929 9.29289C16.6834 8.90237 17.3166 8.90237 17.7071 9.29289C18.0976 9.68342 18.0976 10.3166 17.7071 10.7071L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L6.29289 10.7071C5.90237 10.3166 5.90237 9.68342 6.29289 9.29289C6.68342 8.90237 7.31658 8.90237 7.70711 9.29289L11 12.5858V3C11 2.44772 11.4477 2 12 2ZM3 14C3.55228 14 4 14.4477 4 15V19C4 19.2652 4.10536 19.5196 4.29289 19.7071C4.48043 19.8946 4.73478 20 5 20H19C19.2652 20 19.5196 19.8946 19.7071 19.7071C19.8946 19.5196 20 19.2652 20 19V15C20 14.4477 20.4477 14 21 14C21.5523 14 22 14.4477 22 15V19C22 19.7957 21.6839 20.5587 21.1213 21.1213C20.5587 21.6839 19.7957 22 19 22H5C4.20435 22 3.44129 21.6839 2.87868 21.1213C2.31607 20.5587 2 19.7957 2 19V15C2 14.4477 2.44772 14 3 14Z"
                                      />
                                    </svg>
                                  </a>
                                </div>
                                <img src={image} alt="" />
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
                <div className={Styles.sliderNav}>
                  <div className={Styles.sliderWrapper}>
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      watchSlidesVisibility
                      watchSlidesProgress
                      slideToClickedSlide={true}
                      slidesPerView={5}
                    >
                      {defaultData?.detail?.listPath?.map((item, index) => {
                        const image = item?.cdn_path
                          ? item?.cdn_path
                          : `${Settings.APP_ROOT}/${item?.path}`;
                        return (
                          <SwiperSlide key={`thumb-${index}`}>
                            <div className={Styles.sliderItem}>
                              <div className={Styles.img}>
                                <img src={image} alt="" />
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </div>
                <div className="d-none">
                  <Image.PreviewGroup
                    preview={{
                      visible,
                      current: currentPreview,
                      onVisibleChange: (vis) => setVisible(vis),
                    }}
                  >
                    {defaultData?.detail?.listPath?.map((item, index) => {
                      const image = item?.cdn_path
                        ? item?.cdn_path
                        : `${Settings.APP_ROOT}/${item?.path}`;
                      return <Image key={`review-${index}`} src={image} />;
                    })}
                  </Image.PreviewGroup>
                </div>
              </div>
            ) : (
              <Image src={'error'} fallback="/images/thumbnail-default.png" />
            )}
          </Col>
          <Col span={24} md={{ span: 14 }} lg={{ span: 16 }}>
            <div className={Styles.infoTop}>
              <span className={Styles.id}>ID: {defaultData?.code}</span>
              {defaultData?.real_estate_status && (
                <Tag color={defaultData?.real_estate_status_color}>
                  {defaultData?.real_estate_status}
                </Tag>
              )}
              {accessiable && defaultData?.is_accessible ? (
                <Button type="link">
                  <Link
                    to={`/${typePage?.path}/${defaultData?.id}`}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    {intl.formatMessage({ id: 'pages.real_estate_sale.modal.watch_detail' })}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.2929 4.29289C11.6834 3.90237 12.3166 3.90237 12.7071 4.29289L19.7071 11.2929C20.0976 11.6834 20.0976 12.3166 19.7071 12.7071L12.7071 19.7071C12.3166 20.0976 11.6834 20.0976 11.2929 19.7071C10.9024 19.3166 10.9024 18.6834 11.2929 18.2929L16.5858 13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H16.5858L11.2929 5.70711C10.9024 5.31658 10.9024 4.68342 11.2929 4.29289Z"
                      />
                    </svg>
                  </Link>
                </Button>
              ) : (
                ''
              )}
            </div>
            <p className={Styles.price}>
              <span>Giá:</span>
              {defaultData?.price?.replace('.', ',')}
              &nbsp;{intl.formatMessage({ id: `pages.${typePage?.locale}.price_unit` })}
            </p>
            <p className={Styles.infoItem}>
              <span className={Styles.label}>
                {intl.formatMessage({ id: 'pages.real_estate_sale.address' })}:
              </span>
              <span className={Styles.text}>
                {defaultData?.address} {defaultData?.street}, {defaultData?.ward},{' '}
                {defaultData?.district}, {defaultData?.province_city}
              </span>
            </p>
            <Row gutter={30}>
              <Col span={24} lg={{ span: 12 }}>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Danh mục BĐS:</span>
                  <span className={Styles.text}>{defaultData?.category_title}</span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Ngang (m):</span>
                  <span className={Styles.text}>{defaultData?.detail?.horizontal}</span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Dài (m):</span>
                  <span className={Styles.text}>{defaultData?.detail?.long}</span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>
                    Diện tích (m<sup>2</sup>):
                  </span>
                  <span className={Styles.text}>{defaultData?.detail?.area}</span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>
                    Diện tích công nhận (m<sup>2</sup>):
                  </span>
                  <span className={Styles.text}>{defaultData?.detail?.recognized_area}</span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Phòng ngủ:</span>
                  <span className={Styles.text}>{defaultData?.detail?.bedroom}</span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Số WC:</span>
                  <span className={Styles.text}>{defaultData?.detail?.wc}</span>
                </p>
              </Col>
              <Col span={24} lg={{ span: 12 }}>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Hướng:</span>
                  <span className={Styles.text}>
                    {defaultData?.direction && DIRECTION_ENUM[defaultData?.direction]}
                  </span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Vị trí:</span>
                  <span className={Styles.text}>
                    {defaultData?.location && REAL_LOCATION_ENUM[defaultData.location]}
                  </span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Tình trạng sổ hồng:</span>
                  <span className={Styles.text}>
                    {REAL_ESTATE_IS_EDITABLE[`${defaultData?.detail?.book_status}`]}
                  </span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Hợp tác:</span>
                  <span className={Styles.text}>
                    {REAL_ESTATE_IS_EDITABLE[`${!!defaultData?.agency}`]}
                  </span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Phí môi giới:</span>
                  <span className={Styles.text}>
                    {defaultData?.brokerage_fees}{' '}
                    {intl.formatMessage({ id: `pages.${typePage?.locale}.brokerage_fees_suffix` })}
                  </span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>Người xử lý:</span>
                  <span className={Styles.text}>{defaultData?.creator}</span>
                </p>
                <p className={Styles.infoItem}>
                  <span className={Styles.label}>SĐT người xử lý:</span>
                  <span className={Styles.text}>{defaultData?.creator_phone}</span>
                </p>
              </Col>
            </Row>
            <p className={Styles.infoItem}>
              <span className={Styles.label}>Kết cấu:</span>
              <span className={Styles.textNote}>{defaultData?.detail?.structure}</span>
            </p>
            <p className={Styles.infoItem}>
              <span className={Styles.label}>Ghi chú:</span>
              <span className={Styles.textNote}>{defaultData?.detail?.note}</span>
            </p>
          </Col>
        </Row>
      </GlobalModalForm>
    );
  },
);

export default RealEstateFormModal;
