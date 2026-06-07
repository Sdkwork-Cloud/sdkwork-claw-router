import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("admin membership entitlements are owned by the standard memberships business package", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const packageJson = readPortalFile("./package.json");
  const viewSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/index.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/membershipsService.ts");
  const packagesPageSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/pages/MembershipPackagesPage.tsx");
  const packageGroupsPageSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/pages/MembershipPackageGroupsPage.tsx");
  const plansPageSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/pages/MembershipPlansPage.tsx");
  const membersPageSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/pages/MembershipMembersPage.tsx");
  const entitlementsPageSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/pages/MembershipEntitlementsPage.tsx");
  const rechargePackagesPageSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/pages/MembershipRechargePackagesPage.tsx");
  const drawerSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/components/MembershipDrawer.tsx");
  const routeClassification = readPortalFile("../../docs/schema-registry/frontend-route-classification.yaml");
  const commerceBackendOpenapi = readPortalFile("../../../sdkwork-commerce/generated/openapi/commerce-backend-api.openapi.json");
  const commerceBackendMembershipsSdk = readPortalFile("../../../sdkwork-commerce/sdks/sdkwork-commerce-backend-sdk/sdkwork-commerce-backend-sdk-typescript/generated/server-openapi/src/api/memberships.ts");

  assert.match(appSource, /const MembershipsAdmin = lazyRoute(?:<AdminSectionRouteProps>)?\(\(\) => import\('sdkwork-clawrouter-pc-admin-memberships'\), 'MembershipsAdmin'\)/);
  assert.match(appSource, /<Route path="memberships" element=\{<Navigate to="\/admin\/memberships\/packages" replace \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/packages" element=\{<MembershipsAdmin sectionId="packages" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/vip-packages" element=\{<MembershipsAdmin sectionId="vipPackages" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/plans" element=\{<MembershipsAdmin sectionId="plans" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/members" element=\{<MembershipsAdmin sectionId="members" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/entitlements" element=\{<MembershipsAdmin sectionId="entitlements" \/>} \/>/);
  assert.match(adminLayoutSource, /\/admin\/memberships/);
  assert.match(packageJson, /"sdkwork-clawrouter-pc-admin-memberships": "workspace:\*"/);
  assert.match(routeClassification, /route: \/admin\/memberships[\s\S]*package: sdkwork-clawrouter-pc-admin-memberships[\s\S]*api_surface: backend/);

  for (const marker of [
    "MembershipsAdmin",
    "MembershipPlansPage",
    "MembershipPackageGroupsPage",
    "MembershipVipPackagesPage",
    "MembersTab",
    "EntitlementsTab",
    "fetchMembershipAdminEntitlements",
  ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(marker)));
  }
  assert.match(plansPageSource, /Membership levels/i);
  assert.match(packageGroupsPageSource, /Package groups/i);

  assert.match(serviceSource, /getSdkworkCommerceService\(\)\.admin\.memberships\.entitlements\.list/);
  assert.doesNotMatch(serviceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.memberships/);
  assert.match(commerceBackendOpenapi, /"\/backend\/v3\/api\/memberships\/entitlements"/);
  assert.match(commerceBackendOpenapi, /"operationId": "memberships\.entitlements\.list"/);
  assert.doesNotMatch(commerceBackendOpenapi, /"operationId": "memberships\.entitlements\.management\.list"/);
  assert.match(commerceBackendMembershipsSdk, /class MembershipsEntitlementsApi/);
  assert.match(commerceBackendMembershipsSdk, /backendApiPath\(`\/memberships\/entitlements`\)/);
  assert.match(commerceBackendMembershipsSdk, /async list\(params\?: MembershipsEntitlementsListParams/);
  assert.doesNotMatch(commerceBackendMembershipsSdk, /MembershipsEntitlementsManagementApi/);

  for (const pageName of [
    "MembershipPackagesPage",
    "MembershipPackageGroupsPage",
    "MembershipPlansPage",
    "MembershipMembersPage",
    "MembershipEntitlementsPage",
    "MembershipRechargePackagesPage",
  ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(pageName)), `${pageName} must be dispatched from MembershipsAdmin`);
  }

  for (const retiredInlineTab of [
    "function PlansTab",
    "function MembersTab",
    "function EntitlementsTab",
    "function RechargePackagesTab",
  ]) {
    assert.doesNotMatch(viewSource, new RegExp(escapeRegExp(retiredInlineTab)), `${retiredInlineTab} must move into independent page components`);
  }

  for (const serviceFunction of [
    "fetchMembershipAdminPackageGroups",
    "createMembershipAdminPackageGroup",
    "updateMembershipAdminPackageGroup",
    "deleteMembershipAdminPackageGroup",
    "fetchMembershipAdminPackages",
    "createMembershipAdminPackage",
    "updateMembershipAdminPackage",
    "deleteMembershipAdminPackage",
    "updateMembershipAdminPlan",
    "deleteMembershipAdminPlan",
    "updateMembershipAdminMemberStatus",
  ]) {
    assert.match(serviceSource, new RegExp(escapeRegExp(serviceFunction)), `${serviceFunction} must be exposed by membershipsService`);
  }

  for (const sdkCall of [
    "getSdkworkCommerceService().admin.memberships.packageGroups.create",
    "getSdkworkCommerceService().admin.memberships.packageGroups.update",
    "getSdkworkCommerceService().admin.memberships.packageGroups.delete",
    "getSdkworkCommerceService().admin.memberships.packages.create",
    "getSdkworkCommerceService().admin.memberships.packages.update",
    "getSdkworkCommerceService().admin.memberships.packages.delete",
    "getSdkworkCommerceService().admin.memberships.plans.update",
    "getSdkworkCommerceService().admin.memberships.plans.delete",
    "getSdkworkCommerceService().admin.memberships.members.update",
  ]) {
    assert.match(serviceSource, new RegExp(escapeRegExp(sdkCall)), `${sdkCall} must be used instead of handwritten HTTP`);
  }

  for (const pageSource of [
    packagesPageSource,
    packageGroupsPageSource,
    plansPageSource,
    membersPageSource,
    rechargePackagesPageSource,
  ]) {
    assert.match(pageSource, /MembershipDrawer/, "CRUD and status pages must use drawer-based mutation flows");
  }

  assert.match(packagesPageSource, /MembershipPackageDrawerForm/);
  assert.match(packageGroupsPageSource, /MembershipPackageGroupDrawerForm/);
  assert.match(plansPageSource, /MembershipPlanDrawerForm/);
  assert.match(membersPageSource, /MembershipMemberStatusDrawerForm/);
  assert.match(rechargePackagesPageSource, /MembershipRechargePackageDrawerForm/);
  assert.match(drawerSource, /fixed inset-y-0 right-0/);
  assert.doesNotMatch(entitlementsPageSource, /createMembershipAdminEntitlement|updateMembershipAdminEntitlement|deleteMembershipAdminEntitlement/);

  for (const retiredToken of [
    "sdkwork-clawrouter-pc-admin-vip",
    "/admin/vip",
    "/backend/v3/api/billing/vip",
    "@sdkwork/vip-admin-pc-react",
    "getCommerceService().admin.vip",
    "vip-admin-service",
  ]) {
    assert.doesNotMatch(appSource, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(packageJson, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(viewSource, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(serviceSource, new RegExp(escapeRegExp(retiredToken)));
    assert.doesNotMatch(routeClassification, new RegExp(escapeRegExp(retiredToken)));
  }

  assert.doesNotMatch(serviceSource, /fetch\(/);
  assert.doesNotMatch(serviceSource, /axios/);
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
