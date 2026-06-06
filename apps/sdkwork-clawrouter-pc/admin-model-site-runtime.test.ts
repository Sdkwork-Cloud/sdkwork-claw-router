import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const PORTAL_ROOT = import.meta.dirname;

function readPortalFile(relativePath: string): string {
  return readFileSync(resolve(PORTAL_ROOT, relativePath), "utf8");
}

function sourceBetween(source: string, startToken: string, endToken: string): string {
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken, start + startToken.length);
  assert.notEqual(start, -1, `missing source start token: ${startToken}`);
  assert.notEqual(end, -1, `missing source end token: ${endToken}`);
  return source.slice(start, end);
}

test("admin model site service is SDK-backed and uses confirmed route surface", () => {
  const modelService = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/modelService.ts");

  for (const token of [
    "export class SiteService",
    "getClawRouterBackendSdkClient().sites.siteCatalog.list(",
    "getClawRouterBackendSdkClient().sites.create(",
    "getClawRouterBackendSdkClient().sites.update(",
    "getClawRouterBackendSdkClient().sites.delete(",
    "getClawRouterBackendSdkClient().sites.siteChannels.list(",
    "getClawRouterBackendSdkClient().sites.testConnection.create(",
    "getClawRouterBackendSdkClient().sites.healthCheck.create(",
    "export interface SiteItem",
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
    ".sites.siteModels.",
    "/services/{serviceId}/models",
    "export interface SiteModelItem",
  ]) {
    assert.equal(modelService.includes(forbidden), false, `unexpected forbidden site token: ${forbidden}`);
  }
});

test("admin model page exposes site management route and navigation markers", () => {
  const appSource = readPortalFile("src/App.tsx");
  const registrySource = readPortalFile("src/adminModuleRegistry.ts");
  const modelAdminSource = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/index.tsx");
  const i18nSource = readPortalFile("packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/core-navigation.ts");
  const modelI18nSource = readPortalFile("packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/model.ts");
  const siteAdminStart = modelAdminSource.indexOf("export function SiteAdmin");
  const siteAdminEnd = modelAdminSource.indexOf("type ModelMappingBindingFilter");
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
    adminLayoutSource.includes('className="flex min-h-0 flex-1 flex-col overflow-hidden p-[5px]"'),
    "admin right content wrapper should use 5px padding on all sides",
  );
});

test("admin model site table fills the available admin viewport", () => {
  const modelAdminSource = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/index.tsx");
  const sitePageSource = sourceBetween(modelAdminSource, "export function SiteAdmin", "function ModelMappingAdmin");

  for (const expected of [
    "AdminTableShell",
    "data-admin-site-table-card",
    "data-admin-site-table-viewport",
    'className="flex-1 min-h-0"',
    'viewportClassName="min-h-0 flex-1"',
    "sticky top-0 z-10",
  ]) {
    assert.ok(sitePageSource.includes(expected), `missing adaptive admin site table marker: ${expected}`);
  }

  assert.ok(
    sitePageSource.includes('className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#0f0f10] dark:text-slate-100"'),
    "site page should fill the admin viewport without creating document scroll",
  );
  assert.equal(sitePageSource.includes("min-h-screen"), false, "site page must not use min-h-screen inside AdminLayout");
});

test("admin model site form supports upstream provider profile fields", () => {
  const modelAdminSource = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/index.tsx");
  const modelServiceSource = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/modelService.ts");
  const adminSiteApiSource = readFileSync(
    resolve(PORTAL_ROOT, "../../services/sdkwork-claw-product/src/api/admin_site.rs"),
    "utf8",
  );
  const siteFormStart = modelAdminSource.indexOf("function SiteFormModal");
  const siteFormEnd = modelAdminSource.indexOf("function ModelMappingFormModal");
  const siteInputStart = modelAdminSource.indexOf("function siteInputFromForm");
  const siteInputEnd = modelAdminSource.indexOf("function modelMappingInputFromForm");
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
  assert.equal(siteInputSource.includes("siteCode:"), false, "frontend site form payload should not include siteCode");
  assert.equal(modelAdminSource.includes("generateSiteCode"), false, "site code should be backend-generated, not generated in the portal");
  assert.equal(modelAdminSource.includes("siteCode: editingSite.siteCode"), false, "site update should not resubmit generated siteCode");
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

  const siteCreateInputSource = sourceBetween(modelServiceSource, "export interface SiteCreateInput", "export interface SiteUpdateInput");
  const toSiteCreateRequestSource = sourceBetween(modelServiceSource, "function toSiteCreateRequest", "function toSiteUpdateRequest");
  assert.equal(siteCreateInputSource.includes("siteCode"), false, "portal create input should not expose siteCode");
  assert.equal(toSiteCreateRequestSource.includes("siteCode:"), false, "portal create request should omit siteCode so the backend generates it");

  assert.ok(
    adminSiteApiSource.includes("const MAX_MEDIA_LOCATOR_LEN: usize = 1_048_576;"),
    "site logo data URL storage should allow small uploaded logo payloads, not only tiny URL strings",
  );
});

