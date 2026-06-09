import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { SdkworkBackendClient as SdkworkAppbaseBackendClient } from "@sdkwork/appbase-backend-sdk";
import ts from "typescript";

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

type I18nLiteralViolation = {
  line: number;
  text: string;
  kind: string;
};

const oauthRightContentI18nKeys = [
  "admin.oauth.overview.metrics.providerFamilies",
  "admin.oauth.overview.metrics.runtimeSurfaces",
  "admin.oauth.overview.metrics.accountOwnerModes",
  "admin.oauth.overview.metrics.iamTables",
  "admin.oauth.overview.panels.providerCoverage",
  "admin.oauth.overview.panels.schemaAreas",
  "admin.oauth.overview.panels.surfaceDifferences",
  "admin.oauth.overview.providerColumns.provider",
  "admin.oauth.overview.providerColumns.region",
  "admin.oauth.overview.providerColumns.family",
  "admin.oauth.overview.providerColumns.authorization",
  "admin.oauth.overview.providerColumns.surfaces",
  "admin.oauth.overview.providerColumns.credentialModel",
  "admin.oauth.overview.providerColumns.resourceAccess",
  "admin.oauth.overview.surfaceColumns.surface",
  "admin.oauth.overview.surfaceColumns.entry",
  "admin.oauth.overview.surfaceColumns.callback",
  "admin.oauth.overview.surfaceColumns.clientIdentity",
  "admin.oauth.overview.surfaceColumns.riskControls",
  "admin.oauth.login.cards.authorizationUrl",
  "admin.oauth.login.cards.sessionExchange",
  "admin.oauth.login.cards.grantGovernance",
  "admin.oauth.miniProgram.cards.session",
  "admin.oauth.miniProgram.cards.phoneConsent",
  "admin.oauth.miniProgram.cards.resourceCheck",
  "admin.oauth.resourceCenter.emptyDescription",
  "admin.oauth.resourceCenter.emptyTitle",
  "admin.oauth.resourceCenter.errorTitle",
  "admin.oauth.resourceCenter.loadingTitle",
  "admin.oauth.resourceCenter.searchPlaceholder",
  "admin.oauth.resources.providerCatalog.description",
  "admin.oauth.resources.integrations.description",
  "admin.oauth.resources.clients.description",
  "admin.oauth.resources.secrets.description",
  "admin.oauth.resources.surfaces.description",
  "admin.oauth.resources.flowConfigs.description",
  "admin.oauth.resources.scopeProfiles.description",
  "admin.oauth.resources.claimMappings.description",
  "admin.oauth.resources.policies.description",
  "admin.oauth.resources.tenantBindings.description",
  "admin.oauth.resources.operatorPlatforms.description",
  "admin.oauth.resources.resourceAccounts.description",
  "admin.oauth.resources.officialAccounts.description",
  "admin.oauth.resources.miniPrograms.description",
  "admin.oauth.resources.resourceAuthorizations.description",
  "admin.oauth.resources.webhooks.description",
  "admin.oauth.resources.operationalResources.description",
  "admin.oauth.resources.accountLinks.description",
  "admin.oauth.resources.grants.description",
  "admin.oauth.resources.callbackDiagnostics.description",
  "admin.oauth.resources.diagnosticRuns.description",
  "admin.oauth.groups.configuration",
  "admin.oauth.groups.resourceAccess",
  "admin.oauth.groups.identityRuntime",
  "admin.oauth.boolean.yes",
  "admin.oauth.boolean.no",
] as const;

