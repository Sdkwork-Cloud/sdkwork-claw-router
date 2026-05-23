import {
  getSdkworkCommerceService,
  hasSdkworkCommerceSession,
  requireSdkworkCommerceSession,
  toNullableSdkworkCommerceNumber,
  toSdkworkCommerceMutationStatus,
  toSdkworkCommerceNumber,
  toSdkworkCommerceOptionalString,
  unwrapSdkworkCommerceResponse,
  type SdkworkCommerceService,
} from "@sdkwork/commerce-service";
import {
  createSdkworkVipMessages,
  type SdkworkVipMessages,
  type SdkworkVipMessagesOverrides,
} from "./vip-copy";

export interface SdkworkVipBenefit {
  benefitKey?: string;
  claimed: boolean;
  description?: string;
  id: string;
  name: string;
  type?: string;
  usageLimit: number | null;
  usedCount: number | null;
}

export interface SdkworkVipLevel {
  badge?: string;
  description?: string;
  icon?: string;
  id: string;
  isCurrent: boolean;
  levelValue: number;
  name: string;
  requiredPoints: number | null;
}

export interface SdkworkVipPlan {
  description?: string;
  durationDays: number | null;
  id: string;
  includedPoints: number;
  levelName?: string;
  name: string;
  originalPriceCny: number | null;
  packageId: number;
  priceCny: number;
  recommended: boolean;
  tags: string[];
}

export interface SdkworkVipSummary {
  currentLevelName: string;
  currentLevelValue: number | null;
  expireTime?: string;
  growthValue: number | null;
  isAuthenticated: boolean;
  isVip: boolean;
  pointBalance: number | null;
  remainingDays: number | null;
  status: "free" | "guest" | "vip";
  totalSpent: number | null;
  upgradeGrowthValue: number | null;
  vipPoints: number | null;
}

export interface SdkworkVipDashboardData {
  benefits: SdkworkVipBenefit[];
  levels: SdkworkVipLevel[];
  plans: SdkworkVipPlan[];
  summary: SdkworkVipSummary;
}

export interface SdkworkVipMutationInput {
  couponId?: string;
  packageId: number;
  paymentMethod?: string;
}

export interface SdkworkVipPurchaseResult {
  amountCny: number | null;
  durationDays: number | null;
  orderId?: string;
  packageId: number | null;
  packageName?: string;
  status: "completed" | "failed" | "pending";
  targetLevelName?: string;
}

export interface CreateSdkworkVipServiceOptions {
  commerceService?: SdkworkCommerceService;
  locale?: string | null;
  messages?: SdkworkVipMessagesOverrides;
}

export interface SdkworkVipService {
  getDashboard(): Promise<SdkworkVipDashboardData>;
  getEmptyDashboard(): SdkworkVipDashboardData;
  purchaseMembership(input: SdkworkVipMutationInput): Promise<SdkworkVipPurchaseResult>;
  renewMembership(input: SdkworkVipMutationInput): Promise<SdkworkVipPurchaseResult>;
  upgradeMembership(input: SdkworkVipMutationInput): Promise<SdkworkVipPurchaseResult>;
}

interface RemoteVipBenefit {
  benefitKey?: string;
  claimed?: boolean;
  description?: string;
  id?: number | string;
  name?: string;
  type?: string;
  usageLimit?: number | string;
  usedCount?: number | string;
}

interface RemoteVipLevel {
  badge?: string;
  description?: string;
  icon?: string;
  id?: number | string;
  levelValue?: number | string;
  name?: string;
  requiredPoints?: number | string;
}

interface RemoteVipInfo {
  expireTime?: string;
  growthValue?: number | string;
  remainingDays?: number | string;
  totalSpent?: number | string;
  upgradeGrowthValue?: number | string;
  vipLevel?: number | string;
  vipLevelName?: string;
  vipPoints?: number | string;
  vipStatus?: string;
}

interface RemoteVipStatus {
  expireTime?: string;
  isVip?: boolean;
  pointBalance?: number | string;
  vipLevel?: number | string;
}

interface RemoteVipPackage {
  description?: string;
  id?: number | string;
  levelName?: string;
  name?: string;
  originalPrice?: number | string;
  pointAmount?: number | string;
  price?: number | string;
  recommended?: boolean;
  sortWeight?: number | string;
  tags?: string[];
  vipDurationDays?: number | string;
}

interface RemoteVipPurchaseResult {
  amount?: number | string;
  durationDays?: number | string;
  orderId?: string;
  packageId?: number | string;
  packageName?: string;
  status?: string;
  targetLevelName?: string;
}

