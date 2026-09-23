import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Form,
  Input,
  Select,
  Checkbox,
  App as AntApp,
  Steps,
  Typography,
  Row,
  Col,
  Divider,
} from 'antd';
import {
  Button,
  FormSection,
  DataCard,
  LoadingState,
} from '@cachesol/design-system';
import { fetchMockCatalog } from '../api/mock-catalog';
import { submitMockRegistration } from '../api/mock-registration';
import type { PublicMiniApp } from '../types/miniapp-catalog.types';
import type { RegistrationRequest } from '../types/registration.types';

const { Title, Paragraph } = Typography;

const COMPANY_SIZES = [
  { value: 'micro', label: 'Dưới 10 người' },
  { value: 'small', label: '10-50 người' },
  { value: 'medium', label: '51-200 người' },
  { value: 'large', label: '201-1000 người' },
  { value: 'enterprise', label: 'Trên 1000 người' },
];

const COUNTRIES = [
  { value: 'VN', label: 'Việt Nam' },
  { value: 'SG', label: 'Singapore' },
  { value: 'US', label: 'United States' },
];

const CURRENCIES = [
  { value: 'VND', label: 'VND' },
  { value: 'USD', label: 'USD' },
];

export function RegistrationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm<RegistrationRequest>();
  const { message } = AntApp.useApp();
  const [catalog, setCatalog] = useState<PublicMiniApp[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMockCatalog().then((res) => setCatalog(res.items));
    const preselected = searchParams.get('apps');
    if (preselected) {
      form.setFieldValue('subscription', {
        selectedMiniAppIds: preselected.split(','),
        estimatedSeats: 10,
        billingCurrency: 'VND',
      });
    }
  }, [form, searchParams]);

  const onSubmit = async (values: RegistrationRequest) => {
    setSubmitting(true);
    try {
      const result = await submitMockRegistration(values);
      message.success('Đăng ký thành công! Hệ thống đang khởi tạo tenant của bạn.');
      navigate(`/register/success?tenantId=${result.tenantId}&admin=${encodeURIComponent(result.adminUrl)}`, {
        state: result,
      });
    } catch (e) {
      message.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (catalog.length === 0) {
    return <LoadingState shape="page" label="Đang tải..." />;
  }

  return (
    <main className="cs-landing cs-landing-form">
      <div className="cs-landing__container" style={{ maxWidth: 960 }}>
        <Title level={2}>Đăng ký CacheSol</Title>
        <Paragraph type="secondary">
          Khởi tạo tenant của bạn trong vài phút. Không cần thẻ tín dụng.
        </Paragraph>

        <Steps
          current={1}
          items={[
            { title: 'Thông tin', description: 'Công ty & liên hệ' },
            { title: 'Chọn mini-app', description: 'Subscription' },
            { title: 'Xác nhận', description: 'Review & submit' },
          ]}
          style={{ marginBottom: 32 }}
        />

        <DataCard>
          <Form<RegistrationRequest>
            form={form}
            layout="vertical"
            onFinish={onSubmit}
            initialValues={{
              company: { country: 'VN' },
              subscription: { estimatedSeats: 10, billingCurrency: 'VND' },
              consents: { termsAccepted: false, privacyAccepted: false },
            }}
            disabled={submitting}
          >
            <FormSection title="Thông tin công ty" description="Dùng cho hóa đơn và hợp đồng">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['company', 'companyName']}
                    label="Tên công ty"
                    rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
                  >
                    <Input placeholder="Công ty TNHH ABC" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['company', 'taxCode']}
                    label="Mã số thuế"
                    rules={[{ required: true, message: 'Vui lòng nhập MST' }]}
                  >
                    <Input placeholder="0123456789" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['company', 'companySize']}
                    label="Quy mô"
                  >
                    <Select options={COMPANY_SIZES} allowClear placeholder="Chọn quy mô" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['company', 'country']}
                    label="Quốc gia"
                    rules={[{ required: true }]}
                  >
                    <Select options={COUNTRIES} />
                  </Form.Item>
                </Col>
              </Row>
            </FormSection>

            <Divider />

            <FormSection title="Người liên hệ" description="Sẽ là admin tenant đầu tiên">
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['contact', 'fullName']}
                    label="Họ và tên"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Nguyễn Văn A" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['contact', 'jobTitle']}
                    label="Chức danh"
                  >
                    <Input placeholder="CEO / Giám đốc" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['contact', 'email']}
                    label="Email"
                    rules={[
                      { required: true, message: 'Email bắt buộc' },
                      { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                  >
                    <Input placeholder="contact@company.com" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['contact', 'phone']}
                    label="Số điện thoại"
                  >
                    <Input placeholder="+84 901 234 567" />
                  </Form.Item>
                </Col>
              </Row>
            </FormSection>

            <Divider />

            <FormSection title="Mini-app bạn muốn dùng" description="Có thể bật thêm sau">
              <Form.Item
                name={['subscription', 'selectedMiniAppIds']}
                label="Chọn mini-app"
                rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 mini-app' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn mini-app..."
                  options={catalog.map((a) => ({ value: a.id, label: a.name }))}
                />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['subscription', 'estimatedSeats']}
                    label="Số lượng người dùng ước tính"
                    rules={[{ required: true }]}
                  >
                    <Input type="number" min={1} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name={['subscription', 'billingCurrency']}
                    label="Tiền tệ thanh toán"
                    rules={[{ required: true }]}
                  >
                    <Select options={CURRENCIES} />
                  </Form.Item>
                </Col>
              </Row>
            </FormSection>

            <Divider />

            <Form.Item
              name={['consents', 'termsAccepted']}
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('Bạn cần đồng ý Điều khoản sử dụng')),
                },
              ]}
            >
              <Checkbox>
                Tôi đồng ý với <a href="/terms" target="_blank">Điều khoản sử dụng</a> và{' '}
                <a href="/privacy" target="_blank">Chính sách bảo mật</a>
              </Checkbox>
            </Form.Item>

            <Form.Item
              name={['consents', 'marketingOptIn']}
              valuePropName="checked"
            >
              <Checkbox>Gửi email cho tôi về cập nhật sản phẩm và tip sử dụng</Checkbox>
            </Form.Item>

            <Form.Item style={{ marginTop: 24 }}>
              <Row justify="end" gutter={8}>
                <Col>
                  <Link to="/">
                    <Button variant="tertiary">Hủy</Button>
                  </Link>
                </Col>
                <Col>
                  <Button variant="primary" htmlType="submit" loading={submitting}>
                    Tạo tenant
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </DataCard>
      </div>
    </main>
  );
}

export default RegistrationPage;