const oauthRightContentValueI18nKeys = [
  "admin.oauth.values.empty",
  "admin.oauth.values.status.active",
  "admin.oauth.values.status.inactive",
  "admin.oauth.values.status.enabled",
  "admin.oauth.values.status.disabled",
  "admin.oauth.values.status.pending",
  "admin.oauth.values.status.failed",
  "admin.oauth.values.status.revoked",
  "admin.oauth.values.status.expired",
  "admin.oauth.values.surface.pcWeb",
  "admin.oauth.values.surface.mobileWeb",
  "admin.oauth.values.surface.nativeApp",
  "admin.oauth.values.surface.miniProgram",
  "admin.oauth.values.surface.officialAccount",
  "admin.oauth.values.ownerMode.selfManaged",
  "admin.oauth.values.ownerMode.operatorAuthorized",
  "admin.oauth.values.authorizationMode.selfManaged",
  "admin.oauth.values.authorizationMode.operatorAuthorized",
  "admin.oauth.values.clientType.web",
  "admin.oauth.values.clientType.mobile",
  "admin.oauth.values.clientType.native",
  "admin.oauth.values.clientType.miniProgram",
  "admin.oauth.values.consentMode.default",
  "admin.oauth.values.consentMode.silent",
  "admin.oauth.values.consentMode.explicit",
  "admin.oauth.values.resourceType.menu",
  "admin.oauth.values.resourceType.eventSubscription",
  "admin.oauth.values.publishStatus.draft",
  "admin.oauth.values.publishStatus.published",
  "admin.oauth.values.signatureMode.plain",
  "admin.oauth.values.signatureMode.sha256",
] as const;

const oauthValueI18nKeysAllowedToMatchEnglish = new Set([
  "admin.oauth.values.empty",
  "admin.oauth.values.clientType.web",
  "admin.oauth.values.signatureMode.sha256",
]);

const oauthFlowFieldI18nKeys = [
  "admin.oauth.fields.providerCode",
  "admin.oauth.fields.surface",
  "admin.oauth.fields.redirectUri",
  "admin.oauth.fields.state",
  "admin.oauth.fields.nonce",
  "admin.oauth.fields.pkceChallenge",
  "admin.oauth.fields.authorizationCode",
  "admin.oauth.fields.stateVerifier",
  "admin.oauth.fields.tenantBinding",
  "admin.oauth.fields.claimMapping",
  "admin.oauth.fields.accountLinkPolicy",
  "admin.oauth.fields.scopeProfile",
  "admin.oauth.fields.grantStatus",
  "admin.oauth.fields.expiresAt",
  "admin.oauth.fields.revocationPolicy",
  "admin.oauth.fields.auditEvent",
  "admin.oauth.fields.appId",
  "admin.oauth.fields.loginCode",
  "admin.oauth.fields.anonymousCode",
  "admin.oauth.fields.sessionPolicy",
  "admin.oauth.fields.encryptedDataRef",
  "admin.oauth.fields.ivRef",
  "admin.oauth.fields.consentScope",
  "admin.oauth.fields.retentionPolicy",
  "admin.oauth.fields.resourceAccountId",
  "admin.oauth.fields.operatorPlatformId",
  "admin.oauth.fields.ownerMode",
  "admin.oauth.fields.codeExchangeStatus",
  "admin.oauth.fields.diagnosticRun",
] as const;

const oauthLoadErrorI18nKeys = [
  "admin.oauth.errors.resourceLoad",
  "admin.oauth.errors.sdkResourceUnavailable",
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

test("OAuth admin owns the canonical admin route family", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const registrySource = readPortalFile("./src/adminModuleRegistry.ts");
  const packageJson = JSON.parse(readPortalFile("./package.json")) as {
    dependencies: Record<string, string>;
  };

  assert.equal(packageJson.dependencies["sdkwork-clawrouter-pc-admin-oauth"], "workspace:*");
  assert.match(appSource, /lazyRoute\(\(\) => import\('sdkwork-clawrouter-pc-admin-oauth'\), 'OAuthAdmin'\)/);
  assert.match(appSource, /<Route path="oauth" element=\{<Navigate to="\/admin\/oauth\/overview" replace \/>} \/>/);
  assert.match(appSource, /<Route path="oauth\/login" element=\{<OAuthAdmin sectionId="login" \/>} \/>/);
  assert.match(appSource, /<Route path="oauth\/login\/mini-programs" element=\{<OAuthAdmin sectionId="miniProgramLogin" \/>} \/>/);
  assert.match(registrySource, /id:\s*'oauth'/);
  assert.match(registrySource, /defaultPath:\s*'\/admin\/oauth\/overview'/);
  assert.match(registrySource, /pathPrefixes:\s*\['\/admin\/oauth'\]/);
});

