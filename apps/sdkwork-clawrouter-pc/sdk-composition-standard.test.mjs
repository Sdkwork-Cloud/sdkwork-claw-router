import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const portalRoot = new URL('./', import.meta.url);

function source(path) {
  return readFileSync(new URL(path, portalRoot), 'utf8');
}

function json(path) {
  return JSON.parse(source(path));
}

test('portal workspace declares appbase app and backend generated SDK packages', () => {
  const packageJson = json('package.json');
  const commonsPackageJson = json('packages/sdkwork-clawrouter-pc-commons/package.json');
  const workspaceSource = source('pnpm-workspace.yaml');
  const tsconfigSource = source('tsconfig.json');
  const typecheckSource = source('tsconfig.typecheck.json');
  const viteConfigSource = source('vite.config.ts');

  assert.equal(packageJson.dependencies['@sdkwork/appbase-app-sdk'], 'workspace:*');
  assert.equal(packageJson.dependencies['@sdkwork/appbase-backend-sdk'], 'workspace:*');
  assert.equal(commonsPackageJson.dependencies['@sdkwork/appbase-app-sdk'], 'workspace:*');
  assert.equal(commonsPackageJson.dependencies['@sdkwork/appbase-backend-sdk'], 'workspace:*');

  for (const workspacePattern of [
    '../../../sdkwork-appbase/sdks/sdkwork-appbase-app-sdk/*-typescript/generated/server-openapi',
    '../../../sdkwork-appbase/sdks/sdkwork-appbase-backend-sdk/*-typescript/generated/server-openapi',
  ]) {
    assert.ok(packageJson.workspaces.includes(workspacePattern), `package workspaces must include ${workspacePattern}`);
    assert.ok(workspaceSource.includes(workspacePattern), `pnpm workspace must include ${workspacePattern}`);
  }

  for (const [packageName, sdkFamily] of [
    ['@sdkwork/appbase-app-sdk', 'sdkwork-appbase-app-sdk'],
    ['@sdkwork/appbase-backend-sdk', 'sdkwork-appbase-backend-sdk'],
  ]) {
    const generatedPath = `../../../sdkwork-appbase/sdks/${sdkFamily}/${sdkFamily}-typescript/generated/server-openapi/src/index.ts`;
    assert.ok(tsconfigSource.includes(`"${packageName}"`), `${packageName} must be present in tsconfig paths`);
    assert.ok(typecheckSource.includes(`"${packageName}"`), `${packageName} must be present in typecheck paths`);
    assert.ok(tsconfigSource.includes(generatedPath), `${packageName} tsconfig path must point at generated server-openapi`);
    assert.ok(typecheckSource.includes(generatedPath), `${packageName} typecheck path must point at generated server-openapi`);
    assert.ok(viteConfigSource.includes(`find: '${packageName}'`), `${packageName} must be present in Vite aliases`);
    assert.ok(viteConfigSource.includes(`sdks/${sdkFamily}/${sdkFamily}-typescript/generated/server-openapi/src/index.ts`));
  }

  assert.doesNotMatch(
    typecheckSource,
    /sdkwork-appbase-backend-sdk-typescript\/src\/index\.ts/,
    'typecheck must not point at the stale appbase backend SDK source root',
  );
});

test('commons SDK client bootstrap composes appbase, product and open SDKs through standard credentials', () => {
  const sdkClientsSource = source('packages/sdkwork-clawrouter-pc-commons/src/sdk-clients.ts');

  assert.match(sdkClientsSource, /from '@sdkwork\/appbase-app-sdk'/);
  assert.match(sdkClientsSource, /from '@sdkwork\/appbase-backend-sdk'/);
  assert.match(sdkClientsSource, /from '@sdkwork\/clawrouter-app-sdk'/);
  assert.match(sdkClientsSource, /from '@sdkwork\/clawrouter-backend-sdk'/);
  assert.match(sdkClientsSource, /from '@sdkwork\/clawrouter-open-sdk'/);
  assert.match(sdkClientsSource, /createTokenManager/);
  assert.match(sdkClientsSource, /getClawRouterGlobalTokenManager/);
  assert.match(sdkClientsSource, /createSdkworkAppbaseAppSdkClient/);
  assert.match(sdkClientsSource, /getSdkworkAppbaseAppSdkClient/);
  assert.match(sdkClientsSource, /__SDKWORK_APPBASE_APP_SDK_CLIENT__/);
  assert.match(sdkClientsSource, /tokenManager:\s*resolveClawRouterSdkTokenManager\(options\.tokenManager\)/);
  assert.match(sdkClientsSource, /buildAppbaseAppConfig/);
  assert.match(sdkClientsSource, /buildAppbaseBackendConfig/);

  assert.doesNotMatch(sdkClientsSource, /appClientSessionKey/);
  assert.doesNotMatch(sdkClientsSource, /backendClientSessionKey/);
  assert.doesNotMatch(sdkClientsSource, /appbaseBackendClientSessionKey/);
  assert.doesNotMatch(sdkClientsSource, /createSessionKey/);
});

