/**
 * Registration request/response types.
 * Aligned với backend POST /v1/tenants/register trên Platform Registry.
 */

export interface RegistrationCompanyInfo {
  companyName: string;
  taxCode: string;
  industry?: string;
  companySize?: 'micro' | 'small' | 'medium' | 'large' | 'enterprise';
  website?: string;
  country: string; // ISO 3166-1 alpha-2
  province?: string;
  addressLine?: string;
}

export interface RegistrationContactInfo {
  fullName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
}

export interface RegistrationSubscriptionInfo {
  /** Slugs/IDs of mini-apps the customer wants to enable. */
  selectedMiniAppIds: string[];
  /** Number of expected seats (used for billing). */
  estimatedSeats: number;
  /** Currency that the customer prefers to be billed in. */
  billingCurrency: string;
}

export interface RegistrationRequest {
  company: RegistrationCompanyInfo;
  contact: RegistrationContactInfo;
  subscription: RegistrationSubscriptionInfo;
  /** Free-form consent flags. */
  consents: {
    termsAccepted: boolean;
    privacyAccepted: boolean;
    marketingOptIn?: boolean;
  };
  /** Optional referrer / promo code. */
  referrer?: string;
}

export interface RegistrationResponse {
  /** Tenant ID assigned by Platform Registry. */
  tenantId: string;
  /** Slug for the tenant subdomain. */
  tenantSlug: string;
  /** Admin URL to log in. */
  adminUrl: string;
  /** Masked contact email. */
  contactEmail: string;
  /** Estimated provisioning timeline. */
  provisioningEta: string;
}
