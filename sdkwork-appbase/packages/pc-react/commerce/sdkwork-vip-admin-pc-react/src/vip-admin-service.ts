import {
  getSdkworkCommerceService,
  hasSdkworkCommerceSession,
  requireSdkworkCommerceSession,
  unwrapSdkworkCommerceResponse,
} from "@sdkwork/commerce-service";
import type {
  SdkworkCommerceRequestParams,
  SdkworkCommerceService,
  SdkworkCommerceVipBenefit,
  SdkworkCommerceVipEntitlement,
  SdkworkCommerceVipEntitlementsListParams,
  SdkworkCommerceVipLevel,
  SdkworkCommerceVipLevelDeleteResult,
  SdkworkCommerceVipLevelUpdateRequest,
  SdkworkCommerceVipLevelsListParams,
  SdkworkCommerceVipMembership,
  SdkworkCommerceVipMembershipsListParams,
  SdkworkCommerceVipMembershipStatusUpdateInput,
  SdkworkCommerceVipPackage,
  SdkworkCommerceVipPackageDeleteResult,
  SdkworkCommerceVipPackageGroup,
  SdkworkCommerceVipPackageGroupDeleteResult,
  SdkworkCommerceVipPackageGroupMutationRequest,
  SdkworkCommerceVipPackageGroupsListParams,
  SdkworkCommerceVipPackageUpdateRequest,
  SdkworkCommerceVipPackagesListParams,
} from "@sdkwork/commerce-service";
import {
  createSdkworkVipAdminMessages,
  type SdkworkVipAdminMessages,
  type SdkworkVipAdminMessagesOverrides,
} from "./vip-admin-copy";

export type SdkworkVipAdminLevel = SdkworkCommerceVipLevel;
export type SdkworkVipAdminLevelUpdateInput = SdkworkCommerceVipLevelUpdateRequest;
export type SdkworkVipAdminLevelDeleteResult = SdkworkCommerceVipLevelDeleteResult;
export type SdkworkVipAdminBenefit = SdkworkCommerceVipBenefit;
export type SdkworkVipAdminPackage = SdkworkCommerceVipPackage;
export type SdkworkVipAdminPackageUpdateInput = SdkworkCommerceVipPackageUpdateRequest;
export type SdkworkVipAdminPackageDeleteResult = SdkworkCommerceVipPackageDeleteResult;
export type SdkworkVipAdminPackageGroup = SdkworkCommerceVipPackageGroup;
export type SdkworkVipAdminPackageGroupMutationInput = SdkworkCommerceVipPackageGroupMutationRequest;
export type SdkworkVipAdminPackageGroupDeleteResult = SdkworkCommerceVipPackageGroupDeleteResult;
export type SdkworkVipAdminMembership = SdkworkCommerceVipMembership;
export type SdkworkVipAdminMembershipUpdateInput = SdkworkCommerceVipMembershipStatusUpdateInput;
export type SdkworkVipAdminEntitlement = SdkworkCommerceVipEntitlement;

export interface SdkworkVipAdminSummary {
  activeMemberships: number;
  enabledPackages: number;
  entitlements: number;
  levels: number;
  memberships: number;
  packageGroups: number;
  packages: number;
}

export interface SdkworkVipAdminDashboardData {
  entitlements: SdkworkVipAdminEntitlement[];
  levels: SdkworkVipAdminLevel[];
  memberships: SdkworkVipAdminMembership[];
  packageGroups: SdkworkVipAdminPackageGroup[];
  packages: SdkworkVipAdminPackage[];
  summary: SdkworkVipAdminSummary;
}

export interface CreateSdkworkVipAdminServiceOptions {
  commerceService?: SdkworkCommerceService;
  locale?: string | null;
  messages?: SdkworkVipAdminMessagesOverrides;
}

