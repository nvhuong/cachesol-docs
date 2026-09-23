/**
 * Local mock implementation for POST /v1/tenants/register.
 * Replace with real fetch khi Platform Registry ready.
 */
import type {
  RegistrationRequest,
  RegistrationResponse,
} from '../types/registration.types';

const COUNTRY_TO_TLD: Record<string, string> = {
  VN: 'vn',
  SG: 'sg',
  US: 'us',
};

export function submitMockRegistration(
  payload: RegistrationRequest,
): Promise<RegistrationResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!payload.consents.termsAccepted || !payload.consents.privacyAccepted) {
        reject(new Error('You must accept Terms and Privacy Policy.'));
        return;
      }
      if (!payload.contact.email.includes('@')) {
        reject(new Error('Invalid contact email.'));
        return;
      }
      const slug = payload.company.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 32);

      const tenantId = `tnt_${Date.now().toString(36)}`;
      const tld = COUNTRY_TO_TLD[payload.company.country] ?? 'com';

      resolve({
        tenantId,
        tenantSlug: slug,
        adminUrl: `https://${slug}.${tld}.cachesol.io/admin`,
        contactEmail: payload.contact.email,
        provisioningEta: '5-10 phút',
      });
    }, 1200);
  });
}
