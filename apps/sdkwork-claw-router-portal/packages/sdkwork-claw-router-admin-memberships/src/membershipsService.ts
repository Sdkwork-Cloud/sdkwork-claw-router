import {
  createRequestParams,
  getClawRouterBackendSdkClient,
  isRecord,
  readRequiredApiItem,
  readRequiredApiItems,
  readString,
  type ApiRecord,
} from 'sdkwork-claw-router-commons/runtime';

type BackendCommerce = ReturnType<typeof getClawRouterBackendSdkClient>['commerce'];

export type MembershipsAdminRecord = ApiRecord;

export interface MembershipsAdminPackageGroup {
  id: string;
  name: string;
  description?: string;
  planId?: string;
  status: string;
  packageCount: number;
}

export interface MembershipsAdminPackageItem {
  id: string;
  packageNo: string;
  groupId: string;
  planId: string;
  skuId: string;
  name: string;
  priceAmount: string;
  currencyCode: string;
  durationDays: number;
  recurrenceCycle: string;
  status: string;
}

export interface MembershipsAdminPlanItem {
  id: string;
  planNo: string;
  levelCode: string;
  name: string;
  rank: number;
  status: string;
  benefitCount: number;
  updatedAt: string;
}

export interface MembershipsAdminRechargePackageItem {
  id: string;
  packageNo: string;
  name: string;
  skuId: string;
  priceAmount: string;
  currencyCode: string;
  bonusAmount: string;
  grantAmount: string;
  status: string;
  updatedAt: string;
}

export interface MembershipsAdminRechargePackageMutationInput {
  rmb: string;
  bonus: number;
  status?: 'active' | 'inactive';
}

export interface MembershipsAdminPlanCreateInput {
  code: string;
  name: string;
  rank?: number;
  status?: 'active' | 'inactive' | 'disabled';
}

export interface MembershipsAdminPackageCatalog {
  groups: MembershipsAdminPackageGroup[];
  packages: MembershipsAdminPackageItem[];
  plans: MembershipsAdminPlanItem[];
}

export async function backendMembershipsPlansList(params?: Parameters<BackendCommerce['memberships']['plans']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.memberships.plans.list(params);
}

export async function backendMembershipsPlansCreate(
  body: Parameters<BackendCommerce['memberships']['plans']['create']>[0],
  params: Parameters<BackendCommerce['memberships']['plans']['create']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.memberships.plans.create(
    body,
    params,
  );
}

export async function backendMembershipsPlansUpdate(
  planId: string,
  body: Parameters<BackendCommerce['memberships']['plans']['update']>[1],
  params: Parameters<BackendCommerce['memberships']['plans']['update']>[2],
) {
  return getClawRouterBackendSdkClient().commerce.memberships.plans.update(
    planId,
    body,
    params,
  );
}

export async function backendMembershipsPlansDelete(
  planId: string,
  params?: Parameters<BackendCommerce['memberships']['plans']['delete']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.memberships.plans.delete(
    planId,
    params,
  );
}

export async function backendMembershipsPackageGroupsList(params?: Parameters<BackendCommerce['memberships']['packageGroups']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.memberships.packageGroups.list(params);
}

export async function backendMembershipsPackageGroupsCreate(
  body: Parameters<BackendCommerce['memberships']['packageGroups']['create']>[0],
  params: Parameters<BackendCommerce['memberships']['packageGroups']['create']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.memberships.packageGroups.create(
    body,
    params,
  );
}

export async function backendMembershipsPackageGroupsUpdate(
  packageGroupId: string,
  body: Parameters<BackendCommerce['memberships']['packageGroups']['update']>[1],
  params: Parameters<BackendCommerce['memberships']['packageGroups']['update']>[2],
) {
  return getClawRouterBackendSdkClient().commerce.memberships.packageGroups.update(
    packageGroupId,
    body,
    params,
  );
}

export async function backendMembershipsPackageGroupsDelete(
  packageGroupId: string,
  params?: Parameters<BackendCommerce['memberships']['packageGroups']['delete']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.memberships.packageGroups.delete(
    packageGroupId,
    params,
  );
}

