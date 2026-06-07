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
  const appSdkInput = JSON.parse(readRepoFile("sdks/clawrouter-app-sdk/openapi/clawrouter-app-sdk.sdkgen.json")) as {
    paths?: Record<string, Record<string, { operationId?: string }>>;
  };
  const appSdkSource = readRepoFile("sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/generated/server-openapi/src/sdk.ts");
  const appbaseSdkSource = readRepoFile(
    "../../../sdkwork-appbase/sdks/sdkwork-appbase-app-sdk/sdkwork-appbase-app-sdk-typescript/generated/server-openapi/src/sdk.ts",
  );
  const appbaseAuthSdkSource = readRepoFile(
    "../../../sdkwork-appbase/sdks/sdkwork-appbase-app-sdk/sdkwork-appbase-app-sdk-typescript/generated/server-openapi/src/api/auth.ts",
  );
  const appbaseOpenPlatformSdkSource = readRepoFile(
    "../../../sdkwork-appbase/sdks/sdkwork-appbase-app-sdk/sdkwork-appbase-app-sdk-typescript/generated/server-openapi/src/api/open-platform.ts",
  );
  const authServiceSource = readRepoFile(
    "../../../sdkwork-appbase/packages/pc-react/iam/sdkwork-auth-pc-react/src/auth-service.ts",
  );
  const iamPortsSource = readRepoFile(
    "../../../sdkwork-appbase/packages/common/iam/sdkwork-iam-sdk-ports/src/index.ts",
  );

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
    assert.equal(appSdkInput.paths?.[path], undefined, `clawrouter app SDK input must not regenerate ${method.toUpperCase()} ${path}`);
    assert.match(contractSource, new RegExp(`operation_id:\\s*${operationId.replaceAll(".", "\\.")}`));
    assert.match(contractSource, new RegExp(`api_path:\\s*${path.replace(/[{}]/g, "\\$&").replaceAll("/", "\\/")}`));
  }

  assert.doesNotMatch(appSdkSource, /public readonly auth: AuthApi/);
  assert.doesNotMatch(appSdkSource, /public readonly openPlatform: OpenPlatformApi/);
  assert.equal(
    existsSync(resolve(ROOT, "sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/generated/server-openapi/src/api/auth.ts")),
    false,
  );
  assert.equal(
    existsSync(resolve(ROOT, "sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript/generated/server-openapi/src/api/open-platform.ts")),
    false,
  );
  assert.match(appbaseSdkSource, /public readonly openPlatform: OpenPlatformApi/);
  assert.match(appbaseOpenPlatformSdkSource, /public readonly qrAuth: OpenPlatformQrAuthApi/);
  assert.match(appbaseOpenPlatformSdkSource, /public readonly sessions: OpenPlatformQrAuthSessionsApi/);
  assert.match(appbaseOpenPlatformSdkSource, /public readonly scans: OpenPlatformQrAuthSessionsScansApi/);
  assert.match(appbaseOpenPlatformSdkSource, /public readonly passwords: OpenPlatformQrAuthSessionsPasswordsApi/);
  assert.match(appbaseOpenPlatformSdkSource, /async create\(body: AppbaseOperationCommand\): Promise<AppbaseApiResult>/);
  assert.match(appbaseOpenPlatformSdkSource, /async retrieve\(sessionKey: string\): Promise<AppbaseApiResult>/);
  assert.match(appbaseOpenPlatformSdkSource, /async create\(sessionKey: string, body: AppbaseOperationCommand\): Promise<AppbaseApiResult>/);

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
  assert.doesNotMatch(appbaseAuthSdkSource, /loginQrCodes/);
  assert.doesNotMatch(appbaseAuthSdkSource, /loginQrCodeCallbacks/);
});
