/**
 * Public catalog of mini-apps available on CacheSol Platform.
 * Source of truth: Platform Registry's public endpoint `GET /v1/public/mini-apps`.
 */
export type MiniAppCategory =
  | 'hr'
  | 'sales'
  | 'finance'
  | 'operations'
  | 'analytics'
  | 'productivity';

export type PricingModel = 'free' | 'per-user' | 'flat-rate' | 'custom';

export interface PublicMiniApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  iconUrl?: string;
  category: MiniAppCategory;
  pricing: PricingModel;
  /** Min seats for which pricing applies; null = unlimited. */
  minSeats?: number | null;
  /** Currency in which pricing is expressed (ISO 4217). */
  currency?: string;
  /** Per-month price in major units, when `pricing === 'per-user' | 'flat-rate'`. */
  pricePerMonth?: number;
  features: string[];
  screenshots?: string[];
  publisherName: string;
  /** ISO date when first published. */
  publishedAt: string;
  /** Endpoint on tenant-manager where the app is provisioned. */
  installEndpoint?: string;
}

export interface MiniAppCatalogResponse {
  total: number;
  items: PublicMiniApp[];
}