export async function backendMembershipsPackagesList(params?: Parameters<BackendCommerce['memberships']['packages']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.memberships.packages.list(params);
}

export async function backendMembershipsPackagesCreate(
  body: Parameters<BackendCommerce['memberships']['packages']['create']>[0],
  params: Parameters<BackendCommerce['memberships']['packages']['create']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.memberships.packages.create(
    body,
    params,
  );
}

export async function backendMembershipsPackagesUpdate(
  packageId: string,
  body: Parameters<BackendCommerce['memberships']['packages']['update']>[1],
  params: Parameters<BackendCommerce['memberships']['packages']['update']>[2],
) {
  return getClawRouterBackendSdkClient().commerce.memberships.packages.update(
    packageId,
    body,
    params,
  );
}

export async function backendMembershipsPackagesDelete(
  packageId: string,
  params?: Parameters<BackendCommerce['memberships']['packages']['delete']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.memberships.packages.delete(
    packageId,
    params,
  );
}

export async function backendMembershipsMembersList(params?: Parameters<BackendCommerce['memberships']['members']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.memberships.members.list(params);
}

export async function backendMembershipsMembersStatusUpdate(
  membershipId: string,
  body: Parameters<BackendCommerce['memberships']['members']['status']['update']>[1],
  params: Parameters<BackendCommerce['memberships']['members']['status']['update']>[2],
) {
  return getClawRouterBackendSdkClient().commerce.memberships.members.status.update(
    membershipId,
    body,
    params,
  );
}

export async function backendMembershipsEntitlementsList(params?: Parameters<BackendCommerce['memberships']['entitlements']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.memberships.entitlements.list(params);
}

export async function backendMembershipsRechargePackagesList(params?: Parameters<BackendCommerce['recharges']['packages']['list']>[0]) {
  return getClawRouterBackendSdkClient().commerce.recharges.packages.list(params);
}

export async function backendMembershipsRechargePackagesCreate(
  body: Parameters<BackendCommerce['recharges']['packages']['create']>[0],
  params: Parameters<BackendCommerce['recharges']['packages']['create']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.recharges.packages.create(
    body,
    params,
  );
}

export async function backendMembershipsRechargePackagesUpdate(
  packageId: string,
  body: Parameters<BackendCommerce['recharges']['packages']['update']>[1],
  params: Parameters<BackendCommerce['recharges']['packages']['update']>[2],
) {
  return getClawRouterBackendSdkClient().commerce.recharges.packages.update(
    packageId,
    body,
    params,
  );
}

export async function backendMembershipsRechargePackagesDelete(
  packageId: string,
  params?: Parameters<BackendCommerce['recharges']['packages']['delete']>[1],
) {
  return getClawRouterBackendSdkClient().commerce.recharges.packages.delete(
    packageId,
    params,
  );
}

