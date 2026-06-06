import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(relativePath: string): string {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("admin member center exposes recharge package and recharge settings maintenance through backend SDK", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const adminModuleRegistrySource = readPortalFile("./src/adminModuleRegistry.ts");
  const membershipsSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/index.tsx");
  const rechargePackagesPageSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/pages/MembershipRechargePackagesPage.tsx");
  const membershipsServiceSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-memberships/src/membershipsService.ts");
  const i18nSource = [
    readPortalFile("./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/core-navigation.ts"),
    readPortalFile("./packages/sdkwork-clawrouter-pc-i18n/src/resources/admin-commerce/memberships.ts"),
  ].join("\n");
  const backendMarketingSource = readPortalFile("../../services/sdkwork-claw-product/src/api/admin_marketing.rs");
  const backendContractSource = readPortalFile("../../docs/schema-registry/frontend-field-contracts/operations/backend-commerce-recharges.yaml");
  const backendCommerceSdk = readPortalFile("../../sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript/generated/server-openapi/src/api/commerce.ts");

  assert.match(appSource, /<Route path="memberships\/recharge-packages" element=\{<MembershipsAdmin sectionId="rechargePackages" \/>} \/>/);
  assert.match(adminModuleRegistrySource, /path:\s*'\/admin\/memberships\/recharge-packages',\s*labelKey:\s*'admin\.menu\.membershipRechargePackages'/);

  assert.match(membershipsSource, /MembershipsAdminSectionId[\s\S]*'rechargePackages'/);
  assert.match(membershipsSource, /sectionId === 'rechargePackages'/);
  assert.match(membershipsSource, /MembershipRechargePackagesPage/);
  assert.doesNotMatch(membershipsSource, /function RechargePackagesTab/);
  assert.match(rechargePackagesPageSource, /fetchMembershipAdminRechargePackages/);
  assert.match(rechargePackagesPageSource, /createMembershipAdminRechargePackage/);
  assert.match(rechargePackagesPageSource, /updateMembershipAdminRechargePackage/);
  assert.match(rechargePackagesPageSource, /deleteMembershipAdminRechargePackage/);
  assert.match(rechargePackagesPageSource, /fetchMembershipAdminRechargeSettings/);
  assert.match(rechargePackagesPageSource, /updateMembershipAdminRechargeSettings/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargePackages\.title/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargePackages\.add/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargePackages\.edit/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargePackages\.delete/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargeSettings\.title/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargeSettings\.basePointsPerCny/);
  assert.match(rechargePackagesPageSource, /MembershipSelectField/);
  assert.match(rechargePackagesPageSource, /label=\{t\('admin\.commerce\.memberships\.rechargeSettings\.baseCurrencyCode', 'Base currency'\)\}/);
  assert.match(rechargePackagesPageSource, /options=\{supportedCurrencyCodes\.map\(\(value\) => \(\{ value \}\)\)\}/);
  assert.match(rechargePackagesPageSource, /Object\.entries\(settingsDraft\.currencyToCnyRates\)/);
  assert.match(rechargePackagesPageSource, /currencyToCnyRates:\s*loadedSettings\.currencyToCnyRates/);
  assert.match(rechargePackagesPageSource, /currencyToCnyRates:\s*updated\.currencyToCnyRates/);
  assert.match(rechargePackagesPageSource, /listRechargeCurrencyCodes\(normalizedSettings\)/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargeSettings\.currencyRateLabel/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargeSettings\.addCurrency/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargeSettings\.preview/);
  assert.match(rechargePackagesPageSource, /<table className="w-full text-sm">/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargePackages\.table\.package/);
  assert.match(rechargePackagesPageSource, /admin\.commerce\.memberships\.rechargePackages\.empty/);
  assert.match(rechargePackagesPageSource, /<td colSpan=\{7\}/);
  assert.doesNotMatch(rechargePackagesPageSource, /<MembershipEmptyState title=\{t\('admin\.commerce\.memberships\.rechargePackages\.empty'/);
  assert.doesNotMatch(rechargePackagesPageSource, /\busdRate\b/);
  assert.doesNotMatch(rechargePackagesPageSource, /\bcnyRate\b/);

  assert.match(membershipsServiceSource, /backendMembershipsRechargePackagesList/);
  assert.match(membershipsServiceSource, /backendMembershipsRechargePackagesCreate/);
  assert.match(membershipsServiceSource, /backendMembershipsRechargePackagesUpdate/);
  assert.match(membershipsServiceSource, /backendMembershipsRechargePackagesDelete/);
  assert.match(membershipsServiceSource, /backendMembershipsRechargeSettingsRetrieve/);
  assert.match(membershipsServiceSource, /backendMembershipsRechargeSettingsUpdate/);
  assert.match(membershipsServiceSource, /fetchMembershipAdminRechargePackages/);
  assert.match(membershipsServiceSource, /createMembershipAdminRechargePackage/);
  assert.match(membershipsServiceSource, /updateMembershipAdminRechargePackage/);
  assert.match(membershipsServiceSource, /deleteMembershipAdminRechargePackage/);
  assert.match(membershipsServiceSource, /fetchMembershipAdminRechargeSettings/);
  assert.match(membershipsServiceSource, /updateMembershipAdminRechargeSettings/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.recharges\.packages\.list/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.recharges\.packages\.create/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.recharges\.packages\.update/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.recharges\.packages\.delete/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.recharges\.settings\.retrieve/);
  assert.match(membershipsServiceSource, /getClawRouterBackendSdkClient\(\)\.commerce\.recharges\.settings\.update/);
  assert.match(membershipsServiceSource, /priceAmount/);
  assert.match(membershipsServiceSource, /currencyCode/);
  assert.match(membershipsServiceSource, /bonusPoints/);
  assert.match(membershipsServiceSource, /grantAmount/);
  assert.doesNotMatch(membershipsServiceSource, /\brmb\b/);
  assert.doesNotMatch(membershipsServiceSource, /\bbonus\b/);
  assert.doesNotMatch(membershipsServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(membershipsServiceSource, /\baxios\b/);
  assert.doesNotMatch(membershipsServiceSource, /\/backend\/v3\/api/);

  assert.doesNotMatch(backendMarketingSource, /\/backend\/v3\/api\/billing\/recharges\/packages/);
  assert.doesNotMatch(backendContractSource, /\/backend\/v3\/api\/billing\/recharges\/packages/);
  assert.match(backendContractSource, /operation_id:\s*recharges\.packages\.create/);
  assert.match(backendContractSource, /operation_id:\s*recharges\.packages\.update/);
  assert.match(backendContractSource, /operation_id:\s*recharges\.packages\.delete/);
  assert.match(backendContractSource, /operation_id:\s*recharges\.settings\.retrieve/);
  assert.match(backendContractSource, /operation_id:\s*recharges\.settings\.update/);

  assert.match(backendCommerceSdk, /class CommerceRechargesPackagesApi/);
  assert.match(backendCommerceSdk, /class CommerceRechargesSettingsApi/);
  assert.match(backendCommerceSdk, /backendApiPath\(`\/recharges\/packages`\)/);
  assert.match(backendCommerceSdk, /backendApiPath\(`\/recharges\/settings`\)/);
  assert.match(backendCommerceSdk, /async create\(body: CommerceRechargePackageMutationRequest/);
  assert.match(backendCommerceSdk, /async update\(packageId: string, body: CommerceRechargePackageMutationRequest/);
  assert.match(backendCommerceSdk, /async delete\(packageId: string/);
  assert.match(backendCommerceSdk, /async retrieve\(/);
  assert.match(backendCommerceSdk, /async update\(body: CommerceRechargeSettingsUpdateRequest/);

  for (const key of [
    "admin.menu.membershipRechargePackages",
    "admin.commerce.memberships.rechargePackages.title",
    "admin.commerce.memberships.rechargePackages.desc",
    "admin.commerce.memberships.rechargePackages.empty",
    "admin.commerce.memberships.rechargePackages.add",
    "admin.commerce.memberships.rechargePackages.edit",
    "admin.commerce.memberships.rechargePackages.delete",
    "admin.commerce.memberships.rechargePackages.form.priceAmount",
    "admin.commerce.memberships.rechargePackages.form.currencyCode",
    "admin.commerce.memberships.rechargePackages.form.bonusPoints",
    "admin.commerce.memberships.rechargePackages.form.status",
    "admin.commerce.memberships.rechargePackages.form.submit",
    "admin.commerce.memberships.rechargeSettings.title",
    "admin.commerce.memberships.rechargeSettings.desc",
    "admin.commerce.memberships.rechargeSettings.basePointsPerCny",
    "admin.commerce.memberships.rechargeSettings.baseCurrencyCode",
    "admin.commerce.memberships.rechargeSettings.currencyRates",
    "admin.commerce.memberships.rechargeSettings.currencyRateLabel",
    "admin.commerce.memberships.rechargeSettings.addCurrency",
    "admin.commerce.memberships.rechargeSettings.preview",
    "admin.commerce.memberships.rechargeSettings.submit",
  ]) {
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }
});
