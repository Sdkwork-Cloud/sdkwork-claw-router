import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { SdkworkBackendClient as SdkworkAppbaseBackendClient } from "@sdkwork/appbase-backend-sdk";

import { resources } from "./packages/sdkwork-clawrouter-pc-i18n/src/resources";

const portalRoot = fileURLToPath(new URL(".", import.meta.url));
const workspaceRoot = fileURLToPath(new URL("../..", import.meta.url));

const legacyTerms = [
  "open_platform",
  "openPlatform",
  "OpenPlatform",
  "open-platform",
  "/admin/open-platform",
  "/backend/v3/api/open_platform",
  "/app/v3/api/open_platform",
  "qrAuth",
  "qr_auth",
] as const;

const scannedTextExtensions = new Set([
  ".json",
  ".md",
  ".mjs",
  ".rs",
  ".toml",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);

const expectedOAuthRoutes = [
  ["oauth", "/admin/oauth/login-platforms", undefined],
  ["oauth/login-platforms", undefined, "oauthLoginPlatforms"],
  ["oauth/official-accounts", undefined, "officialAccounts"],
  ["oauth/mini-programs", undefined, "miniPrograms"],
] as const;

const removedOAuthRouteFragments = [
  'path="oauth/overview"',
  'path="oauth/login"',
  'path="oauth/login/mini-programs"',
  'path="oauth/provider-catalog"',
  'path="oauth/integrations"',
  'path="oauth/clients"',
  'path="oauth/secrets"',
  'path="oauth/surfaces"',
  'path="oauth/flow-configs"',
  'path="oauth/scope-profiles"',
  'path="oauth/claim-mappings"',
  'path="oauth/policies"',
  'path="oauth/tenant-bindings"',
  'path="oauth/operator-platforms"',
  'path="oauth/resource-accounts"',
  'path="oauth/resource-accounts/official-accounts"',
  'path="oauth/resource-accounts/mini-programs"',
  'path="oauth/resource-authorizations"',
  'path="oauth/webhooks"',
  'path="oauth/operational-resources"',
  'path="oauth/account-links"',
  'path="oauth/grants"',
  'path="oauth/callback-diagnostics"',
  'path="oauth/diagnostic-runs"',
] as const;

const oauthAccountI18nKeys = [
  "admin.menu.ops.oauth",
  "admin.menu.oauth.loginPlatforms",
  "admin.menu.oauth.officialAccounts",
  "admin.menu.oauth.miniPrograms",
  "admin.oauth.sections.oauthLoginPlatforms",
  "admin.oauth.sections.officialAccounts",
  "admin.oauth.sections.miniPrograms",
  "admin.oauth.form.providerCode",
  "admin.oauth.form.accountName",
  "admin.oauth.form.appId",
  "admin.oauth.form.appSecret",
  "admin.oauth.form.secretRef",
  "admin.oauth.form.callbackUrl",
  "admin.oauth.form.originalId",
  "admin.oauth.form.platformAccountId",
  "admin.oauth.form.submit",
  "admin.oauth.form.saving",
  "admin.oauth.form.saved",
  "admin.oauth.form.error",
  "admin.oauth.columns.providerCode",
  "admin.oauth.columns.accountName",
  "admin.oauth.columns.appId",
  "admin.oauth.columns.resourceAccountKind",
  "admin.oauth.columns.status",
] as const;

function readPortalFile(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

function collectTextFiles(root: string, options: { exclude?: RegExp[] } = {}): string[] {
  if (!existsSync(root)) {
    return [];
  }

  const files: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const fullPath = join(root, entry.name);
    const relativePath = relative(workspaceRoot, fullPath).replaceAll("\\", "/");

    if (options.exclude?.some((pattern) => pattern.test(relativePath))) {
      continue;
    }

    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === "target") {
        continue;
      }
      files.push(...collectTextFiles(fullPath, options));
      continue;
    }

    if (!entry.isFile() || !scannedTextExtensions.has(extname(entry.name))) {
      continue;
    }

    if (statSync(fullPath).size > 2_000_000) {
      continue;
    }

    files.push(fullPath);
  }
  return files;
}

