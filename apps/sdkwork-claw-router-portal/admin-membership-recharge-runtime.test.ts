import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("admin member center exposes recharge package maintenance through backend SDK", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const membershipsSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/index.tsx");
  const membershipsServiceSource = readPortalFile("./packages/sdkwork-claw-router-admin-memberships/src/membershipsService.ts");
  const i18nSource = readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts");
  const backendMarketingSource = readPortalFile("../../services/sdkwork-claw-product/src/api/admin_marketing.rs");
  const backendContractSource = readPortalFile("../../docs/schema-registry/frontend-field-contracts/operations/backend-commerce-recharges.yaml");
  const backendCommerceSdk = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/src/api/commerce.ts");

  assert.match(appSource, /<Route path="memberships\/recharge-packages" element=\{<MembershipsAdmin sectionId="rechargePackages" \/>} \/>/);
  assert.match(adminLayoutSource, /path:\s*'\/admin\/memberships\/recharge-packages',\s*labelKey:\s*'admin\.menu\.membershipRechargePackages'/);

  assert.match(membershipsSource, /type AdminTab = 'packages' \| 'plans' \| 'members' \| 'entitlements' \| 'rechargePackages'/);
  assert.match(membershipsSource, /sectionId === 'rechargePackages'/);
  assert.match(membershipsSource, /activeTab === 'rechargePackages' \? \(/);
  assert.match(membershipsSource, /function RechargePackagesTab\(\)/);
  assert.match(membershipsSource, /fetchMembershipAdminRechargePackages/);
  assert.match(membershipsSource, /createMembershipAdminRechargePackage/);
  assert.match(membershipsSource, /updateMembershipAdminRechargePackage/);
  assert.match(membershipsSource, /deleteMembershipAdminRechargePackage/);
  assert.match(membershipsSource, /admin\.commerce\.memberships\.rechargePackages\.title/);
  assert.match(membershipsSource, /admin\.commerce\.memberships\.rechargePackages\.add/);
  assert.match(membershipsSource, /admin\.commerce\.memberships\.rechargePackages\.edit/);
  assert.match(membershipsSource, /admin\.commerce\.memberships\.rechargePackages\.delete/);

  assert.match(membershipsServiceSource, /backendMembershipsRechargePackagesList/);
  assert.match(membershipsServiceSource, /backendMembershipsRechargePackagesCreate/);
  assert.match(membershipsServiceSource, /backendMembershipsRechargePackagesUpdate/);
  assert.match(membershipsServiceSource, /backendMembershipsRechargePackagesDelete/);
  assert.match(membershipsServiceSource, /fetchMembershipAdminRechargePackages/);
  assert.match(membershipsServiceSource, /createMembershipAdminRechargePackage/);
  assert.match(membershipsServiceSource, /updateMembershipAdminRechargePackage/);
  assert.match(membershipsServiceSource, /deleteMembershipAdminRechargePackage/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.recharges\.packages\.list/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.recharges\.packages\.create/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.recharges\.packages\.update/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.recharges\.packages\.delete/);
  assert.doesNotMatch(membershipsServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(membershipsServiceSource, /\baxios\b/);
  assert.doesNotMatch(membershipsServiceSource, /\/backend\/v3\/api/);

  assert.doesNotMatch(backendMarketingSource, /\/backend\/v3\/api\/billing\/recharges\/packages/);
  assert.doesNotMatch(backendContractSource, /\/backend\/v3\/api\/billing\/recharges\/packages/);
  assert.match(backendContractSource, /operation_id:\s*recharges\.packages\.create/);
  assert.match(backendContractSource, /operation_id:\s*recharges\.packages\.update/);
  assert.match(backendContractSource, /operation_id:\s*recharges\.packages\.delete/);

  assert.match(backendCommerceSdk, /class CommerceRechargesPackagesApi/);
  assert.match(backendCommerceSdk, /backendApiPath\(`\/recharges\/packages`\)/);
  assert.match(backendCommerceSdk, /async create\(body: CommerceRechargePackageMutationRequest/);
  assert.match(backendCommerceSdk, /async update\(packageId: string, body: CommerceRechargePackageMutationRequest/);
  assert.match(backendCommerceSdk, /async delete\(packageId: string/);

  for (const key of [
    "admin.menu.membershipRechargePackages",
    "admin.commerce.memberships.rechargePackages.title",
    "admin.commerce.memberships.rechargePackages.desc",
    "admin.commerce.memberships.rechargePackages.empty",
    "admin.commerce.memberships.rechargePackages.add",
    "admin.commerce.memberships.rechargePackages.edit",
    "admin.commerce.memberships.rechargePackages.delete",
    "admin.commerce.memberships.rechargePackages.form.rmb",
    "admin.commerce.memberships.rechargePackages.form.bonus",
    "admin.commerce.memberships.rechargePackages.form.status",
    "admin.commerce.memberships.rechargePackages.form.submit",
  ]) {
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }
});
