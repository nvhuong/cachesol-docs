/**
 * Admin-facing types — audit, providers, settings.
 */
export type AuditCategory =
  | 'tenant.create'
  | 'tenant.update'
  | 'tenant.delete'
  | 'tenant.suspend'
  | 'mini-app.publish'
  | 'mini-app.unpublish'
  | 'provider.update'
  | 'settings.update'
  | 'auth.login'
  | 'auth.logout';

export interface AuditEntry {
  id: string;
  actor: { id: string; email: string; name?: string };
  category: AuditCategory;
  subject: { type: 'tenant' | 'mini-app' | 'provider' | 'settings'; id: string; label: string };
  description: string;
  diff?: Record<string, { before: unknown; after: unknown }>;
  ip: string;
  userAgent: string;
  timestamp: string;
}

export type ProviderKind = 'keycloak' | 'stripe' | 'sendgrid' | 'vnpay' | 'momo' | 'webhook';

export interface ProviderConfig {
  id: string;
  kind: ProviderKind;
  name: string;
  enabled: boolean;
  baseUrl?: string;
  hasSecrets: boolean; // true nếu đã có secret thật trong vault
  meta?: Record<string, string>;
  updatedAt: string;
}

export interface RegistrySettings {
  supportEmail: string;
  defaultPlan: SubscriptionPlan;
  registrationEnabled: boolean;
  emailFromAddress: string;
  emailFromName: string;
  smtpConfigured: boolean;
  docsUrl?: string;
  statusPageUrl?: string;
}
