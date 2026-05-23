import type { CommerceDeploymentMode, CommerceEnvironment } from "@sdkwork/commerce-contracts";
import { createSdkworkCommerceService, type SdkworkCommerceService } from "@sdkwork/commerce-service";
import {
  assertCommerceAppSdkClient,
  assertCommerceBackendSdkClient,
  type CommerceAppSdkClient,
  type CommerceBackendSdkClient,
} from "@sdkwork/commerce-sdk-ports";
import { createSdkworkRuntimeBootstrap } from "@sdkwork/runtime-bootstrap";

export interface CommerceRuntimeConfig {
  appApiBaseUrl?: string;
  appId: string;
  backendApiBaseUrl?: string;
  deploymentMode: CommerceDeploymentMode;
  environment: CommerceEnvironment;
}

export interface CommerceFeatureFlagStore {
  isEnabled(name: string): boolean;
}

export interface MutableCommerceFeatureFlagStore extends CommerceFeatureFlagStore {
  set(name: string, enabled: boolean): void;
}

export interface CommerceRuntime {
  config: CommerceRuntimeConfig;
  featureFlagStore: CommerceFeatureFlagStore;
  service: SdkworkCommerceService;
}

export interface CreateCommerceRuntimeInput {
  clients: {
    app: CommerceAppSdkClient;
    backend?: CommerceBackendSdkClient;
  };
  config: CommerceRuntimeConfig;
  featureFlagStore?: CommerceFeatureFlagStore;
}

const DEFAULT_COMMERCE_FEATURE_FLAGS = {
  "commerce.admin": true,
  "commerce.audit": true,
  "commerce.cart": true,
  "commerce.catalog": true,
  "commerce.checkout": true,
  "commerce.coupons": true,
  "commerce.fulfillments": true,
  "commerce.inventory": true,
  "commerce.invoices": true,
  "commerce.memberships": true,
  "commerce.orders": true,
  "commerce.payments": true,
  "commerce.recharges": true,
  "commerce.refunds": true,
  "commerce.reports": true,
  "commerce.shipments": true,
  "commerce.wallet": true,
} as const;

export function createCommerceRuntime(input: CreateCommerceRuntimeInput): CommerceRuntime {
  const bootstrap = createSdkworkRuntimeBootstrap({
    clients: input.clients,
    config: input.config,
    validateAppClient: assertCommerceAppSdkClient,
    validateBackendClient: assertCommerceBackendSdkClient,
  });

  return {
    config: { ...bootstrap.config },
    featureFlagStore: input.featureFlagStore ?? createMemoryCommerceFeatureFlagStore(DEFAULT_COMMERCE_FEATURE_FLAGS),
    service: createSdkworkCommerceService({
      appClient: bootstrap.clients.app,
      backendClient: bootstrap.clients.backend,
    }),
  };
}

export function createMemoryCommerceFeatureFlagStore(
  initial: Record<string, boolean> = {},
): MutableCommerceFeatureFlagStore {
  const flags = { ...initial };

  return {
    isEnabled: (name) => Boolean(flags[name]),
    set: (name, enabled) => {
      flags[name] = enabled;
    },
  };
}

export type { CommerceAppSdkClient, CommerceBackendSdkClient, SdkworkCommerceService };