test("OAuth admin exposes the full appbase IAM OAuth configuration map", () => {
  const oauthSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/index.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/oauthAdminService.ts");

  for (const route of [
    "/admin/oauth/overview",
    "/admin/oauth/login",
    "/admin/oauth/login/mini-programs",
    "/admin/oauth/provider-catalog",
    "/admin/oauth/integrations",
    "/admin/oauth/clients",
    "/admin/oauth/secrets",
    "/admin/oauth/surfaces",
    "/admin/oauth/flow-configs",
    "/admin/oauth/scope-profiles",
    "/admin/oauth/claim-mappings",
    "/admin/oauth/policies",
    "/admin/oauth/tenant-bindings",
    "/admin/oauth/operator-platforms",
    "/admin/oauth/resource-accounts",
    "/admin/oauth/resource-accounts/official-accounts",
    "/admin/oauth/resource-accounts/mini-programs",
    "/admin/oauth/resource-authorizations",
    "/admin/oauth/webhooks",
    "/admin/oauth/operational-resources",
    "/admin/oauth/account-links",
    "/admin/oauth/grants",
    "/admin/oauth/callback-diagnostics",
    "/admin/oauth/diagnostic-runs",
  ]) {
    assert.ok(oauthSource.includes(route), `missing OAuth admin route: ${route}`);
  }

  for (const sdkMarker of [
    "getSdkworkAppbaseBackendSdkClient",
    "client.iam?.oauth ?? client.iamOauth?.iam?.oauth",
    "oauthResource('providerCatalog')",
    "oauthResource('integrations')",
    "oauthResource('clients')",
    "oauthResource('secrets')",
    "oauthResource('surfaces')",
    "oauthResource('flowConfigs')",
    "oauthResource('scopeProfiles')",
    "oauthResource('claimMappings')",
    "oauthResource('policies')",
    "oauthResource('tenantBindings')",
    "oauthResource('operatorPlatforms')",
    "oauthResource('resourceAccounts')",
    "oauthResource('resourceAuthorizations')",
    "oauthResource('operationalResources')",
    "oauthResource('accountLinks')",
    "oauthResource('grants')",
    "oauthResource('callbackEvents')",
    "oauthResource('diagnosticRuns')",
    "webhookConfigs ?? client.webhooks",
    "miniProgramLoginChecks",
  ]) {
    assert.ok(serviceSource.includes(sdkMarker), `missing appbase backend SDK marker: ${sdkMarker}`);
  }

  assert.doesNotMatch(oauthSource, /\bfetch\s*\(/);
  assert.doesNotMatch(oauthSource, /\baxios\b/);
  assert.doesNotMatch(serviceSource, /\bfetch\s*\(/);
  assert.doesNotMatch(serviceSource, /\baxios\b/);
  assert.doesNotMatch(serviceSource, /@sdkwork\/clawrouter-backend-sdk/);
  assert.doesNotMatch(serviceSource, /getClawRouterBackendSdkClient/);
});

test("Appbase backend SDK exposes the OAuth admin resource tree used by Claw Router", () => {
  const client = new SdkworkAppbaseBackendClient({
    baseUrl: "http://localhost:8080/backend/v3/api",
    platform: "web-admin",
  }) as unknown as {
    iam?: {
      oauth?: Record<string, any>;
    };
    iamOauth?: {
      iam?: {
        oauth?: Record<string, any>;
      };
    };
  };

  const oauth = client.iam?.oauth ?? client.iamOauth?.iam?.oauth;
  assert.ok(oauth, "expected appbase backend SDK OAuth resource tree to exist");

  for (const resourceName of [
    "providerCatalog",
    "integrations",
    "clients",
    "secrets",
    "surfaces",
    "flowConfigs",
    "scopeProfiles",
    "claimMappings",
    "policies",
    "tenantBindings",
    "operatorPlatforms",
    "resourceAccounts",
    "resourceAuthorizations",
    "webhookConfigs",
    "operationalResources",
    "accountLinks",
    "grants",
    "callbackEvents",
    "diagnosticRuns",
  ]) {
    assert.equal(typeof oauth[resourceName as keyof typeof oauth], "object", `missing iam.oauth.${resourceName}`);
  }

  assert.equal(typeof oauth["providerCatalog"].list, "function");
  assert.equal(typeof oauth["flowConfigs"].list, "function");
  assert.equal(typeof oauth["resourceAccounts"].list, "function");
  assert.equal(typeof oauth["resourceAccounts"].miniProgramLoginChecks.create, "function");
});

test("OAuth admin relies on the primary admin sidebar instead of rendering a nested menu", () => {
  const appSource = readPortalFile("./src/App.tsx");
  const registrySource = readPortalFile("./src/adminModuleRegistry.ts");
  const oauthSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/index.tsx");

  assert.match(registrySource, /moduleId:\s*'oauth'/);
  assert.match(registrySource, /path:\s*'\/admin\/oauth\/overview'/);
  assert.match(registrySource, /path:\s*'\/admin\/oauth\/login'/);
  assert.match(registrySource, /path:\s*'\/admin\/oauth\/resource-accounts\/mini-programs'/);
  assert.match(appSource, /<Route path="oauth\/overview" element=\{<OAuthAdmin sectionId="overview" \/>} \/>/);
  assert.match(appSource, /<Route path="oauth\/resource-accounts\/mini-programs" element=\{<OAuthAdmin sectionId="miniPrograms" \/>} \/>/);
  assert.doesNotMatch(oauthSource, /function OAuthAdminSidebar/);
  assert.doesNotMatch(oauthSource, /function OAuthSidebarLink/);
  assert.doesNotMatch(oauthSource, /<aside className=/);
  assert.doesNotMatch(oauthSource, /aria-label="OAuth admin sections"/);
});

test("OAuth admin right-side content is covered by i18n resources", () => {
  const oauthSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/index.tsx");
  const violations = findOAuthRightContentI18nViolations(oauthSource);
  const en = resources.en.translation;
  const zh = resources.zh.translation;

  assert.deepEqual(
    violations,
    [],
    `Found ${violations.length} non-i18n OAuth right-side content literals:\n${violations
      .slice(0, 80)
      .map((violation) => `${violation.line} ${violation.kind}: ${violation.text}`)
      .join("\n")}`,
  );

  for (const key of oauthRightContentI18nKeys) {
    assert.equal(typeof en[key], "string", `missing English OAuth i18n key: ${key}`);
    assert.notEqual(en[key], "", `empty English OAuth i18n key: ${key}`);
    assert.equal(typeof zh[key], "string", `missing Chinese OAuth i18n key: ${key}`);
    assert.notEqual(zh[key], "", `empty Chinese OAuth i18n key: ${key}`);
  }

  for (const key of findAdminOauthI18nKeys(oauthSource)) {
    assert.equal(typeof en[key], "string", `missing English OAuth source i18n key: ${key}`);
    assert.notEqual(en[key], "", `empty English OAuth source i18n key: ${key}`);
    assert.equal(typeof zh[key], "string", `missing Chinese OAuth source i18n key: ${key}`);
    assert.notEqual(zh[key], "", `empty Chinese OAuth source i18n key: ${key}`);
  }

  assert.equal(en["admin.oauth.overview.panels.providerCoverage"], "Provider Coverage");
  assert.notEqual(zh["admin.oauth.overview.panels.providerCoverage"], en["admin.oauth.overview.panels.providerCoverage"]);
  assert.equal(en["admin.oauth.resourceCenter.emptyTitle"], "No OAuth records");
  assert.notEqual(zh["admin.oauth.resourceCenter.emptyTitle"], en["admin.oauth.resourceCenter.emptyTitle"]);
});

test("OAuth admin right-side table values are localized instead of exposing backend enum text", () => {
  const oauthSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/index.tsx");
  const en = resources.en.translation;
  const zh = resources.zh.translation;

  assert.doesNotMatch(oauthSource, /function formatStatus\(value: unknown\): string \{\s*return typeof value === 'string' && value \? value\.replaceAll\('_', ' '\) : formatUnknown\(value\);\s*\}/);
  assert.match(oauthSource, /function enumFormatter\(namespace: string, t: ReturnType<typeof useTranslation>\['t'\]\)/);
  assert.match(oauthSource, /column\('status', t\('admin\.oauth\.columns\.status', 'Status'\), enumFormatter\('status', t\)\)/);
  assert.match(oauthSource, /column\('surface', t\('admin\.oauth\.columns\.surface', 'Surface'\), enumFormatter\('surface', t\)\)/);
  assert.match(oauthSource, /column\('ownerMode', t\('admin\.oauth\.columns\.ownerMode', 'Owner Mode'\), enumFormatter\('ownerMode', t\)\)/);

  for (const key of oauthRightContentValueI18nKeys) {
    assert.equal(typeof en[key], "string", `missing English OAuth value i18n key: ${key}`);
    assert.notEqual(en[key], "", `empty English OAuth value i18n key: ${key}`);
    assert.equal(typeof zh[key], "string", `missing Chinese OAuth value i18n key: ${key}`);
    assert.notEqual(zh[key], "", `empty Chinese OAuth value i18n key: ${key}`);
    if (!oauthValueI18nKeysAllowedToMatchEnglish.has(key)) {
      assert.notEqual(zh[key], en[key], `Chinese OAuth value should differ from English fallback: ${key}`);
    }
  }
});

test("OAuth admin right-side flow field chips are localized", () => {
  const oauthSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/index.tsx");
  const en = resources.en.translation;
  const zh = resources.zh.translation;

  assert.match(oauthSource, /function OAuthFlowCard\(\{ fields, icon: Icon, title \}: \{ fields: string\[\]; icon: LucideIcon; title: string \}\)/);
  assert.match(oauthSource, /const \{ t \} = useTranslation\(\);[\s\S]*?t\(`admin\.oauth\.fields\.\$\{field\}`/);
  assert.doesNotMatch(oauthSource, /\{field\}\s*<\/span>/);

  for (const key of oauthFlowFieldI18nKeys) {
    assert.equal(typeof en[key], "string", `missing English OAuth flow field i18n key: ${key}`);
    assert.notEqual(en[key], "", `empty English OAuth flow field i18n key: ${key}`);
    assert.equal(typeof zh[key], "string", `missing Chinese OAuth flow field i18n key: ${key}`);
    assert.notEqual(zh[key], "", `empty Chinese OAuth flow field i18n key: ${key}`);
  }
});

test("OAuth admin right-side empty value fallbacks are localized", () => {
  const oauthSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/index.tsx");

  assert.match(oauthSource, /function formatUnknown\(value: unknown, t: ReturnType<typeof useTranslation>\['t'\]\): string/);
  assert.match(oauthSource, /return t\('admin\.oauth\.values\.empty', '-'\);/);
  assert.doesNotMatch(oauthSource, /function formatUnknown\(value: unknown\): string \{\s*if \(value === null \|\| value === undefined \|\| value === ''\) \{\s*return '-';/);
  assert.match(oauthSource, /column\('scopes', t\('admin\.oauth\.columns\.scopes', 'Scopes'\), formatList\(t\)\)/);
  assert.match(oauthSource, /column\('redirectUriCount', t\('admin\.oauth\.columns\.redirectUriCount', 'Redirect URIs'\), formatNumber\(t\)\)/);
  assert.match(oauthSource, /column\('priority', t\('admin\.oauth\.columns\.priority', 'Priority'\), formatNumber\(t\)\)/);
});

test("OAuth admin right-side load errors are localized", () => {
  const oauthSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/index.tsx");
  const serviceSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/oauthAdminService.ts");
  const en = resources.en.translation;
  const zh = resources.zh.translation;

  assert.match(oauthSource, /load: \(params\) => loadOAuthResource\(t, listOAuthProviderCatalog, toOAuthListParams\(params\)\)/);
  assert.match(oauthSource, /function loadOAuthResource\(/);
  assert.match(oauthSource, /translateOAuthLoadError\(t, error\)/);
  assert.match(oauthSource, /admin\.oauth\.errors\.resourceLoad/);
  assert.match(oauthSource, /admin\.oauth\.errors\.sdkResourceUnavailable/);
  assert.doesNotMatch(serviceSource, /throw new Error\('OAuth .* SDK resource is not available/);

  for (const key of oauthLoadErrorI18nKeys) {
    assert.equal(typeof en[key], "string", `missing English OAuth load error i18n key: ${key}`);
    assert.notEqual(en[key], "", `empty English OAuth load error i18n key: ${key}`);
    assert.equal(typeof zh[key], "string", `missing Chinese OAuth load error i18n key: ${key}`);
    assert.notEqual(zh[key], "", `empty Chinese OAuth load error i18n key: ${key}`);
    assert.notEqual(zh[key], en[key], `Chinese OAuth load error should differ from English fallback: ${key}`);
  }
});

test("OAuth admin SDK resource access is centralized and never reads optional resources directly", () => {
  const serviceSource = readPortalFile("./packages/sdkwork-clawrouter-pc-admin-oauth/src/oauthAdminService.ts");

  assert.match(serviceSource, /function resolveOAuthResourceTree\(/);
  assert.match(serviceSource, /function resolveOAuthResource<TKey extends keyof OAuthResources>\(/);
  assert.match(serviceSource, /function assertOAuthListResource<TKey extends keyof OAuthResources>\(/);
  assert.match(serviceSource, /throw createOAuthSdkResourceUnavailableError\(`\$\{String\(resourceName\)\}\.list`\)/);
  assert.doesNotMatch(serviceSource, /oauthClient\(\)\[resourceName\]/);
  assert.doesNotMatch(serviceSource, /\boauthClient\(\)\.(providerCatalog|flowConfigs|resourceAccounts)\b/);
});

test("Claw Router product boundaries no longer expose legacy open platform contracts", () => {
  const findings = findLegacyOauthBoundaryReferences();

  assert.deepEqual(findings, []);
});

function findOAuthRightContentI18nViolations(sourceText: string): I18nLiteralViolation[] {
  const sourceFile = ts.createSourceFile(
    "apps/sdkwork-clawrouter-pc/packages/sdkwork-clawrouter-pc-admin-oauth/src/index.tsx",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const violations: I18nLiteralViolation[] = [];
  const userFacingObjectProperties = new Set([
    "area",
    "authorization",
    "callback",
    "clientIdentity",
    "credentialModel",
    "description",
    "entry",
    "family",
    "group",
    "ownership",
    "provider",
    "region",
    "resourceAccess",
    "riskControls",
    "surface",
    "surfaces",
    "tables",
  ]);
  const userFacingJsxAttributes = new Set([
    "emptyDescription",
    "emptyTitle",
    "errorTitle",
    "label",
    "loadingTitle",
    "paginationNextLabel",
    "paginationPageLabel",
    "paginationPageSizeLabel",
    "paginationPreviousLabel",
    "paginationShowingLabel",
    "reloadLabel",
    "searchPlaceholder",
    "title",
  ]);

  const record = (node: ts.Node, kind: string, value: string) => {
    const normalized = value.replace(/\s+/g, " ").trim();
    if (!normalized) {
      return;
    }
    if (normalized.startsWith("admin.oauth.") || normalized.startsWith("/admin/oauth")) {
      return;
    }
    if (!/[A-Za-z]/.test(normalized)) {
      return;
    }
    if (isInsideTranslationCall(node) || isRecordFieldListLiteral(node) || isRouteOrIdLiteral(node)) {
      return;
    }
    const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    violations.push({
      kind,
      line: position.line + 1,
      text: normalized,
    });
  };

  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) {
      record(node, "jsx text", node.getText(sourceFile));
    } else if (
      ts.isPropertyAssignment(node)
      && userFacingObjectProperties.has(propertyNameFromName(node.name) ?? "")
      && (ts.isStringLiteral(node.initializer) || ts.isNoSubstitutionTemplateLiteral(node.initializer))
    ) {
      record(node.initializer, `object.${propertyNameFromName(node.name)}`, node.initializer.text);
    } else if (ts.isJsxAttribute(node) && userFacingJsxAttributes.has(String(node.name.text)) && node.initializer) {
      if (ts.isStringLiteral(node.initializer)) {
        record(node.initializer, `jsx.${node.name.text}`, node.initializer.text);
      }
    } else if (
      ts.isStringLiteral(node)
      && (isInsideNamedFunction(node, "booleanFormatter") || isInsideNamedFunction(node, "formatBoolean"))
      && (node.text === "Yes" || node.text === "No")
    ) {
      record(node, "formatBoolean", node.text);
    }
    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
  return violations.sort((left, right) => left.line - right.line || left.text.localeCompare(right.text));
}

function findAdminOauthI18nKeys(sourceText: string): string[] {
  return [...new Set(sourceText.match(/admin\.oauth\.[A-Za-z0-9_.]+/g) ?? [])]
    .filter((key) => !key.endsWith("."))
    .sort();
}

function isInsideNamedFunction(node: ts.Node, functionName: string): boolean {
  let current: ts.Node | undefined = node;
  while (current) {
    if (ts.isFunctionDeclaration(current) && current.name?.text === functionName) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

function isInsideTranslationCall(node: ts.Node): boolean {
  let current: ts.Node | undefined = node;
  while (current) {
    const parent = current.parent;
    if (!parent) {
      return false;
    }
    if (ts.isCallExpression(parent) && parent.arguments.includes(current as ts.Expression)) {
      const expression = parent.expression;
      return ts.isIdentifier(expression) && expression.text === "t";
    }
    current = parent;
  }
  return false;
}

function isRecordFieldListLiteral(node: ts.Node): boolean {
  let current: ts.Node | undefined = node;
  while (current) {
    if (ts.isPropertyAssignment(current)) {
      const propertyName = propertyNameFromName(current.name);
      return propertyName === "fields" || propertyName === "searchFields" || propertyName === "pageSizeOptions";
    }
    current = current.parent;
  }
  return false;
}

function isRouteOrIdLiteral(node: ts.Node): boolean {
  let current: ts.Node | undefined = node;
  while (current) {
    if (ts.isPropertyAssignment(current)) {
      const propertyName = propertyNameFromName(current.name);
      return propertyName === "id" || propertyName === "route" || propertyName === "key";
    }
    if (ts.isCallExpression(current)) {
      const expression = current.expression;
      return ts.isIdentifier(expression) && ["navItem", "column", "resolveOAuthSectionId"].includes(expression.text);
    }
    current = current.parent;
  }
  return false;
}

function propertyNameFromName(name: ts.PropertyName): string | undefined {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  return undefined;
}
