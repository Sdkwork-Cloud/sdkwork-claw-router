import type { AppModelCatalogPriceAvailability } from './app-model-catalog-price-availability';
import type { AppModelCatalogReferencePrice } from './app-model-catalog-reference-price';

export interface AppModelCatalogItem {
  apiFormat: string | null;
  capabilities: string[];
  capabilityIntro: string | null;
  catalogKey: string;
  categories: ('Recommended' | 'Open Source' | 'Proprietary' | 'Free' | 'New')[];
  contextTokens: number | null;
  description: string | null;
  displayName: string;
  groups: ('default' | 'vip' | 'enterprise' | 'beta')[];
  inputModalities: string[];
  limitations: string[];
  maxOutputTokens: number | null;
  modalities: string[];
  model: string;
  officialReferenceCurrency?: string | null;
  /** Complete public official reference prices keyed by billing meter. Customer, upstream, provider, and channel prices are never exposed here. */
  officialReferencePrices: AppModelCatalogReferencePrice[];
  officialReferenceUnitPrice?: string | null;
  outputModalities: string[];
  priceAvailability: AppModelCatalogPriceAvailability;
  providerCodes: string[];
  regionCode: string;
  releaseStage: number | null;
  replacementModel: string | null;
  routingState: number | null;
  shelfState: number | null;
  supportedLanguages: string[];
  supportsJsonSchema: boolean;
  supportsStreaming: boolean;
  supportsTools: boolean;
  trainingDataCutoff: string | null;
  useCases: string[];
  vendor: string;
  vendorCode: string;
}