function mapPlan(vipPackage: RemoteVipPackage): SdkworkVipPlan {
  const packageId = toSdkworkCommerceNumber(vipPackage.id);

  return {
    description: toSdkworkCommerceOptionalString(vipPackage.description),
    durationDays: toNullableSdkworkCommerceNumber(vipPackage.vipDurationDays),
    id: `vip-package-${packageId}`,
    includedPoints: toSdkworkCommerceNumber(vipPackage.pointAmount),
    levelName: toSdkworkCommerceOptionalString(vipPackage.levelName),
    name: toSdkworkCommerceOptionalString(vipPackage.name) || "VIP package",
    originalPriceCny: toNullableSdkworkCommerceNumber(vipPackage.originalPrice),
    packageId,
    priceCny: toSdkworkCommerceNumber(vipPackage.price),
    recommended: Boolean(vipPackage.recommended),
    tags: Array.isArray(vipPackage.tags)
      ? vipPackage.tags.map((tag) => tag.trim()).filter(Boolean)
      : [],
  };
}

function sortPlans(plans: SdkworkVipPlan[]): SdkworkVipPlan[] {
  return [...plans].sort(
    (left, right) =>
      Number(right.recommended) - Number(left.recommended)
      || right.includedPoints - left.includedPoints
      || left.priceCny - right.priceCny
      || left.id.localeCompare(right.id),
  );
}

function sortBenefits(benefits: SdkworkVipBenefit[]): SdkworkVipBenefit[] {
  return [...benefits].sort(
    (left, right) =>
      Number(right.claimed) - Number(left.claimed)
      || left.name.localeCompare(right.name),
  );
}

function sortLevels(levels: SdkworkVipLevel[]): SdkworkVipLevel[] {
  return [...levels].sort(
    (left, right) => left.levelValue - right.levelValue || left.name.localeCompare(right.name),
  );
}

function mapSummary(
  vipInfo: RemoteVipInfo | null | undefined,
  vipStatus: RemoteVipStatus | null | undefined,
): SdkworkVipSummary {
  const isVip = Boolean(vipStatus?.isVip || (vipInfo?.vipStatus || "").toUpperCase() === "ACTIVE");
  const currentLevelValue = toNullableSdkworkCommerceNumber(vipStatus?.vipLevel ?? vipInfo?.vipLevel);

  return {
    currentLevelName: toSdkworkCommerceOptionalString(vipInfo?.vipLevelName) || (isVip ? "VIP" : "Free"),
    currentLevelValue,
    expireTime: toSdkworkCommerceOptionalString(vipStatus?.expireTime) || toSdkworkCommerceOptionalString(vipInfo?.expireTime),
    growthValue: toNullableSdkworkCommerceNumber(vipInfo?.growthValue),
    isAuthenticated: true,
    isVip,
    pointBalance: toNullableSdkworkCommerceNumber(vipStatus?.pointBalance),
    remainingDays: toNullableSdkworkCommerceNumber(vipInfo?.remainingDays),
    status: isVip ? "vip" : "free",
    totalSpent: toNullableSdkworkCommerceNumber(vipInfo?.totalSpent),
    upgradeGrowthValue: toNullableSdkworkCommerceNumber(vipInfo?.upgradeGrowthValue),
    vipPoints: toNullableSdkworkCommerceNumber(vipInfo?.vipPoints),
  };
}

function mapLevels(
  levels: RemoteVipLevel[],
  currentLevelValue: number | null,
): SdkworkVipLevel[] {
  return sortLevels(levels.map((level) => ({
    badge: toSdkworkCommerceOptionalString(level.badge),
    description: toSdkworkCommerceOptionalString(level.description),
    icon: toSdkworkCommerceOptionalString(level.icon),
    id: `vip-level-${toSdkworkCommerceNumber(level.id)}`,
    isCurrent: currentLevelValue !== null && toSdkworkCommerceNumber(level.levelValue) === currentLevelValue,
    levelValue: toSdkworkCommerceNumber(level.levelValue),
    name: toSdkworkCommerceOptionalString(level.name) || "VIP level",
    requiredPoints: toNullableSdkworkCommerceNumber(level.requiredPoints),
  })));
}

function mapBenefits(benefits: RemoteVipBenefit[]): SdkworkVipBenefit[] {
  return sortBenefits(benefits.map((benefit) => ({
    benefitKey: toSdkworkCommerceOptionalString(benefit.benefitKey),
    claimed: Boolean(benefit.claimed),
    description: toSdkworkCommerceOptionalString(benefit.description),
    id: `vip-benefit-${toSdkworkCommerceNumber(benefit.id)}`,
    name: toSdkworkCommerceOptionalString(benefit.name) || "VIP benefit",
    type: toSdkworkCommerceOptionalString(benefit.type),
    usageLimit: toNullableSdkworkCommerceNumber(benefit.usageLimit),
    usedCount: toNullableSdkworkCommerceNumber(benefit.usedCount),
  })));
}

