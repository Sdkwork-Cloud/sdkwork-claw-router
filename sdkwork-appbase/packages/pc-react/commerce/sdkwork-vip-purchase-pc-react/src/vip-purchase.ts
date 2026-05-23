import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";
import type { SdkworkVipPlan, SdkworkVipSummary } from "@sdkwork/vip-pc-react";

export interface SdkworkVipPurchaseWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "vip-purchase";
  routePath: string;
}

export interface CreateVipPurchaseWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export type SdkworkVipPurchaseMode = "purchase" | "renew" | "upgrade";

export interface SdkworkVipPurchaseRouteIntent {
  focusWindow: boolean;
  mode?: SdkworkVipPurchaseMode;
  packageId?: number;
  route: string;
  source: "vip-purchase-workspace";
  type: "vip-purchase-route-intent";
}

export interface CreateVipPurchaseRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  mode?: SdkworkVipPurchaseMode;
  packageId?: number;
}

export interface ResolveVipPurchaseActionOptions {
  plan?: Pick<SdkworkVipPlan, "durationDays" | "packageId"> | null;
  summary: Pick<SdkworkVipSummary, "isVip" | "remainingDays">;
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/vip/purchase").trim();
  if (!normalized || normalized === "/") {
    return "/vip/purchase";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

export function resolveSdkworkVipPurchaseMode({
  plan,
  summary,
}: ResolveVipPurchaseActionOptions): SdkworkVipPurchaseMode {
  if (!summary.isVip) {
    return "purchase";
  }

  const remainingDays = summary.remainingDays ?? Number.POSITIVE_INFINITY;
  const durationDays = plan?.durationDays ?? 0;

  return remainingDays <= Math.max(30, Math.ceil(durationDays * 0.2)) ? "renew" : "upgrade";
}

export function createVipPurchaseWorkspaceManifest({
  description = "VIP purchase workspace for top-header package purchase, renewal, and upgrade entry points.",
  host,
  id = "sdkwork-vip-purchase",
  packageNames = ["@sdkwork/vip-purchase-pc-react", "@sdkwork/vip-pc-react"],
  routePath = "/vip/purchase",
  theme,
  title = "VIP Purchase",
}: CreateVipPurchaseWorkspaceManifestOptions = {}): SdkworkVipPurchaseWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames,
      theme,
      title,
    }),
    capability: "vip-purchase",
    routePath: normalizeBasePath(routePath),
  };
}

export function createVipPurchaseRouteIntent(
  options: CreateVipPurchaseRouteIntentOptions = {},
): SdkworkVipPurchaseRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const queryParams = new URLSearchParams();

  if (options.mode) {
    queryParams.set("mode", options.mode);
  }

  if (typeof options.packageId === "number" && Number.isFinite(options.packageId)) {
    queryParams.set("packageId", String(options.packageId));
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    ...(options.mode ? { mode: options.mode } : {}),
    ...(typeof options.packageId === "number" && Number.isFinite(options.packageId)
      ? { packageId: options.packageId }
      : {}),
    route: `${basePath}${querySuffix}`,
    source: "vip-purchase-workspace",
    type: "vip-purchase-route-intent",
  };
}

export const vipPurchasePackageMeta = {
  architecture: "pc-react",
  domain: "commerce",
  package: "@sdkwork/vip-purchase-pc-react",
  status: "ready",
} as const;

export type VipPurchasePackageMeta = typeof vipPurchasePackageMeta;