export interface SdkworkVipAdminService {
  assignPackagesToGroup(
    packages: SdkworkVipAdminPackage[],
    packageGroupId: string,
    requestParams?: SdkworkCommerceRequestParams,
  ): Promise<SdkworkVipAdminPackage[]>;
  createLevel(input: SdkworkVipAdminLevelUpdateInput, requestParams?: SdkworkCommerceRequestParams): Promise<SdkworkVipAdminLevel>;
  createPackage(input: SdkworkVipAdminPackageUpdateInput, requestParams?: SdkworkCommerceRequestParams): Promise<SdkworkVipAdminPackage>;
  createPackageGroup(
    input: SdkworkVipAdminPackageGroupMutationInput,
    requestParams?: SdkworkCommerceRequestParams,
  ): Promise<SdkworkVipAdminPackageGroup>;
  deleteLevel(levelId: string, requestParams?: SdkworkCommerceRequestParams): Promise<SdkworkVipAdminLevelDeleteResult>;
  deletePackage(packageId: string, requestParams?: SdkworkCommerceRequestParams): Promise<SdkworkVipAdminPackageDeleteResult>;
  deletePackageGroup(
    packageGroupId: string,
    requestParams?: SdkworkCommerceRequestParams,
  ): Promise<SdkworkVipAdminPackageGroupDeleteResult>;
  getDashboard(): Promise<SdkworkVipAdminDashboardData>;
  getEmptyDashboard(): SdkworkVipAdminDashboardData;
  listEntitlements(params?: SdkworkCommerceVipEntitlementsListParams): Promise<SdkworkVipAdminEntitlement[]>;
  listLevels(params?: SdkworkCommerceVipLevelsListParams): Promise<SdkworkVipAdminLevel[]>;
  listMemberships(params?: SdkworkCommerceVipMembershipsListParams): Promise<SdkworkVipAdminMembership[]>;
  listPackageGroups(params?: SdkworkCommerceVipPackageGroupsListParams): Promise<SdkworkVipAdminPackageGroup[]>;
  listPackages(params?: SdkworkCommerceVipPackagesListParams): Promise<SdkworkVipAdminPackage[]>;
  updateLevel(
    levelId: string,
    input: SdkworkVipAdminLevelUpdateInput,
    requestParams?: SdkworkCommerceRequestParams,
  ): Promise<SdkworkVipAdminLevel>;
  updateMembershipStatus(
    membershipId: string,
    input: SdkworkVipAdminMembershipUpdateInput,
    requestParams?: SdkworkCommerceRequestParams,
  ): Promise<SdkworkVipAdminMembership>;
  updatePackage(
    packageId: string,
    input: SdkworkVipAdminPackageUpdateInput,
    requestParams?: SdkworkCommerceRequestParams,
  ): Promise<SdkworkVipAdminPackage>;
  updatePackageGroup(
    packageGroupId: string,
    input: SdkworkVipAdminPackageGroupMutationInput,
    requestParams?: SdkworkCommerceRequestParams,
  ): Promise<SdkworkVipAdminPackageGroup>;
}

interface RemotePageEnvelope<T> {
  content?: T[];
  items?: T[];
  records?: T[];
}

type SdkworkVipAdminCopyContext = Pick<SdkworkVipAdminMessages, "service">;

function extractRecords<T>(payload: RemotePageEnvelope<T> | T[] | null | undefined): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.content ?? payload?.items ?? payload?.records ?? [];
}

function createEmptyDashboard(): SdkworkVipAdminDashboardData {
  return {
    entitlements: [],
    levels: [],
    memberships: [],
    packageGroups: [],
    packages: [],
    summary: {
      activeMemberships: 0,
      enabledPackages: 0,
      entitlements: 0,
      levels: 0,
      memberships: 0,
      packageGroups: 0,
      packages: 0,
    },
  };
}

function createDashboard(input: {
  entitlements: SdkworkVipAdminEntitlement[];
  levels: SdkworkVipAdminLevel[];
  memberships: SdkworkVipAdminMembership[];
  packageGroups: SdkworkVipAdminPackageGroup[];
  packages: SdkworkVipAdminPackage[];
}): SdkworkVipAdminDashboardData {
  return {
    ...input,
    summary: {
      activeMemberships: input.memberships.filter((item) => item.status === "active").length,
      enabledPackages: input.packages.filter((item) => item.status === "active").length,
      entitlements: input.entitlements.length,
      levels: input.levels.length,
      memberships: input.memberships.length,
      packageGroups: input.packageGroups.length,
      packages: input.packages.length,
    },
  };
}

function createPackageGroupAssignmentInput(
  packageItem: SdkworkVipAdminPackage,
  groupId: string,
): SdkworkVipAdminPackageUpdateInput {
  return {
    code: packageItem.code,
    currencyCode: packageItem.currencyCode,
    durationDays: packageItem.durationDays,
    groupId,
    levelId: packageItem.levelId,
    name: packageItem.name,
    priceAmount: packageItem.priceAmount,
    status: packageItem.status,
  };
}