export async function fetchMembershipAdminPackageCatalog(): Promise<MembershipsAdminPackageCatalog> {
  const [packagesResult, plansResult] = await Promise.all([
    backendMembershipsPackagesList({ page: 1, pageSize: 200 }),
    backendMembershipsPlansList({ page: 1, pageSize: 100 }),
  ]);

  const rawPackages = readRequiredApiItems(packagesResult, 'Membership packages could not be loaded');
  const normalizedPackages = rawPackages.map(normalizeAdminPackage);
  const groupMap = new Map<string, MembershipsAdminPackageGroup>();

  rawPackages.forEach((rawItem, index) => {
    const pkg = normalizedPackages[index];
    if (!groupMap.has(pkg.groupId)) {
      const rawRecord = isRecord(rawItem) ? rawItem : {};
      const groupRecord = isRecord(rawRecord['package_group'])
        ? rawRecord['package_group'] as ApiRecord
        : null;
      groupMap.set(pkg.groupId, {
        id: pkg.groupId,
        name: groupRecord ? readString(groupRecord, 'name') : pkg.groupId,
        description: groupRecord ? (readString(groupRecord, 'description') || undefined) : undefined,
        planId: groupRecord ? (readString(groupRecord, 'plan_id') || undefined) : undefined,
        status: groupRecord ? readString(groupRecord, 'status') : 'active',
        packageCount: 0,
      });
    }
    groupMap.get(pkg.groupId)!.packageCount++;
  });

  const groups = Array.from(groupMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  const rawPlans = readRequiredApiItems(plansResult, 'Membership plans could not be loaded');
  return {
    groups,
    packages: normalizedPackages,
    plans: rawPlans.map(normalizeAdminPlan),
  };
}

export async function fetchMembershipAdminPlans(): Promise<MembershipsAdminPlanItem[]> {
  const result = await backendMembershipsPlansList({ page: 1, pageSize: 100 });
  return readRequiredApiItems(result, 'Membership plans could not be loaded').map(normalizeAdminPlan);
}

export async function createMembershipAdminPlan(input: MembershipsAdminPlanCreateInput): Promise<MembershipsAdminPlanItem> {
  const result = await backendMembershipsPlansCreate(
    {
      code: requiredMembershipText(input.code, 'code'),
      name: requiredMembershipText(input.name, 'name'),
      rank: input.rank,
      status: input.status ?? 'active',
      benefits: [],
    },
    createRequestParams('admin-membership-plan-create'),
  );
  return normalizeAdminPlan(readRequiredApiItem(result, 'Membership plan could not be created'));
}

export async function fetchMembershipAdminMembers(): Promise<MembershipsAdminRecord[]> {
  const result = await backendMembershipsMembersList({ page: 1, pageSize: 100 });
  return readRequiredApiItems(result, 'Members could not be loaded') as MembershipsAdminRecord[];
}

export async function fetchMembershipAdminEntitlements(): Promise<MembershipsAdminRecord[]> {
  const result = await backendMembershipsEntitlementsList({ page: 1, pageSize: 100 });
  return readRequiredApiItems(result, 'Entitlements could not be loaded') as MembershipsAdminRecord[];
}

export async function fetchMembershipAdminRechargePackages(): Promise<MembershipsAdminRechargePackageItem[]> {
  const result = await backendMembershipsRechargePackagesList({ page: 1, pageSize: 100 });
  return readRequiredApiItems(result, 'Recharge packages could not be loaded').map(normalizeAdminRechargePackage);
}

export async function createMembershipAdminRechargePackage(
  input: MembershipsAdminRechargePackageMutationInput,
): Promise<MembershipsAdminRechargePackageItem> {
  const result = await backendMembershipsRechargePackagesCreate(
    buildRechargePackageMutationRequest(input),
    createRequestParams('admin-membership-recharge-package-create'),
  );
  return normalizeAdminRechargePackage(readRequiredApiItem(result, 'Recharge package could not be created'));
}

export async function updateMembershipAdminRechargePackage(
  packageId: string,
  input: MembershipsAdminRechargePackageMutationInput,
): Promise<MembershipsAdminRechargePackageItem> {
  const result = await backendMembershipsRechargePackagesUpdate(
    requiredMembershipText(packageId, 'packageId'),
    buildRechargePackageMutationRequest(input),
    createRequestParams('admin-membership-recharge-package-update'),
  );
  return normalizeAdminRechargePackage(readRequiredApiItem(result, 'Recharge package could not be updated'));
}

export async function deleteMembershipAdminRechargePackage(packageId: string): Promise<void> {
  const params = createRequestParams('admin-membership-recharge-package-delete');
  await backendMembershipsRechargePackagesDelete(
    requiredMembershipText(packageId, 'packageId'),
    { xRequestId: params.xRequestId },
  );
}

function normalizeAdminPackage(value: unknown): MembershipsAdminPackageItem {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  return {
    id: readString(item, 'id') || readString(item, 'package_no') || readString(item, 'sku_id') || 'membership-package',
    packageNo: readString(item, 'package_no') || readString(item, 'packageNo') || '',
    groupId: readString(item, 'package_group_id') || readString(item, 'packageGroupId') || inferAdminGroupId(item),
    planId: readString(item, 'plan_id') || readString(item, 'planId') || '',
    skuId: readString(item, 'sku_id') || readString(item, 'skuId') || '',
    name: readString(item, 'name') || readString(item, 'package_no') || '',
    priceAmount: readString(item, 'price_amount') || readString(item, 'priceAmount') || '0',
    currencyCode: readString(item, 'currency_code') || readString(item, 'currencyCode') || 'CNY',
    durationDays: parseInt(readString(item, 'duration_days') || readString(item, 'durationDays') || '30', 10),
    recurrenceCycle: readString(item, 'recurrence_cycle') || readString(item, 'recurrenceCycle') || 'one_time',
    status: readString(item, 'status') || 'active',
  };
}

function normalizeAdminRechargePackage(value: unknown): MembershipsAdminRechargePackageItem {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  const priceAmount = readFirstString(item, ['price_amount', 'priceAmount', 'rmb']);
  const bonus = readFirstString(item, ['bonus', 'bonus_amount', 'bonusAmount']);
  const points = readFirstString(item, ['points', 'points_amount', 'pointsAmount', 'grant_amount', 'grantAmount']);
  return {
    id: readFirstString(item, ['id', 'package_id', 'packageId', 'package_no', 'packageNo']) || 'recharge-package',
    packageNo: readFirstString(item, ['package_no', 'packageNo', 'id']),
    name: readFirstString(item, ['name', 'title', 'package_no', 'packageNo', 'id']),
    skuId: readFirstString(item, ['sku_id', 'skuId']),
    priceAmount: priceAmount || '0',
    currencyCode: readFirstString(item, ['currency_code', 'currencyCode']) || 'CNY',
    bonusAmount: bonus || '0',
    grantAmount: points || bonus || '0',
    status: readFirstString(item, ['status']) || 'active',
    updatedAt: readFirstString(item, ['updated_at', 'updatedAt', 'created_at', 'createdAt']),
  };
}

function normalizeAdminPlan(value: unknown): MembershipsAdminPlanItem {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  const benefitsJson = isRecord(item['benefits_json']) ? item['benefits_json'] as ApiRecord : {};
  const benefits = Array.isArray(benefitsJson['benefits']) ? benefitsJson['benefits'] : [];
  const rank = Number(readString(item, 'rank') || readString(benefitsJson, 'rank') || '0');
  return {
    id: readString(item, 'id') || readString(item, 'plan_id') || readString(item, 'plan_no') || '',
    planNo: readString(item, 'plan_no') || readString(item, 'planNo') || '',
    levelCode: readString(item, 'level_code') || readString(item, 'levelCode') || readString(item, 'code') || '',
    name: readString(item, 'name') || readString(item, 'plan_no') || '',
    rank: Number.isFinite(rank) ? rank : 0,
    status: readString(item, 'status') || 'active',
    benefitCount: benefits.length,
    updatedAt: readString(item, 'updated_at') || readString(item, 'updatedAt') || '',
  };
}

function requiredMembershipText(value: string | undefined, fieldName: string): string {
  const normalized = value?.trim();
  if (!normalized) {
    throw new Error(`${fieldName} is required`);
  }
  return normalized;
}

function buildRechargePackageMutationRequest(
  input: MembershipsAdminRechargePackageMutationInput,
): MembershipsAdminRechargePackageMutationInput {
  const rmb = requiredMembershipText(input.rmb, 'rmb');
  if (!/^\d+(?:\.\d{1,2})?$/.test(rmb)) {
    throw new Error('rmb must be a valid amount');
  }
  if (!Number.isInteger(input.bonus) || input.bonus < 0) {
    throw new Error('bonus must be a non-negative integer');
  }
  return {
    rmb,
    bonus: input.bonus,
    status: input.status ?? 'active',
  };
}

function readFirstString(record: ApiRecord, keys: string[]): string {
  for (const key of keys) {
    const value = readString(record, key).trim();
    if (value) {
      return value;
    }
  }
  return '';
}

function inferAdminGroupId(item: ApiRecord): string {
  const recurrenceCycle = readString(item, 'recurrence_cycle') || readString(item, 'recurrenceCycle') || 'one_time';
  const durationDays = parseInt(readString(item, 'duration_days') || readString(item, 'durationDays') || '30', 10);
  if (recurrenceCycle.includes('yearly') || recurrenceCycle.includes('annual') || durationDays >= 300) return 'annual';
  if (recurrenceCycle.includes('monthly') || (durationDays >= 25 && durationDays <= 35)) return 'monthly';
  return 'onetime';
}
