import {
  ensureSdkworkApiSuccess,
  isRecord,
  readApiItem,
  readApiItems,
  readApiRecord,
  readRequiredApiItems,
  readString,
  type ApiRecord,
} from 'sdkwork-clawrouter-pc-commons/runtime';
import { getSdkworkCommerceService } from '@sdkwork/commerce-service';

export interface MembershipSummary {
  membershipNo: string;
  planId: string;
  planName: string | null;
  status: string;
  startsAt: string | null;
  expiresAt: string | null;
}

export interface MembershipPackageGroup {
  id: string;
  groupNo: string;
  name: string;
  description: string | null;
  status: string;
  sortOrder: number;
  packages: MembershipPackage[];
}

export interface MembershipPackage {
  id: string;
  packageNo: string;
  packageGroupId: string | null;
  planId: string;
  planName: string;
  skuId: string;
  priceAmount: string;
  currencyCode: string;
  durationDays: number;
  recurrenceCycle: string;
  status: string;
  isPurchasable: boolean;
}

export interface MembershipBenefit {
  code: string;
  name: string;
  quotaAmount: string;
  quotaPeriod: string | null;
  resetPolicy: string | null;
  status: string;
}

export interface MembershipPointsBalance {
  balance: number;
  status: string;
  updatedAt: string | null;
}

export interface MembershipPointsHistoryItem {
  id: string;
  title: string;
  amount: string;
  occurredAt: string | null;
  status: string;
}

export interface MembershipDailyRewardStatus {
  available: boolean;
  claimedToday: boolean;
  rewardPoints: number;
  status: string;
  nextAvailableAt: string | null;
}

export interface MembershipPrivilegeUsageItem {
  code: string;
  name: string;
  used: string;
  quota: string;
  remaining: string;
  status: string;
}

export interface MembershipPrivilegeUsage {
  speedUpAvailable: boolean;
  speedUpRemaining: number;
  items: MembershipPrivilegeUsageItem[];
}

export interface MembershipActionResult {
  success: boolean;
  requestNo: string;
  status: string;
  rewardPoints?: number;
}

export interface MembershipOverview {
  summary: MembershipSummary | null;
  packageGroups: MembershipPackageGroup[];
  benefits: MembershipBenefit[];
  pointsBalance: MembershipPointsBalance;
  pointsHistory: MembershipPointsHistoryItem[];
  dailyReward: MembershipDailyRewardStatus;
  privilegeUsage: MembershipPrivilegeUsage;
}

const EMPTY_POINTS_BALANCE: MembershipPointsBalance = {
  balance: 0,
  status: 'inactive',
  updatedAt: null,
};

const EMPTY_DAILY_REWARD: MembershipDailyRewardStatus = {
  available: false,
  claimedToday: false,
  rewardPoints: 0,
  status: 'unavailable',
  nextAvailableAt: null,
};

const EMPTY_PRIVILEGE_USAGE: MembershipPrivilegeUsage = {
  speedUpAvailable: false,
  speedUpRemaining: 0,
  items: [],
};

export class MembershipService {
  static async fetchMembershipOverview(): Promise<MembershipOverview> {
    const [
      summaryResult,
      packageGroupsResult,
      benefitsResult,
      pointsBalanceResult,
      pointsHistoryResult,
      dailyRewardResult,
      privilegeUsageResult,
    ] = await Promise.allSettled([
      appMembershipsCurrentRetrieve(),
      appMembershipsPackageGroupsList(),
      appMembershipsBenefitsList(),
      appMembershipsPointsBalanceRetrieve(),
      appMembershipsPointsHistoryList(),
      appMembershipsPointsDailyRewardsStatusRetrieve(),
      appMembershipsPrivilegesUsageRetrieve(),
    ]);

    return {
      summary: readOptionalMembershipSummaryResult(summaryResult),
      packageGroups: await readMembershipPackageGroupsResult(packageGroupsResult),
      benefits: readOptionalListResult(
        benefitsResult,
        'console.memberships.errors.benefitsFallback',
        normalizeMembershipBenefit,
        isMembershipBenefit,
      ),
      pointsBalance: readOptionalValueResult(
        pointsBalanceResult,
        'console.memberships.errors.pointsFallback',
        normalizePointsBalance,
        createEmptyPointsBalance,
      ),
      pointsHistory: readOptionalListResult(
        pointsHistoryResult,
        'console.memberships.errors.pointsFallback',
        normalizePointsHistoryItem,
        isMembershipPointsHistoryItem,
      ),
      dailyReward: readOptionalValueResult(
        dailyRewardResult,
        'console.memberships.errors.dailyRewardFallback',
        normalizeDailyRewardStatus,
        createEmptyDailyReward,
      ),
      privilegeUsage: readOptionalValueResult(
        privilegeUsageResult,
        'console.memberships.errors.privilegesFallback',
        normalizePrivilegeUsage,
        createEmptyPrivilegeUsage,
      ),
    };
  }

