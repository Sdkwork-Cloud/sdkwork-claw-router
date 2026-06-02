import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

function readPortalFile(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("admin file platform is composed from storage and drive module blocks", () => {
  const registryUrl = new URL("./src/adminModuleRegistry.ts", import.meta.url);
  assert.equal(existsSync(registryUrl), true, "admin module registry must own top navigation and sidebar blocks");

  const appSource = readPortalFile("./src/App.tsx");
  const adminHeaderSource = readPortalFile("./src/AdminHeader.tsx");
  const adminLayoutSource = readPortalFile("./src/AdminLayout.tsx");
  const i18nSource = [
    readPortalFile("./packages/sdkwork-claw-router-i18n/src/index.ts"),
    readPortalFile("./packages/sdkwork-claw-router-i18n/src/resources/admin/core-navigation.ts"),
  ].join("\n");
  const fileAdminIndexSource = readPortalFile("./packages/sdkwork-claw-router-admin-file-platform/src/index.tsx");
  const storageAdminSource = readPortalFile("./packages/sdkwork-claw-router-admin-file-platform/src/storageAdmin.tsx");
  const storageDefinitionsSource = readPortalFile("./packages/sdkwork-claw-router-admin-file-platform/src/storageSectionDefinitions.ts");
  const storageServiceSource = readPortalFile("./packages/sdkwork-claw-router-admin-file-platform/src/storageService.ts");
  const storageShellSource = readPortalFile("./packages/sdkwork-claw-router-admin-file-platform/src/components/StoragePageShell.tsx");
  const storagePageSource = [
    "./packages/sdkwork-claw-router-admin-file-platform/src/pages/ProvidersPage.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/pages/BucketsPage.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/pages/DefaultBucketsPage.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/pages/QuotasPage.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/pages/UsagePage.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/pages/ReconciliationPage.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/pages/GarbageCollectionPage.tsx",
  ].map(readPortalFile).join("\n");
  const storageFormSource = [
    "./packages/sdkwork-claw-router-admin-file-platform/src/forms/StorageProviderForm.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/forms/StorageBucketForm.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/forms/DefaultBucketPolicyForm.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/forms/QuotaPolicyForm.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/forms/StorageReconciliationForm.tsx",
    "./packages/sdkwork-claw-router-admin-file-platform/src/forms/StorageGarbageCollectionForm.tsx",
  ].map(readPortalFile).join("\n");
  const fileAdminPackage = readPortalFile("./packages/sdkwork-claw-router-admin-file-platform/package.json");
  const registrySource = readFileSync(registryUrl, "utf8");
  const storageSource = [
    storageAdminSource,
    storageDefinitionsSource,
    storageServiceSource,
    storageShellSource,
    storagePageSource,
    storageFormSource,
  ].join("\n");

  assert.match(registrySource, /export type AdminModuleId =/);
  assert.match(registrySource, /export const ADMIN_MODULES:/);
  assert.match(registrySource, /export const ADMIN_MODULE_MENUS:/);
  assert.match(registrySource, /function moduleBlock/);
  assert.match(registrySource, /function groupBlock/);
  assert.match(registrySource, /function itemBlock/);
  assert.match(registrySource, /export function getActiveModuleFromPath/);
  assert.match(registrySource, /export function getAdminModuleMenu/);

  assert.match(
    registrySource,
    /id:\s*'storageCenter',\s*nameKey:\s*'admin\.header\.storageCenter'[\s\S]*defaultPath:\s*'\/admin\/storage\/providers'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/storage'[^\]]*\]/,
  );
  assert.match(
    registrySource,
    /id:\s*'driveCenter',\s*nameKey:\s*'admin\.header\.driveCenter'[\s\S]*defaultPath:\s*'\/admin\/drive\/spaces'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/drive'[^\]]*\]/,
  );
  assert.match(registrySource, /path:\s*'\/admin\/storage\/providers',\s*labelKey:\s*'admin\.menu\.storage\.providers'/);
  assert.match(registrySource, /path:\s*'\/admin\/storage\/buckets',\s*labelKey:\s*'admin\.menu\.storage\.buckets'/);
  assert.match(registrySource, /path:\s*'\/admin\/storage\/default-buckets',\s*labelKey:\s*'admin\.menu\.storage\.defaultBuckets'/);
  assert.match(registrySource, /path:\s*'\/admin\/storage\/quotas',\s*labelKey:\s*'admin\.menu\.storage\.quotas'/);
  assert.match(registrySource, /path:\s*'\/admin\/drive\/spaces',\s*labelKey:\s*'admin\.menu\.drive\.spaces'/);
  assert.match(registrySource, /path:\s*'\/admin\/drive\/nodes',\s*labelKey:\s*'admin\.menu\.drive\.nodes'/);

  assert.match(adminHeaderSource, /from '\.\/adminModuleRegistry'/);
  assert.match(adminHeaderSource, /ADMIN_MODULES\.map/);
  assert.doesNotMatch(adminHeaderSource, /const ADMIN_MODULES:/);
  assert.match(adminLayoutSource, /from '\.\/adminModuleRegistry'/);
  assert.match(adminLayoutSource, /getAdminModuleMenu\(activeModule\)/);
  assert.doesNotMatch(adminLayoutSource, /const MODULE_MENUS:/);

  assert.match(appSource, /const StorageAdmin = lazyRoute<AdminSectionRouteProps>\(\(\) => import\('sdkwork-claw-router-admin-file-platform'\), 'StorageAdmin'\);/);
  assert.match(appSource, /const DriveAdmin = lazyRoute<AdminSectionRouteProps>\(\(\) => import\('sdkwork-claw-router-admin-file-platform'\), 'DriveAdmin'\);/);
  assert.match(appSource, /<Route path="storage" element=\{<Navigate to="\/admin\/storage\/providers" replace \/>} \/>/);
  assert.match(appSource, /<Route path="storage\/providers" element=\{<StorageAdmin sectionId="providers" \/>} \/>/);
  assert.match(appSource, /<Route path="storage\/buckets" element=\{<StorageAdmin sectionId="buckets" \/>} \/>/);
  assert.match(appSource, /<Route path="storage\/default-buckets" element=\{<StorageAdmin sectionId="defaultBuckets" \/>} \/>/);
  assert.match(appSource, /<Route path="storage\/quotas" element=\{<StorageAdmin sectionId="quotas" \/>} \/>/);
  assert.match(appSource, /<Route path="drive" element=\{<Navigate to="\/admin\/drive\/spaces" replace \/>} \/>/);
  assert.match(appSource, /<Route path="drive\/spaces" element=\{<DriveAdmin sectionId="spaces" \/>} \/>/);
  assert.match(appSource, /<Route path="drive\/nodes" element=\{<DriveAdmin sectionId="nodes" \/>} \/>/);
  assert.match(appSource, /<Route path="service-providers" element=\{<Navigate to="\/admin\/service-providers\/dashboard" replace \/>} \/>/);

  assert.match(fileAdminPackage, /"name":\s*"sdkwork-claw-router-admin-file-platform"/);
  assert.match(fileAdminPackage, /"@sdkwork\/file-platform-pc-react":\s*"workspace:\*"/);
  assert.match(fileAdminPackage, /"@sdkwork\/file-sdk-ports":\s*"workspace:\*"/);
  assert.match(fileAdminPackage, /"@sdkwork\/file-service":\s*"workspace:\*"/);
  assert.match(fileAdminIndexSource, /export \{ StorageAdmin \} from '\.\/storageAdmin';/);
  assert.match(fileAdminIndexSource, /export function DriveAdmin/);
  assert.match(fileAdminIndexSource, /DriveBrowser/);
  assert.match(storageAdminSource, /export function StorageAdmin/);
  assert.match(storageAdminSource, /data-admin-file-platform="storage-center"/);
  assert.match(fileAdminIndexSource, /data-admin-file-platform="drive-center"/);
  assert.match(storageDefinitionsSource, /export const STORAGE_SECTION_DEFINITIONS:/);
  assert.match(storageFormSource, /StorageProviderForm/);
  assert.match(storageFormSource, /StorageBucketForm/);
  assert.match(storageFormSource, /DefaultBucketPolicyForm/);
  assert.match(storageFormSource, /QuotaPolicyForm/);
  assert.match(storageFormSource, /Credential ref[\s\S]*required/);
  assert.match(storageFormSource, /setProviderId\(initialData\.providerId \|\| ''\)/);
  assert.match(storageFormSource, /setBucketId\(initialData\.bucketId \|\| ''\)/);
  assert.doesNotMatch(storageFormSource, /setProviderId\(initialData\.providerCode/);
  assert.match(storageFormSource, /jobType: target\.trim\(\)/);
  assert.match(storageFormSource, /'INTELLIGENT_TIERING'/);
  assert.match(storageFormSource, /'ONEZONE_IA'/);
  assert.match(storageFormSource, /'GLACIER_IR'/);
  assert.match(storageFormSource, /'DEEP_ARCHIVE'/);
  assert.match(storageFormSource, /'none'/);
  assert.doesNotMatch(storageFormSource, /provider_managed/);
  assert.match(storageFormSource, /'hard'/);
  assert.match(storageFormSource, /'soft'/);
  assert.match(storageFormSource, /'warn'/);
  assert.doesNotMatch(storageFormSource, /hard_limit/);
  assert.doesNotMatch(storageFormSource, /warn_only/);
  assert.match(storageShellSource, /StoragePageShell/);
  assert.match(storagePageSource, /AdminTableShell/);
  assert.match(storagePageSource, /StorageDrawer/);
  assert.match(storageDefinitionsSource, /Provider Registry/);
  assert.match(storageDefinitionsSource, /Bucket Topology/);
  assert.match(storageDefinitionsSource, /Default Bucket Routing/);
  assert.match(storageDefinitionsSource, /Quota Policies/);
  assert.match(storageDefinitionsSource, /Usage Signals/);
  assert.match(storageDefinitionsSource, /Reconciliation Runs/);
  assert.match(storageDefinitionsSource, /Garbage Collection/);
  assert.match(storageServiceSource, /getClawRouterBackendSdkClient\(\)\.oss/);
  assert.match(storageServiceSource, /client\.providers\.list\(/);
  assert.match(storageServiceSource, /client\.quotas\.create\(/);
  assert.match(storageServiceSource, /client\.usage\.ledger\.list\(/);
  assert.match(storagePageSource, /fetchStorageUsageLedgerRecords/);
  assert.match(storagePageSource, /fetchStorageUsageSnapshotRecords/);
  assert.match(storagePageSource, /setActiveUsageView/);
  assert.match(storageServiceSource, /providerId: readString\(item, 'id'\)/);
  assert.match(storageServiceSource, /bucketId: readString\(item, 'id'\)/);
  assert.match(storageServiceSource, /providerId: readString\(item, 'providerId'\)/);
  assert.match(storageServiceSource, /bucketId: readString\(item, 'bucketId'\)/);
  assert.match(storageServiceSource, /readRequiredString\(item, 'jobId'/);
  assert.match(storageServiceSource, /String\(readNonNegativeMetric\(item, \['candidateCount'\]/);
  assert.doesNotMatch(storageServiceSource, /input\.jobType \|\| target/);
  assert.match(storagePageSource, /const providerId = record\.id \|\| record\.providerId/);
  assert.match(storagePageSource, /const bucketId = record\.id \|\| record\.bucketId/);
  assert.doesNotMatch(storagePageSource, /const providerId = record\.providerCode \|\| record\.id/);
  assert.doesNotMatch(storagePageSource, /const bucketId = record\.bucketName \|\| record\.id/);
  assert.doesNotMatch(storageSource, /data-admin-storage-sdk-status="pending"/);
  assert.doesNotMatch(storageSource, /backend SDK surface is not registered yet/);
  assert.doesNotMatch(storageSource, /SDK_NOT_REGISTERED/);
  assert.doesNotMatch(storageSource, /<StorageOperationsSettings/);
  assert.doesNotMatch(storageServiceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(storageServiceSource, /\baxios\b/);

  for (const key of [
    "admin.header.storageCenter",
    "admin.header.driveCenter",
    "admin.menu.storageCenter.configuration",
    "admin.menu.storage.providers",
    "admin.menu.storage.defaultBuckets",
    "admin.menu.driveCenter.library",
    "admin.menu.drive.spaces",
    "admin.menu.drive.nodes",
  ]) {
    assert.match(i18nSource, new RegExp(`"${key.replaceAll(".", "\\.")}"`), `${key} must be present in i18n resources`);
  }
});

test("admin header keeps overflowing desktop modules behind a More menu", () => {
  const adminHeaderSource = readPortalFile("./src/AdminHeader.tsx");

  assert.doesNotMatch(adminHeaderSource, /overflow-x-auto/, "desktop admin header navigation must not expose a horizontal scrollbar");
  assert.match(adminHeaderSource, /visibleModules/);
  assert.match(adminHeaderSource, /overflowModules/);
  assert.match(adminHeaderSource, /isModuleMoreMenuOpen/);
  assert.match(adminHeaderSource, /data-admin-header-module-nav/);
  assert.match(adminHeaderSource, /data-admin-header-visible-modules/);
  assert.match(adminHeaderSource, /data-admin-header-more-menu/);
  assert.match(adminHeaderSource, /ResizeObserver/);
  assert.match(adminHeaderSource, /aria-expanded=\{isModuleMoreMenuOpen\}/);
  assert.doesNotMatch(
    adminHeaderSource,
    /data-admin-header-visible-modules[^>]*className="[^"]*\bflex-1\b/,
    "More must stay next to visible header menu items instead of being pushed to the far right",
  );
});