function unwrapAdminResponse<T>(payload: unknown, copy: SdkworkVipAdminCopyContext, fallbackMessage: string): T {
  return unwrapSdkworkCommerceResponse<T>(payload, fallbackMessage || copy.service.loadFailed);
}

async function runVipAdminOperation<T>(
  operation: () => Promise<T>,
  copy: SdkworkVipAdminCopyContext,
  fallbackMessage: string,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw new Error(readVipAdminErrorMessage(error, fallbackMessage || copy.service.loadFailed));
  }
}

function readVipAdminErrorMessage(error: unknown, fallbackMessage: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
}

export function createSdkworkVipAdminService(
  options: CreateSdkworkVipAdminServiceOptions = {},
): SdkworkVipAdminService {
  const copy = createSdkworkVipAdminMessages(options.locale, options.messages);
  const getCommerceService = () => options.commerceService ?? getSdkworkCommerceService();

  const service: SdkworkVipAdminService = {
    async assignPackagesToGroup(packages, packageGroupId, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return Promise.all(
        packages.map((packageItem) => service.updatePackage(
          packageItem.id,
          createPackageGroupAssignmentInput(packageItem, packageGroupId),
          requestParams,
        )),
      );
    },

    async createLevel(input, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return runVipAdminOperation(
        async () => unwrapAdminResponse<SdkworkVipAdminLevel>(
          await (requestParams
            ? getCommerceService().admin.vip.levels.create(input, requestParams)
            : getCommerceService().admin.vip.levels.create(input)),
          copy,
          copy.service.levelCreateFailed,
        ),
        copy,
        copy.service.levelCreateFailed,
      );
    },

    async createPackage(input, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return runVipAdminOperation(
        async () => unwrapAdminResponse<SdkworkVipAdminPackage>(
          await (requestParams
            ? getCommerceService().admin.vip.packages.create(input, requestParams)
            : getCommerceService().admin.vip.packages.create(input)),
          copy,
          copy.service.packageCreateFailed,
        ),
        copy,
        copy.service.packageCreateFailed,
      );
    },

    async createPackageGroup(input, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return runVipAdminOperation(
        async () => unwrapAdminResponse<SdkworkVipAdminPackageGroup>(
          await (requestParams
            ? getCommerceService().admin.vip.packageGroups.create(input, requestParams)
            : getCommerceService().admin.vip.packageGroups.create(input)),
          copy,
          copy.service.packageGroupCreateFailed,
        ),
        copy,
        copy.service.packageGroupCreateFailed,
      );
    },

    async deleteLevel(levelId, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return runVipAdminOperation(
        async () => unwrapAdminResponse<SdkworkVipAdminLevelDeleteResult>(
          await (requestParams
            ? getCommerceService().admin.vip.levels.delete(levelId, requestParams)
            : getCommerceService().admin.vip.levels.delete(levelId)),
          copy,
          copy.service.levelDeleteFailed,
        ),
        copy,
        copy.service.levelDeleteFailed,
      );
    },

    async deletePackage(packageId, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return runVipAdminOperation(
        async () => unwrapAdminResponse<SdkworkVipAdminPackageDeleteResult>(
          await (requestParams
            ? getCommerceService().admin.vip.packages.delete(packageId, requestParams)
            : getCommerceService().admin.vip.packages.delete(packageId)),
          copy,
          copy.service.packageDeleteFailed,
        ),
        copy,
        copy.service.packageDeleteFailed,
      );
    },

    async deletePackageGroup(packageGroupId, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return runVipAdminOperation(
        async () => unwrapAdminResponse<SdkworkVipAdminPackageGroupDeleteResult>(
          await (requestParams
            ? getCommerceService().admin.vip.packageGroups.delete(packageGroupId, requestParams)
            : getCommerceService().admin.vip.packageGroups.delete(packageGroupId)),
          copy,
          copy.service.packageGroupDeleteFailed,
        ),
        copy,
        copy.service.packageGroupDeleteFailed,
      );
    },

    async getDashboard() {
      if (!hasSdkworkCommerceSession()) {
        return createEmptyDashboard();
      }

      const [levels, packages, packageGroups, memberships, entitlements] = await Promise.all([
        service.listLevels(),
        service.listPackages(),
        service.listPackageGroups(),
        service.listMemberships(),
        service.listEntitlements(),
      ]);

      return createDashboard({
        entitlements,
        levels,
        memberships,
        packageGroups,
        packages,
      });
    },

    getEmptyDashboard() {
      return createEmptyDashboard();
    },

    async listEntitlements(params) {
      return runVipAdminOperation(
        async () => extractRecords(
          unwrapAdminResponse<RemotePageEnvelope<SdkworkVipAdminEntitlement> | SdkworkVipAdminEntitlement[]>(
            await getCommerceService().admin.vip.entitlements.list(params),
            copy,
            copy.service.entitlementsLoadFailed,
          ),
        ),
        copy,
        copy.service.entitlementsLoadFailed,
      );
    },

    async listLevels(params) {
      return runVipAdminOperation(
        async () => extractRecords(
          unwrapAdminResponse<RemotePageEnvelope<SdkworkVipAdminLevel> | SdkworkVipAdminLevel[]>(
            await getCommerceService().admin.vip.levels.list(params),
            copy,
            copy.service.levelsLoadFailed,
          ),
        ),
        copy,
        copy.service.levelsLoadFailed,
      );
    },

    async listMemberships(params) {
      return runVipAdminOperation(
        async () => extractRecords(
          unwrapAdminResponse<RemotePageEnvelope<SdkworkVipAdminMembership> | SdkworkVipAdminMembership[]>(
            await getCommerceService().admin.vip.memberships.list(params),
            copy,
            copy.service.membershipsLoadFailed,
          ),
        ),
        copy,
        copy.service.membershipsLoadFailed,
      );
    },

    async listPackageGroups(params) {
      return runVipAdminOperation(
        async () => extractRecords(
          unwrapAdminResponse<RemotePageEnvelope<SdkworkVipAdminPackageGroup> | SdkworkVipAdminPackageGroup[]>(
            await getCommerceService().admin.vip.packageGroups.list(params),
            copy,
            copy.service.packageGroupsLoadFailed,
          ),
        ),
        copy,
        copy.service.packageGroupsLoadFailed,
      );
    },

    async listPackages(params) {
      return runVipAdminOperation(
        async () => extractRecords(
          unwrapAdminResponse<RemotePageEnvelope<SdkworkVipAdminPackage> | SdkworkVipAdminPackage[]>(
            await getCommerceService().admin.vip.packages.list(params),
            copy,
            copy.service.packagesLoadFailed,
          ),
        ),
        copy,
        copy.service.packagesLoadFailed,
      );
    },

    async updateLevel(levelId, input, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return runVipAdminOperation(
        async () => unwrapAdminResponse<SdkworkVipAdminLevel>(
          await (requestParams
            ? getCommerceService().admin.vip.levels.update(levelId, input, requestParams)
            : getCommerceService().admin.vip.levels.update(levelId, input)),
          copy,
          copy.service.levelUpdateFailed,
        ),
        copy,
        copy.service.levelUpdateFailed,
      );
    },

    async updateMembershipStatus(membershipId, input, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return runVipAdminOperation(
        async () => unwrapAdminResponse<SdkworkVipAdminMembership>(
          await (requestParams
            ? getCommerceService().admin.vip.memberships.update(membershipId, input, requestParams)
            : getCommerceService().admin.vip.memberships.update(membershipId, input)),
          copy,
          copy.service.membershipUpdateFailed,
        ),
        copy,
        copy.service.membershipUpdateFailed,
      );
    },

    async updatePackage(packageId, input, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return runVipAdminOperation(
        async () => unwrapAdminResponse<SdkworkVipAdminPackage>(
          await (requestParams
            ? getCommerceService().admin.vip.packages.update(packageId, input, requestParams)
            : getCommerceService().admin.vip.packages.update(packageId, input)),
          copy,
          copy.service.packageUpdateFailed,
        ),
        copy,
        copy.service.packageUpdateFailed,
      );
    },

    async updatePackageGroup(packageGroupId, input, requestParams) {
      requireSdkworkCommerceSession(copy.service.signInRequired);
      return runVipAdminOperation(
        async () => unwrapAdminResponse<SdkworkVipAdminPackageGroup>(
          await (requestParams
            ? getCommerceService().admin.vip.packageGroups.update(packageGroupId, input, requestParams)
            : getCommerceService().admin.vip.packageGroups.update(packageGroupId, input)),
          copy,
          copy.service.packageGroupUpdateFailed,
        ),
        copy,
        copy.service.packageGroupUpdateFailed,
      );
    },
  };

  return service;
}

export const sdkworkVipAdminService = createSdkworkVipAdminService();