  static async fetchMembershipSummary(): Promise<MembershipSummary | null> {
    const result = await appMembershipsCurrentRetrieve();
    return normalizeNullableMembershipSummary(result);
  }

  static async fetchMembershipPackages(): Promise<MembershipPackage[]> {
    const result = await appMembershipsPackagesList({
      page: 1,
      pageSize: 100,
      status: 'active',
    });
    ensureSdkworkApiSuccess(result, 'console.memberships.errors.packagesFallback');
    return readRequiredApiItems(result, 'console.memberships.errors.packagesFallback')
      .map((item, index) => normalizeMembershipPackage(item, null, index))
      .filter(isMembershipPackage);
  }

  static async purchaseMembership(packageId: string): Promise<MembershipActionResult> {
    return createMembershipPackageAction(packageId, appMembershipsPurchasesCreate);
  }

  static async renewMembership(packageId: string): Promise<MembershipActionResult> {
    return createMembershipPackageAction(packageId, appMembershipsPurchasesRenew);
  }

  static async upgradeMembership(packageId: string): Promise<MembershipActionResult> {
    return createMembershipPackageAction(packageId, appMembershipsPurchasesUpgrade);
  }

  static async claimDailyReward(): Promise<MembershipActionResult> {
    const result = await appMembershipsPointsDailyRewardsCreate();
    return normalizeMembershipActionResult(result, 'Membership daily reward request number is required');
  }

  static async activateSpeedUp(): Promise<MembershipActionResult> {
    const result = await appMembershipsPrivilegesSpeedUpsCreate();
    return normalizeMembershipActionResult(result, 'Membership speed-up request number is required');
  }
}

type CommerceRequestParams = Record<string, unknown>;
type CommerceRequestBody = Record<string, unknown>;

export async function appMembershipsCurrentRetrieve() {
  return getSdkworkCommerceService().memberships.current.retrieve();
}

export async function appMembershipsCurrentStatusRetrieve() {
  return getSdkworkCommerceService().memberships.current.status.retrieve();
}

export async function appMembershipsPlansList() {
  return getSdkworkCommerceService().memberships.plans.list();
}

export async function appMembershipsBenefitsList() {
  return getSdkworkCommerceService().memberships.benefits.list();
}

export async function appMembershipsPackageGroupsList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().memberships.packageGroups.list(params);
}

export async function appMembershipsPackageGroupsRetrieve(packageGroupId: string) {
  return getSdkworkCommerceService().memberships.packageGroups.retrieve(packageGroupId);
}

export async function appMembershipsPackageGroupsPackagesList(
  packageGroupId: string,
  params?: CommerceRequestParams,
) {
  return getSdkworkCommerceService().memberships.packageGroups.packages.list(packageGroupId, params);
}

export async function appMembershipsPackagesList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().memberships.packages.list(params);
}

export async function appMembershipsPackagesRetrieve(packageId: string) {
  return getSdkworkCommerceService().memberships.packages.retrieve(packageId);
}

export async function appMembershipsPurchasesCreate(body: CommerceRequestBody) {
  return getSdkworkCommerceService().memberships.purchases.create(body);
}

export async function appMembershipsPurchasesRenew(body: CommerceRequestBody) {
  return getSdkworkCommerceService().memberships.purchases.renew(body);
}

export async function appMembershipsPurchasesUpgrade(body: CommerceRequestBody) {
  return getSdkworkCommerceService().memberships.purchases.upgrade(body);
}

export async function appMembershipsPointsBalanceRetrieve() {
  return getSdkworkCommerceService().memberships.points.balance.retrieve();
}

export async function appMembershipsPointsHistoryList(params?: CommerceRequestParams) {
  return getSdkworkCommerceService().memberships.points.history.list(params);
}

