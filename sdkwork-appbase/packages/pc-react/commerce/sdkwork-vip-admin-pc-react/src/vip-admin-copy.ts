export type SdkworkVipAdminLocale = "en-US" | "zh-CN";

export type SdkworkVipAdminMessagesOverrides = DeepPartial<SdkworkVipAdminMessages>;

export interface SdkworkVipAdminMessages {
  actions: {
    entitlements: string;
    levels: string;
    memberships: string;
    packages: string;
    refresh: string;
  };
  page: {
    description: string;
    emptyDescription: string;
    emptyTitle: string;
    errorTitle: string;
    loading: string;
    title: string;
  };
  service: {
    entitlementsLoadFailed: string;
    levelCreateFailed: string;
    levelDeleteFailed: string;
    packageCreateFailed: string;
    packageDeleteFailed: string;
    packageGroupCreateFailed: string;
    packageGroupDeleteFailed: string;
    packageGroupsLoadFailed: string;
    packageGroupUpdateFailed: string;
    levelsLoadFailed: string;
    levelUpdateFailed: string;
    loadFailed: string;
    membershipsLoadFailed: string;
    membershipUpdateFailed: string;
    packagesLoadFailed: string;
    packageUpdateFailed: string;
    signInRequired: string;
  };
  status: {
    disabled: string;
    enabled: string;
    unknown: string;
  };
  summary: {
    activeMemberships: string;
    entitlements: string;
    levels: string;
    packages: string;
  };
  ui: Record<string, string>;
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends (...args: never[]) => unknown
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeDeep<T>(base: T, overrides?: DeepPartial<T>): T {
  if (!overrides) {
    return base;
  }

  const output: Record<string, unknown> = {
    ...(base as Record<string, unknown>),
  };

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      continue;
    }

    const baseValue = output[key];
    output[key] = isRecord(baseValue) && isRecord(value)
      ? mergeDeep(baseValue, value)
      : value;
  }

  return output as T;
}

