import { Card, Form, Input, Switch, Select, App } from 'antd';
import { PageHeader, FormSection, Button } from '@cachesol/design-system';

interface TenantSettings {
  general: {
    companyName: string;
    locale: string;
    timezone: string;
    dateFormat: string;
  };
  keycloak: {
    realm: string;
    syncEnabled: boolean;
    autoSyncIntervalMin: number;
  };
  notifications: {
    emailOnEmployeeCreate: boolean;
    emailOnProvisioningFailure: boolean;
  };
}

export function SettingsPage() {
  const { message } = App.useApp();
  const [form] = Form.useForm<TenantSettings>();

  const initial: TenantSettings = {
    general: {
      companyName: 'ACME Corp',
      locale: 'vi-VN',
      timezone: 'Asia/Ho_Chi_Minh',
      dateFormat: 'DD/MM/YYYY',
    },
    keycloak: { realm: 'acme', syncEnabled: true, autoSyncIntervalMin: 30 },
    notifications: { emailOnEmployeeCreate: false, emailOnProvisioningFailure: true },
  };

  const onSave = async (v: TenantSettings) => {
    await new Promise((r) => setTimeout(r, 500));
    message.success('Settings saved (mock).');
    void v;
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Cấu hình tenant"
        breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
      />

      <Card>
        <Form<TenantSettings> form={form} layout="vertical" onFinish={onSave} initialValues={initial}>
          <FormSection title="General">
            <Form.Item<TenantSettings> name={['general', 'companyName']} label="Company display name">
              <Input />
            </Form.Item>
            <Form.Item<TenantSettings> name={['general', 'locale']} label="Locale">
              <Select
                options={[
                  { value: 'vi-VN', label: 'vi-VN' },
                  { value: 'en-US', label: 'en-US' },
                  { value: 'en-GB', label: 'en-GB' },
                ]}
              />
            </Form.Item>
            <Form.Item<TenantSettings> name={['general', 'timezone']} label="Timezone">
              <Select
                options={[
                  { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh (UTC+7)' },
                  { value: 'Asia/Singapore', label: 'Asia/Singapore (UTC+8)' },
                  { value: 'UTC', label: 'UTC' },
                ]}
              />
            </Form.Item>
          </FormSection>

          <FormSection title="Keycloak">
            <Form.Item<TenantSettings> name={['keycloak', 'realm']} label="Realm">
              <Input addonBefore="/" disabled />
            </Form.Item>
            <Form.Item<TenantSettings> name={['keycloak', 'syncEnabled']} label="Auto sync" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item<TenantSettings> name={['keycloak', 'autoSyncIntervalMin']} label="Auto sync interval (phút)">
              <Input type="number" min={5} max={1440} />
            </Form.Item>
          </FormSection>

          <FormSection title="Email notifications">
            <Form.Item<TenantSettings> name={['notifications', 'emailOnEmployeeCreate']} label="Gửi email khi tạo employee mới" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item<TenantSettings> name={['notifications', 'emailOnProvisioningFailure']} label="Gửi email khi provisioning thất bại" valuePropName="checked">
              <Switch />
            </Form.Item>
          </FormSection>

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
}

export default SettingsPage;