export async function appMembershipsPointsDailyRewardsCreate() {
  return getSdkworkCommerceService().memberships.points.dailyRewards.create({});
}

export async function appMembershipsPointsDailyRewardsStatusRetrieve() {
  return getSdkworkCommerceService().memberships.points.dailyRewards.status.retrieve();
}

export async function appMembershipsPrivilegesUsageRetrieve() {
  return getSdkworkCommerceService().memberships.privileges.usage.retrieve();
}

export async function appMembershipsPrivilegesSpeedUpsCreate() {
  return getSdkworkCommerceService().memberships.privileges.speedUps.create({});
}

function createEmptyPointsBalance(): MembershipPointsBalance {
  return { ...EMPTY_POINTS_BALANCE };
}

function createEmptyDailyReward(): MembershipDailyRewardStatus {
  return { ...EMPTY_DAILY_REWARD };
}

function createEmptyPrivilegeUsage(): MembershipPrivilegeUsage {
  return {
    ...EMPTY_PRIVILEGE_USAGE,
    items: [],
  };
}

function readOptionalMembershipSummaryResult(result: PromiseSettledResult<unknown>): MembershipSummary | null {
  if (result.status !== 'fulfilled') {
    return null;
  }
  try {
    ensureSdkworkApiSuccess(result.value, 'console.memberships.errors.currentFallback');
    return normalizeNullableMembershipSummary(result.value);
  } catch {
    return null;
  }
}

async function readMembershipPackageGroupsResult(result: PromiseSettledResult<unknown>): Promise<MembershipPackageGroup[]> {
  if (result.status !== 'fulfilled') {
    throw result.reason instanceof Error
      ? result.reason
      : new Error('console.memberships.errors.packageGroupsFallback');
  }
  ensureSdkworkApiSuccess(result.value, 'console.memberships.errors.packageGroupsFallback');
  return await normalizeMembershipPackageGroups(result.value);
}

function readOptionalListResult<T>(
  result: PromiseSettledResult<unknown>,
  successMessage: string,
  normalize: (value: unknown) => T | null,
  isValue: (value: T | null) => value is T,
): T[] {
  if (result.status !== 'fulfilled') {
    return [];
  }
  try {
    ensureSdkworkApiSuccess(result.value, successMessage);
    const normalizedItems: T[] = [];
    for (const item of readApiItems(result.value)) {
      try {
        const normalizedItem = normalize(item);
        if (isValue(normalizedItem)) {
          normalizedItems.push(normalizedItem);
        }
      } catch {
        continue;
      }
    }
    return normalizedItems;
  } catch {
    return [];
  }
}

function readOptionalValueResult<T>(
  result: PromiseSettledResult<unknown>,
  successMessage: string,
  normalize: (value: unknown) => T,
  fallback: () => T,
): T {
  if (result.status !== 'fulfilled') {
    return fallback();
  }
  try {
    ensureSdkworkApiSuccess(result.value, successMessage);
    return normalize(result.value);
  } catch {
    return fallback();
  }
}

async function normalizeMembershipPackageGroups(result: unknown): Promise<MembershipPackageGroup[]> {
  const rawGroups = readRequiredApiItems(result, 'console.memberships.errors.packageGroupsFallback');
  const groupEntries = await Promise.all(
    rawGroups
      .map((item, index) => normalizeMembershipPackageGroupRecord(item, index))
      .filter(isMembershipPackageGroupRecord)
      .map(async ({ record, index }) => {
        const groupId = readFirstString(record, ['id'])
          || `group-${index + 1}`;
        const embeddedPackages = readOptionalApiItems(record, ['packages']);
        const packageLoadResult = embeddedPackages
          ? { items: embeddedPackages, failed: false }
          : await fetchPackageGroupPackagesSafely(groupId);
        const packages = packageLoadResult.items
          .map((item, packageIndex) => normalizeMembershipPackage(item, groupId, packageIndex))
          .filter(isMembershipPackage)
          .sort(compareMembershipPackages);

        return {
          group: {
            id: groupId,
            groupNo: readFirstString(record, ['groupNo']) || groupId,
            name: readFirstString(record, ['name']) || groupId,
            description: readFirstString(record, ['description']) || null,
            status: readFirstString(record, ['status']) || 'active',
            sortOrder: readFirstNumber(record, ['sortOrder'], index),
            packages,
          },
          packageLoadFailed: packageLoadResult.failed,
        };
      }),
  );

  const groups = groupEntries
    .map((entry) => entry.group)
    .sort(compareMembershipPackageGroups);

  if (groups.length > 0) {
    return groups;
  }

  return [];
}

