import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";

const ROOT = resolve(import.meta.dirname, "../..");

function readRepoFile(path: string): string {
  const absolutePath = resolve(ROOT, path);
  assert.ok(existsSync(absolutePath), `${path} must exist`);
  return readFileSync(absolutePath, "utf8");
}

test("login QR auth is exposed only through openPlatform.qrAuth sessions", () => {
  const contractSource = readRepoFile("docs/schema-registry/frontend-field-contracts.yaml");
  const appOpenApi = JSON.parse(readRepoFile("generated/openapi/clawrouter-app-openapi.json")) as {
    paths?: Record<string, Record<string, { operationId?: string; tags?: string[]; ["x-sdkwork-domain"]?: string }>>;
    components?: { schemas?: Record<string, unknown> };
  };
  const appSdkSource = readRepoFile("sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/sdk.ts");
  const authSdkSource = readRepoFile("sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/auth.ts");
  const openPlatformSdkSource = readRepoFile("sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/src/api/open-platform.ts");
  const authServiceSource = readRepoFile("sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-service.ts");
  const iamPortsSource = readRepoFile("sdkwork-appbase/packages/common/iam/sdkwork-iam-sdk-ports/src/index.ts");

  for (const [path, method, operationId] of [
    ["/app/v3/api/open_platform/qr_auth/sessions", "post", "qrAuth.sessions.create"],
    ["/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}", "get", "qrAuth.sessions.retrieve"],
    ["/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/scans", "post", "qrAuth.sessions.scans.create"],
    ["/app/v3/api/open_platform/qr_auth/sessions/{sessionKey}/passwords", "post", "qrAuth.sessions.passwords.create"],
  ] as const) {
    const operation = appOpenApi.paths?.[path]?.[method];
    assert.equal(operation?.operationId, operationId);
    assert.equal(operation?.tags?.[0], "openPlatform");
    assert.equal(operation?.["x-sdkwork-domain"], "platform");
    assert.match(contractSource, new RegExp(`operation_id:\\s*${operationId.replaceAll(".", "\\.")}`));
    assert.match(contractSource, new RegExp(`api_path:\\s*${path.replace(/[{}]/g, "\\$&").replaceAll("/", "\\/")}`));
  }

  assert.match(appSdkSource, /public readonly openPlatform: OpenPlatformApi/);
  assert.match(openPlatformSdkSource, /public readonly qrAuth: OpenPlatformQrAuthApi/);
  assert.match(openPlatformSdkSource, /public readonly sessions: OpenPlatformQrAuthSessionsApi/);
  assert.match(openPlatformSdkSource, /public readonly scans: OpenPlatformQrAuthSessionsScansApi/);
  assert.match(openPlatformSdkSource, /public readonly passwords: OpenPlatformQrAuthSessionsPasswordsApi/);
  assert.match(openPlatformSdkSource, /async create\(body: OpenPlatformQrAuthSessionCreateRequest\): Promise<QrAuthSessionsCreateResult>/);
  assert.match(openPlatformSdkSource, /async retrieve\(sessionKey: string\): Promise<QrAuthSessionsRetrieveResult>/);
  assert.match(openPlatformSdkSource, /async create\(sessionKey: string, body: OpenPlatformQrAuthScanCreateRequest\): Promise<QrAuthSessionsScansCreateResult>/);
  assert.match(openPlatformSdkSource, /async create\(sessionKey: string, body: OpenPlatformQrAuthPasswordCreateRequest\): Promise<QrAuthSessionsPasswordsCreateResult>/);

  assert.match(authServiceSource, /client\.openPlatform\?\.qrAuth\?\.sessions\?\.create/);
  assert.match(authServiceSource, /client\.openPlatform\?\.qrAuth\?\.sessions\?\.retrieve/);
  assert.match(authServiceSource, /client\.openPlatform\?\.qrAuth\?\.sessions\?\.scans\?\.create/);
  assert.match(authServiceSource, /client\.openPlatform\?\.qrAuth\?\.sessions\?\.passwords\?\.create/);
  assert.match(iamPortsSource, /openPlatform\.qrAuth\.sessions/);

  assert.doesNotMatch(contractSource, /operation_id:\s*loginQrCodes\./);
  assert.doesNotMatch(contractSource, /operation_id:\s*loginQrCodeCallbacks\./);
  assert.ok(!appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes"]);
  assert.ok(!appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes/{qrKey}"]);
  assert.ok(!appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes/{qrKey}/callback"]);
  assert.ok(!appOpenApi.paths?.["/app/v3/api/auth/qr_login_codes/confirm"]);
  assert.doesNotMatch(authSdkSource, /loginQrCodes/);
  assert.doesNotMatch(authSdkSource, /loginQrCodeCallbacks/);
});
