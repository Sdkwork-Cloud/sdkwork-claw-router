import {
  getClawRouterAppSdkClient,
  createRequestParams,
  isRecord,
  readApiRecord,
  readRequiredApiItems,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

export interface MembershipSummary {
  membershipNo: string;
  planId: string;
  status: string;
  startsAt: string;
  expiresAt: string;
}

export interface MembershipPackage {
  id: string;
  packageNo: string;
  planId: string;
  skuId: string;
  priceAmount: string;
  currencyCode: string;
  durationDays: number;
  recurrenceCycle: string;
  status: string;
}

export class MembershipService {
  static async fetchMembershipSummary(): Promise<MembershipSummary | null> {
    const result = await appMembershipsCurrentRetrieve();
    const data = readApiRecord(result);
    if (Object.keys(data).length === 0) {
      return null;
    }
    return normalizeMembershipSummary(data);
  }

  static async fetchMembershipPackages(): Promise<MembershipPackage[]> {
    const result = await appMembershipsPackagesList({ page: 1, pageSize: 100, status: 'active' });
    return readRequiredApiItems(result, 'console.commerce.errors.membershipPackagesFallback')
      .map(normalizeMembershipPackage);
  }

  static async purchaseMembership(packageId: string): Promise<{ success: boolean; requestNo: string; status: string }> {
    const result = await appMembershipsPurchasesCreate(
      {
        packageId: requiredPositiveIntegerId(packageId, 'packageId'),
        paymentMethod: 'wechat',
      },
    );
    const data = readApiRecord(result);
    const success = readRequiredBoolean(data, 'success', 'Membership purchase success flag is required');
    const requestNo = readString(data, 'requestNo') || readString(data, 'orderNo') || readString(data, 'orderId');
    if (!requestNo) {
      throw new Error('Membership purchase request number is required');
    }
    const status = readString(data, 'status') || (success ? 'accepted' : 'failed');
    return { success, requestNo, status };
  }
}

type AppCommerce = ReturnType<typeof getClawRouterAppSdkClient>['commerce'];

export async function appMembershipsCurrentRetrieve() {
  return getClawRouterAppSdkClient().commerce.memberships.current.retrieve();
}

export async function appMembershipsCurrentStatusRetrieve() {
  return getClawRouterAppSdkClient().commerce.memberships.current.status.retrieve();
}

export async function appMembershipsPlansList() {
  return getClawRouterAppSdkClient().commerce.memberships.plans.list();
}

export async function appMembershipsBenefitsList(params?: Parameters<AppCommerce['memberships']['benefits']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.memberships.benefits.list(params);
}

export async function appMembershipsPackageGroupsList(params?: Parameters<AppCommerce['memberships']['packageGroups']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.memberships.packageGroups.list(params);
}

export async function appMembershipsPackageGroupsRetrieve(packageGroupId: string) {
  return getClawRouterAppSdkClient().commerce.memberships.packageGroups.retrieve(packageGroupId);
}

export async function appMembershipsPackageGroupsPackagesList(
  packageGroupId: string,
  params?: Parameters<AppCommerce['memberships']['packageGroups']['packages']['list']>[1],
) {
  return getClawRouterAppSdkClient().commerce.memberships.packageGroups.packages.list(packageGroupId, params);
}

export async function appMembershipsPackagesList(params?: Parameters<AppCommerce['memberships']['packages']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.memberships.packages.list(params);
}

export async function appMembershipsPackagesRetrieve(packageId: string) {
  return getClawRouterAppSdkClient().commerce.memberships.packages.retrieve(packageId);
}

export async function appMembershipsPurchasesCreate(body: Parameters<AppCommerce['memberships']['purchases']['create']>[0]) {
  return getClawRouterAppSdkClient().commerce.memberships.purchases.create(
    body,
    createRequestParams('app-membership-purchase-create'),
  );
}

export async function appMembershipsPurchasesRenew(body: Parameters<AppCommerce['memberships']['purchases']['renew']>[0]) {
  return getClawRouterAppSdkClient().commerce.memberships.purchases.renew(
    body,
    createRequestParams('app-membership-purchase-renew'),
  );
}

export async function appMembershipsPurchasesUpgrade(body: Parameters<AppCommerce['memberships']['purchases']['upgrade']>[0]) {
  return getClawRouterAppSdkClient().commerce.memberships.purchases.upgrade(
    body,
    createRequestParams('app-membership-purchase-upgrade'),
  );
}

export async function appMembershipsPointsBalanceRetrieve() {
  return getClawRouterAppSdkClient().commerce.memberships.points.balance.retrieve();
}

export async function appMembershipsPointsHistoryList(params?: Parameters<AppCommerce['memberships']['points']['history']['list']>[0]) {
  return getClawRouterAppSdkClient().commerce.memberships.points.history.list(params);
}

export async function appMembershipsPointsDailyRewardsCreate() {
  return getClawRouterAppSdkClient().commerce.memberships.points.dailyRewards.create(
    undefined,
    createRequestParams('app-membership-daily-reward-create'),
  );
}

export async function appMembershipsPointsDailyRewardsStatusRetrieve() {
  return getClawRouterAppSdkClient().commerce.memberships.points.dailyRewards.status.retrieve();
}

export async function appMembershipsPrivilegesUsageRetrieve() {
  return getClawRouterAppSdkClient().commerce.memberships.privileges.usage.retrieve();
}

export async function appMembershipsPrivilegesSpeedUpsCreate() {
  return getClawRouterAppSdkClient().commerce.memberships.privileges.speedUps.create(
    undefined,
    createRequestParams('app-membership-speed-up-create'),
  );
}

function normalizeMembershipSummary(value: ApiRecord): MembershipSummary {
  return {
    membershipNo: firstRequiredString(value, ['membershipNo', 'membership_no'], 'Membership number is required'),
    planId: firstRequiredString(value, ['planId', 'plan_id'], 'Membership plan id is required'),
    status: firstRequiredString(value, ['status'], 'Membership status is required'),
    startsAt: firstRequiredString(value, ['startsAt', 'starts_at'], 'Membership start time is required'),
    expiresAt: firstRequiredString(value, ['expiresAt', 'expires_at'], 'Membership expiry time is required'),
  };
}

function normalizeMembershipPackage(value: unknown): MembershipPackage {
  const item = readRequiredRecord(value, 'Membership package record is required');
  const packageId = firstRequiredString(item, ['id', 'packageId', 'package_id', 'packageNo', 'package_no'], 'Membership package id is required');
  const planId = readFirstString(item, ['planId', 'plan_id'])
    || normalizePlanName(readFirstString(item, ['planName', 'plan_name']))
    || packageId;
  return {
    id: packageId,
    packageNo: firstRequiredString(item, ['packageNo', 'package_no', 'code', 'id'], 'Membership package number is required'),
    planId,
    skuId: readFirstString(item, ['skuId', 'sku_id']) || packageId,
    priceAmount: firstMoneyString(item, ['priceAmount', 'price_amount', 'price'], 'Membership package price amount is required'),
    currencyCode: readFirstString(item, ['currencyCode', 'currency_code']) || 'CNY',
    durationDays: readFirstNonNegativeNumber(item, ['durationDays', 'duration_days'], 'Membership duration is required'),
    recurrenceCycle: readFirstString(item, ['recurrenceCycle', 'recurrence_cycle']) || 'one_time',
    status: readFirstString(item, ['status']) || 'active',
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

function readRequiredBoolean(record: ApiRecord, key: string, message: string): boolean {
  const value = record[key];
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  throw new Error(message);
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

function normalizePlanName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

function readFirstNonNegativeNumber(item: ApiRecord, keys: readonly string[], message: string): number {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null || value === '') {
      continue;
    }
    const number = typeof value === 'number' ? value : typeof value === 'string' ? Number(value.trim()) : Number.NaN;
    if (Number.isFinite(number) && number >= 0) {
      return number;
    }
    throw new Error(`${key} must be a non-negative number`);
  }
  throw new Error(message);
}

function firstMoneyString(item: ApiRecord, keys: readonly string[], message: string): string {
  const value = readFirstString(item, keys);
  if (!value) {
    throw new Error(message);
  }
  return moneyAmount(value, message);
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

function formatMoneyString(value: string): string {
  const [whole, fraction = ''] = value.split('.');
  return `${whole}.${fraction.padEnd(2, '0').slice(0, 2)}`;
}