async function fetchPackageGroupPackagesSafely(packageGroupId: string): Promise<{ items: unknown[]; failed: boolean }> {
  try {
    return {
      items: await fetchPackageGroupPackages(packageGroupId),
      failed: false,
    };
  } catch {
    return {
      items: [],
      failed: true,
    };
  }
}

async function fetchPackageGroupPackages(packageGroupId: string): Promise<unknown[]> {
  const result = await appMembershipsPackageGroupsPackagesList(packageGroupId);
  ensureSdkworkApiSuccess(result, 'console.memberships.errors.packagesFallback');
  return readRequiredApiItems(result, 'console.memberships.errors.packagesFallback');
}

function normalizeMembershipPackageGroupRecord(value: unknown, index: number): { record: ApiRecord; index: number } | null {
  return isRecord(value) ? { record: value, index } : null;
}

function isMembershipPackageGroupRecord(value: { record: ApiRecord; index: number } | null): value is { record: ApiRecord; index: number } {
  return value !== null;
}

function normalizeNullableMembershipSummary(result: unknown): MembershipSummary | null {
  const data = readApiRecord(result);
  if (Object.keys(data).length === 0) {
    return null;
  }
  return normalizeMembershipSummary(data);
}

function normalizeMembershipSummary(value: ApiRecord): MembershipSummary {
  return {
    membershipNo: firstRequiredString(value, ['membershipNo'], 'Membership number is required'),
    planId: firstRequiredString(value, ['planId'], 'Membership plan id is required'),
    planName: readFirstString(value, ['planName']) || null,
    status: readFirstString(value, ['status']) || 'active',
    startsAt: readFirstString(value, ['startsAt']) || null,
    expiresAt: readFirstString(value, ['expiresAt']) || null,
  };
}

function normalizeMembershipPackage(value: unknown, packageGroupIdOverride: string | null = null, index = 0): MembershipPackage | null {
  if (!isRecord(value)) {
    return null;
  }
  const item = value;
  const packageId = readFirstString(item, ['id', 'packageNo', 'package_no'])
    || `package-${index + 1}`;
  const planName = readFirstString(item, ['planName', 'plan_name']) || readFirstString(item, ['name']);
  const planId = readFirstString(item, ['planId', 'plan_id'])
    || normalizePlanName(planName)
    || packageId;
  const status = readFirstString(item, ['status']) || 'active';
  const price = readDisplayMoneyString(item, ['priceAmount', 'price_amount']);

  return {
    id: packageId,
    packageNo: readFirstString(item, ['packageNo', 'package_no']) || packageId,
    packageGroupId: packageGroupIdOverride || readFirstString(item, ['packageGroupId', 'package_group_id']) || null,
    planId,
    planName: planName || planId,
    skuId: readFirstString(item, ['skuId', 'sku_id']) || packageId,
    priceAmount: price.amount,
    currencyCode: readFirstString(item, ['currencyCode', 'currency_code']) || 'CNY',
    durationDays: readFirstNonNegativeNumberOrFallback(item, ['durationDays', 'duration_days'], 0),
    recurrenceCycle: readFirstString(item, ['recurrenceCycle', 'recurrence_cycle']) || 'one_time',
    status,
    isPurchasable: isPositiveIntegerId(packageId) && price.isPurchasable && normalizeStatus(status) === 'active',
  };
}

function isMembershipPackage(value: MembershipPackage | null): value is MembershipPackage {
  return value !== null;
}

function normalizeMembershipBenefit(value: unknown): MembershipBenefit {
  const item = readRequiredRecord(value, 'Membership benefit record is required');
  const code = firstRequiredString(item, ['entitlementCode'], 'Membership benefit code is required');
  return {
    code,
    name: readFirstString(item, ['name']) || code,
    quotaAmount: readFirstString(item, ['quotaAmount']) || '-',
    quotaPeriod: readFirstString(item, ['quotaPeriod']) || null,
    resetPolicy: readFirstString(item, ['resetPolicy']) || null,
    status: readFirstString(item, ['status']) || 'active',
  };
}

