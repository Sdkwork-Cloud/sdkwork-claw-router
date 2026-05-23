import type { SdkworkCommerceService } from "@sdkwork/commerce-service";
import {
  createSdkworkVipService,
  type SdkworkVipMutationInput,
  type SdkworkVipPlan,
  type SdkworkVipPurchaseResult,
  type SdkworkVipService,
  type SdkworkVipSummary,
} from "@sdkwork/vip-pc-react";
import {
  resolveSdkworkVipPurchaseMode,
  type SdkworkVipPurchaseMode,
} from "./vip-purchase";

export interface SdkworkVipPurchaseSubmitInput extends SdkworkVipMutationInput {
  mode?: SdkworkVipPurchaseMode;
  plan?: Pick<SdkworkVipPlan, "durationDays" | "packageId"> | null;
  summary: Pick<SdkworkVipSummary, "isVip" | "remainingDays">;
}

export interface SdkworkVipPurchaseSubmitResult extends SdkworkVipPurchaseResult {
  mode: SdkworkVipPurchaseMode;
}

export interface CreateSdkworkVipPurchaseServiceOptions {
  commerceService?: SdkworkCommerceService;
  locale?: string | null;
  vipService?: Pick<SdkworkVipService, "purchaseMembership" | "renewMembership" | "upgradeMembership">;
}

export interface SdkworkVipPurchaseService {
  purchasePackage(input: SdkworkVipMutationInput): Promise<SdkworkVipPurchaseSubmitResult>;
  renewPackage(input: SdkworkVipMutationInput): Promise<SdkworkVipPurchaseSubmitResult>;
  submitPackagePurchase(input: SdkworkVipPurchaseSubmitInput): Promise<SdkworkVipPurchaseSubmitResult>;
  upgradePackage(input: SdkworkVipMutationInput): Promise<SdkworkVipPurchaseSubmitResult>;
}

function createVipPurchasePayload(input: SdkworkVipMutationInput): SdkworkVipMutationInput {
  return {
    couponId: input.couponId,
    packageId: input.packageId,
    paymentMethod: input.paymentMethod,
  };
}

async function withMode(
  mode: SdkworkVipPurchaseMode,
  request: Promise<SdkworkVipPurchaseResult>,
): Promise<SdkworkVipPurchaseSubmitResult> {
  return {
    ...(await request),
    mode,
  };
}

export function createSdkworkVipPurchaseService(
  options: CreateSdkworkVipPurchaseServiceOptions = {},
): SdkworkVipPurchaseService {
  const vipService = options.vipService ?? createSdkworkVipService({
    commerceService: options.commerceService,
    locale: options.locale,
  });
  const purchasePackage = (input: SdkworkVipMutationInput) =>
    withMode("purchase", vipService.purchaseMembership(createVipPurchasePayload(input)));
  const renewPackage = (input: SdkworkVipMutationInput) =>
    withMode("renew", vipService.renewMembership(createVipPurchasePayload(input)));
  const upgradePackage = (input: SdkworkVipMutationInput) =>
    withMode("upgrade", vipService.upgradeMembership(createVipPurchasePayload(input)));

  return {
    purchasePackage,

    renewPackage,

    submitPackagePurchase(input) {
      const mode = input.mode ?? resolveSdkworkVipPurchaseMode({
        plan: input.plan,
        summary: input.summary,
      });
      const payload = createVipPurchasePayload(input);

      if (mode === "purchase") {
        return purchasePackage(payload);
      }

      if (mode === "renew") {
        return renewPackage(payload);
      }

      return upgradePackage(payload);
    },

    upgradePackage,
  };
}

export const sdkworkVipPurchaseService = createSdkworkVipPurchaseService();
