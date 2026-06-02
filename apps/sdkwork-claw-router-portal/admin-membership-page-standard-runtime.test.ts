import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("admin membership pages share standardized table and action controls", () => {
  const controlsSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/components/MembershipPageControls.tsx");
  const shellSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/components/MembershipAdminPageShell.tsx");
  const tablePages = [
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackagesPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipVipPackagesPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackageGroupsPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPlansPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipMembersPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipEntitlementsPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipRechargePackagesPage.tsx",
  ];
  const mutationPages = [
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackagesPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipVipPackagesPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackageGroupsPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPlansPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipMembersPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipRechargePackagesPage.tsx",
  ];
  const destructivePages = [
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackagesPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipVipPackagesPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackageGroupsPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPlansPage.tsx",
    "./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipRechargePackagesPage.tsx",
  ];

  for (const exportedMember of [
    "MembershipIconActionButton",
    "MembershipTableActions",
    "MembershipTablePanel",
    "confirmMembershipAction",
  ]) {
    assert.match(controlsSource, new RegExp(`export (?:function|const) ${exportedMember}\\b`), `${exportedMember} must be exported by shared membership page controls`);
  }

  assert.match(controlsSource, /aria-label=\{label\}/);
  assert.match(controlsSource, /title=\{label\}/);
  assert.match(controlsSource, /window\.confirm\(message\)/);
  assert.match(shellSource, /className="[^"]*justify-end[^"]*"/, "membership shell must keep only a compact right-aligned action toolbar");
  assert.doesNotMatch(shellSource, /\n\s+(?:title|description): string/, "membership shell must not expose duplicate page header props");
  assert.doesNotMatch(shellSource, /<h3[^>]*>\{title\}<\/h3>/, "membership shell must not render a duplicate page title");
  assert.doesNotMatch(shellSource, /\{description\}/, "membership shell must not render duplicate page description copy");

  for (const pageFile of tablePages) {
    const source = readPortalFile(pageFile);
    assert.match(source, /from '\.\.\/components\/MembershipPageControls'/, `${pageFile} must import shared page controls`);
    assert.match(source, /<MembershipTablePanel\b/, `${pageFile} must wrap tables in the shared table panel`);
    assert.doesNotMatch(source, /<MembershipAdminPageShell\s*\n\s+title=\{/, `${pageFile} must not pass duplicate page titles to the shell`);
    assert.doesNotMatch(source, /^\s+description=\{/m, `${pageFile} must not pass duplicate page descriptions to the shell`);
    assert.doesNotMatch(source, /overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-white\/10 dark:bg-white\/5/, `${pageFile} must not duplicate the table panel class`);
  }

  for (const pageFile of mutationPages) {
    const source = readPortalFile(pageFile);
    assert.match(source, /<MembershipIconActionButton\b/, `${pageFile} must use the shared icon action button`);
  }

  for (const pageFile of destructivePages) {
    const source = readPortalFile(pageFile);
    assert.match(source, /confirmMembershipAction\(/, `${pageFile} must route destructive confirmations through shared confirm helper`);
    assert.doesNotMatch(source, /window\.confirm\(/, `${pageFile} must not call window.confirm directly`);
  }
});

test("admin membership package sidebar exposes package group CRUD controls", () => {
  const packagesPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackagesPage.tsx");
  const dialogSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/components/MembershipDialog.tsx");

  for (const expectedImport of [
    "MembershipDialog",
    "MembershipPackageGroupDrawerForm",
    "createMembershipAdminPackageGroup",
    "updateMembershipAdminPackageGroup",
    "deleteMembershipAdminPackageGroup",
  ]) {
    assert.ok(packagesPageSource.includes(expectedImport), `packages page must use ${expectedImport}`);
  }

  for (const expectedMarker of [
    "data-admin-membership-package-groups-header",
    "data-admin-membership-package-group-add",
    "data-admin-membership-package-group-edit",
    "data-admin-membership-package-group-delete",
    "isGroupDialogOpen",
    "openCreateGroupDialog",
    "openEditGroupDialog",
    "handleSaveGroup",
    "handleDeleteGroup",
  ]) {
    assert.ok(packagesPageSource.includes(expectedMarker), `missing package group sidebar CRUD marker: ${expectedMarker}`);
  }

  assert.match(packagesPageSource, /confirmMembershipAction\(/);
  assert.doesNotMatch(packagesPageSource, /window\.confirm\(/);
  assert.match(packagesPageSource, /<MembershipDialog[\s\S]*<MembershipPackageGroupDrawerForm/);
  assert.match(dialogSource, /export function MembershipDialog\b/);
  assert.match(dialogSource, /role="dialog"/);
  assert.match(dialogSource, /aria-modal="true"/);
});

test("admin membership center exposes VIP package CRUD management", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const registrySource = readPortalFile("./src/adminModuleRegistry.ts");
  const membershipsIndexSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/index.tsx");
  const vipPackagesPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipVipPackagesPage.tsx");
  const navigationMessagesSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/admin/core-navigation.ts");
  const membershipMessagesSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/admin-commerce/memberships.ts");

  assert.match(appSource, /path="memberships\/vip-packages"/, "admin router must register VIP packages route");
  assert.match(appSource, /<MembershipsAdmin sectionId="vipPackages" \/>/, "VIP packages route must render membership admin vipPackages section");
  assert.match(registrySource, /path: '\/admin\/memberships\/vip-packages'/, "admin menu must expose VIP packages entry");
  assert.match(registrySource, /labelKey: 'admin\.menu\.membershipVipPackages'/, "admin menu must use VIP packages navigation label");

  assert.match(membershipsIndexSource, /\|\s+'vipPackages'/, "membership section id must include vipPackages");
  assert.match(membershipsIndexSource, /sectionId === 'vipPackages'/, "membership admin must resolve vipPackages section");
  assert.match(membershipsIndexSource, /<MembershipVipPackagesPage \/>/, "membership admin must render VIP packages page");

  for (const expectedImport of [
    "fetchMembershipAdminPackageCatalog",
    "createMembershipAdminPackage",
    "updateMembershipAdminPackage",
    "deleteMembershipAdminPackage",
    "MembershipPackageDrawerForm",
    "MembershipDrawer",
    "MembershipTablePanel",
    "MembershipIconActionButton",
    "confirmMembershipAction",
  ]) {
    assert.ok(vipPackagesPageSource.includes(expectedImport), `VIP packages page must use ${expectedImport}`);
  }

  for (const expectedMarker of [
    "data-admin-membership-vip-packages-page",
    "data-admin-membership-vip-package-add",
    "data-admin-membership-vip-package-edit",
    "data-admin-membership-vip-package-delete",
    "handleSavePackage",
    "handleDeletePackage",
  ]) {
    assert.ok(vipPackagesPageSource.includes(expectedMarker), `missing VIP package CRUD marker: ${expectedMarker}`);
  }

  assert.match(vipPackagesPageSource, /createMembershipAdminPackage\(input\)/);
  assert.match(vipPackagesPageSource, /updateMembershipAdminPackage\(editingPackage\.id,\s*input\)/);
  assert.match(vipPackagesPageSource, /deleteMembershipAdminPackage\(item\.id\)/);
  assert.match(vipPackagesPageSource, /translationKeyPrefix="admin\.commerce\.memberships\.vipPackages"/);
  assert.match(vipPackagesPageSource, /confirmMembershipAction\(/);
  assert.doesNotMatch(vipPackagesPageSource, /window\.confirm\(/);
  assert.doesNotMatch(vipPackagesPageSource, /\bfetch\(/);
  assert.doesNotMatch(vipPackagesPageSource, /\baxios\b/);

  assert.match(navigationMessagesSource, /"admin\.menu\.membershipVipPackages"/);
  assert.match(membershipMessagesSource, /"admin\.commerce\.memberships\.vipPackages\.title"/);
  assert.match(membershipMessagesSource, /"admin\.commerce\.memberships\.vipPackages\.form\.submit"/);
  assert.match(membershipMessagesSource, /"admin\.commerce\.memberships\.vipPackages\.form\.updateSubmit"/);
});

test("admin membership package groups are sort-weight ordered and movable", async () => {
  const packagesPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackagesPage.tsx");
  const membershipsServiceSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/membershipsService.ts");
  const membershipsService = await import("./packages/sdkwork-claw-router-admin-memberships/src/membershipsService.ts");

  assert.match(membershipsServiceSource, /export function sortMembershipAdminPackageGroups\b/);
  assert.match(membershipsServiceSource, /export function moveMembershipAdminPackageGroup\b/);
  assert.match(membershipsServiceSource, /sortMembershipAdminPackageGroups\(Array\.from\(groupMap\.values\(\)\)\)/);
  assert.match(membershipsServiceSource, /sortMembershipAdminPackageGroups\(groups\.map\(\(group\) => \(\{/);

  for (const expectedMarker of [
    "ArrowUp",
    "ArrowDown",
    "handleMoveGroup",
    "moveMembershipPackageGroup",
    "buildPackageGroupMutationInput",
    "data-admin-membership-package-group-move-up",
    "data-admin-membership-package-group-move-down",
  ]) {
    assert.ok(packagesPageSource.includes(expectedMarker), `missing package group move marker: ${expectedMarker}`);
  }

  assert.match(packagesPageSource, /moveMembershipPackageGroup\(groups, group\.id, direction\)/);
  assert.match(packagesPageSource, /updateMembershipAdminPackageGroup\(group\.id,\s*buildPackageGroupMutationInput\(group\)\)/);
  assert.match(packagesPageSource, /disabled=\{index === 0 \|\| movingGroupId === group\.id\}/);
  assert.match(packagesPageSource, /disabled=\{index === groups\.length - 1 \|\| movingGroupId === group\.id\}/);

  const groups = [
    membershipPackageGroup({ id: "year", code: "year", name: "Yearly", sortWeight: 30 }),
    membershipPackageGroup({ id: "month-b", code: "month-b", name: "Monthly B", sortWeight: 10 }),
    membershipPackageGroup({ id: "month-a", code: "month-a", name: "Monthly A", sortWeight: 10 }),
  ];

  const sorted = membershipsService.sortMembershipAdminPackageGroups(groups);

  assert.deepEqual(sorted.map((group) => group.id), ["month-a", "month-b", "year"]);
  assert.deepEqual(groups.map((group) => group.id), ["year", "month-b", "month-a"]);

  const movedDown = membershipsService.moveMembershipAdminPackageGroup(groups, "month-a", "down");
  assert.deepEqual(movedDown.map((group) => [group.id, group.sortWeight]), [
    ["month-b", 10],
    ["month-a", 20],
    ["year", 30],
  ]);

  const movedUp = membershipsService.moveMembershipAdminPackageGroup(groups, "year", "up");
  assert.deepEqual(movedUp.map((group) => [group.id, group.sortWeight]), [
    ["month-a", 10],
    ["year", 20],
    ["month-b", 30],
  ]);
});

function membershipPackageGroup(overrides: Record<string, unknown>) {
  return {
    id: "",
    code: "",
    name: "",
    billingCycle: "month",
    durationDays: 30,
    sortWeight: 0,
    status: "active",
    packageCount: 0,
    ...overrides,
  };
}