const EN_US_MESSAGES: SdkworkVipAdminMessages = {
  actions: {
    entitlements: "Entitlements",
    levels: "Levels",
    memberships: "Memberships",
    packages: "Packages",
    refresh: "Refresh",
  },
  page: {
    description: "Manage VIP levels, packages, memberships, and entitlement inventory from one admin workspace.",
    emptyDescription: "Admin VIP records will appear after the commerce backend returns data.",
    emptyTitle: "No VIP admin records",
    errorTitle: "VIP admin error",
    loading: "Loading VIP admin...",
    title: "VIP Admin",
  },
  service: {
    entitlementsLoadFailed: "Failed to load VIP entitlements.",
    levelCreateFailed: "Failed to create VIP level.",
    levelDeleteFailed: "Failed to delete VIP level.",
    packageCreateFailed: "Failed to create VIP package.",
    packageDeleteFailed: "Failed to delete VIP package.",
    packageGroupCreateFailed: "Failed to create VIP package group.",
    packageGroupDeleteFailed: "Failed to delete VIP package group.",
    packageGroupsLoadFailed: "Failed to load VIP package groups.",
    packageGroupUpdateFailed: "Failed to update VIP package group.",
    levelsLoadFailed: "Failed to load VIP levels.",
    levelUpdateFailed: "Failed to update VIP levels.",
    loadFailed: "Failed to load VIP admin data.",
    membershipsLoadFailed: "Failed to load VIP memberships.",
    membershipUpdateFailed: "Failed to update VIP membership.",
    packagesLoadFailed: "Failed to load VIP packages.",
    packageUpdateFailed: "Failed to update VIP packages.",
    signInRequired: "Please sign in to manage VIP administration.",
  },
  status: {
    disabled: "Disabled",
    enabled: "Enabled",
    unknown: "Unknown",
  },
  summary: {
    activeMemberships: "Active memberships",
    entitlements: "Entitlements",
    levels: "Levels",
    packages: "Packages",
  },
  ui: {
    "admin.vip.actions.addPackageToGroup": "Add package to group",
    "admin.vip.actions.addSelectedPackages": "Add selected packages",
    "admin.vip.actions.cancel": "Cancel",
    "admin.vip.actions.closeModal": "Close modal",
    "admin.vip.actions.confirm": "Confirm",
    "admin.vip.actions.createGroup": "Create group",
    "admin.vip.actions.createLevel": "New level",
    "admin.vip.actions.createPackage": "Create package",
    "admin.vip.actions.delete": "Delete",
    "admin.vip.actions.disable": "Disable",
    "admin.vip.actions.edit": "Edit",
    "admin.vip.actions.refresh": "Refresh",
    "admin.vip.actions.saveGroup": "Save group",
    "admin.vip.actions.saveLevel": "Save level",
    "admin.vip.actions.savePackage": "Save package",
    "admin.vip.actions.saving": "Saving...",
    "admin.vip.empty.entitlements": "No VIP entitlements found",
    "admin.vip.empty.groupPackages": "No packages in this group",
    "admin.vip.empty.levels": "No VIP levels found",
    "admin.vip.empty.memberships": "No VIP memberships found",
    "admin.vip.empty.noPackageGroupSelected": "Select a package group first",
    "admin.vip.empty.noPackagesToAdd": "No packages available to add",
    "admin.vip.empty.packageGroups": "No VIP package groups found",
    "admin.vip.errors.activeLevelRequired": "Create an active VIP level before adding packages.",
    "admin.vip.errors.activePackageGroupRequired": "Create an active VIP package group before adding packages.",
    "admin.vip.errors.entitlementsLoadFallback": "Failed to load VIP entitlements.",
    "admin.vip.errors.invalidDurationDays": "Duration days must be a positive integer.",
    "admin.vip.errors.invalidLevelStatus": "Invalid VIP level status.",
    "admin.vip.errors.invalidMembershipStatus": "Invalid VIP membership status.",
    "admin.vip.errors.invalidPackageGroupStatus": "Invalid VIP package group status.",
    "admin.vip.errors.invalidPackageStatus": "Invalid VIP package status.",
    "admin.vip.errors.invalidRank": "Rank must be a non-negative integer.",
    "admin.vip.errors.invalidSortWeight": "Sort weight must be a non-negative integer.",
    "admin.vip.errors.levelCreateFallback": "Failed to create VIP level.",
    "admin.vip.errors.levelDeleteFallback": "Failed to disable VIP level.",
    "admin.vip.errors.levelSaveFallback": "Failed to save VIP level.",
    "admin.vip.errors.levelsLoadFallback": "Failed to load VIP levels.",
    "admin.vip.errors.loadFallback": "Failed to load VIP management data.",
    "admin.vip.errors.membershipStatusFallback": "Failed to update VIP membership status.",
    "admin.vip.errors.membershipsLoadFallback": "Failed to load VIP memberships.",
    "admin.vip.errors.packageCreateFallback": "Failed to create VIP package.",
    "admin.vip.errors.packageDeleteFallback": "Failed to delete VIP package.",
    "admin.vip.errors.packageGroupCreateFallback": "Failed to create VIP package group.",
    "admin.vip.errors.packageGroupDeleteFallback": "Failed to delete VIP package group.",
    "admin.vip.errors.packageGroupSaveFallback": "Failed to save VIP package group.",
    "admin.vip.errors.packageGroupsLoadFallback": "Failed to load VIP package groups.",
    "admin.vip.errors.packageSaveFallback": "Failed to save VIP package.",
    "admin.vip.errors.packagesLoadFallback": "Failed to load VIP packages.",
    "admin.vip.errors.saveLevelFallback": "Failed to save VIP level.",
    "admin.vip.errors.savePackageFallback": "Failed to save VIP package.",
    "admin.vip.fields.billingCycle": "Billing cycle",
    "admin.vip.fields.code": "Code",
    "admin.vip.fields.currency": "Currency",
    "admin.vip.fields.description": "Description",
    "admin.vip.fields.durationDays": "Duration days",
    "admin.vip.fields.level": "Level",
    "admin.vip.fields.name": "Name",
    "admin.vip.fields.packageGroup": "Package Group",
    "admin.vip.fields.price": "Price",
    "admin.vip.fields.rank": "Rank",
    "admin.vip.fields.sortWeight": "Sort weight",
    "admin.vip.fields.status": "Status",
    "admin.vip.forms.levelDefinition": "Level Definition",
    "admin.vip.forms.purchasePackage": "Purchase Package",
    "admin.vip.labels.packageGroups": "Package groups",
    "admin.vip.modals.addPackagesToGroupTitle": "Add packages to group",
    "admin.vip.modals.addPackagesToNamedGroupTitle": "Add packages to {name}",
    "admin.vip.modals.createGroupTitle": "Create VIP package group",
    "admin.vip.modals.createLevelTitle": "Create VIP level",
    "admin.vip.modals.createPackageTitle": "Create VIP package",
    "admin.vip.modals.deleteGroupTitle": "Delete VIP package group",
    "admin.vip.modals.deletePackageTitle": "Delete VIP package",
    "admin.vip.modals.disableLevelTitle": "Disable VIP level",
    "admin.vip.modals.editGroupTitle": "Edit VIP package group",
    "admin.vip.modals.editLevelTitle": "Edit VIP level",
    "admin.vip.modals.editPackageTitle": "Edit VIP package",
    "admin.vip.states.loadError": "VIP management data could not be loaded",
    "admin.vip.states.loading": "Loading VIP management data...",
    "admin.vip.states.saveErrorTitle": "VIP management change was not saved",
    "admin.vip.status.active": "Active",
    "admin.vip.status.cancelled": "Cancelled",
    "admin.vip.status.disabled": "Disabled",
    "admin.vip.status.exhausted": "Exhausted",
    "admin.vip.status.expired": "Expired",
    "admin.vip.status.inactive": "Inactive",
    "admin.vip.status.suspended": "Suspended",
    "admin.vip.table.billingCycle": "Billing Cycle",
    "admin.vip.table.expires": "Expires",
    "admin.vip.table.group": "Group",
    "admin.vip.table.id": "ID",
    "admin.vip.table.operations": "Operations",
    "admin.vip.table.sort": "Sort",
    "admin.vip.table.started": "Started",
    "admin.vip.table.user": "User",
    "admin.vip.tabs.entitlements": "Entitlements",
    "admin.vip.tabs.levels": "VIP Levels",
    "admin.vip.tabs.memberships": "Memberships",
    "admin.vip.tabs.packages": "Packages",
    "admin.vip.filters.packagePickerSearch": "Search packages...",
    "admin.vip.filters.search": "Search VIP records...",
    "common.retry": "Retry",
  },
};