function isMembershipBenefit(value: MembershipBenefit | null): value is MembershipBenefit {
  return value !== null;
}

function normalizePointsBalance(result: unknown): MembershipPointsBalance {
  const item = readApiItem(result) ?? readApiRecord(result);
  if (Object.keys(item).length === 0) {
    return { ...EMPTY_POINTS_BALANCE };
  }
  return {
    balance: readFirstNumber(item, ['balance'], 0),
    status: readFirstString(item, ['status']) || 'active',
    updatedAt: readFirstString(item, ['updatedAt']) || null,
  };
}

function normalizePointsHistoryItem(value: unknown): MembershipPointsHistoryItem | null {
  if (!isRecord(value)) {
    return null;
  }
  const id = readFirstString(value, ['id'])
    || readFirstString(value, ['occurredAt']);
  if (!id) {
    return null;
  }
  return {
    id,
    title: readFirstString(value, ['title']) || id,
    amount: readFirstString(value, ['amount']) || '0',
    occurredAt: readFirstString(value, ['occurredAt']) || null,
    status: readFirstString(value, ['status']) || 'success',
  };
}

function isMembershipPointsHistoryItem(value: MembershipPointsHistoryItem | null): value is MembershipPointsHistoryItem {
  return value !== null;
}

function normalizeDailyRewardStatus(result: unknown): MembershipDailyRewardStatus {
  const item = readApiItem(result) ?? readApiRecord(result);
  if (Object.keys(item).length === 0) {
    return { ...EMPTY_DAILY_REWARD };
  }
  const claimedToday = readOptionalBoolean(item, 'claimedToday') ?? false;
  const available = readOptionalBoolean(item, 'available')
    ?? (!claimedToday && normalizeStatus(readFirstString(item, ['status'])) === 'available');
  return {
    available,
    claimedToday,
    rewardPoints: readFirstNumber(item, ['rewardPoints'], 0),
    status: readFirstString(item, ['status']) || (available ? 'available' : 'unavailable'),
    nextAvailableAt: readFirstString(item, ['nextAvailableAt']) || null,
  };
}

function normalizePrivilegeUsage(result: unknown): MembershipPrivilegeUsage {
  const item = readApiItem(result) ?? readApiRecord(result);
  const items = readRecordArray(item, 'items')
    .concat(readRecordArray(item, 'usages'))
    .concat(readApiItems(result).filter(isRecord))
    .map(normalizePrivilegeUsageItem)
    .filter(isMembershipPrivilegeUsageItem);
  const speedUpRemaining = readFirstNumber(item, ['speedUpRemaining'], 0);
  const speedUpAvailable = readOptionalBoolean(item, 'speedUpAvailable')
    ?? speedUpRemaining > 0;
  return {
    speedUpAvailable,
    speedUpRemaining,
    items,
  };
}

function normalizePrivilegeUsageItem(value: ApiRecord): MembershipPrivilegeUsageItem | null {
  const code = readFirstString(value, ['code']);
  if (!code) {
    return null;
  }
  const quota = readFirstString(value, ['quotaAmount']) || '-';
  const used = readFirstString(value, ['usedAmount']) || '0';
  return {
    code,
    name: readFirstString(value, ['name']) || code,
    used,
    quota,
    remaining: readFirstString(value, ['balanceAfter']) || calculateRemaining(quota, used),
    status: readFirstString(value, ['status']) || 'active',
  };
}

function isMembershipPrivilegeUsageItem(value: MembershipPrivilegeUsageItem | null): value is MembershipPrivilegeUsageItem {
  return value !== null;
}

async function createMembershipPackageAction(
  packageId: string,
  action: (body: CommerceRequestBody) => Promise<unknown>,
): Promise<MembershipActionResult> {
  const result = await action({
    packageId: String(requiredPositiveIntegerId(packageId, 'packageId')),
  });
  return normalizeMembershipActionResult(result, 'Membership purchase request number is required');
}

function normalizeMembershipActionResult(result: unknown, missingRequestMessage: string): MembershipActionResult {
  const data = readApiItem(result) ?? readApiRecord(result);
  const requestNo = readFirstString(
    data,
    ['requestNo'],
  );
  if (!requestNo) {
    throw new Error(missingRequestMessage);
  }
  const status = readFirstString(data, ['status']) || 'accepted';
  const success = readOperationAccepted(data, status);
  if (!success) {
    throw new Error('Membership operation was not accepted');
  }
  const rewardPoints = readOptionalNumber(data, 'rewardPoints');
  return {
    success,
    requestNo,
    status,
    ...(rewardPoints !== undefined ? { rewardPoints } : {}),
  };
}