function findLegacyOauthBoundaryReferences(): string[] {
  const scopedRoots = [
    join(portalRoot, "src"),
    join(portalRoot, "packages"),
    join(workspaceRoot, "services", "sdkwork-claw-product", "src"),
    join(workspaceRoot, "services", "sdkwork-claw-product", "tests"),
    join(workspaceRoot, "docs", "schema-registry"),
    join(workspaceRoot, "specs"),
    join(workspaceRoot, "generated", "api"),
    join(workspaceRoot, "generated", "openapi"),
    join(workspaceRoot, "sdks", "clawrouter-app-sdk"),
    join(workspaceRoot, "sdks", "clawrouter-backend-sdk"),
  ];
  const exclude = [
    /apps\/sdkwork-clawrouter-pc\/admin-oauth-runtime\.test\.ts$/,
    /apps\/sdkwork-clawrouter-pc\/admin-open-platform-runtime\.test\.ts$/,
    /apps\/sdkwork-clawrouter-pc\/auth-qr-open-platform-contract\.test\.ts$/,
    /docs\/superpowers\//,
    /data\/skills\//,
  ];

  const findings: string[] = [];
  for (const root of scopedRoots) {
    for (const file of collectTextFiles(root, { exclude })) {
      const source = readFileSync(file, "utf8");
      const matchedTerms = legacyTerms.filter((term) => source.includes(term));
      if (matchedTerms.length === 0) {
        continue;
      }
      findings.push(`${relative(workspaceRoot, file).replaceAll("\\", "/")}: ${matchedTerms.join(", ")}`);
    }
  }
  return findings;
}

test("OAuth admin is owned by operations navigation instead of the global header", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const registrySource = readPortalFile("./src/adminModuleRegistry.ts");
  const packageJson = JSON.parse(readPortalFile("./package.json")) as {
    dependencies: Record<string, string>;
  };

  assert.equal(packageJson.dependencies["sdkwork-clawrouter-pc-admin-oauth"], "workspace:*");
  assert.match(appSource, /lazyRoute\(\(\) => import\('sdkwork-clawrouter-pc-admin-oauth'\), 'OAuthAdmin'\)/);
  assert.doesNotMatch(registrySource, /\|\s*'oauth'/);
  assert.doesNotMatch(registrySource, /id:\s*'oauth'/);
  assert.doesNotMatch(registrySource, /nameKey:\s*'admin\.header\.oauth'/);
  assert.match(registrySource, /id:\s*'operations'[\s\S]*pathPrefixes:\s*\[[^\]]*'\/admin\/oauth'/);
  assert.match(registrySource, /moduleId:\s*'operations'[\s\S]*groupBlock\('admin\.menu\.ops\.oauth'/);

  for (const [path, redirect, sectionId] of expectedOAuthRoutes) {
    if (redirect) {
      assert.match(
        appSource,
        new RegExp(`<Route path="${path}" element=\\{<Navigate to="${redirect}" replace \\/>} \\/>`),
      );
      continue;
    }
    assert.ok(sectionId, `route ${path} should declare a section id`);
    assert.match(
      appSource,
      new RegExp(`<Route path="${path}" element=\\{<OAuthAdmin sectionId="${sectionId}" \\/>} \\/>`),
    );
  }

  for (const fragment of removedOAuthRouteFragments) {
    assert.ok(!appSource.includes(fragment), `legacy OAuth route should be removed: ${fragment}`);
  }

  for (const [path, labelKey] of [
    ["/admin/oauth/login-platforms", "admin.menu.oauth.loginPlatforms"],
    ["/admin/oauth/official-accounts", "admin.menu.oauth.officialAccounts"],
    ["/admin/oauth/mini-programs", "admin.menu.oauth.miniPrograms"],
  ] as const) {
    assert.match(registrySource, new RegExp(`path:\\s*'${path}'`));
    assert.match(registrySource, new RegExp(`labelKey:\\s*'${labelKey.replaceAll(".", "\\.")}'`));
  }
});

