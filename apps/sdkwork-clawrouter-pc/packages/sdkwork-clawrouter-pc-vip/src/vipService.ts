import {
  createIdempotencyParams,
  createClientOperationToken,
  hasStoredPortalSession,
  isRecord,
  readApiItems,
  readApiRecord,
  readRequiredApiItems,
  readMediaResource,
  readString,
  type ApiRecord,
  type ClawRouterMediaResource,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

export interface VipPackageGroup {
  id: string;
  groupNo: string;
  name: string;
  description?: string;
  discount?: string;
  sortOrder: number;
  packages: VipPackage[];
}

export interface VipPackage {
  id: string;
  packageNo: string;
  groupId: string;
  planId: string;
  planName: string;
  skuId: string;
  priceAmount: string;
  originalPriceAmount?: string;
  currencyCode: string;
  durationDays: number;
  durationUnit: string;
  recurrenceCycle: string;
  status: string;
  pointsPerMonth?: number;
  maxImages?: number;
  maxVideos?: string;
  features: VipPackageFeature[];
  isPopular?: boolean;
  isRecommended?: boolean;
  isPreview?: boolean;
  isPurchasable: boolean;
  badge?: string;
}

export interface VipPackageFeature {
  id: string;
  name: string;
  description?: string;
  iconKey?: string;
  included: boolean;
}

export interface VipSummary {
  currentPlanId: string | null;
  currentPlanName: string | null;
  status: string;
  expiresAt: string | null;
  pointsBalance: number;
}

export interface VipCatalog {
  groups: VipPackageGroup[];
  summary: VipSummary | null;
}

export interface VipPurchaseResult {
  success: boolean;
  requestNo: string;
  status: string;
  providerCode?: string;
  paymentMethod?: string;
  paymentProduct?: string;
  nextAction?: 'scan_qr' | 'request_payment' | 'open_url' | 'completed' | 'pending';
  paymentId?: string;
  cashierUrl?: string;
  qrCodePayload?: string;
  qrCode?: ClawRouterMediaResource;
  requestPaymentPayload?: string;
}

export interface VipRedeemResult {
  success: boolean;
  requestNo: string;
  status: string;
  message?: string;
}

export class VipService {
  static async fetchVipCatalog(): Promise<VipCatalog> {
    const summaryPromise = hasStoredPortalSession()
      ? appMembershipsCurrentRetrieve()
      : null;
    const [groupsResult, summaryResult] = await Promise.allSettled([
      appMembershipsPackageGroupsList(),
      summaryPromise,
    ]);

    const summary = readVipSummaryResult(summaryResult);
    if (groupsResult.status !== 'fulfilled') {
      return createFallbackVipCatalog(summary);
    }

    let rawGroups: unknown[];
    try {
      rawGroups = readRequiredApiItems(groupsResult.value, 'vip.errors.packageGroupsLoadError');
    } catch {
      return createFallbackVipCatalog(summary);
    }

    const groups = (await Promise.all(
      rawGroups.map((rawGroup, index) => normalizeVipPackageGroup(rawGroup, index)),
    ))
      .filter((group): group is VipPackageGroup => group !== null)
      .sort((a, b) => a.sortOrder - b.sortOrder || compareText(a.name, b.name) || compareText(a.id, b.id));

    if (groups.length === 0) {
      return createFallbackVipCatalog(summary);
    }

    return { groups, summary };
  }

  static async purchaseVipPackage(packageId: string): Promise<VipPurchaseResult> {
    const result = await appMembershipsPurchasesCreate(
      {
        packageId: String(requiredPositiveIntegerId(packageId, 'packageId')),
      },
    );
    const data = readApiRecord(result);
    const requestNo = readFirstString(
      data,
      ['requestNo', 'request_no', 'orderNo', 'order_no', 'orderId', 'order_id', 'paymentIntentId', 'payment_intent_id', 'id'],
    );
    if (!requestNo) {
      throw new Error('VIP purchase request number is required');
    }
    const status = readFirstString(data, ['status', 'paymentStatus', 'payment_status', 'orderStatus', 'order_status']) || 'accepted';
    const success = readPurchaseAccepted(data, status);
    if (!success) {
      throw new Error('VIP purchase was not accepted');
    }
    const providerCode = readFirstString(data, ['providerCode', 'provider_code']);
    const paymentMethod = readFirstString(data, ['paymentMethod', 'payment_method']);
    const paymentProduct = readFirstString(data, ['paymentProduct', 'payment_product']);
    const nextAction = readPurchaseNextAction(readFirstString(data, ['nextAction', 'next_action']));
    const paymentId = readFirstString(data, ['paymentId', 'payment_id', 'paymentIntentId', 'payment_intent_id']);
    const qrCodePayload = readStandardQrCodePayload(data, 'VIP');
    const cashierUrl = readStandardCashierUrl(data, 'VIP', qrCodePayload);
    const qrCode = readMediaResource(data.qrCode);
    const requestPaymentPayload = readStandardRequestPaymentPayload(data);
    return {
      success,
      requestNo,
      status,
      ...(providerCode ? { providerCode } : {}),
      ...(paymentMethod ? { paymentMethod } : {}),
      ...(paymentProduct ? { paymentProduct } : {}),
      ...(nextAction ? { nextAction } : {}),
      ...(paymentId ? { paymentId } : {}),
      ...(cashierUrl ? { cashierUrl } : {}),
      ...(qrCodePayload ? { qrCodePayload } : {}),
      ...(qrCode ? { qrCode } : {}),
      ...(requestPaymentPayload ? { requestPaymentPayload } : {}),
    };
  }

  static async redeemMembershipCode(code: string): Promise<VipRedeemResult> {
    const normalizedCode = requiredText(code, 'code');
    const result = await appPromotionCodeRedemptionsCreate(
      {
        clientRequestNo: createClientOperationToken('vip-membership-redemption'),
        code: normalizedCode,
        scene: 'membership_redeem',
        source: 'vip-page',
      },
    );
    const data = readApiRecord(result);
    const requestNo = readFirstString(data, ['requestNo', 'request_no', 'redemptionNo', 'redemption_no', 'id']);
    const status = readFirstString(data, ['status', 'state']) || 'accepted';
    const success = readPurchaseAccepted(data, status);
    if (!success) {
      throw new Error('VIP membership redeem was not accepted');
    }
    const message = readFirstString(data, ['msg', 'message']);
    return {
      success,
      requestNo: requestNo || createClientOperationToken('vip-membership-redemption-result'),
      status,
      ...(message ? { message } : {}),
    };
  }
}

type AppCommerceService = ReturnType<typeof getSdkworkCommerceService>;

async function appMembershipsPackageGroupsList(params?: Parameters<AppCommerceService['memberships']['packageGroups']['list']>[0]) {
  return getSdkworkCommerceService().memberships.packageGroups.list(params);
}

async function appMembershipsPackageGroupsPackagesList(
  packageGroupId: string,
  params?: Parameters<AppCommerceService['memberships']['packageGroups']['packages']['list']>[1],
) {
  return getSdkworkCommerceService().memberships.packageGroups.packages.list(packageGroupId, params);
}

async function appMembershipsCurrentRetrieve() {
  return getSdkworkCommerceService().memberships.current.retrieve();
}

async function appMembershipsPurchasesCreate(body: Parameters<AppCommerceService['memberships']['purchases']['create']>[0]) {
  return getSdkworkCommerceService().memberships.purchases.create(
    body,
    createIdempotencyParams('app-vip-purchase-create'),
  );
}

async function appPromotionCodeRedemptionsCreate(body: Parameters<AppCommerceService['promotions']['codes']['redemptions']['create']>[0]) {
  return getSdkworkCommerceService().promotions.codes.redemptions.create(
    body,
    createIdempotencyParams('app-vip-membership-redemption-create'),
  );
}

function normalizeVipSummary(value: ApiRecord): VipSummary {
  return {
    currentPlanId: readString(value, 'planId') || readString(value, 'plan_id') || null,
    currentPlanName: readString(value, 'planName') || readString(value, 'plan_name') || null,
    status: readString(value, 'status') || 'inactive',
    expiresAt: readString(value, 'expiresAt') || readString(value, 'expires_at') || null,
    pointsBalance: readOptionalNumber(value, 'pointsBalance', 'points_balance') ?? 0,
  };
}

function readVipSummaryResult(result: PromiseSettledResult<unknown>): VipSummary | null {
  if (result.status !== 'fulfilled') {
    return null;
  }
  try {
    const data = readApiRecord(result.value);
    return Object.keys(data).length > 0 ? normalizeVipSummary(data) : null;
  } catch {
    return null;
  }
}

async function normalizeVipPackageGroup(value: unknown, index: number): Promise<VipPackageGroup | null> {
  if (!isRecord(value)) {
    return null;
  }
  const item = value;
  const groupId = readFirstString(
    item,
    ['id', 'packageGroupId', 'package_group_id', 'groupId', 'group_id', 'groupNo', 'group_no'],
  ) || `vip-group-${index + 1}`;
  const name = readFirstString(item, ['name', 'groupName', 'group_name'])
    || getFallbackGroupName(groupId, index);
  const embeddedPackageItems = readOptionalApiItems(item, ['packages', 'items', 'records', 'list']);
  const packageItems = embeddedPackageItems ?? await fetchPackageGroupPackages(groupId).catch(() => []);
  const packages = packageItems
    .map((rawPackage, packageIndex) => ({
      package: normalizeVipPackage(rawPackage, groupId, packageIndex),
      sortOrder: readPackageSortOrder(rawPackage),
    }))
    .filter((item): item is { package: VipPackage; sortOrder: number } => item.package !== null)
    .sort((a, b) => (
      a.sortOrder - b.sortOrder
      || compareText(a.package.planName, b.package.planName)
      || compareText(a.package.id, b.package.id)
    ))
    .map((item) => item.package);

  return {
    id: groupId,
    groupNo: readFirstString(item, ['groupNo', 'group_no', 'packageGroupNo', 'package_group_no', 'code']) || groupId,
    name,
    description: readFirstString(item, ['description', 'summary']) || undefined,
    discount: readFirstString(item, ['discount', 'badge', 'label']) || undefined,
    sortOrder: readFirstNumber(item, ['sortOrder', 'sort_order', 'sortWeight', 'sort_weight'], index),
    packages: packages.length > 0 ? packages : createPreviewVipPackages(groupId, index),
  };
}

async function fetchPackageGroupPackages(groupId: string): Promise<unknown[]> {
  const result = await appMembershipsPackageGroupsPackagesList(groupId);
  return readRequiredApiItems(result, 'vip.errors.packagesLoadError');
}

function normalizeVipPackage(value: unknown, groupIdOverride?: string, index = 0): VipPackage | null {
  if (!isRecord(value)) {
    return null;
  }
  const item = value;
  const groupId = groupIdOverride || readFirstString(item, ['package_group_id', 'packageGroupId']) || inferGroupId(item);
  const packageId = readFirstString(item, ['id', 'packageId', 'package_id', 'packageNo', 'package_no'])
    || `${groupId}-package-${index + 1}`;
  const packageName = readFirstString(item, ['name', 'packageName', 'package_name']);
  const planName = readFirstString(item, ['planName', 'plan_name']);
  const planId = readFirstString(item, ['planId', 'plan_id', 'planNo', 'plan_no'])
    || inferPlanId(item)
    || normalizePlanName(planName)
    || packageId;
  const recommended = readOptionalBoolean(item, 'recommended') ?? isRecommendedPlan(planId);
  const recurrenceCycle = readFirstString(item, ['recurrenceCycle', 'recurrence_cycle', 'billingCycle', 'billing_cycle'])
    || inferRecurrenceCycle(item);
  const price = readDisplayMoneyString(item, ['priceAmount', 'price_amount', 'price']);
  const originalPriceAmount = readOptionalMoneyString(
    item,
    ['originalPriceAmount', 'original_price_amount', 'originalPrice', 'original_price'],
  );

  return {
    id: packageId,
    packageNo: readFirstString(item, ['packageNo', 'package_no', 'code', 'id']) || packageId,
    groupId,
    planId,
    planName: packageName || planName || getPlanName(planId),
    skuId: readFirstString(item, ['skuId', 'sku_id']) || packageId,
    priceAmount: price.amount,
    originalPriceAmount,
    currencyCode: readFirstString(item, ['currencyCode', 'currency_code']) || 'CNY',
    durationDays: readFirstNonNegativeNumberOrFallback(item, ['durationDays', 'duration_days'], 30),
    durationUnit: inferDurationUnit(item),
    recurrenceCycle,
    status: readFirstString(item, ['status']) || 'active',
    pointsPerMonth: readOptionalNumber(item, 'pointsPerMonth', 'points_per_month', 'pointAmount', 'point_amount'),
    maxImages: readOptionalNumber(item, 'maxImages', 'max_images'),
    maxVideos: readFirstString(item, ['maxVideos', 'max_videos']) || undefined,
    features: buildDefaultFeatures(planId),
    isPopular: readOptionalBoolean(item, 'popular') ?? recommended ?? isPopularPlan(planId),
    isRecommended: recommended,
    isPurchasable: price.isPurchasable && isPositiveIntegerId(packageId),
    badge: getBadge(planId, recommended),
  };
}

function readPackageSortOrder(value: unknown): number {
  return isRecord(value) ? readFirstNumber(value, ['sortOrder', 'sort_order', 'sortWeight', 'sort_weight'], 0) : 0;
}

function inferGroupId(item: ApiRecord): string {
  const recurrenceCycle = readFirstString(item, ['recurrenceCycle', 'recurrence_cycle']) || 'one_time';
  let durationDays = 365;
  try {
    durationDays = readFirstNonNegativeNumber(item, ['durationDays', 'duration_days'], 'Duration days is required');
  } catch {
    durationDays = 365;
  }

  if (recurrenceCycle.includes('yearly') || recurrenceCycle.includes('annual') || durationDays >= 300) {
    return 'annual';
  }
  if (recurrenceCycle.includes('monthly') || (durationDays >= 25 && durationDays <= 35)) {
    return 'monthly';
  }
  return 'onetime';
}

function inferDurationUnit(item: ApiRecord): string {
  let durationDays = 30;
  try {
    durationDays = readFirstNonNegativeNumber(item, ['durationDays', 'duration_days'], 'Duration days is required');
  } catch {
    durationDays = 30;
  }
  if (durationDays >= 300) return 'year';
  if (durationDays >= 25 && durationDays <= 35) return 'month';
  if (durationDays >= 6 && durationDays <= 8) return 'week';
  return 'period';
}

function inferRecurrenceCycle(item: ApiRecord): string {
  const tags = readStringArray(item, 'tags').map((tag) => tag.toLowerCase());
  if (tags.includes('yearly') || tags.includes('annual')) return 'yearly';
  if (tags.includes('monthly')) return 'monthly';
  const durationDays = readOptionalNumber(item, 'durationDays', 'duration_days') ?? 0;
  if (durationDays >= 300) return 'yearly';
  if (durationDays >= 25 && durationDays <= 35) return 'monthly';
  return 'one_time';
}

function getPlanName(planId: string): string {
  const planNames: Record<string, string> = {
    free: 'Free',
    basic: 'Basic',
    standard: 'Standard',
    advanced: 'Advanced',
    premium: 'Premium',
    pro: 'Pro',
    enterprise: 'Enterprise',
  };
  return planNames[planId] || planId;
}

function getBadge(planId: string, recommended: boolean): string | undefined {
  if (isPopularPlan(planId)) {
    return 'vip.badges.bestValue';
  }
  if (recommended || planId === 'standard' || planId === 'advanced') {
    return 'vip.badges.recommended';
  }
  return undefined;
}

function isPopularPlan(planId: string): boolean {
  return ['premium', 'pro', 'enterprise'].includes(planId);
}

function isRecommendedPlan(planId: string): boolean {
  return ['standard', 'advanced', 'premium', 'pro', 'enterprise'].includes(planId);
}

function buildDefaultFeatures(planId: string): VipPackageFeature[] {
  const privilegedPlan = planId !== 'free';
  const advancedPlan = ['standard', 'advanced', 'premium', 'pro', 'enterprise'].includes(planId);
  const topPlan = ['premium', 'pro', 'enterprise'].includes(planId);
  return [
    { id: 'credits', name: 'vip.features.credits', included: privilegedPlan },
    { id: 'orders', name: 'vip.features.orders', included: true },
    { id: 'priority', name: 'vip.features.priority', included: advancedPlan },
    { id: 'watermark', name: 'vip.features.watermark', included: privilegedPlan },
    { id: 'support', name: 'vip.features.support', included: topPlan },
  ];
}

function createFallbackVipCatalog(summary: VipSummary | null): VipCatalog {
  return {
    summary,
    groups: [
      {
        id: 'monthly-preview',
        groupNo: 'monthly-preview',
        name: 'Monthly VIP',
        description: undefined,
        sortOrder: 10,
        packages: createPreviewVipPackages('monthly-preview', 0),
      },
      {
        id: 'annual-preview',
        groupNo: 'annual-preview',
        name: 'Annual VIP',
        description: undefined,
        discount: 'vip.badges.bestValue',
        sortOrder: 20,
        packages: createPreviewVipPackages('annual-preview', 1),
      },
    ],
  };
}

function createPreviewVipPackages(groupId: string, index: number): VipPackage[] {
  const normalizedGroupId = groupId.toLowerCase();
  const annual = normalizedGroupId.includes('annual') || normalizedGroupId.includes('year');
  const planId = annual ? 'premium' : 'standard';
  const durationDays = annual ? 365 : 30;
  const recurrenceCycle = annual ? 'yearly' : 'monthly';
  const priceAmount = annual ? '199.00' : '29.90';
  return [
    {
      id: `${groupId}-preview-${index + 1}`,
      packageNo: `${groupId}-preview-${index + 1}`,
      groupId,
      planId,
      planName: getPlanName(planId),
      skuId: `${groupId}-preview-sku-${index + 1}`,
      priceAmount,
      currencyCode: 'CNY',
      durationDays,
      durationUnit: annual ? 'year' : 'month',
      recurrenceCycle,
      status: 'preview',
      pointsPerMonth: annual ? 200000 : 20000,
      features: buildDefaultFeatures(planId),
      isPopular: annual,
      isRecommended: true,
      isPreview: true,
      isPurchasable: false,
      badge: annual ? 'vip.badges.bestValue' : 'vip.badges.recommended',
    },
  ];
}

function getFallbackGroupName(groupId: string, index: number): string {
  const normalizedGroupId = groupId.toLowerCase();
  if (normalizedGroupId.includes('annual') || normalizedGroupId.includes('year')) {
    return 'Annual VIP';
  }
  if (normalizedGroupId.includes('month')) {
    return 'Monthly VIP';
  }
  return `VIP packages ${index + 1}`;
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${fieldName} is required`);
  return normalized;
}

function requiredPositiveIntegerId(value: string, fieldName: string): number {
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  const number = Number(normalized);
  if (!Number.isSafeInteger(number) || number <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return number;
}

function readFirstString(item: ApiRecord, keys: readonly string[]): string {
  for (const key of keys) {
    const value = readString(item, key).trim();
    if (value) return value;
  }
  return '';
}

function readPurchaseAccepted(item: ApiRecord, status: string): boolean {
  const explicitSuccess = readOptionalBoolean(item, 'success');
  if (explicitSuccess !== undefined) {
    return explicitSuccess;
  }
  const normalizedStatus = status.trim().toLowerCase();
  if (['failed', 'failure', 'rejected', 'cancelled', 'canceled', 'error'].includes(normalizedStatus)) {
    return false;
  }
  return true;
}

function readStandardQrCodePayload(item: ApiRecord, scopeLabel: string): string {
  const value = readFirstString(item, ['qrCodePayload', 'qr_code_payload', 'cashierUrl', 'cashier_url']);
  if (!value) {
    return '';
  }
  if (!/^https?:\/\//iu.test(value.trim())) {
    throw new Error(`${scopeLabel} qrCodePayload must be an http(s) url when present`);
  }
  return value;
}

function readStandardCashierUrl(item: ApiRecord, scopeLabel: string, fallbackUrl = ''): string {
  const value = readFirstString(item, ['cashierUrl', 'cashier_url']) || fallbackUrl;
  if (!value) {
    return '';
  }
  if (!/^https?:\/\//iu.test(value.trim())) {
    throw new Error(`${scopeLabel} cashierUrl must be an http(s) url when present`);
  }
  return value;
}

function readStandardRequestPaymentPayload(item: ApiRecord): string {
  const value = item.requestPaymentPayload ?? item.request_payment_payload;
  if (value === undefined || value === null || value === '') {
    return '';
  }
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function readPurchaseNextAction(value: string): VipPurchaseResult['nextAction'] | undefined {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  if (normalized === 'request_payment') {
    return 'request_payment';
  }
  if (normalized === 'open_url' || normalized === 'redirect') {
    return 'open_url';
  }
  if (normalized === 'completed' || normalized === 'success') {
    return 'completed';
  }
  if (normalized === 'pending') {
    return 'pending';
  }
  return 'scan_qr';
}

function inferPlanId(item: ApiRecord): string {
  const tags = readStringArray(item, 'tags')
    .map(normalizePlanName)
    .filter(Boolean);
  const knownPlan = tags.find((tag) => ['free', 'basic', 'standard', 'advanced', 'premium', 'pro', 'enterprise'].includes(tag));
  if (knownPlan) return knownPlan;

  const normalizedPlanName = normalizePlanName(readFirstString(item, ['planName', 'plan_name']));
  if (normalizedPlanName.endsWith('-member')) {
    return normalizedPlanName.slice(0, -'-member'.length);
  }
  return normalizedPlanName;
}

function readFirstNonNegativeNumber(item: ApiRecord, keys: readonly string[], message: string): number {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null || value === '') continue;
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
    if (Number.isFinite(number) && number >= 0) return number;
    throw new Error(`${key} must be a non-negative number`);
  }
  throw new Error(message);
}

function readFirstNonNegativeNumberOrFallback(item: ApiRecord, keys: readonly string[], fallback: number): number {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null || value === '') continue;
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
    if (Number.isFinite(number) && number >= 0) return number;
  }
  return fallback;
}

function readOptionalNumber(item: ApiRecord, ...keys: readonly string[]): number | undefined {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null || value === '') continue;
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
    if (Number.isFinite(number)) return number;
  }
  return undefined;
}

function readStringArray(record: ApiRecord, key: string): string[] {
  const value = record[key];
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return item;
      if (typeof item === 'number' || typeof item === 'boolean') return String(item);
      return '';
    })
    .filter((item) => item.trim().length > 0);
}

function readOptionalApiItems(record: ApiRecord, keys: readonly string[]): unknown[] | null {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }
  const nestedItems = readApiItems(record, [...keys]);
  return nestedItems.length > 0 ? nestedItems : null;
}

function readFirstNumber(item: ApiRecord, keys: readonly string[], fallback: number): number {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null || value === '') continue;
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
    if (Number.isFinite(number)) return number;
  }
  return fallback;
}

function readOptionalBoolean(item: ApiRecord, key: string): boolean | undefined {
  const value = item[key];
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return undefined;
}

function normalizePlanName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

function readDisplayMoneyString(item: ApiRecord, keys: readonly string[]): { amount: string; isPurchasable: boolean } {
  const value = readFirstString(item, keys);
  if (!value) {
    return { amount: '0.00', isPurchasable: false };
  }
  try {
    return { amount: moneyAmount(value, 'Price amount is required'), isPurchasable: true };
  } catch {
    const displayAmount = optionalMoneyAmount(value);
    return { amount: displayAmount ?? '0.00', isPurchasable: false };
  }
}

function readOptionalMoneyString(item: ApiRecord, keys: readonly string[]): string | undefined {
  const value = readFirstString(item, keys);
  if (!value) {
    return undefined;
  }
  return optionalMoneyAmount(value) ?? undefined;
}

function moneyAmount(value: string, fieldName: string): string {
  const normalized = requiredText(value, fieldName).replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`${fieldName} must be a positive money amount`);
  }
  if (!/[1-9]/.test(normalized.replace('.', ''))) {
    throw new Error(`${fieldName} must be greater than zero`);
  }
  return formatMoneyString(normalized);
}

function optionalMoneyAmount(value: string): string | null {
  const normalized = value.trim().replace(/,/g, '');
  if (!/^\d+(?:\.\d{1,2})?$/u.test(normalized)) {
    return null;
  }
  return formatMoneyString(normalized);
}

function formatMoneyString(value: string): string {
  const [whole, fraction = ''] = value.split('.');
  return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}

function isPositiveIntegerId(value: string): boolean {
  const normalized = value.trim();
  if (!/^\d+$/u.test(normalized)) {
    return false;
  }
  const number = Number(normalized);
  return Number.isSafeInteger(number) && number > 0;
}

function compareText(left: string, right: string): number {
  return left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' });
}
