import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export type SdkworkVipAdminView = "levels" | "packages" | "memberships" | "entitlements";

export interface SdkworkVipAdminWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "vip-admin";
  routePath: string;
}

export interface CreateSdkworkVipAdminWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkVipAdminRouteIntent {
  focusWindow: boolean;
  route: string;
  source: "vip-admin-workspace";
  type: "vip-admin-route-intent";
  view?: SdkworkVipAdminView;
}

export interface CreateSdkworkVipAdminRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  view?: SdkworkVipAdminView;
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/admin/vip").trim();
  if (!normalized || normalized === "/") {
    return "/admin/vip";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

export function createSdkworkVipAdminWorkspaceManifest({
  description = "Admin VIP management workspace for levels, packages, memberships, and entitlement review.",
  host,
  id = "sdkwork-vip-admin",
  packageNames = ["@sdkwork/vip-admin-pc-react"],
  routePath = "/admin/vip",
  theme,
  title = "VIP Admin",
}: CreateSdkworkVipAdminWorkspaceManifestOptions = {}): SdkworkVipAdminWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames,
      theme,
      title,
    }),
    capability: "vip-admin",
    routePath: normalizeBasePath(routePath),
  };
}

export function createSdkworkVipAdminRouteIntent(
  options: CreateSdkworkVipAdminRouteIntentOptions = {},
): SdkworkVipAdminRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const queryParams = new URLSearchParams();

  if (options.view) {
    queryParams.set("view", options.view);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    route: `${basePath}${querySuffix}`,
    source: "vip-admin-workspace",
    type: "vip-admin-route-intent",
    ...(options.view ? { view: options.view } : {}),
  };
}

export const vipAdminPackageMeta = {
  architecture: "pc-react",
  domain: "commerce",
  package: "@sdkwork/vip-admin-pc-react",
  status: "ready",
} as const;

export type VipAdminPackageMeta = typeof vipAdminPackageMeta;