test("admin model site form uses a larger single-click logo uploader", () => {
  const modelAdminSource = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/index.tsx");
  const siteFormStart = modelAdminSource.indexOf("function SiteFormModal");
  const siteFormEnd = modelAdminSource.indexOf("function ModelMappingFormModal");
  assert.notEqual(siteFormStart, -1, "missing SiteFormModal source start");
  assert.notEqual(siteFormEnd, -1, "missing SiteFormModal source end");
  const siteFormSource = modelAdminSource.slice(siteFormStart, siteFormEnd);

  for (const token of [
    "data-admin-site-logo-upload-panel",
    "data-admin-site-logo-upload-placeholder",
    "data-admin-site-logo-upload-control",
    "h-28 w-28",
    "cursor-pointer",
    "sr-only",
    'accept="image/*"',
  ]) {
    assert.ok(siteFormSource.includes(token), `missing logo uploader marker: ${token}`);
  }

  assert.doesNotMatch(siteFormSource, /inline-flex cursor-pointer items-center gap-2[\s\S]*admin\.model\.site\.form\.uploadLogo/);
  assert.match(siteFormSource, /data-admin-site-logo-upload-panel[\s\S]*<input[\s\S]*type="file"/);
});

test("admin model site form uses right-side vendor table with picker and row removal", () => {
  const modelAdminSource = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/index.tsx");
  const modelI18nSource = readPortalFile("packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/model.ts");
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

test("admin model site form opens as a left-side drawer instead of a centered modal", () => {
  const modelAdminSource = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/index.tsx");
  const siteFormStart = modelAdminSource.indexOf("function SiteFormModal");
  const siteFormEnd = modelAdminSource.indexOf("function ModelMappingFormModal");
  assert.notEqual(siteFormStart, -1, "missing SiteFormModal source start");
  assert.notEqual(siteFormEnd, -1, "missing SiteFormModal source end");
  const siteFormSource = modelAdminSource.slice(siteFormStart, siteFormEnd);

  for (const token of [
    "data-admin-site-form-drawer",
    "data-admin-site-form-drawer-panel",
    "justify-start",
    "rounded-r-2xl",
    'aria-label={t(\'common.actions.closeDrawer\')}',
  ]) {
    assert.ok(siteFormSource.includes(token), `missing left drawer marker: ${token}`);
  }

  assert.match(siteFormSource, /<aside data-admin-site-form-drawer-panel/);
  assert.match(siteFormSource, /className="flex h-full w-\[min\(94vw,1120px\)\]/);
  assert.doesNotMatch(siteFormSource, /items-center justify-center bg-slate-950\/50 p-4/);
  assert.doesNotMatch(siteFormSource, /w-full max-w-6xl overflow-hidden rounded-2xl/);
});

test("admin model site vendor picker supports multi-select while mapping pickers stay single-select", () => {
  const modelAdminSource = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/index.tsx");
  const siteFormStart = modelAdminSource.indexOf("function SiteFormModal");
  const siteFormEnd = modelAdminSource.indexOf("function ModelMappingFormModal");
  const mappingFormStart = modelAdminSource.indexOf("function ModelMappingFormModal");
  const mappingFormEnd = modelAdminSource.indexOf("function ModelMappingRowsTable");
  const pickerStart = modelAdminSource.indexOf("function VendorPickerModal");
  const pickerEnd = modelAdminSource.indexOf("function FormInput");
  assert.notEqual(siteFormStart, -1, "missing SiteFormModal source start");
  assert.notEqual(siteFormEnd, -1, "missing SiteFormModal source end");
  assert.notEqual(mappingFormStart, -1, "missing ModelMappingFormModal source start");
  assert.notEqual(mappingFormEnd, -1, "missing ModelMappingFormModal source end");
  assert.notEqual(pickerStart, -1, "missing VendorPickerModal source start");
  assert.notEqual(pickerEnd, -1, "missing VendorPickerModal source end");
  const siteFormSource = modelAdminSource.slice(siteFormStart, siteFormEnd);
  const mappingFormSource = modelAdminSource.slice(mappingFormStart, mappingFormEnd);
  const pickerSource = modelAdminSource.slice(pickerStart, pickerEnd);

  for (const token of [
    "type VendorPickerSelectionMode = 'single' | 'multiple'",
    "selectionMode = 'single'",
    "selectedVendorCodes = []",
    "onSelectionChange",
    "toggleVendorSelection",
    "type={selectionMode === 'multiple' ? 'checkbox' : 'radio'}",
    "admin.model.site.form.vendorPickerDone",
  ]) {
    assert.ok(pickerSource.includes(token) || modelAdminSource.includes(token), `missing multi-select picker marker: ${token}`);
  }

  assert.ok(siteFormSource.includes('selectionMode="multiple"'), "site form should open vendor picker in multi-select mode");
  assert.ok(siteFormSource.includes("selectedVendorCodes={selectedVendorCodes}"), "site form should pass selected vendor codes");
  assert.ok(siteFormSource.includes("onSelectionChange={setSelectedVendorCodes}"), "site form should update selected vendors without closing per click");
  assert.doesNotMatch(siteFormSource, /onSelect=\{\(vendor\) => \{\s*selectVendorCode\(vendor\.vendorCode\);\s*setIsVendorPickerOpen\(false\);/);
  assert.doesNotMatch(mappingFormSource, /selectionMode="multiple"/, "model mapping vendor pickers should remain single-select");
});

test("admin model site vendor picker puts the selection control before vendor content", () => {
  const modelAdminSource = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/index.tsx");
  const pickerStart = modelAdminSource.indexOf("function VendorPickerModal");
  const pickerEnd = modelAdminSource.indexOf("function FormInput");
  assert.notEqual(pickerStart, -1, "missing VendorPickerModal source start");
  assert.notEqual(pickerEnd, -1, "missing VendorPickerModal source end");
  const pickerSource = modelAdminSource.slice(pickerStart, pickerEnd);
  const controlIndex = pickerSource.indexOf("data-admin-vendor-picker-choice-control");
  const infoIndex = pickerSource.indexOf("data-admin-vendor-picker-vendor-info");
  const statusIndex = pickerSource.indexOf("data-admin-vendor-picker-vendor-status");

  assert.notEqual(controlIndex, -1, "vendor picker selection control marker must exist");
  assert.notEqual(infoIndex, -1, "vendor picker info marker must exist");
  assert.notEqual(statusIndex, -1, "vendor picker status marker must exist");
  assert.ok(controlIndex < infoIndex, "selection control should be placed before vendor name and code");
  assert.ok(infoIndex < statusIndex, "vendor status should stay after vendor name and code");
  assert.match(pickerSource, /className=\{`flex w-full items-center gap-3/);
  assert.doesNotMatch(pickerSource, /justify-between gap-3[\s\S]*data-admin-vendor-picker-choice-control/);
});

test("admin model site form edits domains with a dynamic input list", () => {
  const modelAdminSource = readPortalFile("packages/sdkwork-clawrouter-pc-admin-model/src/index.tsx");
  const modelI18nSource = readPortalFile("packages/sdkwork-clawrouter-pc-i18n/src/resources/admin/model.ts");
  const siteFormStart = modelAdminSource.indexOf("function SiteFormModal");
  const siteFormEnd = modelAdminSource.indexOf("function ModelMappingFormModal");
  assert.notEqual(siteFormStart, -1, "missing SiteFormModal source start");
  assert.notEqual(siteFormEnd, -1, "missing SiteFormModal source end");
  const siteFormSource = modelAdminSource.slice(siteFormStart, siteFormEnd);

  for (const token of [
    "domainInputs",
    "setDomainInputs",
    "addDomainInput",
    "removeDomainInput",
    "updateDomainInput",
    "data-admin-site-domain-input-list",
    "data-admin-site-domain-input-row",
    "data-admin-site-domain-input",
    "data-admin-site-domain-add",
    "data-admin-site-domain-remove",
    "name=\"domains\" type=\"hidden\"",
    "admin.model.site.form.addDomain",
    "admin.model.site.form.removeDomain",
    "admin.model.site.form.domainPlaceholder",
  ]) {
    assert.ok(siteFormSource.includes(token) || modelI18nSource.includes(`"${token}"`), `missing dynamic domain marker: ${token}`);
  }

  assert.match(siteFormSource, /value=\{domainInputs\.join\('\\n'\)\}/);
  assert.match(siteFormSource, /domainInputs\.map\(\(domain, index\) =>/);
  assert.doesNotMatch(siteFormSource, /<textarea[\s\S]*name="domains"/);
});
