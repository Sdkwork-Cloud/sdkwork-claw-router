import {
  createIdempotencyParams,
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
  code: string;
  name: string;
  description?: string;
  planId?: string;
  billingCycle: string;
  durationDays: number;
  sortWeight: number;
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
  benefits: MembershipsAdminPlanBenefitInput[];
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

export interface MembershipsAdminPlanBenefitInput {
  id?: number;
  name: string;
  benefitKey?: string;
  type?: string;
  description?: string;
  icon?: string;
  usageLimit?: number;
  usedCount?: number;
  claimed?: boolean;
}

export interface MembershipsAdminPlanMutationInput {
  code: string;
  name: string;
  rank?: number;
  status?: 'active' | 'inactive' | 'disabled';
  benefits?: MembershipsAdminPlanBenefitInput[];
}

export interface MembershipsAdminPlanCreateInput {
  code: string;
  name: string;
  rank?: number;
  status?: 'active' | 'inactive' | 'disabled';
  benefits?: MembershipsAdminPlanBenefitInput[];
}

export interface MembershipsAdminPackageGroupMutationInput {
  code: string;
  name: string;
  description?: string;
  billingCycle: string;
  durationDays: number;
  sortWeight?: number;
  status?: 'active' | 'inactive' | 'disabled';
}

export interface MembershipsAdminPackageMutationInput {
  code: string;
  packageGroupId: string;
  planId: string;
  name: string;
  priceAmount: string;
  currencyCode?: string;
  durationDays: number;
  status?: 'active' | 'inactive' | 'disabled';
}

export interface MembershipsAdminMembersListParams {
  userId?: string;
  planId?: string;
  status?: string;
}

export interface MembershipsAdminEntitlementsListParams {
  membershipId?: string;
  planId?: string;
  status?: string;
}

export interface MembershipsAdminPackagesListParams {
  packageGroupId?: string;
  planId?: string;
  status?: string;
}

export type MembershipsAdminMemberStatus = 'active' | 'inactive' | 'expired' | 'suspended' | 'cancelled';

export interface MembershipsAdminMemberStatusInput {
  status: MembershipsAdminMemberStatus;
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
) {
  return getClawRouterBackendSdkClient().commerce.memberships.plans.delete(
    planId,
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
) {
  return getClawRouterBackendSdkClient().commerce.memberships.packageGroups.delete(
    packageGroupId,
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
) {
  return getClawRouterBackendSdkClient().commerce.memberships.packages.delete(
    packageId,
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
) {
  return getClawRouterBackendSdkClient().commerce.recharges.packages.delete(
    packageId,
  );
}

export async function fetchMembershipAdminPackageCatalog(): Promise<MembershipsAdminPackageCatalog> {
  const [packagesResult, groupsResult, plansResult] = await Promise.all([
    backendMembershipsPackagesList({ page: 1, pageSize: 200 }),
    backendMembershipsPackageGroupsList({ page: 1, pageSize: 100 }),
    backendMembershipsPlansList({ page: 1, pageSize: 100 }),
  ]);

  const rawPackages = readRequiredApiItems(packagesResult, 'Membership packages could not be loaded');
  const normalizedPackages = rawPackages.map(normalizeAdminPackage);
  const groupMap = new Map<string, MembershipsAdminPackageGroup>();

  readRequiredApiItems(groupsResult, 'Membership package groups could not be loaded')
    .map(normalizeAdminPackageGroup)
    .forEach((group) => {
      groupMap.set(group.id, group);
    });

  rawPackages.forEach((rawItem, index) => {
    const pkg = normalizedPackages[index];
    if (!groupMap.has(pkg.groupId)) {
      const rawRecord = isRecord(rawItem) ? rawItem : {};
      const groupRecord = isRecord(rawRecord['package_group'])
        ? rawRecord['package_group'] as ApiRecord
        : null;
      groupMap.set(pkg.groupId, {
        id: pkg.groupId,
        code: pkg.groupId,
        name: groupRecord ? readString(groupRecord, 'name') : pkg.groupId,
        description: groupRecord ? (readString(groupRecord, 'description') || undefined) : undefined,
        planId: groupRecord ? (readString(groupRecord, 'plan_id') || undefined) : undefined,
        billingCycle: groupRecord ? (readString(groupRecord, 'billing_cycle') || readString(groupRecord, 'billingCycle') || inferAdminBillingCycle(pkg.durationDays)) : inferAdminBillingCycle(pkg.durationDays),
        durationDays: groupRecord ? readInteger(groupRecord, ['duration_days', 'durationDays'], pkg.durationDays) : pkg.durationDays,
        sortWeight: groupRecord ? readInteger(groupRecord, ['sort_weight', 'sortWeight'], 0) : 0,
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

export async function fetchMembershipAdminPackageGroups(): Promise<MembershipsAdminPackageGroup[]> {
  const [groupsResult, packagesResult] = await Promise.all([
    backendMembershipsPackageGroupsList({ page: 1, pageSize: 100 }),
    backendMembershipsPackagesList({ page: 1, pageSize: 200 }),
  ]);
  const groups = readRequiredApiItems(groupsResult, 'Membership package groups could not be loaded')
    .map(normalizeAdminPackageGroup);
  const packageCounts = new Map<string, number>();
  readRequiredApiItems(packagesResult, 'Membership packages could not be loaded')
    .map(normalizeAdminPackage)
    .forEach((pkg) => {
      packageCounts.set(pkg.groupId, (packageCounts.get(pkg.groupId) ?? 0) + 1);
    });
  return groups.map((group) => ({
    ...group,
    packageCount: packageCounts.get(group.id) ?? packageCounts.get(group.code) ?? 0,
  }));
}

export async function createMembershipAdminPackageGroup(
  input: MembershipsAdminPackageGroupMutationInput,
): Promise<MembershipsAdminPackageGroup> {
  const result = await backendMembershipsPackageGroupsCreate(
    buildPackageGroupMutationRequest(input),
    createIdempotencyParams('admin-membership-package-group-create'),
  );
  return normalizeAdminPackageGroup(readRequiredApiItem(result, 'Membership package group could not be created'));
}

export async function updateMembershipAdminPackageGroup(
  packageGroupId: string,
  input: MembershipsAdminPackageGroupMutationInput,
): Promise<MembershipsAdminPackageGroup> {
  const result = await backendMembershipsPackageGroupsUpdate(
    requiredMembershipText(packageGroupId, 'packageGroupId'),
    buildPackageGroupMutationRequest(input),
    createIdempotencyParams('admin-membership-package-group-update'),
  );
  return normalizeAdminPackageGroup(readRequiredApiItem(result, 'Membership package group could not be updated'));
}

export async function deleteMembershipAdminPackageGroup(packageGroupId: string): Promise<void> {
  await backendMembershipsPackageGroupsDelete(
    requiredMembershipText(packageGroupId, 'packageGroupId'),
  );
}

export async function fetchMembershipAdminPackages(
  params: MembershipsAdminPackagesListParams = {},
): Promise<MembershipsAdminPackageItem[]> {
  const result = await backendMembershipsPackagesList({
    page: 1,
    pageSize: 200,
    packageGroupId: params.packageGroupId,
    planId: params.planId,
    status: params.status,
  });
  return readRequiredApiItems(result, 'Membership packages could not be loaded').map(normalizeAdminPackage);
}

export async function createMembershipAdminPackage(
  input: MembershipsAdminPackageMutationInput,
): Promise<MembershipsAdminPackageItem> {
  const result = await backendMembershipsPackagesCreate(
    buildPackageMutationRequest(input),
    createIdempotencyParams('admin-membership-package-create'),
  );
  return normalizeAdminPackage(readRequiredApiItem(result, 'Membership package could not be created'));
}

export async function updateMembershipAdminPackage(
  packageId: string,
  input: MembershipsAdminPackageMutationInput,
): Promise<MembershipsAdminPackageItem> {
  const result = await backendMembershipsPackagesUpdate(
    requiredMembershipText(packageId, 'packageId'),
    buildPackageMutationRequest(input),
    createIdempotencyParams('admin-membership-package-update'),
  );
  return normalizeAdminPackage(readRequiredApiItem(result, 'Membership package could not be updated'));
}

export async function deleteMembershipAdminPackage(packageId: string): Promise<void> {
  await backendMembershipsPackagesDelete(
    requiredMembershipText(packageId, 'packageId'),
  );
}

export async function fetchMembershipAdminPlans(): Promise<MembershipsAdminPlanItem[]> {
  const result = await backendMembershipsPlansList({ page: 1, pageSize: 100 });
  return readRequiredApiItems(result, 'Membership plans could not be loaded').map(normalizeAdminPlan);
}

export async function createMembershipAdminPlan(input: MembershipsAdminPlanCreateInput): Promise<MembershipsAdminPlanItem> {
  const result = await backendMembershipsPlansCreate(
    buildPlanMutationRequest(input),
    createIdempotencyParams('admin-membership-plan-create'),
  );
  return normalizeAdminPlan(readRequiredApiItem(result, 'Membership plan could not be created'));
}

export async function updateMembershipAdminPlan(
  planId: string,
  input: MembershipsAdminPlanMutationInput,
): Promise<MembershipsAdminPlanItem> {
  const result = await backendMembershipsPlansUpdate(
    requiredMembershipText(planId, 'planId'),
    buildPlanMutationRequest(input),
    createIdempotencyParams('admin-membership-plan-update'),
  );
  return normalizeAdminPlan(readRequiredApiItem(result, 'Membership plan could not be updated'));
}

export async function deleteMembershipAdminPlan(planId: string): Promise<void> {
  await backendMembershipsPlansDelete(
    requiredMembershipText(planId, 'planId'),
  );
}

export async function fetchMembershipAdminMembers(
  params: MembershipsAdminMembersListParams = {},
): Promise<MembershipsAdminRecord[]> {
  const result = await backendMembershipsMembersList({
    page: 1,
    pageSize: 100,
    userId: params.userId,
    planId: params.planId,
    status: params.status,
  });
  return readRequiredApiItems(result, 'Members could not be loaded') as MembershipsAdminRecord[];
}

export async function updateMembershipAdminMemberStatus(
  membershipId: string,
  input: MembershipsAdminMemberStatusInput,
): Promise<MembershipsAdminRecord> {
  const result = await backendMembershipsMembersStatusUpdate(
    requiredMembershipText(membershipId, 'membershipId'),
    { status: requiredMembershipMemberStatus(input.status) },
    createIdempotencyParams('admin-membership-member-status-update'),
  );
  return readRequiredApiItem(result, 'Membership status could not be updated');
}

export async function fetchMembershipAdminEntitlements(
  params: MembershipsAdminEntitlementsListParams = {},
): Promise<MembershipsAdminRecord[]> {
  const result = await backendMembershipsEntitlementsList({
    page: 1,
    pageSize: 100,
    membershipId: params.membershipId,
    planId: params.planId,
    status: params.status,
  });
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
    createIdempotencyParams('admin-membership-recharge-package-create'),
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
    createIdempotencyParams('admin-membership-recharge-package-update'),
  );
  return normalizeAdminRechargePackage(readRequiredApiItem(result, 'Recharge package could not be updated'));
}

export async function deleteMembershipAdminRechargePackage(packageId: string): Promise<void> {
  await backendMembershipsRechargePackagesDelete(
    requiredMembershipText(packageId, 'packageId'),
  );
}

function normalizeAdminPackage(value: unknown): MembershipsAdminPackageItem {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  const code = readFirstString(item, ['package_no', 'packageNo', 'code']);
  return {
    id: readFirstString(item, ['id', 'package_id', 'packageId', 'package_no', 'packageNo', 'code', 'sku_id', 'skuId']) || 'membership-package',
    packageNo: code,
    groupId: readFirstString(item, ['package_group_id', 'packageGroupId', 'group_id', 'groupId']) || inferAdminGroupId(item),
    planId: readFirstString(item, ['plan_id', 'planId']),
    skuId: readFirstString(item, ['sku_id', 'skuId']),
    name: readFirstString(item, ['name', 'package_no', 'packageNo', 'code']),
    priceAmount: readFirstString(item, ['price_amount', 'priceAmount']) || '0',
    currencyCode: readFirstString(item, ['currency_code', 'currencyCode']) || 'CNY',
    durationDays: readInteger(item, ['duration_days', 'durationDays'], 30),
    recurrenceCycle: readFirstString(item, ['recurrence_cycle', 'recurrenceCycle']) || inferAdminBillingCycle(readInteger(item, ['duration_days', 'durationDays'], 30)),
    status: readString(item, 'status') || 'active',
  };
}

function normalizeAdminPackageGroup(value: unknown): MembershipsAdminPackageGroup {
  const item = isRecord(value) ? value as ApiRecord : {} as ApiRecord;
  const code = readFirstString(item, ['group_no', 'groupNo', 'code', 'id']);
  const durationDays = readInteger(item, ['duration_days', 'durationDays'], inferDurationFromBillingCycle(readFirstString(item, ['billing_cycle', 'billingCycle'])));
  return {
    id: readFirstString(item, ['id', 'package_group_id', 'packageGroupId', 'group_no', 'groupNo', 'code']) || 'membership-package-group',
    code,
    name: readFirstString(item, ['name', 'group_name', 'groupName', 'code', 'id']),
    description: readFirstString(item, ['description']) || undefined,
    planId: readFirstString(item, ['plan_id', 'planId']) || undefined,
    billingCycle: readFirstString(item, ['billing_cycle', 'billingCycle']) || inferAdminBillingCycle(durationDays),
    durationDays,
    sortWeight: readInteger(item, ['sort_weight', 'sortWeight'], 0),
    status: readFirstString(item, ['status']) || 'active',
    packageCount: readInteger(item, ['package_count', 'packageCount'], 0),
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
  const rawBenefits = readBenefitArray(item, benefitsJson);
  const benefits = rawBenefits.map(normalizeAdminPlanBenefit);
  const rank = Number(readString(item, 'rank') || readString(benefitsJson, 'rank') || '0');
  const code = readFirstString(item, ['plan_no', 'planNo', 'level_code', 'levelCode', 'code']);
  return {
    id: readFirstString(item, ['id', 'plan_id', 'planId', 'plan_no', 'planNo', 'code']),
    planNo: readFirstString(item, ['plan_no', 'planNo', 'code']),
    levelCode: readFirstString(item, ['level_code', 'levelCode', 'code', 'plan_no', 'planNo']),
    name: readFirstString(item, ['name', 'plan_no', 'planNo', 'code']),
    rank: Number.isFinite(rank) ? rank : 0,
    status: readString(item, 'status') || 'active',
    benefitCount: benefits.length,
    benefits,
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

function requiredMembershipCode(value: string | undefined, fieldName: string): string {
  const normalized = requiredMembershipText(value, fieldName);
  if (!/^[A-Za-z0-9_-]+$/.test(normalized)) {
    throw new Error(`${fieldName} may only contain letters, numbers, -, and _`);
  }
  return normalized;
}

function requiredPositiveInteger(value: number | undefined, fieldName: string): number {
  if (!Number.isInteger(value) || (value ?? 0) <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return value;
}

function requiredNonNegativeInteger(value: number | undefined, fieldName: string): number {
  if (!Number.isInteger(value) || (value ?? 0) < 0) {
    throw new Error(`${fieldName} must be a non-negative integer`);
  }
  return value;
}

function requiredMoneyAmount(value: string | undefined, fieldName: string): string {
  const normalized = requiredMembershipText(value, fieldName);
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) {
    throw new Error(`${fieldName} must be a valid amount`);
  }
  return normalized;
}

function requiredResourceStatus(value: string | undefined, fieldName: string): 'active' | 'inactive' | 'disabled' {
  const status = (value ?? 'active').trim().toLowerCase();
  if (status === 'active' || status === 'inactive' || status === 'disabled') {
    return status;
  }
  throw new Error(`${fieldName} must be active, inactive, or disabled`);
}

function requiredMembershipMemberStatus(value: string | undefined): MembershipsAdminMemberStatus {
  const status = requiredMembershipText(value, 'status').toLowerCase();
  if (
    status === 'active'
    || status === 'inactive'
    || status === 'expired'
    || status === 'suspended'
    || status === 'cancelled'
  ) {
    return status;
  }
  throw new Error('status must be active, inactive, expired, suspended, or cancelled');
}

function buildPlanMutationRequest(input: MembershipsAdminPlanMutationInput) {
  const rank = input.rank === undefined ? undefined : requiredNonNegativeInteger(input.rank, 'rank');
  return {
    code: requiredMembershipCode(input.code, 'code'),
    name: requiredMembershipText(input.name, 'name'),
    rank,
    status: requiredResourceStatus(input.status, 'status'),
    benefits: (input.benefits ?? []).map(buildPlanBenefitMutationRequest),
  };
}

function buildPlanBenefitMutationRequest(input: MembershipsAdminPlanBenefitInput) {
  return {
    id: input.id === undefined ? undefined : requiredNonNegativeInteger(input.id, 'benefit id'),
    name: requiredMembershipText(input.name, 'benefit name'),
    benefitKey: optionalBoundedText(input.benefitKey),
    type: optionalBoundedText(input.type),
    description: optionalBoundedText(input.description),
    icon: optionalBoundedText(input.icon),
    usageLimit: input.usageLimit === undefined ? undefined : requiredNonNegativeInteger(input.usageLimit, 'usageLimit'),
    usedCount: input.usedCount === undefined ? undefined : requiredNonNegativeInteger(input.usedCount, 'usedCount'),
    claimed: input.claimed ?? false,
  };
}

function buildPackageGroupMutationRequest(input: MembershipsAdminPackageGroupMutationInput) {
  return {
    code: requiredMembershipCode(input.code, 'code'),
    name: requiredMembershipText(input.name, 'name'),
    description: optionalBoundedText(input.description),
    billingCycle: requiredMembershipText(input.billingCycle, 'billingCycle'),
    durationDays: requiredPositiveInteger(input.durationDays, 'durationDays'),
    sortWeight: input.sortWeight === undefined ? 0 : requiredNonNegativeInteger(input.sortWeight, 'sortWeight'),
    status: requiredResourceStatus(input.status, 'status'),
  };
}

function buildPackageMutationRequest(input: MembershipsAdminPackageMutationInput) {
  return {
    code: requiredMembershipCode(input.code, 'code'),
    packageGroupId: requiredMembershipText(input.packageGroupId, 'packageGroupId'),
    planId: requiredMembershipText(input.planId, 'planId'),
    name: requiredMembershipText(input.name, 'name'),
    priceAmount: requiredMoneyAmount(input.priceAmount, 'priceAmount'),
    currencyCode: normalizeCurrencyCode(input.currencyCode),
    durationDays: requiredPositiveInteger(input.durationDays, 'durationDays'),
    status: requiredResourceStatus(input.status, 'status'),
  };
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

function normalizeCurrencyCode(value: string | undefined): string {
  const normalized = (value ?? 'CNY').trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,16}$/.test(normalized)) {
    throw new Error('currencyCode is invalid');
  }
  return normalized;
}

function optionalBoundedText(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
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

function readInteger(record: ApiRecord, keys: string[], fallback: number): number {
  for (const key of keys) {
    const raw = record[key];
    const parsed = typeof raw === 'number'
      ? raw
      : typeof raw === 'string'
        ? Number.parseInt(raw.trim(), 10)
        : Number.NaN;
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function readBenefitArray(item: ApiRecord, benefitsJson: ApiRecord): unknown[] {
  if (Array.isArray(item['benefits'])) {
    return item['benefits'];
  }
  if (Array.isArray(benefitsJson['benefits'])) {
    return benefitsJson['benefits'];
  }
  if (Array.isArray(benefitsJson['items'])) {
    return benefitsJson['items'];
  }
  return [];
}

function normalizeAdminPlanBenefit(value: unknown): MembershipsAdminPlanBenefitInput {
  const item = isRecord(value) ? value as ApiRecord : {};
  return {
    id: optionalInteger(item, ['id']),
    name: readFirstString(item, ['name']),
    benefitKey: readFirstString(item, ['benefitKey', 'benefit_key']) || undefined,
    type: readFirstString(item, ['type']) || undefined,
    description: readFirstString(item, ['description']) || undefined,
    icon: readFirstString(item, ['icon']) || undefined,
    usageLimit: optionalInteger(item, ['usageLimit', 'usage_limit']),
    usedCount: optionalInteger(item, ['usedCount', 'used_count']),
    claimed: typeof item['claimed'] === 'boolean' ? item['claimed'] : undefined,
  };
}

function optionalInteger(record: ApiRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key];
    const parsed = typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number.parseInt(value.trim(), 10)
        : Number.NaN;
    if (Number.isInteger(parsed)) {
      return parsed;
    }
  }
  return undefined;
}

function inferAdminGroupId(item: ApiRecord): string {
  const recurrenceCycle = readString(item, 'recurrence_cycle') || readString(item, 'recurrenceCycle') || 'one_time';
  const durationDays = parseInt(readString(item, 'duration_days') || readString(item, 'durationDays') || '30', 10);
  if (recurrenceCycle.includes('yearly') || recurrenceCycle.includes('annual') || durationDays >= 300) return 'annual';
  if (recurrenceCycle.includes('monthly') || (durationDays >= 25 && durationDays <= 35)) return 'monthly';
  return 'onetime';
}

function inferAdminBillingCycle(durationDays: number): string {
  if (durationDays >= 360) return 'year';
  if (durationDays >= 25 && durationDays <= 35) return 'month';
  if (durationDays === 7) return 'week';
  if (durationDays === 1) return 'day';
  return 'one_time';
}

function inferDurationFromBillingCycle(billingCycle: string): number {
  const normalized = billingCycle.trim().toLowerCase();
  if (normalized.includes('year')) return 365;
  if (normalized.includes('month')) return 30;
  if (normalized.includes('week')) return 7;
  if (normalized.includes('day')) return 1;
  return 30;
}