test('IAM runtime uses appbase app and backend clients while binding product SDK clients to the shared token manager', () => {
  const iamRuntimeSource = source('packages/sdkwork-clawrouter-pc-commons/src/iam-runtime.ts');

  assert.match(iamRuntimeSource, /createIamAppSdkAdapter\(getSdkworkAppbaseAppSdkClient\(\)\)/);
  assert.match(iamRuntimeSource, /createIamBackendSdkAdapter\(getSdkworkAppbaseBackendSdkClient\(\)\)/);
  assert.match(iamRuntimeSource, /appbaseApp:/);
  assert.match(iamRuntimeSource, /appbaseBackend:/);
  assert.match(iamRuntimeSource, /sdkClients:\s*\[/);
  assert.match(iamRuntimeSource, /getClawRouterAppSdkClient\(\)/);
  assert.match(iamRuntimeSource, /getClawRouterBackendSdkClient\(\)/);
  assert.match(iamRuntimeSource, /tokenManager:\s*getClawRouterGlobalTokenManager\(\)/);
  assert.doesNotMatch(iamRuntimeSource, /app:\s*createIamAppSdkAdapter/);
});

test('appbase-owned app capabilities no longer call the product clawrouter app SDK', () => {
  const sessionServiceSource = source('packages/sdkwork-clawrouter-pc-commons/src/sessionService.ts');
  const portalSessionSource = source('packages/sdkwork-clawrouter-pc-commons/src/portal-session.ts');
  const iamDirectorySource = source('packages/sdkwork-clawrouter-pc-commons/src/iamDirectoryApiOperations.ts');
  const authSettingsSource = source('src/auth/clawRouterAuthSettingsService.ts');
  const userServiceSource = source('packages/sdkwork-clawrouter-pc-console-user/src/userService.ts');

  for (const [name, fileSource] of [
    ['sessionService', sessionServiceSource],
    ['portal-session', portalSessionSource],
    ['iamDirectoryApiOperations', iamDirectorySource],
    ['clawRouterAuthSettingsService', authSettingsSource],
    ['userService', userServiceSource],
  ]) {
    assert.match(fileSource, /getSdkworkAppbaseAppSdkClient/, `${name} must use appbase app SDK`);
  }

  assert.doesNotMatch(sessionServiceSource, /getClawRouterAppSdkClient/);
  assert.doesNotMatch(portalSessionSource, /getClawRouterAppSdkClient/);
  assert.doesNotMatch(iamDirectorySource, /getClawRouterAppSdkClient/);
  assert.doesNotMatch(authSettingsSource, /getClawRouterAppSdkClient/);
  assert.doesNotMatch(userServiceSource, /getClawRouterAppSdkClient/);
  assert.doesNotMatch(userServiceSource, /@sdkwork\/clawrouter-app-sdk/);

  assert.match(sessionServiceSource, /\.auth\.sessions\.create/);
  assert.match(sessionServiceSource, /\.auth\.sessions\.current\.delete/);
  assert.match(portalSessionSource, /\.auth\.sessions\.current\.retrieve/);
  assert.match(portalSessionSource, /\.auth\.sessions\.current\.delete/);
  assert.match(authSettingsSource, /\.system\.iam\.runtime\.retrieve\(\)/);
  assert.match(authSettingsSource, /\.system\.iam\.verificationPolicy\.retrieve\(\)/);
  assert.match(userServiceSource, /\.iam\.users\.current\.retrieve\(\)/);
});