const ZH_CN_MESSAGES: SdkworkVipAdminMessages = {
  actions: {
    entitlements: "\u6743\u76ca",
    levels: "\u7b49\u7ea7",
    memberships: "\u4f1a\u5458",
    packages: "\u5957\u9910",
    refresh: "\u5237\u65b0",
  },
  page: {
    description: "\u5728\u4e00\u4e2a\u7ba1\u7406\u5de5\u4f5c\u53f0\u4e2d\u7edf\u4e00\u7ba1\u7406 VIP \u7b49\u7ea7\u3001\u5957\u9910\u3001\u4f1a\u5458\u548c\u6743\u76ca\u5e93\u5b58\u3002",
    emptyDescription: "\u5f53\u5546\u4e1a\u540e\u53f0\u8fd4\u56de\u6570\u636e\u540e\uff0cVIP \u7ba1\u7406\u8bb0\u5f55\u4f1a\u663e\u793a\u5728\u8fd9\u91cc\u3002",
    emptyTitle: "\u6682\u65e0 VIP \u7ba1\u7406\u8bb0\u5f55",
    errorTitle: "VIP \u7ba1\u7406\u5f02\u5e38",
    loading: "\u6b63\u5728\u52a0\u8f7d VIP \u7ba1\u7406...",
    title: "VIP \u7ba1\u7406",
  },
  service: {
    entitlementsLoadFailed: "\u52a0\u8f7d VIP \u6743\u76ca\u5931\u8d25\u3002",
    levelCreateFailed: "\u521b\u5efa VIP \u7b49\u7ea7\u5931\u8d25\u3002",
    levelDeleteFailed: "\u5220\u9664 VIP \u7b49\u7ea7\u5931\u8d25\u3002",
    packageCreateFailed: "\u521b\u5efa VIP \u5957\u9910\u5931\u8d25\u3002",
    packageDeleteFailed: "\u5220\u9664 VIP \u5957\u9910\u5931\u8d25\u3002",
    packageGroupCreateFailed: "\u521b\u5efa VIP \u5957\u9910\u5206\u7ec4\u5931\u8d25\u3002",
    packageGroupDeleteFailed: "\u5220\u9664 VIP \u5957\u9910\u5206\u7ec4\u5931\u8d25\u3002",
    packageGroupsLoadFailed: "\u52a0\u8f7d VIP \u5957\u9910\u5206\u7ec4\u5931\u8d25\u3002",
    packageGroupUpdateFailed: "\u66f4\u65b0 VIP \u5957\u9910\u5206\u7ec4\u5931\u8d25\u3002",
    levelsLoadFailed: "\u52a0\u8f7d VIP \u7b49\u7ea7\u5931\u8d25\u3002",
    levelUpdateFailed: "\u66f4\u65b0 VIP \u7b49\u7ea7\u5931\u8d25\u3002",
    loadFailed: "\u52a0\u8f7d VIP \u7ba1\u7406\u6570\u636e\u5931\u8d25\u3002",
    membershipsLoadFailed: "\u52a0\u8f7d VIP \u4f1a\u5458\u5931\u8d25\u3002",
    membershipUpdateFailed: "\u66f4\u65b0 VIP \u4f1a\u5458\u5931\u8d25\u3002",
    packagesLoadFailed: "\u52a0\u8f7d VIP \u5957\u9910\u5931\u8d25\u3002",
    packageUpdateFailed: "\u66f4\u65b0 VIP \u5957\u9910\u5931\u8d25\u3002",
    signInRequired: "\u8bf7\u5148\u767b\u5f55\u540e\u518d\u7ba1\u7406 VIP \u540e\u53f0\u3002",
  },
  status: {
    disabled: "\u5df2\u505c\u7528",
    enabled: "\u5df2\u542f\u7528",
    unknown: "\u672a\u77e5",
  },
  summary: {
    activeMemberships: "\u751f\u6548\u4f1a\u5458",
    entitlements: "\u6743\u76ca",
    levels: "\u7b49\u7ea7",
    packages: "\u5957\u9910",
  },
  ui: {
    "admin.vip.actions.addPackageToGroup": "\u6dfb\u52a0\u5957\u9910\u5230\u5206\u7ec4",
    "admin.vip.actions.addSelectedPackages": "\u6dfb\u52a0\u5df2\u9009\u5957\u9910",
    "admin.vip.actions.cancel": "\u53d6\u6d88",
    "admin.vip.actions.closeModal": "\u5173\u95ed\u5f39\u7a97",
    "admin.vip.actions.confirm": "\u786e\u8ba4",
    "admin.vip.actions.createGroup": "\u521b\u5efa\u5206\u7ec4",
    "admin.vip.actions.createLevel": "\u65b0\u5efa\u7b49\u7ea7",
    "admin.vip.actions.createPackage": "\u521b\u5efa\u5957\u9910",
    "admin.vip.actions.delete": "\u5220\u9664",
    "admin.vip.actions.disable": "\u505c\u7528",
    "admin.vip.actions.edit": "\u7f16\u8f91",
    "admin.vip.actions.refresh": "\u5237\u65b0",
    "admin.vip.actions.saveGroup": "\u4fdd\u5b58\u5206\u7ec4",
    "admin.vip.actions.saveLevel": "\u4fdd\u5b58\u7b49\u7ea7",
    "admin.vip.actions.savePackage": "\u4fdd\u5b58\u5957\u9910",
    "admin.vip.actions.saving": "\u4fdd\u5b58\u4e2d...",
    "admin.vip.empty.entitlements": "\u6682\u65e0 VIP \u6743\u76ca",
    "admin.vip.empty.groupPackages": "\u5f53\u524d\u5206\u7ec4\u6682\u65e0\u5957\u9910",
    "admin.vip.empty.levels": "\u6682\u65e0 VIP \u7b49\u7ea7",
    "admin.vip.empty.memberships": "\u6682\u65e0 VIP \u4f1a\u5458",
    "admin.vip.empty.noPackageGroupSelected": "\u8bf7\u5148\u9009\u62e9\u5957\u9910\u5206\u7ec4",
    "admin.vip.empty.noPackagesToAdd": "\u6682\u65e0\u53ef\u6dfb\u52a0\u5957\u9910",
    "admin.vip.empty.packageGroups": "\u6682\u65e0 VIP \u5957\u9910\u5206\u7ec4",
    "admin.vip.errors.activeLevelRequired": "\u8bf7\u5148\u521b\u5efa\u542f\u7528\u72b6\u6001\u7684 VIP \u7b49\u7ea7\u3002",
    "admin.vip.errors.activePackageGroupRequired": "\u8bf7\u5148\u521b\u5efa\u542f\u7528\u72b6\u6001\u7684 VIP \u5957\u9910\u5206\u7ec4\u3002",
    "admin.vip.errors.entitlementsLoadFallback": "VIP \u6743\u76ca\u52a0\u8f7d\u5931\u8d25\u3002",
    "admin.vip.errors.invalidDurationDays": "\u6709\u6548\u5929\u6570\u5fc5\u987b\u662f\u6b63\u6574\u6570\u3002",
    "admin.vip.errors.invalidLevelStatus": "VIP \u7b49\u7ea7\u72b6\u6001\u65e0\u6548\u3002",
    "admin.vip.errors.invalidMembershipStatus": "VIP \u4f1a\u5458\u72b6\u6001\u65e0\u6548\u3002",
    "admin.vip.errors.invalidPackageGroupStatus": "VIP \u5957\u9910\u5206\u7ec4\u72b6\u6001\u65e0\u6548\u3002",
    "admin.vip.errors.invalidPackageStatus": "VIP \u5957\u9910\u72b6\u6001\u65e0\u6548\u3002",
    "admin.vip.errors.invalidRank": "\u6392\u5e8f\u7b49\u7ea7\u5fc5\u987b\u662f\u975e\u8d1f\u6574\u6570\u3002",
    "admin.vip.errors.invalidSortWeight": "\u6392\u5e8f\u6743\u91cd\u5fc5\u987b\u662f\u975e\u8d1f\u6574\u6570\u3002",
    "admin.vip.errors.levelCreateFallback": "VIP \u7b49\u7ea7\u521b\u5efa\u5931\u8d25\u3002",
    "admin.vip.errors.levelDeleteFallback": "VIP \u7b49\u7ea7\u505c\u7528\u5931\u8d25\u3002",
    "admin.vip.errors.levelSaveFallback": "VIP \u7b49\u7ea7\u4fdd\u5b58\u5931\u8d25\u3002",
    "admin.vip.errors.levelsLoadFallback": "VIP \u7b49\u7ea7\u52a0\u8f7d\u5931\u8d25\u3002",
    "admin.vip.errors.loadFallback": "VIP \u7ba1\u7406\u6570\u636e\u52a0\u8f7d\u5931\u8d25\u3002",
    "admin.vip.errors.membershipStatusFallback": "VIP \u4f1a\u5458\u72b6\u6001\u66f4\u65b0\u5931\u8d25\u3002",
    "admin.vip.errors.membershipsLoadFallback": "VIP \u4f1a\u5458\u52a0\u8f7d\u5931\u8d25\u3002",
    "admin.vip.errors.packageCreateFallback": "VIP \u5957\u9910\u521b\u5efa\u5931\u8d25\u3002",
    "admin.vip.errors.packageDeleteFallback": "VIP \u5957\u9910\u5220\u9664\u5931\u8d25\u3002",
    "admin.vip.errors.packageGroupCreateFallback": "VIP \u5957\u9910\u5206\u7ec4\u521b\u5efa\u5931\u8d25\u3002",
    "admin.vip.errors.packageGroupDeleteFallback": "VIP \u5957\u9910\u5206\u7ec4\u5220\u9664\u5931\u8d25\u3002",
    "admin.vip.errors.packageGroupSaveFallback": "VIP \u5957\u9910\u5206\u7ec4\u4fdd\u5b58\u5931\u8d25\u3002",
    "admin.vip.errors.packageGroupsLoadFallback": "VIP \u5957\u9910\u5206\u7ec4\u52a0\u8f7d\u5931\u8d25\u3002",
    "admin.vip.errors.packageSaveFallback": "VIP \u5957\u9910\u4fdd\u5b58\u5931\u8d25\u3002",
    "admin.vip.errors.packagesLoadFallback": "VIP \u5957\u9910\u52a0\u8f7d\u5931\u8d25\u3002",
    "admin.vip.errors.saveLevelFallback": "VIP \u7b49\u7ea7\u4fdd\u5b58\u5931\u8d25\u3002",
    "admin.vip.errors.savePackageFallback": "VIP \u5957\u9910\u4fdd\u5b58\u5931\u8d25\u3002",
    "admin.vip.fields.billingCycle": "\u8ba1\u8d39\u5468\u671f",
    "admin.vip.fields.code": "\u7f16\u7801",
    "admin.vip.fields.currency": "\u5e01\u79cd",
    "admin.vip.fields.description": "\u63cf\u8ff0",
    "admin.vip.fields.durationDays": "\u6709\u6548\u5929\u6570",
    "admin.vip.fields.level": "\u7b49\u7ea7",
    "admin.vip.fields.name": "\u540d\u79f0",
    "admin.vip.fields.packageGroup": "\u5957\u9910\u5206\u7ec4",
    "admin.vip.fields.price": "\u4ef7\u683c",
    "admin.vip.fields.rank": "\u6392\u5e8f\u7b49\u7ea7",
    "admin.vip.fields.sortWeight": "\u6392\u5e8f\u6743\u91cd",
    "admin.vip.fields.status": "\u72b6\u6001",
    "admin.vip.forms.levelDefinition": "\u7b49\u7ea7\u5b9a\u4e49",
    "admin.vip.forms.purchasePackage": "\u8d2d\u4e70\u5957\u9910",
    "admin.vip.labels.packageGroups": "\u5957\u9910\u5206\u7ec4",
    "admin.vip.modals.addPackagesToGroupTitle": "\u6dfb\u52a0\u5957\u9910\u5230\u5206\u7ec4",
    "admin.vip.modals.addPackagesToNamedGroupTitle": "\u6dfb\u52a0\u5957\u9910\u5230 {name}",
    "admin.vip.modals.createGroupTitle": "\u521b\u5efa VIP \u5957\u9910\u5206\u7ec4",
    "admin.vip.modals.createLevelTitle": "\u521b\u5efa VIP \u7b49\u7ea7",
    "admin.vip.modals.createPackageTitle": "\u521b\u5efa VIP \u5957\u9910",
    "admin.vip.modals.deleteGroupTitle": "\u5220\u9664 VIP \u5957\u9910\u5206\u7ec4",
    "admin.vip.modals.deletePackageTitle": "\u5220\u9664 VIP \u5957\u9910",
    "admin.vip.modals.disableLevelTitle": "\u505c\u7528 VIP \u7b49\u7ea7",
    "admin.vip.modals.editGroupTitle": "\u7f16\u8f91 VIP \u5957\u9910\u5206\u7ec4",
    "admin.vip.modals.editLevelTitle": "\u7f16\u8f91 VIP \u7b49\u7ea7",
    "admin.vip.modals.editPackageTitle": "\u7f16\u8f91 VIP \u5957\u9910",
    "admin.vip.states.loadError": "VIP \u7ba1\u7406\u6570\u636e\u52a0\u8f7d\u5931\u8d25",
    "admin.vip.states.loading": "\u6b63\u5728\u52a0\u8f7d VIP \u7ba1\u7406\u6570\u636e...",
    "admin.vip.states.saveErrorTitle": "VIP \u7ba1\u7406\u53d8\u66f4\u672a\u4fdd\u5b58",
    "admin.vip.status.active": "\u542f\u7528",
    "admin.vip.status.cancelled": "\u5df2\u53d6\u6d88",
    "admin.vip.status.disabled": "\u5df2\u505c\u7528",
    "admin.vip.status.exhausted": "\u5df2\u7528\u5c3d",
    "admin.vip.status.expired": "\u5df2\u8fc7\u671f",
    "admin.vip.status.inactive": "\u672a\u542f\u7528",
    "admin.vip.status.suspended": "\u5df2\u6682\u505c",
    "admin.vip.table.billingCycle": "\u8ba1\u8d39\u5468\u671f",
    "admin.vip.table.expires": "\u5230\u671f\u65f6\u95f4",
    "admin.vip.table.group": "\u5206\u7ec4",
    "admin.vip.table.id": "ID",
    "admin.vip.table.operations": "\u64cd\u4f5c",
    "admin.vip.table.sort": "\u6392\u5e8f",
    "admin.vip.table.started": "\u5f00\u59cb\u65f6\u95f4",
    "admin.vip.table.user": "\u7528\u6237",
    "admin.vip.tabs.entitlements": "\u6743\u76ca",
    "admin.vip.tabs.levels": "VIP \u7b49\u7ea7",
    "admin.vip.tabs.memberships": "\u4f1a\u5458",
    "admin.vip.tabs.packages": "\u5957\u9910",
    "admin.vip.filters.packagePickerSearch": "\u641c\u7d22\u5957\u9910...",
    "admin.vip.filters.search": "\u641c\u7d22 VIP \u8bb0\u5f55...",
    "common.retry": "\u91cd\u8bd5",
  },
};

const SDKWORK_VIP_ADMIN_MESSAGES: Record<SdkworkVipAdminLocale, SdkworkVipAdminMessages> = {
  "en-US": EN_US_MESSAGES,
  "zh-CN": ZH_CN_MESSAGES,
};

export function normalizeSdkworkVipAdminLocale(locale?: string | null): SdkworkVipAdminLocale {
  const normalized = String(locale || "").trim().toLowerCase();
  if (normalized.startsWith("zh")) {
    return "zh-CN";
  }

  return "en-US";
}

export function createSdkworkVipAdminMessages(
  locale?: string | null,
  overrides?: SdkworkVipAdminMessagesOverrides,
): SdkworkVipAdminMessages {
  return mergeDeep(
    SDKWORK_VIP_ADMIN_MESSAGES[normalizeSdkworkVipAdminLocale(locale)],
    overrides,
  );
}
