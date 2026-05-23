import {
  createSdkworkAppCapabilityManifest,
  type CreateSdkworkAppCapabilityManifestOptions,
  type SdkworkAppCapabilityManifest,
} from "@sdkwork/appbase-pc-react";

export interface SdkworkVipWorkspaceManifest extends SdkworkAppCapabilityManifest {
  capability: "vip";
  routePath: string;
}

export interface CreateVipWorkspaceManifestOptions
  extends Partial<
    Pick<CreateSdkworkAppCapabilityManifestOptions, "description" | "host" | "id" | "packageNames" | "theme" | "title">
  > {
  routePath?: string;
}

export interface SdkworkVipRouteIntent {
  focusWindow: boolean;
  route: string;
  sectionId?: string;
  source: "vip-workspace";
  type: "vip-route-intent";
}

export interface CreateVipRouteIntentOptions {
  basePath?: string;
  focusWindow?: boolean;
  sectionId?: string;
}

export interface SdkworkVipBenefitDigestInput {
  claimed?: boolean;
  id: string;
  name: string;
  usageLimit?: number | null;
  usedCount?: number | null;
}

export interface SdkworkVipBenefitsDigest {
  claimedBenefits: number;
  limitedBenefits: number;
  totalBenefits: number;
  unusedLimitedBenefits: number;
}

export interface SdkworkVipLevelDigestInput {
  id: string;
  isCurrent?: boolean;
  levelValue: number;
  name: string;
  requiredPoints?: number | null;
}

export interface SdkworkVipLevelsDigest {
  currentLevelName?: string;
  currentLevelValue: number | null;
  highestLevelName?: string;
  levelCount: number;
  nextLevelName?: string;
}

function normalizeBasePath(basePath: string | undefined): string {
  const normalized = (basePath ?? "/vip").trim();
  if (!normalized || normalized === "/") {
    return "/vip";
  }

  return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
}

export function summarizeSdkworkVipBenefits(
  benefits: readonly SdkworkVipBenefitDigestInput[],
): SdkworkVipBenefitsDigest {
  return benefits.reduce<SdkworkVipBenefitsDigest>(
    (summary, benefit) => {
      summary.totalBenefits += 1;

      if (benefit.claimed) {
        summary.claimedBenefits += 1;
      }

      if ((benefit.usageLimit ?? null) !== null) {
        summary.limitedBenefits += 1;
        if ((benefit.usedCount ?? 0) <= 0) {
          summary.unusedLimitedBenefits += 1;
        }
      }

      return summary;
    },
    {
      claimedBenefits: 0,
      limitedBenefits: 0,
      totalBenefits: 0,
      unusedLimitedBenefits: 0,
    },
  );
}

export function summarizeSdkworkVipLevels(
  levels: readonly SdkworkVipLevelDigestInput[],
): SdkworkVipLevelsDigest {
  const sortedLevels = [...levels].sort(
    (left, right) => left.levelValue - right.levelValue || left.name.localeCompare(right.name),
  );
  const currentLevel = sortedLevels.find((level) => level.isCurrent);
  const highestLevel = sortedLevels[sortedLevels.length - 1];
  const nextLevel = currentLevel
    ? sortedLevels.find((level) => level.levelValue > currentLevel.levelValue)
    : sortedLevels[0];

  return {
    currentLevelName: currentLevel?.name,
    currentLevelValue: currentLevel?.levelValue ?? null,
    highestLevelName: highestLevel?.name,
    levelCount: sortedLevels.length,
    nextLevelName: nextLevel?.name,
  };
}

export function createVipWorkspaceManifest({
  description = "VIP workspace for membership levels, benefit comparison, and premium upgrade routing.",
  host,
  id = "sdkwork-vip",
  packageNames = ["@sdkwork/vip-pc-react"],
  routePath = "/vip",
  theme,
  title = "VIP",
}: CreateVipWorkspaceManifestOptions = {}): SdkworkVipWorkspaceManifest {
  return {
    ...createSdkworkAppCapabilityManifest({
      description,
      host,
      id,
      packageNames,
      theme,
      title,
    }),
    capability: "vip",
    routePath: normalizeBasePath(routePath),
  };
}

export function createVipRouteIntent(
  options: CreateVipRouteIntentOptions = {},
): SdkworkVipRouteIntent {
  const basePath = normalizeBasePath(options.basePath);
  const queryParams = new URLSearchParams();

  if (options.sectionId) {
    queryParams.set("section", options.sectionId);
  }

  const querySuffix = queryParams.toString() ? `?${queryParams.toString()}` : "";

  return {
    focusWindow: options.focusWindow !== false,
    route: `${basePath}${querySuffix}`,
    ...(options.sectionId ? { sectionId: options.sectionId } : {}),
    source: "vip-workspace",
    type: "vip-route-intent",
  };
}

export const vipPackageMeta = {
  architecture: "pc-react",
  domain: "commerce",
  package: "@sdkwork/vip-pc-react",
  status: "ready",
} as const;

export type VipPackageMeta = typeof vipPackageMeta;