function mapPurchaseResult(result: RemoteVipPurchaseResult | null | undefined): SdkworkVipPurchaseResult {
  return {
    amountCny: toNullableSdkworkCommerceNumber(result?.amount),
    durationDays: toNullableSdkworkCommerceNumber(result?.durationDays),
    orderId: toSdkworkCommerceOptionalString(result?.orderId),
    packageId: toNullableSdkworkCommerceNumber(result?.packageId),
    packageName: toSdkworkCommerceOptionalString(result?.packageName),
    status: toSdkworkCommerceMutationStatus(toSdkworkCommerceOptionalString(result?.status)),
    targetLevelName: toSdkworkCommerceOptionalString(result?.targetLevelName),
  };
}

async function runPurchaseMutation(
  getCommerceService: () => SdkworkCommerceService,
  copy: SdkworkVipMessages["service"],
  action: "purchase" | "renew" | "upgrade",
  input: SdkworkVipMutationInput,
): Promise<SdkworkVipPurchaseResult> {
  requireSdkworkCommerceSession(copy.signInRequired);
  const commerceService = getCommerceService();
  const body = {
    couponId: toSdkworkCommerceOptionalString(input.couponId),
    packageId: input.packageId,
    paymentMethod: toSdkworkCommerceOptionalString(input.paymentMethod),
  };
  const result = unwrapSdkworkCommerceResponse<RemoteVipPurchaseResult>(
    await (
      action === "purchase"
        ? commerceService.vip.purchase.create(body)
        : action === "renew"
          ? commerceService.vip.purchase.renew(body)
          : commerceService.vip.purchase.upgrade(body)
    ),
    action === "purchase"
      ? copy.purchaseFailed
      : action === "renew"
        ? copy.renewFailed
        : copy.upgradeFailed,
  );

  return mapPurchaseResult(result);
}

function createEmptyDashboard(): SdkworkVipDashboardData {
  return {
    benefits: [],
    levels: [],
    plans: [],
    summary: {
      currentLevelName: "Guest",
      currentLevelValue: null,
      growthValue: null,
      isAuthenticated: false,
      isVip: false,
      pointBalance: null,
      remainingDays: null,
      status: "guest",
      totalSpent: null,
      upgradeGrowthValue: null,
      vipPoints: null,
    },
  };
}

export function createSdkworkVipService(
  options: CreateSdkworkVipServiceOptions = {},
): SdkworkVipService {
  const copy = createSdkworkVipMessages(options.locale, options.messages);
  const getCommerceService = () => options.commerceService ?? getSdkworkCommerceService();

  return {
    async getDashboard() {
      const commerceService = getCommerceService();

      if (!hasSdkworkCommerceSession()) {
        const packagesPayload = await commerceService.vip.packages.list();
        const packages = unwrapSdkworkCommerceResponse<RemoteVipPackage[]>(packagesPayload);

        return {
          ...createEmptyDashboard(),
          plans: sortPlans(packages.map(mapPlan)),
        };
      }

      const [vipInfoPayload, vipStatusPayload, levelsPayload, benefitsPayload, packagesPayload] = await Promise.all([
        commerceService.vip.info.retrieve(),
        commerceService.vip.status.retrieve(),
        commerceService.vip.levels.list(),
        commerceService.vip.benefits.list(),
        commerceService.vip.packages.list(),
      ]);
      const vipInfo = unwrapSdkworkCommerceResponse<RemoteVipInfo | null>(vipInfoPayload);
      const vipStatus = unwrapSdkworkCommerceResponse<RemoteVipStatus | null>(vipStatusPayload);
      const levels = unwrapSdkworkCommerceResponse<RemoteVipLevel[]>(levelsPayload);
      const benefits = unwrapSdkworkCommerceResponse<RemoteVipBenefit[]>(benefitsPayload);
      const packages = unwrapSdkworkCommerceResponse<RemoteVipPackage[]>(packagesPayload);
      const summary = mapSummary(vipInfo, vipStatus);

      return {
        benefits: mapBenefits(benefits),
        levels: mapLevels(levels, summary.currentLevelValue),
        plans: sortPlans(packages.map(mapPlan)),
        summary,
      };
    },

    getEmptyDashboard() {
      return createEmptyDashboard();
    },

    async purchaseMembership(input) {
      return runPurchaseMutation(getCommerceService, copy.service, "purchase", input);
    },

    async renewMembership(input) {
      return runPurchaseMutation(getCommerceService, copy.service, "renew", input);
    },

    async upgradeMembership(input) {
      return runPurchaseMutation(getCommerceService, copy.service, "upgrade", input);
    },
  };
}

export const sdkworkVipService = createSdkworkVipService();
