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
  const viewSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/index.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/membershipsService.ts");
  const packagesPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackagesPage.tsx");
  const packageGroupsPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPackageGroupsPage.tsx");
  const plansPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipPlansPage.tsx");
  const membersPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipMembersPage.tsx");
  const entitlementsPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipEntitlementsPage.tsx");
  const rechargePackagesPageSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/pages/MembershipRechargePackagesPage.tsx");
  const drawerSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/components/MembershipDrawer.tsx");
  const routeClassification = readPortalFile("../../docs/schema-registry/frontend-route-classification.yaml");
  const backendOpenapi = readPortalFile("../../generated/openapi/clawrouter-backend-openapi.json");
  const backendCommerceSdk = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/api/commerce.ts");

  assert.match(appSource, /const MembershipsAdmin = lazyRoute(?:<AdminSectionRouteProps>)?\(\(\) => import\('sdkwork-claw-router-admin-memberships'\), 'MembershipsAdmin'\)/);
  assert.match(appSource, /<Route path="memberships" element=\{<Navigate to="\/admin\/memberships\/packages" replace \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/packages" element=\{<MembershipsAdmin sectionId="packages" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/plans" element=\{<MembershipsAdmin sectionId="plans" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/members" element=\{<MembershipsAdmin sectionId="members" \/>} \/>/);
  assert.match(appSource, /<Route path="memberships\/entitlements" element=\{<MembershipsAdmin sectionId="entitlements" \/>} \/>/);
  assert.match(adminLayoutSource, /\/admin\/memberships/);
  assert.match(packageJson, /"sdkwork-claw-router-admin-memberships": "workspace:\*"/);
  assert.match(routeClassification, /route: \/admin\/memberships[\s\S]*package: sdkwork-claw-router-admin-memberships[\s\S]*api_surface: backend/);

  for (const marker of [
    "MembershipsAdmin",
    "Membership Levels",
    "Package Groups",
    "MembersTab",
    "EntitlementsTab",
    "fetchMembershipAdminEntitlements",
  ]) {
    assert.match(viewSource, new RegExp(escapeRegExp(marker)));
  }

  assert.match(serviceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.memberships\.entitlements\.list/);
  assert.match(backendOpenapi, /"\/backend\/v3\/api\/memberships\/entitlements"/);
  assert.match(backendCommerceSdk, /class CommerceMembershipsEntitlementsApi/);
  assert.match(backendCommerceSdk, /backendApiPath\(`\/memberships\/entitlements`\)/);

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
    "getClawRouterBackendSdkClient().commerce.memberships.packageGroups.create",
    "getClawRouterBackendSdkClient().commerce.memberships.packageGroups.update",
    "getClawRouterBackendSdkClient().commerce.memberships.packageGroups.delete",
    "getClawRouterBackendSdkClient().commerce.memberships.packages.create",
    "getClawRouterBackendSdkClient().commerce.memberships.packages.update",
    "getClawRouterBackendSdkClient().commerce.memberships.packages.delete",
    "getClawRouterBackendSdkClient().commerce.memberships.plans.update",
    "getClawRouterBackendSdkClient().commerce.memberships.plans.delete",
    "getClawRouterBackendSdkClient().commerce.memberships.members.status.update",
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
    "sdkwork-claw-router-admin-vip",
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
