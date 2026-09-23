import { useEffect, useState } from 'react';
import { Card, Form, Input, Switch, Select, App } from 'antd';
import { PageHeader, FormSection, Button, LoadingState } from '@cachesol/design-system';
import { fetchMockSettings } from '../../api/mock-data';
import type { RegistrySettings } from '../../types/admin.types';

export function SettingsPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<RegistrySettings>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<RegistrySettings | null>(null);

  useEffect(() => {
    fetchMockSettings().then((s) => {
      form.setFieldsValue(s);
      setSettings(s);
      setLoading(false);
    });
  }, [form]);

  const onSave = async (values: RegistrySettings) => {
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setSettings(values);
      message.success('Settings saved (mock).');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) return <LoadingState shape="page" />;

  return (
    <>
      <PageHeader
        title="Settings"
        description="Cấu hình chung cho Platform Registry"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
      />

      <Card>
        <Form<RegistrySettings> form={form} layout="vertical" onFinish={onSave}>
          <FormSection title="General" description="Thông tin liên hệ và support">
            <Form.Item<RegistrySettings> name="supportEmail" label="Support email" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item<RegistrySettings> name="defaultPlan" label="Default plan khi đăng ký mới">
              <Select
                options={[
                  { value: 'trial', label: 'Trial (14 ngày)' },
                  { value: 'starter', label: 'Starter' },
                  { value: 'business', label: 'Business' },
                ]}
              />
            </Form.Item>
            <Form.Item<RegistrySettings> name="registrationEnabled" label="Cho phép đăng ký công khai" valuePropName="checked">
              <Switch />
            </Form.Item>
          </FormSection>

          <FormSection title="Email" description="Sender cho email transactional">
            <Form.Item<RegistrySettings> name="emailFromAddress" label="From address" rules={[{ required: true, type: 'email' }]}>
              <Input />
            </Form.Item>
            <Form.Item<RegistrySettings> name="emailFromName" label="From name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </FormSection>

          <FormSection title="Links">
            <Form.Item<RegistrySettings> name="docsUrl" label="Docs URL">
              <Input placeholder="https://docs.cachesol.io" />
            </Form.Item>
            <Form.Item<RegistrySettings> name="statusPageUrl" label="Status page URL">
              <Input placeholder="https://status.cachesol.io" />
            </Form.Item>
          </FormSection>

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Button htmlType="submit" variant="primary" loading={saving}>
              Save settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default SettingsPage;
