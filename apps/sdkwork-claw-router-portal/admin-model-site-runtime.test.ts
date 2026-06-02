import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const PORTAL_ROOT = import.meta.dirname;

function readPortalFile(relativePath: string): string {
  return readFileSync(resolve(PORTAL_ROOT, relativePath), "utf8");
}

test("admin model site service is SDK-backed and uses confirmed route surface", () => {
  const modelService = readPortalFile("packages/sdkwork-claw-router-admin-model/src/modelService.ts");

  for (const token of [
    "export class SiteService",
    "getClawRouterBackendSdkClient().sites.siteCatalog.list(",
    "getClawRouterBackendSdkClient().sites.create(",
    "getClawRouterBackendSdkClient().sites.update(",
    "getClawRouterBackendSdkClient().sites.delete(",
    "getClawRouterBackendSdkClient().sites.siteModels.list(",
    "getClawRouterBackendSdkClient().sites.siteModels.create(",
    "getClawRouterBackendSdkClient().sites.siteModels.update(",
    "getClawRouterBackendSdkClient().sites.siteModels.delete(",
    "getClawRouterBackendSdkClient().sites.siteChannels.list(",
    "getClawRouterBackendSdkClient().sites.testConnection.create(",
    "getClawRouterBackendSdkClient().sites.healthCheck.create(",
    "export interface SiteItem",
    "export interface SiteModelItem",
    "export interface SiteChannelItem",
    "export interface SiteConnectionCheckResult",
  ]) {
    assert.ok(modelService.includes(token), `missing site service marker: ${token}`);
  }

  for (const forbidden of [
    "fetch(",
    "axios.",
    "/backend/v3/api/integration/sites",
    "relay_stations",
    "integration_site",
    ".sites.services.",
    "/services/{serviceId}/models",
  ]) {
    assert.equal(modelService.includes(forbidden), false, `unexpected forbidden site token: ${forbidden}`);
  }
});

test("admin model page exposes site management route and navigation markers", () => {
  const appSource = readPortalFile("src/App.tsx");
  const registrySource = readPortalFile("src/adminModuleRegistry.ts");
  const modelAdminSource = readPortalFile("packages/sdkwork-claw-router-admin-model/src/index.tsx");
  const i18nSource = readPortalFile("packages/sdkwork-claw-router-i18n/src/resources/admin/core-navigation.ts");
  const modelI18nSource = readPortalFile("packages/sdkwork-claw-router-i18n/src/resources/admin/model.ts");
  const siteAdminStart = modelAdminSource.indexOf("export function SiteAdmin");
  const siteAdminEnd = modelAdminSource.indexOf("type ModelMappingScopeFilter");
  assert.notEqual(siteAdminStart, -1, "missing SiteAdmin source start");
  assert.notEqual(siteAdminEnd, -1, "missing SiteAdmin source end");
  const siteAdminSource = modelAdminSource.slice(siteAdminStart, siteAdminEnd);
  const siteAdminRenderSource = siteAdminSource.slice(siteAdminSource.indexOf("return ("));

  for (const token of [
    'path="model/sites"',
    "SiteAdmin",
  ]) {
    assert.ok(appSource.includes(token), `missing app route marker: ${token}`);
  }

  for (const token of [
    "/admin/model/sites",
    "admin.menu.modelSites",
  ]) {
    assert.ok(registrySource.includes(token), `missing admin registry marker: ${token}`);
    assert.ok(i18nSource.includes(token.replace("/admin/model/sites", '"admin.menu.modelSites"')), `missing admin navigation i18n marker: ${token}`);
  }

  for (const token of [
    "export function SiteAdmin",
    "SiteService.fetchSites()",
    "SiteService.createSite(",
    "SiteService.updateSite(",
    "SiteService.deleteSite(",
    "admin.model.site.actions.add",
    "admin.model.site.search.placeholder",
    "admin.model.site.table.name",
    "admin.model.site.table.baseUrl",
    "admin.model.site.table.domains",
    "admin.model.site.table.vendors",
    "admin.model.site.table.healthStatus",
    "admin.model.site.form.logo",
    "admin.model.site.form.supportedVendors",
    "admin.model.site.form.selectVendors",
  ]) {
    assert.ok(modelAdminSource.includes(token) || modelI18nSource.includes(`"${token}"`), `missing site admin marker: ${token}`);
  }

  assert.ok(
    siteAdminRenderSource.indexOf("admin.model.site.search.placeholder") < siteAdminRenderSource.indexOf("onClick={openCreateSite}"),
    "site add action should live in the search controls area, after the search input",
  );

  for (const forbidden of [
    "relay_stations",
    "integration_site",
    "/backend/v3/api/integration/sites",
    "/services/{serviceId}/models",
  ]) {
    assert.equal(modelAdminSource.includes(forbidden), false, `unexpected forbidden UI token: ${forbidden}`);
  }

  for (const forbidden of [
    "header={(",
    "admin.model.site.title",
    "admin.model.site.subtitle",
    "xl:grid-cols-[minmax(0,1fr)_420px]",
    "<aside",
    "Select a site",
    "admin.model.site.models.title",
    "admin.model.site.channels.title",
    "SiteService.fetchSiteModels(",
    "SiteService.fetchSiteChannels(",
    "openCreateSiteModel",
    "SiteModelFormModal",
    "siteChannels",
  ]) {
    assert.equal(siteAdminSource.includes(forbidden), false, `unexpected site admin detail panel marker: ${forbidden}`);
  }
});

test("admin model site page uses compact admin content padding", () => {
  const adminLayoutSource = readPortalFile("src/AdminLayout.tsx");

  assert.ok(
    adminLayoutSource.includes('className="flex min-h-0 flex-1 flex-col p-[5px]"'),
    "admin right content wrapper should use 5px padding on all sides",
  );
});

