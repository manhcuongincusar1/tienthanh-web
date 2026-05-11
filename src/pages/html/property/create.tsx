import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormDigit,
  ProFormField,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { Alert, AutoComplete, Col, Input, Modal, Row } from 'antd';
// import { tagRender } from '../customer/sell';
const warningPopup = () => {
  Modal.confirm({
    width: 500,
    icon: (
      <svg
        className="icon"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.038 3.04412C14.637 2.70685 15.3129 2.52966 16.0004 2.52966C16.6878 2.52966 17.3637 2.70685 17.9627 3.04412C18.5618 3.38139 19.0638 3.86736 19.4204 4.45515L19.4242 4.46148L30.7175 23.3148L30.7283 23.3332C31.0776 23.9381 31.2624 24.6238 31.2644 25.3223C31.2663 26.0207 31.0854 26.7075 30.7395 27.3143C30.3936 27.9211 29.8949 28.4267 29.2929 28.7809C28.691 29.1351 28.0067 29.3256 27.3083 29.3332L27.2937 29.3334L4.69236 29.3333C3.99396 29.3256 3.30974 29.1351 2.70778 28.7809C2.10582 28.4267 1.60709 27.9211 1.26122 27.3143C0.915348 26.7075 0.734388 26.0207 0.736344 25.3223C0.738299 24.6238 0.923103 23.9381 1.27237 23.3332L1.2832 23.3148L12.5803 4.45514C12.9369 3.86735 13.4389 3.38139 14.038 3.04412ZM16.0004 5.19633C15.7712 5.19633 15.5459 5.25539 15.3462 5.36782C15.1474 5.47973 14.9807 5.64077 14.862 5.83551L3.57727 24.6744C3.4637 24.8742 3.40364 25.0999 3.403 25.3297C3.40235 25.5626 3.46267 25.7915 3.57796 25.9938C3.69325 26.196 3.85949 26.3646 4.06015 26.4826C4.25904 26.5997 4.48488 26.6631 4.71555 26.6667H27.2852C27.5158 26.6631 27.7417 26.5997 27.9406 26.4826C28.1412 26.3646 28.3075 26.196 28.4227 25.9938C28.538 25.7915 28.5984 25.5626 28.5977 25.3297C28.5971 25.0999 28.537 24.8742 28.4235 24.6745L17.1404 5.83816C17.1398 5.83727 17.1393 5.83639 17.1387 5.83551C17.02 5.64077 16.8533 5.47973 16.6545 5.36782C16.4548 5.25539 16.2295 5.19633 16.0004 5.19633ZM16.0004 10.6667C16.7367 10.6667 17.3337 11.2636 17.3337 12V17.3333C17.3337 18.0697 16.7367 18.6667 16.0004 18.6667C15.264 18.6667 14.667 18.0697 14.667 17.3333V12C14.667 11.2636 15.264 10.6667 16.0004 10.6667ZM14.667 22.6667C14.667 21.9303 15.264 21.3333 16.0004 21.3333H16.0137C16.7501 21.3333 17.347 21.9303 17.347 22.6667C17.347 23.403 16.7501 24 16.0137 24H16.0004C15.264 24 14.667 23.403 14.667 22.6667Z"
          fill="#FAAD14"
        />
      </svg>
    ),
    okText: 'Tiếp tục',
    cancelText: 'Nhập lại',
    title: <span className="ant-modal-warning-title">Thông tin BĐS này đã có trong hệ thống!</span>,
    content: (
      <span>
        Bạn có muốn tiếp tục tạo mới BĐS? <br />
        BĐS chỉ được lưu vào BĐS của tôi.
      </span>
    ),
    onOk() {},
  });
};
function PropertySellCreate() {
  const statusOptions = [
    {
      value: 0,
      label: 'Đang bán',
    },
    {
      value: 1,
      label: 'Đã bán',
    },
    {
      value: 2,
      label: 'Tạm ngưng',
    },
  ];
  return (
    <PageContainer>
      <ProCard title="Thông tin BĐS bán" direction="column" headerBordered>
        <Alert
          message="BĐS đã có trong hệ thống và chỉ được lưu vào BĐS của tôi."
          type="warning"
          showIcon
          className="mb-4"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3ZM1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM12 7C12.5523 7 13 7.44772 13 8V12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12V8C11 7.44772 11.4477 7 12 7ZM11 16C11 15.4477 11.4477 15 12 15H12.01C12.5623 15 13.01 15.4477 13.01 16C13.01 16.5523 12.5623 17 12.01 17H12C11.4477 17 11 16.5523 11 16Z"
                fill="#FAAD14"
              />
            </svg>
          }
        />
        <ProForm
          submitter={{
            searchConfig: {
              resetText: 'Hủy',
              submitText: 'Lưu',
            },

            render(props, dom) {
              return <div className="form-footer">{dom}</div>;
            },
          }}
        >
          <Row gutter={{ xs: 12, sm: 12, md: 24 }}>
            <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
              <ProFormText
                label="Ngày tạo"
                name="created_at"
                fieldProps={{
                  value: '26/06/2022',
                }}
                disabled
              />
            </Col>
            <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
              <ProFormText
                label="ID"
                name="id"
                fieldProps={{
                  value: '000003',
                }}
                disabled
              />
            </Col>
            <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
              <ProFormSelect
                label="Tình trạng BĐS"
                name="status"
                mode="multiple"
                options={statusOptions}
                fieldProps={{
                  showArrow: true,
                  maxTagCount: 'responsive',
                  // tagRender: (props) => tagRender(props),
                }}
                placeholder="Chọn"
                rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}
              />
            </Col>
            <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
              <ProFormSelect
                label="Danh mục BĐS"
                name="property_category"
                placeholder="Chọn"
                options={[
                  {
                    value: '0',
                    label: 'Tình trạng 1',
                  },
                  {
                    value: '1',
                    label: 'Tình trạng 2',
                  },
                ]}
                rules={[{ required: true, message: 'Vui lòng chọn Danh mục BĐS' }]}
              />
            </Col>
            <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
              <ProFormSelect
                label="Thành phố"
                name="province"
                placeholder="Chọn"
                options={[
                  {
                    value: 1,
                    label: 'Tp Hồ Chí Minh',
                  },
                ]}
                rules={[{ required: true, message: 'Vui lòng chọn Thành phố' }]}
              />
            </Col>
            <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
              <ProFormSelect
                label="Quận/Huyện"
                name="district"
                placeholder="Chọn"
                options={[
                  {
                    value: 1,
                    label: 'Gò Vấp',
                  },
                ]}
                rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện' }]}
              />
            </Col>
            <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
              <ProFormSelect
                label="Phường/Xã"
                name="ward"
                placeholder="Chọn"
                options={[
                  {
                    value: 1,
                    label: 'Phường 1',
                  },
                ]}
                rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã' }]}
              />
            </Col>
            <Col span={24} lg={{ span: 12 }} xl={{ span: 6 }}>
              <ProFormText
                label="Đường"
                name="street"
                placeholder="Nhập"
                rules={[{ required: true, message: 'Vui lòng nhập Đường' }]}
              />
            </Col>
            <Col span={24}>
              <ProFormText
                label="Địa chỉ"
                name="address"
                placeholder="Nhập địa chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
              />
            </Col>
            <Col span={24} lg={{ span: 10 }} xl={{ span: 6 }}>
              <ProFormField
                label="Số điện thoại người bán"
                name="sale_phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại người bán' }]}
              >
                <AutoComplete
                  key="AutoComplete"
                  options={[
                    { value: '0987654321', text: '0987654321' },
                    { value: '0987123123', text: '0987123123' },
                  ]}
                  placeholder=""
                >
                  <Input
                    placeholder="Tìm SĐT"
                    allowClear
                    suffix={
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6.33594 1.66732C3.75861 1.66732 1.66927 3.75666 1.66927 6.33398C1.66927 8.91131 3.75861 11.0007 6.33594 11.0007C7.59323 11.0007 8.7344 10.5034 9.57353 9.69491C9.59108 9.67209 9.6103 9.65015 9.6312 9.62925C9.6521 9.60835 9.67404 9.58912 9.69686 9.57158C10.5054 8.73245 11.0026 7.59128 11.0026 6.33398C11.0026 3.75666 8.91327 1.66732 6.33594 1.66732ZM11.0239 10.0791C11.845 9.05266 12.3359 7.75066 12.3359 6.33398C12.3359 3.02028 9.64964 0.333984 6.33594 0.333984C3.02223 0.333984 0.335938 3.02028 0.335938 6.33398C0.335938 9.64769 3.02223 12.334 6.33594 12.334C7.75261 12.334 9.05461 11.843 10.0811 11.0219L12.5312 13.4721C12.7915 13.7324 13.2137 13.7324 13.474 13.4721C13.7344 13.2117 13.7344 12.7896 13.474 12.5292L11.0239 10.0791Z"
                          fill="rgb(29, 30, 32)"
                        />
                      </svg>
                    }
                  />
                </AutoComplete>
              </ProFormField>
            </Col>
            <Col span={24} lg={{ span: 10 }} xl={{ span: 12 }}>
              <ProFormText
                label="Tên người bán"
                name="sale_name"
                placeholder="Tên"
                rules={[{ required: true, message: 'Vui lòng nhập Tên người bán' }]}
              />
            </Col>
            <Col span={24} lg={{ span: 4 }} xl={{ span: 6 }}>
              <ProFormSwitch name="switch" label="Thiện chí" />
            </Col>
            <Col span={24} lg={{ span: 10 }} xl={{ span: 6 }}>
              <ProFormText label="Số điện thoại chủ nhà" name="owner_phone" placeholder="Tìm sđt" />
            </Col>
            <Col span={24} lg={{ span: 10 }} xl={{ span: 12 }}>
              <ProFormText label="Tên chủ nhà" name="owner_name" placeholder="Tên" />
            </Col>
            <Col span={24} lg={{ span: 10 }} xl={{ span: 12 }}>
              <ProFormDigit
                label="Giá (tỷ VND)"
                name="price"
                placeholder="Nhập giá"
                rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
              />
            </Col>
            <Col span={12} lg={{ span: 10 }} xl={{ span: 9 }} xxl={{ span: 10 }}>
              <ProFormDigit
                label="Phí môi giới"
                name="benefit"
                placeholder="Nhập Phí môi giới"
                rules={[{ required: true, message: 'Vui lòng nhập Phí môi giới' }]}
                fieldProps={{
                  prefix: '%',
                }}
              />
            </Col>
            <Col span={12} lg={{ span: 4 }} xl={{ span: 3 }} xxl={{ span: 2 }}>
              <ProFormSwitch name="switch" label="Hợp tác" />
            </Col>
            <Col span={24} lg={{ span: 8 }} xl={{ span: 6 }}>
              <ProFormText label="Hướng" name="location" placeholder="Nhập hướng" />
            </Col>
            <Col span={12} lg={{ span: 8 }} xl={{ span: 3 }}>
              <ProFormDigit
                label="Ngang (m)"
                name="width"
                placeholder="0"
                rules={[{ required: true, message: 'Vui lòng nhập Chiều ngang' }]}
              />
            </Col>
            <Col span={12} lg={{ span: 8 }} xl={{ span: 3 }}>
              <ProFormDigit
                label="Dài (m)"
                name="length"
                placeholder="0"
                rules={[{ required: true, message: 'Vui lòng nhập Chiều dài' }]}
              />
            </Col>
            <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
              <ProFormDigit label="Diện tích (m2)" name="area" placeholder="0" />
            </Col>
            <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
              <ProFormDigit
                label="Diện tích công nhận (m2)"
                name="real_area"
                placeholder="0"
                rules={[{ required: true, message: 'Vui lòng nhập Diện tích công nhận' }]}
              />
            </Col>
            <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
              <ProFormDigit label="Phòng ngủ" name="bedroom" placeholder="0" />
            </Col>
            <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
              <ProFormDigit label="Số WC" name="bathroom" placeholder="0" />
            </Col>
            <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
              <ProFormSelect
                label="Vị trí"
                name="stand"
                placeholder="Chọn"
                options={[
                  {
                    value: 1,
                    label: 'Mặt tiền',
                  },
                ]}
                rules={[{ required: true, message: 'Vui lòng chọn Vị trí' }]}
              />
            </Col>
            <Col span={12} lg={{ span: 8 }} xl={{ span: 6 }}>
              <ProFormSwitch label="Tình trạng sổ hồng" />
            </Col>
            <Col span={24} lg={{ span: 12 }}>
              <ProFormTextArea
                name="structure"
                label="Kết cấu"
                placeholder="Nhập văn bản"
                rules={[{ required: true, message: 'Vui lòng nhập Kết cấu' }]}
              />
            </Col>
            <Col span={24} lg={{ span: 12 }}>
              <ProFormTextArea
                name="note"
                label="Ghi chú"
                placeholder="Nhập văn bản"
                rules={[{ required: true, message: 'Vui lòng nhập Kết cấu' }]}
              />
            </Col>
          </Row>
          <span className="section-space-top" />
          <h3 className="section-title">Hình ảnh BĐS bán</h3>
          <ProFormUploadButton
            name="upload"
            label=""
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
            }}
            icon={
              <svg
                className="d-block mx-auto"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 4C12.5523 4 13 4.44772 13 5V11H19C19.5523 11 20 11.4477 20 12C20 12.5523 19.5523 13 19 13H13V19C13 19.5523 12.5523 20 12 20C11.4477 20 11 19.5523 11 19V13H5C4.44772 13 4 12.5523 4 12C4 11.4477 4.44772 11 5 11H11V5C11 4.44772 11.4477 4 12 4Z"
                  fill="black"
                />
              </svg>
            }
            title="Upload"
            action="/"
          />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
}

export default PropertySellCreate;