function readRequiredRecord(value: unknown, message: string): ApiRecord {
  if (!isRecord(value)) {
    throw new Error(message);
  }
  return value;
}

function requiredText(value: string, fieldName: string): string {
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
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

function firstRequiredString(item: ApiRecord, keys: readonly string[], message: string): string {
  const value = readFirstString(item, keys);
  if (!value) {
    throw new Error(message);
  }
  return value;
}

function readFirstString(item: ApiRecord, keys: readonly string[]): string {
  for (const key of keys) {
    const value = readString(item, key).trim();
    if (value) {
      return value;
    }
  }
  return '';
}

function readFirstNumber(item: ApiRecord, keys: readonly string[], fallback: number): number {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null || value === '') {
      continue;
    }
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
    if (Number.isFinite(number)) {
      return number;
    }
  }
  return fallback;
}

function readOptionalNumber(item: ApiRecord, ...keys: readonly string[]): number | undefined {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null || value === '') {
      continue;
    }
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
    if (Number.isFinite(number)) {
      return number;
    }
  }
  return undefined;
}

function readFirstNonNegativeNumberOrFallback(item: ApiRecord, keys: readonly string[], fallback: number): number {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null || value === '') {
      continue;
    }
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
    if (Number.isFinite(number) && number >= 0) {
      return number;
    }
  }
  return fallback;
}

function readOptionalBoolean(item: ApiRecord, ...keys: readonly string[]): boolean | undefined {
  for (const key of keys) {
    const value = item[key];
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') {
        return true;
      }
      if (value.toLowerCase() === 'false') {
        return false;
      }
    }
  }
  return undefined;
}

function readRecordArray(record: ApiRecord, key: string): ApiRecord[] {
  const value = record[key];
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function readOptionalApiItems(record: ApiRecord, keys: readonly string[]): unknown[] | null {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }
  return null;
}

function readOperationAccepted(item: ApiRecord, status: string): boolean {
  const explicitSuccess = readOptionalBoolean(item, 'success');
  if (explicitSuccess !== undefined) {
    return explicitSuccess;
  }
  return !['failed', 'failure', 'rejected', 'cancelled', 'canceled', 'error'].includes(normalizeStatus(status));
}

function normalizePlanName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

function normalizeStatus(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_]+/g, '-');
}

function readDisplayMoneyString(item: ApiRecord, keys: readonly string[]): { amount: string; isPurchasable: boolean } {
  const value = readFirstString(item, keys);
  if (!value) {
    return { amount: '0.00', isPurchasable: false };
  }
  try {
    return { amount: moneyAmount(value, 'priceAmount'), isPurchasable: true };
  } catch {
    return { amount: optionalMoneyAmount(value) ?? '0.00', isPurchasable: false };
  }
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
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
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
  if (!/^\d+$/.test(normalized)) {
    return false;
  }
  const number = Number(normalized);
  return Number.isSafeInteger(number) && number > 0;
}

function calculateRemaining(quota: string, used: string): string {
  const quotaNumber = Number(quota);
  const usedNumber = Number(used);
  if (!Number.isFinite(quotaNumber) || !Number.isFinite(usedNumber)) {
    return '-';
  }
  return String(Math.max(0, quotaNumber - usedNumber));
}

function compareMembershipPackageGroups(left: MembershipPackageGroup, right: MembershipPackageGroup): number {
  return left.sortOrder - right.sortOrder
    || left.name.localeCompare(right.name, undefined, { numeric: true, sensitivity: 'base' })
    || left.id.localeCompare(right.id, undefined, { numeric: true, sensitivity: 'base' });
}

function compareMembershipPackages(left: MembershipPackage, right: MembershipPackage): number {
  return left.durationDays - right.durationDays
    || Number(left.priceAmount) - Number(right.priceAmount)
    || left.planName.localeCompare(right.planName, undefined, { numeric: true, sensitivity: 'base' })
    || left.id.localeCompare(right.id, undefined, { numeric: true, sensitivity: 'base' });
}