test("admin model site form supports upstream provider profile fields", () => {
  const modelAdminSource = readPortalFile("packages/sdkwork-claw-router-admin-model/src/index.tsx");
  const modelServiceSource = readPortalFile("packages/sdkwork-claw-router-admin-model/src/modelService.ts");
  const adminSiteApiSource = readFileSync(
    resolve(PORTAL_ROOT, "../../services/sdkwork-claw-product/src/api/admin_site.rs"),
    "utf8",
  );
  const siteFormStart = modelAdminSource.indexOf("function SiteFormModal");
  const siteFormEnd = modelAdminSource.indexOf("function ModelMappingFormModal");
  const siteInputStart = modelAdminSource.indexOf("function siteInputFromForm");
  const siteInputEnd = modelAdminSource.indexOf("function modelMappingInputsFromForm");
  assert.notEqual(siteFormStart, -1, "missing SiteFormModal source start");
  assert.notEqual(siteFormEnd, -1, "missing SiteFormModal source end");
  assert.notEqual(siteInputStart, -1, "missing siteInputFromForm source start");
  assert.notEqual(siteInputEnd, -1, "missing siteInputFromForm source end");
  const siteFormSource = modelAdminSource.slice(siteFormStart, siteFormEnd);
  const siteInputSource = modelAdminSource.slice(siteInputStart, siteInputEnd);

  assert.ok(
    siteFormSource.indexOf('name="siteName"') < siteFormSource.indexOf('name="displayName"'),
    "site name should be the first visible identity field in the upstream provider modal",
  );
  assert.equal(siteFormSource.includes('name="siteCode"'), false, "site code should not be a visible form input");
  assert.ok(siteInputSource.includes("generateSiteCode("), "site code should be generated from form data");
  assert.equal(siteInputSource.includes("readFormString(formData, 'siteCode')"), false, "siteInputFromForm should not read a visible siteCode field");

  for (const token of [
    'type="file"',
    'accept="image/*"',
    "reader.readAsDataURL(file)",
    'name="logo"',
    'readSiteLogoFromForm',
    'name="domains"',
    'parseMultilineFormList(formData, \'domains\')',
    'site.domains',
    'site.vendorCodes',
    'SiteFormModal',
    'vendors={vendors}',
    'isVendorPickerOpen',
    'selectedVendorCodes',
    'name="vendorCodes"',
    'parseJsonStringArrayFormValue(formData, \'vendorCodes\')',
  ]) {
    assert.ok(modelAdminSource.includes(token), `missing upstream provider profile marker: ${token}`);
  }

  for (const token of [
    "logo?:",
    "domains: string[]",
    "vendorCodes: string[]",
    "readOptionalMediaResource",
    "readStringArray(item, 'domains')",
    "readStringArray(item, 'vendorCodes')",
    "logo: input.logo ?? null",
    "domains: input.domains ?? []",
    "vendorCodes: input.vendorCodes ?? []",
  ]) {
    assert.ok(modelServiceSource.includes(token), `missing site service profile marker: ${token}`);
  }

  assert.ok(
    adminSiteApiSource.includes("const MAX_MEDIA_LOCATOR_LEN: usize = 1_048_576;"),
    "site logo data URL storage should allow small uploaded logo payloads, not only tiny URL strings",
  );
});

test("admin model site form uses right-side vendor table with picker and row removal", () => {
  const modelAdminSource = readPortalFile("packages/sdkwork-claw-router-admin-model/src/index.tsx");
  const modelI18nSource = readPortalFile("packages/sdkwork-claw-router-i18n/src/resources/admin/model.ts");
  const siteFormStart = modelAdminSource.indexOf("function SiteFormModal");
  const siteFormEnd = modelAdminSource.indexOf("function ModelMappingFormModal");
  assert.notEqual(siteFormStart, -1, "missing SiteFormModal source start");
  assert.notEqual(siteFormEnd, -1, "missing SiteFormModal source end");
  const siteFormSource = modelAdminSource.slice(siteFormStart, siteFormEnd);

  for (const token of [
    "data-admin-site-form-layout",
    "data-admin-site-supported-vendors-panel",
    "data-admin-site-supported-vendor-table",
    "data-admin-site-supported-vendor-row",
    "data-admin-site-supported-vendor-remove",
    "removeSelectedVendorCode",
    "selectVendorCode",
    "setIsVendorPickerOpen(true)",
    "<VendorPickerModal",
    "admin.model.site.form.supportedVendorsHint",
    "admin.model.site.form.vendorColumns.vendor",
    "admin.model.site.form.vendorColumns.code",
    "admin.model.site.form.vendorColumns.status",
    "admin.model.site.form.removeVendor",
  ]) {
    assert.ok(siteFormSource.includes(token) || modelI18nSource.includes(`"${token}"`), `missing right-side vendor table marker: ${token}`);
  }

  assert.match(siteFormSource, /grid[^"]*lg:grid-cols-\[minmax\(0,1fr\)_minmax\(320px,380px\)\]/);
  assert.match(siteFormSource, /selectedVendorCodes\.map\(\(vendorCode\) =>/);
  assert.match(siteFormSource, /vendorByCode\.get\(vendorCode\)/);
  assert.match(siteFormSource, /onSelect=\{\(vendor\) => \{/);
  assert.match(siteFormSource, /selectVendorCode\(vendor\.vendorCode\)/);
  assert.match(siteFormSource, /onClick=\{\(\) => removeSelectedVendorCode\(vendorCode\)\}/);
  assert.doesNotMatch(siteFormSource, /vendorSummary/);
  assert.doesNotMatch(siteFormSource, /setIsVendorPickerOpen\(\(value\) => !value\)/);
});