test("OAuth admin page is reduced to the three account intake categories", () => {
  const oauthSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/index.tsx");

  const sectionUnion = oauthSource.match(/export type OAuthAdminSectionId =[\s\S]*?;/)?.[0] ?? "";
  assert.match(sectionUnion, /'oauthLoginPlatforms'/);
  assert.match(sectionUnion, /'officialAccounts'/);
  assert.match(sectionUnion, /'miniPrograms'/);
  for (const removedSectionId of [
    "'overview'",
    "'login'",
    "'miniProgramLogin'",
    "'providerCatalog'",
    "'integrations'",
    "'clients'",
    "'diagnosticRuns'",
    "'resourceAuthorizations'",
  ]) {
    assert.ok(!sectionUnion.includes(removedSectionId), `legacy section id should be removed: ${removedSectionId}`);
  }

  assert.match(oauthSource, /const OAUTH_ACCOUNT_SECTIONS/);
  assert.match(oauthSource, /resourceAccountKind:\s*'open_app'/);
  assert.match(oauthSource, /resourceAccountKind:\s*'official_account'/);
  assert.match(oauthSource, /resourceAccountKind:\s*'mini_program'/);
  assert.match(oauthSource, /function buildOAuthResourceAccountPayload/);
  assert.match(oauthSource, /createOAuthResourceAccount/);
  assert.match(oauthSource, /listOAuthResourceAccounts/);
  assert.match(oauthSource, /data-admin-oauth-account-form/);
  assert.match(oauthSource, /providerAccountId/);
  assert.match(oauthSource, /providerAccountOriginalId/);
  assert.match(oauthSource, /providerConfigJson/);

  for (const removedMarker of [
    "OAUTH_PLATFORM_BLUEPRINTS",
    "OAUTH_SURFACE_BLUEPRINTS",
    "OAUTH_SCHEMA_AREAS",
    "OAuthOverview",
    "OAuthLoginWorkspace",
    "OAuthMiniProgramWorkspace",
    "providerCatalog",
    "operatorPlatforms",
    "resourceAuthorizations",
    "callbackDiagnostics",
    "diagnosticRuns",
  ]) {
    assert.ok(!oauthSource.includes(removedMarker), `legacy OAuth workspace marker should be removed: ${removedMarker}`);
  }

  assert.doesNotMatch(oauthSource, /\bfetch\s*\(/);
  assert.doesNotMatch(oauthSource, /\baxios\b/);
});

test("OAuth account service only uses appbase backend SDK resource accounts", () => {
  const serviceSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/oauthAdminService.ts");

  for (const marker of [
    "getSdkworkAppbaseBackendSdkClient",
    "iam.oauth.resourceAccounts",
    "listOAuthResourceAccounts",
    "createOAuthResourceAccount",
    "updateOAuthResourceAccount",
  ]) {
    assert.ok(serviceSource.includes(marker), `missing account service marker: ${marker}`);
  }

  for (const removedMarker of [
    "oauthResource('providerCatalog')",
    "oauthResource('integrations')",
    "oauthResource('clients')",
    "oauthResource('secrets')",
    "oauthResource('surfaces')",
    "oauthResource('flowConfigs')",
    "oauthResource('operatorPlatforms')",
    "oauthResource('resourceAuthorizations')",
    "oauthResource('accountLinks')",
    "oauthResource('diagnosticRuns')",
  ]) {
    assert.ok(!serviceSource.includes(removedMarker), `legacy service resource should be removed: ${removedMarker}`);
  }

  assert.doesNotMatch(serviceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(serviceSource, /\baxios\b/);
  assert.doesNotMatch(serviceSource, /@sdkwork\/clawrouter-backend-sdk/);
  assert.doesNotMatch(serviceSource, /getClawRouterBackendSdkClient/);
  assert.doesNotMatch(serviceSource, /\/backend\/v3\/api/);
});

test("Appbase backend SDK exposes the OAuth resource account operations used by Claw Router", () => {
  const client = new SdkworkAppbaseBackendClient({
    baseUrl: "http://localhost:8080/backend/v3/api",
    platform: "web-admin",
  }) as unknown as {
    iam?: {
      oauth?: {
        resourceAccounts?: Record<string, any>;
      };
    };
    iamOauth?: {
      iam?: {
        oauth?: {
          resourceAccounts?: Record<string, any>;
        };
      };
    };
  };

  const resourceAccounts = client.iam?.oauth?.resourceAccounts ?? client.iamOauth?.iam?.oauth?.resourceAccounts;
  assert.ok(resourceAccounts, "expected appbase backend SDK iam.oauth.resourceAccounts to exist");
  assert.equal(typeof resourceAccounts.list, "function");
  assert.equal(typeof resourceAccounts.create, "function");
  assert.equal(typeof resourceAccounts.update, "function");
});

test("OAuth account navigation and form copy are covered by i18n resources", () => {
  const en = resources.en.translation;
  const zh = resources.zh.translation;

  for (const key of oauthAccountI18nKeys) {
    assert.equal(typeof en[key], "string", `missing English OAuth account i18n key: ${key}`);
    assert.notEqual(en[key], "", `empty English OAuth account i18n key: ${key}`);
    assert.equal(typeof zh[key], "string", `missing Chinese OAuth account i18n key: ${key}`);
    assert.notEqual(zh[key], "", `empty Chinese OAuth account i18n key: ${key}`);
  }
});

test("Claw Router product boundaries no longer expose legacy open platform contracts", () => {
  const findings = findLegacyOauthBoundaryReferences();

  assert.deepEqual(findings, []);
});
