import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const workspaceRoot = path.resolve(import.meta.dirname, '..');
const portalRoot = path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal');
const execFileAsync = promisify(execFile);

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

test('root package exposes pnpm product entrypoints', () => {
  const rootPackage = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'package.json'), 'utf8'),
  );

  assert.equal(rootPackage.private, true);
  assert.equal(rootPackage.packageManager, 'pnpm@10.33.0');
  assert.equal(
    rootPackage.scripts.dev,
    'node scripts/run-claw-router-product.mjs server',
  );
  assert.equal(
    rootPackage.scripts.test,
    'node scripts/run-claw-router-product.test.mjs',
  );
  assert.equal(
    rootPackage.scripts.build,
    'node scripts/build-claw-router-production.mjs',
  );
  assert.equal(
    rootPackage.scripts.start,
    'node scripts/start-claw-router-production.mjs',
  );
  assert.equal(
    rootPackage.scripts.release,
    'pnpm release:preflight && pnpm verify',
  );
  assert.equal(
    rootPackage.scripts['desktop:dev'],
    'node scripts/run-claw-router-product.mjs desktop',
  );
  assert.equal(
    rootPackage.scripts['tauri:dev'],
    'node scripts/run-claw-router-product.mjs desktop',
  );
  assert.equal(
    rootPackage.scripts['service:dev'],
    'node scripts/run-claw-router-product.mjs service',
  );
  assert.equal(
    rootPackage.scripts['server:dev'],
    'node scripts/run-claw-router-product.mjs server',
  );
  assert.equal(
    rootPackage.scripts['smoke:dev'],
    'node scripts/smoke-edge-dev-server.mjs',
  );
  assert.equal(
    rootPackage.scripts['verify:fast'],
    'node scripts/verify-claw-router-product.mjs --fast',
  );
  assert.equal(
    rootPackage.scripts['clean:fast'],
    'node scripts/clean-claw-router-workspace.mjs',
  );
  assert.equal(
    rootPackage.scripts['release:preflight'],
    'node scripts/release-preflight.mjs',
  );
  assert.equal(
    rootPackage.scripts['app-store:seed:update'],
    'node scripts/update-app-store-seed.mjs',
  );
  assert.equal(
    rootPackage.scripts['app-store:seed:check'],
    'node scripts/update-app-store-seed.mjs --check',
  );
  assert.equal(
    rootPackage.scripts['skills:seed:mirror-clawhub'],
    'node scripts/mirror-clawhub-skills-seed.mjs --fetch',
  );
  assert.equal(
    rootPackage.scripts['skills:seed:check'],
    'node scripts/mirror-clawhub-skills-seed.mjs --check',
  );
});

test('app store seed updater defaults to file seed updates and gates database sync behind explicit flag', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'update-app-store-seed.mjs')).href
  );

  const defaults = module.parseAppStoreSeedArgs([]);
  const defaultPlan = module.buildAppStoreSeedCommandPlan(defaults, { workspaceRoot });

  assert.equal(defaults.appsRoot, path.resolve(workspaceRoot, '..'));
  assert.equal(defaults.check, false);
  assert.equal(defaults.syncDb, false);
  assert.equal(defaults.initializeMissing, true);
  assert.deepEqual(defaultPlan.steps.map((step) => step.name), [
    'initialize-missing-app-manifests',
    'export-plus-app-seed',
    'generate-app-category-seed',
  ]);
  assert.equal(defaultPlan.steps.some((step) => step.name === 'sync-database'), false);

  const check = module.parseAppStoreSeedArgs(['--check']);
  const checkPlan = module.buildAppStoreSeedCommandPlan(check, { workspaceRoot });
  assert.equal(check.check, true);
  assert.equal(checkPlan.steps.find((step) => step.name === 'export-plus-app-seed').mode, 'check');
  assert.equal(checkPlan.steps.find((step) => step.name === 'generate-app-category-seed').mode, 'check');

  const sync = module.parseAppStoreSeedArgs(['--sync-db']);
  const syncPlan = module.buildAppStoreSeedCommandPlan(sync, { workspaceRoot });
  assert.deepEqual(syncPlan.steps.at(-1), {
    name: 'sync-database',
    command: 'cargo',
    args: ['run', '-p', 'sdkwork-claw-installer', '--', 'ensure'],
    requiresDatabaseUrl: true,
  });
});

test('app store seed updater emits pure JSON for machine-readable check output', async () => {
  const { stdout } = await execFileAsync(process.execPath, [
    path.join(workspaceRoot, 'scripts', 'update-app-store-seed.mjs'),
    '--check',
    '--json',
  ], {
    cwd: workspaceRoot,
    maxBuffer: 1024 * 1024 * 8,
  });
  const payload = JSON.parse(stdout);

  assert.equal(payload.ok, true);
  assert.equal(payload.mode, 'check');
  assert.equal(payload.appCount > 0, true);
  assert.equal(payload.categoryCount > 0, true);
  assert.equal(payload.databaseSynced, false);
});

test('product scripts keep commercial default ports and reject obsolete aliases', () => {
  const rootPackage = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'package.json'), 'utf8'),
  );
  const workspaceStarter = readFileSync(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs'), 'utf8');
  const productionStarter = readFileSync(path.join(workspaceRoot, 'scripts', 'start-claw-router-production.mjs'), 'utf8');
  const portalViteConfig = readFileSync(path.join(portalRoot, 'vite.config.ts'), 'utf8');
  const productSurface = [
    JSON.stringify(rootPackage.scripts),
    workspaceStarter,
    productionStarter,
    portalViteConfig,
  ].join('\n');

  assert.ok(workspaceStarter.includes("const DEFAULT_SERVER_BIND = '0.0.0.0:3900';"));
  assert.ok(workspaceStarter.includes("const DEFAULT_PORTAL_BIND = '127.0.0.1:3901';"));
  assert.ok(productionStarter.includes("'0.0.0.0:3900'"));
  assert.match(portalViteConfig, /DEFAULT_PORTAL_DEV_PORT\s*=\s*3901/u);
  assert.ok(!productSurface.includes('3000'));
  assert.ok(!productSurface.includes('39000'));
  assert.ok(!productSurface.includes('unified_server'));
  assert.ok(!productSurface.includes('unified server'));
  assert.ok(!productSurface.includes('--portal-dev-bind'));
});

test('portal runtime is served by Rust edge server without Node server entrypoint', () => {
  const forbiddenPortalServerFiles = [
    'server.ts',
    'server.test.ts',
    path.join('scripts', 'build-server.mjs'),
    path.join('scripts', 'smoke-production-server.mjs'),
  ];

  for (const relativeFile of forbiddenPortalServerFiles) {
    assert.equal(
      existsSync(path.join(portalRoot, relativeFile)),
      false,
      `${relativeFile} must be removed; portal runtime belongs to Rust edge server`,
    );
  }

  const portalPackage = JSON.parse(
    readFileSync(path.join(portalRoot, 'package.json'), 'utf8'),
  );
  const rootPackage = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'package.json'), 'utf8'),
  );
  const scriptsSurface = JSON.stringify({
    root: rootPackage.scripts,
    portal: portalPackage.scripts,
  });

  assert.ok(!scriptsSurface.includes('server.ts'));
  assert.ok(!scriptsSurface.includes('dist/server.mjs'));
  assert.ok(!scriptsSurface.includes('smoke-production-server.mjs'));
  assert.equal(portalPackage.scripts['deps:check'], 'node scripts/check-portal-deps.mjs');
  assert.equal(portalPackage.scripts.dev, 'pnpm deps:check && vite --configLoader native');
  assert.equal(portalPackage.scripts['browser:dev'], 'pnpm deps:check && vite --configLoader native');
  assert.equal(portalPackage.scripts.preview, 'vite preview --configLoader native');
  assert.equal(portalPackage.scripts.build, 'pnpm deps:check && node scripts/build-portal.mjs');
  assert.equal(portalPackage.scripts.start, 'node ../../scripts/start-claw-router-production.mjs');
  assert.equal(rootPackage.scripts.start, 'node scripts/start-claw-router-production.mjs');
});

test('Rust edge server owns configurable portal CSP connect-src policy', () => {
  const edgeServerSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-gateway', 'src', 'edge_server.rs'),
    'utf8',
  );
  const gatewayMainSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-gateway', 'src', 'main.rs'),
    'utf8',
  );
  const readmeSource = readFileSync(path.join(workspaceRoot, 'README.md'), 'utf8');

  assert.ok(edgeServerSource.includes('with_portal_csp_connect_src'));
  assert.ok(edgeServerSource.includes('normalize_portal_csp_connect_src'));
  assert.ok(edgeServerSource.includes('build_portal_content_security_policy'));
  assert.ok(edgeServerSource.includes('portal_public_url_origin'));
  assert.ok(edgeServerSource.includes('"content-security-policy"'));
  assert.ok(gatewayMainSource.includes('PORTAL_CSP_CONNECT_SRC'));
  assert.ok(gatewayMainSource.includes('PORTAL_TOOL_API_RATE_LIMIT_REQUESTS'));
  assert.ok(gatewayMainSource.includes('PORTAL_TOOL_API_RATE_LIMIT_WINDOW_SECONDS'));
  assert.ok(gatewayMainSource.includes('PORTAL_TOOL_API_SDK_ARCHIVE_ROOT'));
  assert.ok(edgeServerSource.includes('with_portal_tool_api_rate_limit'));
  assert.ok(edgeServerSource.includes('with_portal_tool_api_sdk_archive_root'));
  assert.ok(edgeServerSource.includes('serve_prebuilt_sdk_archive'));
  assert.ok(edgeServerSource.includes('sdk_archive_not_found'));
  assert.ok(edgeServerSource.includes('application/zip'));
  assert.ok(edgeServerSource.includes('tool_api_rate_limited'));
  assert.ok(edgeServerSource.includes('header::RETRY_AFTER'));
  assert.ok(edgeServerSource.includes('ratelimit-limit'));
  assert.ok(readmeSource.includes('PORTAL_CSP_CONNECT_SRC'));
  assert.ok(readmeSource.includes('PORTAL_TOOL_API_RATE_LIMIT_REQUESTS'));
  assert.ok(readmeSource.includes('PORTAL_TOOL_API_SDK_ARCHIVE_ROOT'));
  assert.ok(readmeSource.includes('prebuilt SDK ZIP archives'));
  assert.ok(readmeSource.includes('sdk_archive_not_found'));
  assert.ok(readmeSource.includes('RateLimit-Remaining'));
  assert.ok(readmeSource.includes('the limiter uses'));
  assert.ok(readmeSource.includes('x-forwarded-for'));
  assert.ok(readmeSource.includes('Absolute runtime API origins are added to'));
  assert.ok(!readmeSource.includes('TOOL_API_ENABLED` on the server'));
});

test('portal env example defaults to same-origin Rust edge API paths', () => {
  const envExample = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', '.env.example'),
    'utf8',
  );

  assert.ok(envExample.includes('PORTAL_PUBLIC_API_BASE_URL="/v1"'));
  assert.ok(envExample.includes('PORTAL_PUBLIC_APP_API_BASE_URL="/app/v3/api"'));
  assert.ok(envExample.includes('PORTAL_PUBLIC_BACKEND_API_BASE_URL="/backend/v3/api"'));
  assert.ok(!envExample.includes('https://api.sdkwork.com'));
});

test('claw router product launcher preserves forwarded mode arguments after --', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'run-claw-router-product.mjs')).href
  );

  const parsed = module.parseClawRouterProductArgs(['server', '--', '--help']);

  assert.equal(parsed.mode, 'server');
  assert.equal(parsed.help, false);
  assert.deepEqual(parsed.extraArgs, ['--help']);
});

test('claw router workspace launch plan starts Rust services, portal, and edge Rust server', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
  );

  const settings = module.parseWorkspaceArgs(['--gateway-bind', '0.0.0.0:19080']);
  const plan = module.buildWorkspaceCommandPlan(settings, { workspaceRoot });

  assert.equal(settings.serverBind, '0.0.0.0:3900');
  assert.equal(settings.portalBind, '127.0.0.1:3901');
  assert.equal(settings.portalDevBind, undefined);
  assert.equal(settings.databaseUrl, 'sqlite://target/dev/sdkwork-claw-router.sqlite');
  assert.deepEqual(plan.steps.map((step) => step.name), [
    'installer',
    'model-catalog-refresh',
    'gateway',
    'admin-api',
    'app-api',
    'portal',
    'server',
  ]);
  assert.deepEqual(plan.steps[0].args, [
    'run',
    '-p',
    'sdkwork-claw-installer',
    '--',
    'ensure',
  ]);
  assert.equal(plan.steps[0].blocking, true);
  assert.equal(plan.steps[0].env.SDKWORK_CLAW_DATABASE_URL, settings.databaseUrl);
  assert.equal(plan.steps[0].env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS, '1');
  assert.equal(plan.steps[0].env.SDKWORK_CLAW_STARTUP_INSTALL_MODE, 'ensure');
  assert.equal(plan.steps[0].env.SDKWORK_CLAW_INSTALL_ENVIRONMENT, 'development');
  assert.equal(plan.steps[0].env.SDKWORK_CLAW_INSTALL_SEED_PROFILE, 'commercial');
  assert.equal(
    plan.steps[0].env.SDKWORK_MODELS_CATALOG_ROOT,
    path.join(workspaceRoot, 'data', 'sdkwork-models'),
  );
  assert.deepEqual(plan.steps[1].args, [
    'run',
    '-p',
    'sdkwork-claw-installer',
    '--',
    'refresh-catalog',
    '--catalog-root',
    path.join(workspaceRoot, 'data', 'sdkwork-models'),
    '--force',
  ]);
  assert.equal(plan.steps[1].blocking, true);
  assert.match(plan.steps[1].failureHint, /model catalog refresh failed/u);
  assert.match(plan.steps[1].failureHint, /pnpm models:check/u);
  assert.equal(plan.steps[1].env.SDKWORK_CLAW_DATABASE_URL, settings.databaseUrl);
  assert.equal(plan.steps[1].env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS, '1');
  assert.equal(plan.steps[1].env.SDKWORK_CLAW_STARTUP_INSTALL_MODE, 'ensure');
  assert.equal(
    plan.steps[1].env.SDKWORK_MODELS_CATALOG_ROOT,
    path.join(workspaceRoot, 'data', 'sdkwork-models'),
  );
  assert.deepEqual(plan.steps[2].args, [
    'run',
    '-p',
    'sdkwork-claw-gateway',
  ]);
  assert.equal(plan.steps[2].env.SDKWORK_CLAW_GATEWAY_BIND, '0.0.0.0:19080');
  assert.equal(plan.steps[2].env.SDKWORK_CLAW_DEPLOYMENT_MODE, 'server');
  assert.equal(plan.steps[2].env.SDKWORK_CLAW_DATABASE_URL, settings.databaseUrl);
  assert.equal(plan.steps[2].env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS, '1');
  assert.equal(plan.steps[2].env.SDKWORK_CLAW_STARTUP_INSTALL_MODE, 'skip');
  assert.equal(plan.steps[2].env.SDKWORK_CLAW_USAGE_SETTLEMENT_WORKER_ENABLED, 'false');
  assert.equal(plan.steps[2].env.SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP, 'false');
  assert.equal(plan.steps[2].env.SDKWORK_CLAW_API_KEY_PEPPER.length >= 32, true);
  assert.equal(
    plan.steps[2].env.SDKWORK_MODELS_CATALOG_ROOT,
    path.join(workspaceRoot, 'data', 'sdkwork-models'),
  );
  assert.equal(plan.steps[3].env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS, '1');
  assert.equal(plan.steps[3].env.SDKWORK_CLAW_STARTUP_INSTALL_MODE, 'skip');
  assert.equal(plan.steps[4].env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS, '1');
  assert.equal(plan.steps[4].env.SDKWORK_CLAW_STARTUP_INSTALL_MODE, 'skip');
  assert.equal(plan.steps[4].env.SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP, 'false');
  assert.deepEqual(plan.steps[5].args, [
    '--dir',
    'apps/sdkwork-claw-router-portal',
    'browser:dev',
  ]);
  assert.equal(plan.steps[5].env.PORT, '3901');
  assert.equal(plan.steps[5].env.SDKWORK_CLAW_PORTAL_BIND, '127.0.0.1:3901');
  assert.equal(plan.steps[5].env.OPENAPI_DEV_URL, 'http://127.0.0.1:19080/openapi.json');
  assert.equal(plan.steps[5].env.PORTAL_FORWARDING_ENABLED, undefined);
  assert.equal(plan.steps[5].env.PORTAL_FORWARD_GATEWAY_BASE_URL, undefined);
  assert.equal(plan.steps[5].env.PORTAL_FORWARD_BACKEND_API_BASE_URL, undefined);
  assert.equal(plan.steps[5].env.PORTAL_FORWARD_APP_API_BASE_URL, undefined);
  assert.equal(plan.steps[5].env.PORTAL_PUBLIC_API_BASE_URL, '/v1');
  assert.equal(plan.steps[5].env.PORTAL_PUBLIC_BACKEND_API_BASE_URL, '/backend/v3/api');
  assert.equal(plan.steps[5].env.PORTAL_PUBLIC_APP_API_BASE_URL, '/app/v3/api');
  assert.equal(plan.steps[5].env.PORTAL_DEV_PROXY_GATEWAY_TARGET, 'http://127.0.0.1:19080');
  assert.equal(plan.steps[5].env.PORTAL_DEV_PROXY_BACKEND_API_TARGET, 'http://127.0.0.1:18081');
  assert.equal(plan.steps[5].env.PORTAL_DEV_PROXY_APP_API_TARGET, 'http://127.0.0.1:18082');
  assert.deepEqual(plan.steps[6].args, [
    'run',
    '-p',
    'sdkwork-claw-gateway',
  ]);
  assert.equal(plan.steps[6].env.SDKWORK_CLAW_EDGE_SERVER, '1');
  assert.equal(plan.steps[6].env.SDKWORK_CLAW_SERVER_BIND, '0.0.0.0:3900');
  assert.equal(plan.steps[6].env.SDKWORK_CLAW_STARTUP_INSTALL_MODE, 'skip');
  assert.equal(plan.steps[6].env.SDKWORK_CLAW_EDGE_GATEWAY_BASE_URL, 'http://127.0.0.1:19080');
  assert.equal(plan.steps[6].env.SDKWORK_CLAW_EDGE_BACKEND_API_BASE_URL, 'http://127.0.0.1:18081');
  assert.equal(plan.steps[6].env.SDKWORK_CLAW_EDGE_APP_API_BASE_URL, 'http://127.0.0.1:18082');
  assert.equal(plan.steps[6].env.SDKWORK_CLAW_EDGE_PORTAL_BASE_URL, 'http://127.0.0.1:3901');
  assert.equal(
    plan.steps[6].env.SDKWORK_MODELS_CATALOG_ROOT,
    path.join(workspaceRoot, 'data', 'sdkwork-models'),
  );
});

test('claw router workspace reports occupied service ports before startup', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
  );

  const settings = module.parseWorkspaceArgs([]);
  const unavailable = await module.findUnavailableWorkspaceBinds(settings, async (target) =>
    !['18082', '3900'].includes(target.port),
  );

  assert.deepEqual(
    unavailable.map((target) => `${target.name} ${target.bind}`),
    ['app-api 127.0.0.1:18082', 'server 0.0.0.0:3900'],
  );
  await assert.rejects(
    () => module.assertWorkspaceBindsAvailable(settings, async (target) =>
      !['18082', '3900'].includes(target.port),
    ),
    /workspace ports are already in use: app-api 127\.0\.0\.1:18082, server 0\.0\.0\.0:3900/u,
  );
});

test('claw router workspace checks service ports before running installer steps', () => {
  const workspaceStarter = readFileSync(
    path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs'),
    'utf8',
  );

  const preflightIndex = workspaceStarter.indexOf('await assertWorkspaceBindsAvailable(settings);');
  const blockingStepsIndex = workspaceStarter.indexOf('for (const step of blockingSteps)');

  assert.ok(preflightIndex >= 0, 'workspace starter must check service ports before startup');
  assert.ok(blockingStepsIndex >= 0, 'workspace starter must run blocking installer steps');
  assert.ok(
    preflightIndex < blockingStepsIndex,
    'workspace service port preflight must run before installer/model refresh steps',
  );
});

test('claw router workspace supports custom edge server and direct portal binds', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
  );

  const settings = module.parseWorkspaceArgs([
    '--server-bind',
    '0.0.0.0:12900',
    '--portal-bind',
    '0.0.0.0:13900',
  ]);
  const plan = module.buildWorkspaceCommandPlan(settings, { workspaceRoot });
  const portalStep = plan.steps.find((step) => step.name === 'portal');
  const serverStep = plan.steps.find((step) => step.name === 'server');

  assert.deepEqual(portalStep.args, [
    '--dir',
    'apps/sdkwork-claw-router-portal',
    'browser:dev',
  ]);
  assert.equal(portalStep.env.HOST, '0.0.0.0');
  assert.equal(portalStep.env.PORT, '13900');
  assert.equal(portalStep.env.SDKWORK_CLAW_PORTAL_BIND, '0.0.0.0:13900');
  assert.equal(serverStep.env.SDKWORK_CLAW_SERVER_BIND, '0.0.0.0:12900');
  assert.equal(serverStep.env.SDKWORK_CLAW_EDGE_PORTAL_BASE_URL, 'http://127.0.0.1:13900');
});

test('claw router workspace uses one resolved model catalog root for refresh and services', async () => {
  const previousCatalogRoot = process.env.SDKWORK_MODELS_CATALOG_ROOT;
  const externalCatalogRoot = path.join(workspaceRoot, 'tmp', 'external-sdkwork-models');
  process.env.SDKWORK_MODELS_CATALOG_ROOT = externalCatalogRoot;
  try {
    const module = await import(
      pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
    );

    const settings = module.parseWorkspaceArgs([]);
    const plan = module.buildWorkspaceCommandPlan(settings, { workspaceRoot });
    const refreshStep = plan.steps.find((step) => step.name === 'model-catalog-refresh');
    const serviceSteps = plan.steps.filter((step) =>
      ['installer', 'gateway', 'admin-api', 'app-api', 'server'].includes(step.name),
    );

    assert.equal(settings.modelsCatalogRoot, externalCatalogRoot);
    assert.deepEqual(refreshStep.args.slice(-3), [
      '--catalog-root',
      externalCatalogRoot,
      '--force',
    ]);
    for (const step of serviceSteps) {
      assert.equal(step.env.SDKWORK_MODELS_CATALOG_ROOT, externalCatalogRoot);
    }
  } finally {
    if (previousCatalogRoot === undefined) {
      delete process.env.SDKWORK_MODELS_CATALOG_ROOT;
    } else {
      process.env.SDKWORK_MODELS_CATALOG_ROOT = previousCatalogRoot;
    }
  }
});

test('claw router workspace pins startup install ownership to installer steps', async () => {
  const previousStartupInstallMode = process.env.SDKWORK_CLAW_STARTUP_INSTALL_MODE;
  process.env.SDKWORK_CLAW_STARTUP_INSTALL_MODE = 'ensure';
  try {
    const module = await import(
      pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
    );

    const settings = module.parseWorkspaceArgs([]);
    const plan = module.buildWorkspaceCommandPlan(settings, { workspaceRoot });
    const modesByStep = new Map(
      plan.steps
        .filter((step) => ['installer', 'model-catalog-refresh', 'gateway', 'admin-api', 'app-api', 'server'].includes(step.name))
        .map((step) => [step.name, step.env.SDKWORK_CLAW_STARTUP_INSTALL_MODE]),
    );

    assert.deepEqual(Object.fromEntries(modesByStep), {
      installer: 'ensure',
      'model-catalog-refresh': 'ensure',
      gateway: 'skip',
      'admin-api': 'skip',
      'app-api': 'skip',
      server: 'skip',
    });
  } finally {
    if (previousStartupInstallMode === undefined) {
      delete process.env.SDKWORK_CLAW_STARTUP_INSTALL_MODE;
    } else {
      process.env.SDKWORK_CLAW_STARTUP_INSTALL_MODE = previousStartupInstallMode;
    }
  }
});

test('claw router workspace constrains default SQLite dev database without overriding explicit database tuning', async () => {
  const previousMaxConnections = process.env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS;
  const previousSettlementWorker = process.env.SDKWORK_CLAW_USAGE_SETTLEMENT_WORKER_ENABLED;
  const previousRankingStartup = process.env.SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP;
  try {
    delete process.env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS;
    delete process.env.SDKWORK_CLAW_USAGE_SETTLEMENT_WORKER_ENABLED;
    delete process.env.SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP;
    const module = await import(
      pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
    );

    const sqliteSettings = module.parseWorkspaceArgs([]);
    const sqlitePlan = module.buildWorkspaceCommandPlan(sqliteSettings, { workspaceRoot });
    for (const step of sqlitePlan.steps.filter((step) =>
      ['installer', 'model-catalog-refresh', 'gateway', 'admin-api', 'app-api', 'server'].includes(step.name),
    )) {
      assert.equal(step.env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS, '1');
      assert.equal(step.env.SDKWORK_CLAW_USAGE_SETTLEMENT_WORKER_ENABLED, 'false');
      assert.equal(step.env.SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP, 'false');
    }

    process.env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS = '8';
    process.env.SDKWORK_CLAW_USAGE_SETTLEMENT_WORKER_ENABLED = 'true';
    process.env.SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP = 'true';
    const tunedSettings = module.parseWorkspaceArgs([
      '--database-url',
      'postgres://sdkwork:sdkwork@localhost:5432/sdkwork_claw_router',
    ]);
    const tunedPlan = module.buildWorkspaceCommandPlan(tunedSettings, { workspaceRoot });
    for (const step of tunedPlan.steps.filter((step) =>
      ['installer', 'model-catalog-refresh', 'gateway', 'admin-api', 'app-api', 'server'].includes(step.name),
    )) {
      assert.equal(step.env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS, '8');
      assert.equal(step.env.SDKWORK_CLAW_USAGE_SETTLEMENT_WORKER_ENABLED, 'true');
      assert.equal(step.env.SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP, 'true');
    }
  } finally {
    if (previousMaxConnections === undefined) {
      delete process.env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS;
    } else {
      process.env.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS = previousMaxConnections;
    }
    if (previousSettlementWorker === undefined) {
      delete process.env.SDKWORK_CLAW_USAGE_SETTLEMENT_WORKER_ENABLED;
    } else {
      process.env.SDKWORK_CLAW_USAGE_SETTLEMENT_WORKER_ENABLED = previousSettlementWorker;
    }
    if (previousRankingStartup === undefined) {
      delete process.env.SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP;
    } else {
      process.env.SDKWORK_CLAW_MODEL_RANKING_RUN_ON_STARTUP = previousRankingStartup;
    }
  }
});

test('claw router workspace rejects obsolete portal dev bind option', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
  );

  assert.throws(
    () => module.parseWorkspaceArgs(['--portal-dev-bind', '127.0.0.1:13900']),
    /unknown option: --portal-dev-bind/u,
  );
});

test('claw router workspace supports explicit Rust server forwarding target URLs', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
  );

  const settings = module.parseWorkspaceArgs([
    '--gateway-forward-url',
    'http://gateway.internal:18080',
    '--backend-api-forward-url',
    'https://admin.internal',
    '--app-api-forward-url',
    'http://app.internal:18082',
  ]);
  const plan = module.buildWorkspaceCommandPlan(settings, { workspaceRoot });
  const serverEnv = plan.steps.find((step) => step.name === 'server').env;

  assert.equal(serverEnv.SDKWORK_CLAW_EDGE_GATEWAY_BASE_URL, 'http://gateway.internal:18080');
  assert.equal(serverEnv.SDKWORK_CLAW_EDGE_BACKEND_API_BASE_URL, 'https://admin.internal');
  assert.equal(serverEnv.SDKWORK_CLAW_EDGE_APP_API_BASE_URL, 'http://app.internal:18082');
});

test('workspace dry-run output uses server and portal bind names without obsolete aliases', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
  );

  const settings = module.parseWorkspaceArgs([
    '--server-bind',
    '0.0.0.0:12900',
    '--portal-bind',
    '0.0.0.0:13900',
    '--plan-format',
    'json',
  ]);
  const plan = module.buildWorkspaceCommandPlan(settings, { workspaceRoot });
  const [jsonLine] = module.renderWorkspaceDryRun(settings, plan);
  const dryRun = JSON.parse(jsonLine);
  const textOutput = module.renderWorkspaceDryRun(
    { ...settings, planFormat: 'text' },
    plan,
  ).join('\n');
  const helpText = module.workspaceHelpText();

  assert.equal(dryRun.serverBind, '0.0.0.0:12900');
  assert.equal(dryRun.portalBind, '0.0.0.0:13900');
  assert.equal(Object.hasOwn(dryRun, 'portalDevBind'), false);
  assert.equal(
    dryRun.steps.find((step) => step.name === 'model-catalog-refresh').blocking,
    true,
  );
  assert.match(
    dryRun.steps.find((step) => step.name === 'model-catalog-refresh').failureHint,
    /refresh-catalog/u,
  );
  assert.ok(textOutput.includes('SDKWORK_CLAW_SERVER_BIND=0.0.0.0:12900'));
  assert.ok(textOutput.includes('SDKWORK_CLAW_PORTAL_BIND=0.0.0.0:13900'));
  assert.ok(textOutput.includes(`SDKWORK_MODELS_CATALOG_ROOT=${path.join(workspaceRoot, 'data', 'sdkwork-models')}`));
  assert.ok(textOutput.includes('PORTAL_PUBLIC_API_BASE_URL=/v1'));
  assert.ok(textOutput.includes('PORTAL_PUBLIC_BACKEND_API_BASE_URL=/backend/v3/api'));
  assert.ok(textOutput.includes('PORTAL_PUBLIC_APP_API_BASE_URL=/app/v3/api'));
  assert.ok(!textOutput.includes('PORTAL_DEV_BIND'));
  assert.ok(helpText.includes('--server-bind <bind>'));
  assert.ok(helpText.includes('--portal-bind <bind>'));
  assert.ok(!helpText.includes('--portal-dev-bind'));
});

test('workspace launch plan exposes explicit forwarded header trust settings', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
  );

  const defaults = module.parseWorkspaceArgs([]);
  const defaultPlan = module.buildWorkspaceCommandPlan(defaults, { workspaceRoot });
  const defaultServerEnv = defaultPlan.steps.find((step) => step.name === 'server').env;

  assert.equal(defaults.externalScheme, 'http');
  assert.equal(defaults.trustForwardedHeaders, false);
  assert.equal(defaultServerEnv.SDKWORK_CLAW_EDGE_EXTERNAL_SCHEME, 'http');
  assert.equal(defaultServerEnv.SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS, '0');

  const settings = module.parseWorkspaceArgs([
    '--external-scheme',
    'https',
    '--trust-forwarded-headers',
    '--plan-format',
    'json',
  ]);
  const plan = module.buildWorkspaceCommandPlan(settings, { workspaceRoot });
  const serverEnv = plan.steps.find((step) => step.name === 'server').env;
  const [jsonLine] = module.renderWorkspaceDryRun(settings, plan);
  const dryRun = JSON.parse(jsonLine);
  const textOutput = module.renderWorkspaceDryRun(
    { ...settings, planFormat: 'text' },
    plan,
  ).join('\n');
  const helpText = module.workspaceHelpText();

  assert.equal(settings.externalScheme, 'https');
  assert.equal(settings.trustForwardedHeaders, true);
  assert.equal(serverEnv.SDKWORK_CLAW_EDGE_EXTERNAL_SCHEME, 'https');
  assert.equal(serverEnv.SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS, '1');
  assert.equal(dryRun.externalScheme, 'https');
  assert.equal(dryRun.trustForwardedHeaders, true);
  assert.ok(textOutput.includes('SDKWORK_CLAW_EDGE_EXTERNAL_SCHEME=https'));
  assert.ok(textOutput.includes('SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS=1'));
  assert.ok(helpText.includes('--external-scheme <scheme>'));
  assert.ok(helpText.includes('--trust-forwarded-headers'));
  assert.throws(
    () => module.parseWorkspaceArgs(['--external-scheme', 'ftp']),
    /--external-scheme must be http or https/u,
  );
});

test('workspace access output includes portal, openapi, and api route URLs', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
  );

  const settings = module.parseWorkspaceArgs([
    '--gateway-bind',
    '0.0.0.0:19080',
    '--admin-api-bind',
    '0.0.0.0:19081',
    '--app-api-bind',
    '0.0.0.0:19082',
    '--server-bind',
    '0.0.0.0:12900',
  ]);
  const lines = module.workspaceAccessLines(settings);

  assert.deepEqual(lines, [
    '[start-workspace] Mode: server',
    '[start-workspace] Edge Server Access',
    '[start-workspace]   Portal: http://127.0.0.1:12900/',
    '[start-workspace]   Gateway API: http://127.0.0.1:12900/v1',
    '[start-workspace]   Backend/Admin API: http://127.0.0.1:12900/backend/v3/api',
    '[start-workspace]   App API: http://127.0.0.1:12900/app/v3/api',
    '[start-workspace]   Gateway OpenAPI: http://127.0.0.1:12900/openapi.json',
    '[start-workspace]   Admin API OpenAPI: http://127.0.0.1:12900/backend/v3/api/openapi.json',
    '[start-workspace]   App API OpenAPI: http://127.0.0.1:12900/app/v3/api/openapi.json',
    '[start-workspace] Direct Service Access',
    '[start-workspace]   Direct Portal Dev: http://127.0.0.1:3901/',
    '[start-workspace]   Direct Portal Gateway API Proxy: http://127.0.0.1:3901/v1',
    '[start-workspace]   Direct Portal Backend/Admin API Proxy: http://127.0.0.1:3901/backend/v3/api',
    '[start-workspace]   Direct Portal App API Proxy: http://127.0.0.1:3901/app/v3/api',
    '[start-workspace]   Direct Portal Gateway OpenAPI Proxy: http://127.0.0.1:3901/openapi.json',
    '[start-workspace]   Direct Portal Admin API OpenAPI Proxy: http://127.0.0.1:3901/backend/v3/api/openapi.json',
    '[start-workspace]   Direct Portal App API OpenAPI Proxy: http://127.0.0.1:3901/app/v3/api/openapi.json',
    '[start-workspace] OpenAPI Schemas',
    '[start-workspace]   Gateway OpenAPI: http://127.0.0.1:19080/openapi.json',
    '[start-workspace]   Admin API OpenAPI: http://127.0.0.1:19081/backend/v3/api/openapi.json',
    '[start-workspace]   App API OpenAPI: http://127.0.0.1:19082/app/v3/api/openapi.json',
    '[start-workspace] API Access Paths',
    '[start-workspace]   OpenAI-compatible Gateway API: http://127.0.0.1:19080/v1',
    '[start-workspace]   Backend/Admin API: http://127.0.0.1:19081/backend/v3/api',
    '[start-workspace]   App API: http://127.0.0.1:19082/app/v3/api',
    '[start-workspace] Health Checks',
    '[start-workspace]   Edge Server Health: http://127.0.0.1:12900/healthz',
    '[start-workspace]   Edge Server Ready: http://127.0.0.1:12900/readyz',
    '[start-workspace]   Gateway Health: http://127.0.0.1:19080/healthz',
    '[start-workspace]   Gateway Ready: http://127.0.0.1:19080/readyz',
    '[start-workspace]   Admin API Health: http://127.0.0.1:19081/healthz',
    '[start-workspace]   Admin API Ready: http://127.0.0.1:19081/readyz',
    '[start-workspace]   App API Health: http://127.0.0.1:19082/healthz',
    '[start-workspace]   App API Ready: http://127.0.0.1:19082/readyz',
  ]);
});

test('workspace access output defaults to edge server port 3900', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs')).href
  );

  const settings = module.parseWorkspaceArgs([]);
  const lines = module.workspaceAccessLines(settings);

  assert.equal(settings.serverBind, '0.0.0.0:3900');
  assert.equal(settings.portalBind, '127.0.0.1:3901');
  assert.equal(lines[2], '[start-workspace]   Portal: http://127.0.0.1:3900/');
  assert.equal(lines[3], '[start-workspace]   Gateway API: http://127.0.0.1:3900/v1');
  assert.equal(lines[6], '[start-workspace]   Gateway OpenAPI: http://127.0.0.1:3900/openapi.json');
  assert.equal(lines[7], '[start-workspace]   Admin API OpenAPI: http://127.0.0.1:3900/backend/v3/api/openapi.json');
  assert.equal(lines[8], '[start-workspace]   App API OpenAPI: http://127.0.0.1:3900/app/v3/api/openapi.json');
  assert.ok(lines.includes('[start-workspace]   Direct Portal Dev: http://127.0.0.1:3901/'));
  assert.ok(lines.includes('[start-workspace]   Direct Portal Gateway API Proxy: http://127.0.0.1:3901/v1'));
  assert.ok(lines.includes('[start-workspace]   Direct Portal App API Proxy: http://127.0.0.1:3901/app/v3/api'));
  assert.ok(lines.includes('[start-workspace]   Direct Portal App API OpenAPI Proxy: http://127.0.0.1:3901/app/v3/api/openapi.json'));
  assert.ok(lines.includes('[start-workspace]   Edge Server Health: http://127.0.0.1:3900/healthz'));
  assert.ok(lines.includes('[start-workspace]   Edge Server Ready: http://127.0.0.1:3900/readyz'));
});

test('claw router product launcher desktop mode runs install-checked workspace and installs portal dependencies when requested', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'run-claw-router-product.mjs')).href
  );

  const plan = module.createClawRouterProductLaunchPlan({
    workspaceRoot,
    mode: 'desktop',
    install: true,
    platform: 'win32',
    env: {},
    extraArgs: [],
  });

  assert.equal(plan.length, 2);
  assert.equal(plan[0].label, 'portal install');
  assert.deepEqual(plan[0].args, ['--dir', 'apps/sdkwork-claw-router-portal', 'install']);
  assert.equal(plan[0].command, 'pnpm.cmd');
  assert.equal(plan[0].shell, true);
  assert.equal(plan[1].label, 'desktop development workspace');
  assert.equal(plan[1].command, process.execPath);
  assert.deepEqual(plan[1].args, [
    path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs'),
  ]);
  assert.equal(plan[1].shell, false);
  assert.equal(plan[1].env.SDKWORK_CLAW_DEPLOYMENT_MODE, 'desktop');
});

test('claw router product launcher service mode runs install-checked workspace with service flags', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'run-claw-router-product.mjs')).href
  );

  const plan = module.createClawRouterProductLaunchPlan({
    workspaceRoot,
    mode: 'service',
    install: false,
    platform: 'linux',
    env: {},
    extraArgs: ['--server-bind', '127.0.0.1:3910'],
  });

  assert.equal(plan.length, 1);
  assert.equal(plan[0].label, 'service development workspace');
  assert.equal(plan[0].command, process.execPath);
  assert.deepEqual(plan[0].args, [
    path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs'),
    '--server-bind',
    '127.0.0.1:3910',
  ]);
  assert.equal(plan[0].env.SDKWORK_CLAW_DEPLOYMENT_MODE, 'desktop');
  assert.equal(plan[0].env.SDKWORK_CLAW_SERVICE_MODE, '1');
  assert.equal(plan[0].env.SDKWORK_CLAW_PORTAL_START_HIDDEN, '1');
  assert.equal(plan[0].shell, false);
});

test('claw router product launcher forwards workspace arguments into server mode', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'run-claw-router-product.mjs')).href
  );

  const plan = module.createClawRouterProductLaunchPlan({
    workspaceRoot,
    mode: 'server',
    install: false,
    platform: 'linux',
    env: {},
    extraArgs: ['--gateway-bind', '0.0.0.0:19080'],
  });

  assert.equal(plan.length, 1);
  assert.equal(plan[0].label, 'server development workspace');
  assert.equal(plan[0].command, process.execPath);
  assert.deepEqual(plan[0].args, [
    path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs'),
    '--gateway-bind',
    '0.0.0.0:19080',
  ]);
  assert.equal(plan[0].shell, false);
});

test('claw router product launcher server plan prints human-readable access matrix by default', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'run-claw-router-product.mjs')).href
  );

  const plan = module.createClawRouterProductLaunchPlan({
    workspaceRoot,
    mode: 'plan',
    install: false,
    platform: 'linux',
    env: {},
    extraArgs: [],
  });

  assert.equal(plan.length, 1);
  assert.equal(plan[0].label, 'server development plan');
  assert.deepEqual(plan[0].args, [
    path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs'),
    '--dry-run',
  ]);
});

test('production starter supports help, dry-run, and full edge access matrix', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'start-claw-router-production.mjs')).href
  );
  const artifacts = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'claw-router-production-artifacts.mjs')).href
  );

  assert.deepEqual(module.parseStartProductionArgs(['--help']), {
    help: true,
    dryRun: false,
    serverBind: null,
    gatewayForwardUrl: null,
    backendApiForwardUrl: null,
    appApiForwardUrl: null,
    externalScheme: null,
    trustForwardedHeaders: false,
  });
  assert.deepEqual(module.parseStartProductionArgs(['--dry-run']), {
    help: false,
    dryRun: true,
    serverBind: null,
    gatewayForwardUrl: null,
    backendApiForwardUrl: null,
    appApiForwardUrl: null,
    externalScheme: null,
    trustForwardedHeaders: false,
  });
  assert.deepEqual(
    module.parseStartProductionArgs([
      '--dry-run',
      '--server-bind',
      '0.0.0.0:12900',
      '--gateway-forward-url',
      'http://gateway.internal:18080',
      '--backend-api-forward-url',
      'https://admin.internal',
      '--app-api-forward-url',
      'http://app.internal:18082',
      '--external-scheme',
      'https',
      '--trust-forwarded-headers',
    ]),
    {
      help: false,
      dryRun: true,
      serverBind: '0.0.0.0:12900',
      gatewayForwardUrl: 'http://gateway.internal:18080',
      backendApiForwardUrl: 'https://admin.internal',
      appApiForwardUrl: 'http://app.internal:18082',
      externalScheme: 'https',
      trustForwardedHeaders: true,
    },
  );
  assert.throws(
    () => module.parseStartProductionArgs(['--gateway-forward-url', 'http://gateway.internal:18080/v1']),
    /must be an HTTP\/HTTPS origin/,
  );
  assert.throws(
    () => module.parseStartProductionArgs(['--external-scheme', 'ftp']),
    /must be http or https/,
  );
  assert.doesNotThrow(() => module.main(['--dry-run']));
  assert.doesNotThrow(() => module.assertPortalDistReadyForStart(true, path.join(workspaceRoot, 'missing-dist')));
  assert.throws(
    () => module.assertPortalDistReadyForStart(false, path.join(workspaceRoot, 'missing-dist')),
    /portal production dist is missing/,
  );

  const env = module.resolveStartProductionEnv(
    {
      SDKWORK_CLAW_SERVER_BIND: '0.0.0.0:12900',
      PORTAL_PUBLIC_API_BASE_URL: 'https://api.example.com/v1',
      CARGO_TARGET_DIR: 'target-codex',
    },
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'dist'),
    module.parseStartProductionArgs([
      '--gateway-forward-url',
      'http://gateway.internal:18080',
      '--backend-api-forward-url',
      'https://admin.internal',
      '--app-api-forward-url',
      'http://app.internal:18082',
      '--external-scheme',
      'https',
      '--trust-forwarded-headers',
    ]),
  );
  assert.equal(env.SDKWORK_CLAW_EDGE_SERVER, '1');
  assert.equal(env.SDKWORK_CLAW_SERVER_BIND, '0.0.0.0:12900');
  assert.equal(env.SDKWORK_CLAW_EDGE_GATEWAY_BASE_URL, 'http://gateway.internal:18080');
  assert.equal(env.SDKWORK_CLAW_EDGE_BACKEND_API_BASE_URL, 'https://admin.internal');
  assert.equal(env.SDKWORK_CLAW_EDGE_APP_API_BASE_URL, 'http://app.internal:18082');
  assert.equal(env.SDKWORK_CLAW_EDGE_EXTERNAL_SCHEME, 'https');
  assert.equal(env.SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS, '1');
  assert.equal(env.PORTAL_PUBLIC_API_BASE_URL, 'https://api.example.com/v1');
  assert.equal(env.PORTAL_PUBLIC_APP_API_BASE_URL, '/app/v3/api');
  assert.equal(env.PORTAL_PUBLIC_BACKEND_API_BASE_URL, '/backend/v3/api');
  assert.equal(env.PORTAL_PUBLIC_TOOL_API_ENABLED, 'false');
  assert.equal(env.PORTAL_TOOL_API_RATE_LIMIT_REQUESTS, '120');
  assert.equal(env.PORTAL_TOOL_API_RATE_LIMIT_WINDOW_SECONDS, '60');
  assert.equal(
    env.PORTAL_TOOL_API_SDK_ARCHIVE_ROOT,
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'dist', 'sdk-archives'),
  );
  assert.equal(env.CARGO_TARGET_DIR, 'target-codex');
  assert.equal(
    artifacts.productionGatewayBinaryPath({ env, platform: 'win32', workspaceRoot }),
    path.join(workspaceRoot, 'target-codex', 'release', 'sdkwork-claw-gateway.exe'),
  );
  assert.deepEqual(
    module.resolveStartProductionCommand(
      { ...env, SDKWORK_CLAW_GATEWAY_BIN: 'D:\\prod\\sdkwork-claw-gateway.exe' },
      'win32',
      workspaceRoot,
    ),
    {
      command: 'D:\\prod\\sdkwork-claw-gateway.exe',
      args: [],
      source: 'env',
    },
  );

  const lines = module.buildStartProductionAccessLines(env);
  assert.ok(lines.includes('[start-production] Edge Server Access'));
  assert.ok(lines.includes('[start-production]   Portal: http://127.0.0.1:12900/'));
  assert.ok(lines.includes('[start-production]   Gateway OpenAPI: http://127.0.0.1:12900/openapi.json'));
  assert.ok(lines.includes('[start-production]   Admin API OpenAPI: http://127.0.0.1:12900/backend/v3/api/openapi.json'));
  assert.ok(lines.includes('[start-production]   App API OpenAPI: http://127.0.0.1:12900/app/v3/api/openapi.json'));
  assert.ok(lines.includes('[start-production]   Gateway API: http://127.0.0.1:12900/v1'));
  assert.ok(lines.includes('[start-production]   Backend/Admin API: http://127.0.0.1:12900/backend/v3/api'));
  assert.ok(lines.includes('[start-production]   App API: http://127.0.0.1:12900/app/v3/api'));
  assert.ok(lines.includes('[start-production]   Edge Server Health: http://127.0.0.1:12900/healthz'));
  assert.ok(lines.includes('[start-production]   Edge Server Ready: http://127.0.0.1:12900/readyz'));
  assert.ok(lines.includes('[start-production] Edge Forwarding Targets'));
  assert.ok(lines.includes('[start-production]   Gateway Target: http://gateway.internal:18080'));
  assert.ok(lines.includes('[start-production]   Backend/Admin Target: https://admin.internal'));
  assert.ok(lines.includes('[start-production]   App Target: http://app.internal:18082'));
  assert.ok(lines.includes('[start-production] Direct Service Access'));
  assert.ok(lines.includes('[start-production]   Gateway OpenAPI: http://gateway.internal:18080/openapi.json'));
  assert.ok(lines.includes('[start-production]   Admin API OpenAPI: https://admin.internal/backend/v3/api/openapi.json'));
  assert.ok(lines.includes('[start-production]   App API OpenAPI: http://app.internal:18082/app/v3/api/openapi.json'));
  assert.ok(lines.includes('[start-production]   OpenAI-compatible Gateway API: http://gateway.internal:18080/v1'));
  assert.ok(lines.includes('[start-production]   Backend/Admin API: https://admin.internal/backend/v3/api'));
  assert.ok(lines.includes('[start-production]   App API: http://app.internal:18082/app/v3/api'));
  assert.ok(lines.includes('[start-production]   PORTAL_PUBLIC_TOOL_API_ENABLED=false'));
  assert.ok(lines.includes('[start-production]   PORTAL_TOOL_API_RATE_LIMIT_REQUESTS=120'));
  assert.ok(lines.includes('[start-production]   PORTAL_TOOL_API_RATE_LIMIT_WINDOW_SECONDS=60'));
  assert.ok(lines.some((line) => (
    line.startsWith('[start-production]   PORTAL_TOOL_API_SDK_ARCHIVE_ROOT=')
    && line.includes(path.join('apps', 'sdkwork-claw-router-portal', 'dist', 'sdk-archives'))
  )));
  assert.ok(lines.includes('[start-production]   SDKWORK_CLAW_EDGE_EXTERNAL_SCHEME=https'));
  assert.ok(lines.includes('[start-production]   SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS=1'));
});

test('production build creates portal assets and Rust edge release artifact', async () => {
  const rootPackage = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'package.json'), 'utf8'),
  );
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'build-claw-router-production.mjs')).href
  );

  assert.equal(rootPackage.scripts.build, 'node scripts/build-claw-router-production.mjs');
  assert.deepEqual(module.parseProductionBuildArgs(['--dry-run']), {
    help: false,
    dryRun: true,
  });
  const plan = module.createProductionBuildPlan(
    { help: false, dryRun: false },
    { CARGO_TARGET_DIR: 'target-codex' },
    'win32',
    workspaceRoot,
  );

  assert.deepEqual(plan.map((step) => step.label), [
    'gateway OpenAPI schema generation',
    'app SDK runtime build',
    'backend SDK runtime build',
    'open SDK runtime build',
    'portal production assets',
    'SDK archive artifacts',
    'Rust edge release binary',
  ]);
  assert.equal(plan[0].command, 'python');
  assert.deepEqual(plan[0].args, ['-B', '-m', 'tools.clawrouter_gateway_openapi_generator']);
  assert.deepEqual(plan[1].args, ['--dir', 'sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript', 'build']);
  assert.deepEqual(plan[2].args, ['--dir', 'sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript', 'build']);
  assert.deepEqual(plan[3].args, ['--dir', 'sdks/clawrouter-open-sdk/clawrouter-open-sdk-typescript', 'build']);
  assert.equal(plan[1].attempts, 2);
  assert.equal(plan[2].attempts, 2);
  assert.equal(plan[3].attempts, 2);
  assert.deepEqual(plan[4].args, ['--dir', 'apps/sdkwork-claw-router-portal', 'build']);
  assert.deepEqual(plan[5].args, ['scripts/archive-claw-router-sdks.mjs']);
  assert.equal(plan[5].command, 'node');
  assert.deepEqual(plan[6].args, ['build', '-p', 'sdkwork-claw-gateway', '--release']);
  assert.equal(plan[6].command, 'cargo.exe');
  assert.equal(plan[6].env.CARGO_TARGET_DIR, 'target-codex');
  assert.ok(
    module.renderProductionBuildPlan(plan, { CARGO_TARGET_DIR: 'target-codex' }, 'win32', workspaceRoot)
      .some((line) => line.includes('target-codex') && line.includes('sdkwork-claw-gateway.exe')),
  );
  assert.ok(
    module.renderProductionBuildPlan(plan, { CARGO_TARGET_DIR: 'target-codex' }, 'win32', workspaceRoot)
      .some((line) => line.includes('dist') && line.includes('sdk-archives')),
  );
  const buildProductionSource = readFileSync(
    path.join(workspaceRoot, 'scripts', 'build-claw-router-production.mjs'),
    'utf8',
  );
  assert.match(buildProductionSource, /attempt \${attempt}\/\${attempts}/);
  assert.match(buildProductionSource, /retrying once to recover from transient toolchain process exits/);
});

test('production SDK archiver creates deterministic ZIP artifacts for generated SDKs', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'archive-claw-router-sdks.mjs')).href
  );

  assert.deepEqual(module.parseSdkArchiveArgs(['--dry-run']), {
    dryRun: true,
    help: false,
    outputDir: null,
  });
  assert.equal(
    module.defaultSdkArchiveRoot(workspaceRoot),
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'dist', 'sdk-archives'),
  );
  assert.deepEqual(module.defaultSdkArchiveSpecs().map((spec) => spec.archiveName), [
    'sdkwork-clawrouter-app-sdk-typescript-0.1.0.zip',
    'sdkwork-clawrouter-backend-sdk-typescript-0.1.0.zip',
    'sdkwork-clawrouter-open-sdk-typescript-0.1.0.zip',
  ]);
  assert.ok(module.defaultSdkArchiveSpecs().every((spec) => spec.language === 'typescript'));
  assert.ok(module.defaultSdkArchiveSpecs().every((spec) => spec.sourceDir.startsWith('sdks/')));

  const manifest = module.buildSdkArchiveManifest(
    module.defaultSdkArchiveSpecs(),
    new Map([
      ['sdkwork-clawrouter-app-sdk-typescript-0.1.0.zip', { size: 1200, sha256: 'a'.repeat(64) }],
      ['sdkwork-clawrouter-backend-sdk-typescript-0.1.0.zip', { size: 2200, sha256: 'b'.repeat(64) }],
      ['sdkwork-clawrouter-open-sdk-typescript-0.1.0.zip', { size: 3200, sha256: 'c'.repeat(64) }],
    ]),
  );
  assert.deepEqual(manifest.archives.map((archive) => archive.file), [
    'sdkwork-clawrouter-app-sdk-typescript-0.1.0.zip',
    'sdkwork-clawrouter-backend-sdk-typescript-0.1.0.zip',
    'sdkwork-clawrouter-open-sdk-typescript-0.1.0.zip',
  ]);
  assert.equal(manifest.archives[0].packageName, '@sdkwork/clawrouter-app-sdk');
  assert.equal(manifest.archives[1].packageName, '@sdkwork/clawrouter-backend-sdk');
  assert.equal(manifest.archives[2].packageName, '@sdkwork/clawrouter-open-sdk');
  assert.match(JSON.stringify(manifest), /generatedAt/);
});

test('Rust edge SDK archive tool API is constrained to generated SDK packages', () => {
  const edgeServerSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-gateway', 'src', 'edge_server.rs'),
    'utf8',
  );
  const edgeServerTestSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-gateway', 'tests', 'edge_server.rs'),
    'utf8',
  );

  assert.ok(edgeServerSource.includes('sdkwork-clawrouter-app-sdk-typescript-0.1.0.zip'));
  assert.ok(edgeServerSource.includes('sdkwork-clawrouter-backend-sdk-typescript-0.1.0.zip'));
  assert.ok(edgeServerSource.includes('@sdkwork/clawrouter-app-sdk'));
  assert.ok(edgeServerSource.includes('@sdkwork/clawrouter-backend-sdk'));
  assert.ok(edgeServerSource.includes('SdkworkAppClient'));
  assert.ok(edgeServerSource.includes('unsupported_sdk_archive'));
  assert.ok(!edgeServerSource.includes('ClawRouterSDK'));
  assert.ok(!edgeServerSource.includes('sdkwork-clawrouter-sdk'));
  assert.ok(!edgeServerSource.includes('"sdkwork-clawrouter-sdk"'));
  assert.ok(!edgeServerSource.includes('sdkwork-clawrouter-sdk-typescript-1.0.0.zip'));
  assert.ok(!edgeServerTestSource.includes('ClawRouterSDK'));
  assert.ok(!edgeServerTestSource.includes('@sdkwork/clawrouter-sdk'));
  assert.ok(!edgeServerTestSource.includes('sdkwork-clawrouter-sdk-typescript-1.0.0.zip'));
});

test('API router product chain is covered from portal services through SDK and Rust edge', () => {
  const routingServiceSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-console-routing',
      'src',
      'routingService.ts',
    ),
    'utf8',
  );
  const modelServiceSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-models',
      'src',
      'modelService.ts',
    ),
    'utf8',
  );
  const playgroundServiceSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-playground',
      'src',
      'playgroundService.ts',
    ),
    'utf8',
  );
  const routingComponentsSource = [
    'ApiKeysTab.tsx',
    'ChannelsTab.tsx',
    'RequestDataTab.tsx',
    'StrategyTab.tsx',
    'UsageTab.tsx',
  ].map((fileName) =>
    readFileSync(
      path.join(
        workspaceRoot,
        'apps',
        'sdkwork-claw-router-portal',
        'packages',
        'sdkwork-claw-router-console-routing',
        'src',
        'components',
        fileName,
      ),
      'utf8',
    ),
  ).join('\n');
  const appSdkRouterSource = readFileSync(
    path.join(
      workspaceRoot,
      'sdks',
      'clawrouter-app-sdk',
      'clawrouter-app-sdk-typescript',
      'src',
      'api',
      'ai.ts',
    ),
    'utf8',
  );
  const manifest = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'generated', 'api', 'api-contract-manifest.json'), 'utf8'),
  );
  const openapi = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'generated', 'openapi', 'clawrouter-app-openapi.json'), 'utf8'),
  );
  const appApiSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-app-api', 'src', 'lib.rs'),
    'utf8',
  );
  const appRoutingReadSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-product', 'src', 'api', 'app_routing.rs'),
    'utf8',
  );
  const appRoutingCommandSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-product', 'src', 'api', 'app_routing_channel_command.rs'),
    'utf8',
  );
  const appRoutingStrategySource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-product', 'src', 'api', 'app_routing_strategy.rs'),
    'utf8',
  );
  const appModelsSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-product', 'src', 'api', 'app_models.rs'),
    'utf8',
  );
  const appGenerationHistorySource = readFileSync(
    path.join(
      workspaceRoot,
      'services',
      'sdkwork-claw-product',
      'src',
      'api',
      'app_generation_history.rs',
    ),
    'utf8',
  );
  const appDatabaseTestSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-app-api', 'tests', 'database_config_router.rs'),
    'utf8',
  );
  const edgeSmokeSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-gateway', 'tests', 'edge_server_sqlite_smoke.rs'),
    'utf8',
  );
  const gatewayRuntimeSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-gateway', 'src', 'runtime.rs'),
    'utf8',
  );
  const openaiChatSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-product', 'src', 'api', 'openai_chat.rs'),
    'utf8',
  );
  const openaiChatTestSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-gateway', 'tests', 'openai_chat_route.rs'),
    'utf8',
  );
  const appAiServiceSurface = `${routingServiceSource}\n${modelServiceSource}\n${playgroundServiceSource}`;

  const requiredAppRouterOperations = [
    {
      operation: 'fetchModels',
      method: 'GET',
      manifestPath: '/app/v3/api/ai/models',
      sdkPath: '/ai/models',
      frontendService: 'ModelService',
      rustSource: appModelsSource,
      rustRoutePath: '/app/v3/api/ai/models',
      edgeSmokePath: '/app/v3/api/ai/models',
    },
    {
      operation: 'fetchGenerationHistory',
      method: 'GET',
      manifestPath: '/app/v3/api/ai/generations',
      sdkPath: '/ai/generations',
      frontendService: 'PlaygroundService',
      rustSource: appGenerationHistorySource,
      rustRoutePath: '/app/v3/api/ai/generations',
      edgeSmokePath: '/app/v3/api/ai/generations',
    },
    {
      operation: 'fetchChannels',
      method: 'GET',
      manifestPath: '/app/v3/api/ai/routing/channels',
      sdkPath: '/ai/routing/channels',
      frontendService: 'RoutingService',
      rustSource: appRoutingReadSource,
      rustRoutePath: '/app/v3/api/ai/routing/channels',
      edgeSmokePath: '/app/v3/api/ai/routing/channels',
    },
    {
      operation: 'createChannel',
      method: 'POST',
      manifestPath: '/app/v3/api/ai/routing/channels',
      sdkPath: '/ai/routing/channels',
      frontendService: 'RoutingService',
      rustSource: appRoutingCommandSource,
      rustRoutePath: '/app/v3/api/ai/routing/channels',
      edgeSmokePath: '/app/v3/api/ai/routing/channels',
    },
    {
      operation: 'updateChannel',
      method: 'PUT',
      manifestPath: '/app/v3/api/ai/routing/channels/{channelId}',
      sdkPath: '/ai/routing/channels/${channelId}',
      frontendService: 'RoutingService',
      rustSource: appRoutingCommandSource,
      rustRoutePath: '/app/v3/api/ai/routing/channels/{channel_id}',
      edgeSmokePath: '/app/v3/api/ai/routing/channels/{created_channel_id}',
    },
    {
      operation: 'deleteChannel',
      method: 'DELETE',
      manifestPath: '/app/v3/api/ai/routing/channels/{channelId}',
      sdkPath: '/ai/routing/channels/${channelId}',
      frontendService: 'RoutingService',
      rustSource: appRoutingCommandSource,
      rustRoutePath: '/app/v3/api/ai/routing/channels/{channel_id}',
      edgeSmokePath: '/app/v3/api/ai/routing/channels/{created_channel_id}',
    },
    {
      operation: 'setChannelStatus',
      method: 'PUT',
      manifestPath: '/app/v3/api/ai/routing/channels/{channelId}/status',
      sdkPath: '/ai/routing/channels/${channelId}/status',
      frontendService: 'RoutingService',
      rustSource: appRoutingCommandSource,
      rustRoutePath: '/app/v3/api/ai/routing/channels/{channel_id}/status',
      edgeSmokePath: '/app/v3/api/ai/routing/channels/{created_channel_id}/status',
    },
    {
      operation: 'testChannel',
      method: 'POST',
      manifestPath: '/app/v3/api/ai/routing/channels/{channelId}/verify',
      sdkPath: '/ai/routing/channels/${channelId}/verify',
      frontendService: 'RoutingService',
      rustSource: appRoutingCommandSource,
      rustRoutePath: '/app/v3/api/ai/routing/channels/{channel_id}/verify',
      edgeSmokePath: '/app/v3/api/ai/routing/channels/{created_channel_id}/verify',
    },
    {
      operation: 'fetchApiKeys',
      method: 'GET',
      manifestPath: '/app/v3/api/ai/routing/api_keys',
      sdkPath: '/ai/routing/api_keys',
      frontendService: 'RoutingService',
      rustSource: appRoutingReadSource,
      rustRoutePath: '/app/v3/api/ai/routing/api_keys',
      edgeSmokePath: '/app/v3/api/ai/routing/api_keys',
    },
    {
      operation: 'fetchRequestTraces',
      method: 'GET',
      manifestPath: '/app/v3/api/ai/routing/request_traces',
      sdkPath: '/ai/routing/request_traces',
      frontendService: 'RoutingService',
      rustSource: appRoutingReadSource,
      rustRoutePath: '/app/v3/api/ai/routing/request_traces',
      edgeSmokePath: '/app/v3/api/ai/routing/request_traces',
    },
    {
      operation: 'fetchStrategy',
      method: 'GET',
      manifestPath: '/app/v3/api/ai/routing/strategy',
      sdkPath: '/ai/routing/strategy',
      frontendService: 'RoutingService',
      rustSource: appRoutingStrategySource,
      rustRoutePath: '/app/v3/api/ai/routing/strategy',
      edgeSmokePath: '/app/v3/api/ai/routing/strategy',
    },
    {
      operation: 'updateStrategy',
      method: 'PUT',
      manifestPath: '/app/v3/api/ai/routing/strategy',
      sdkPath: '/ai/routing/strategy',
      frontendService: 'RoutingService',
      rustSource: appRoutingStrategySource,
      rustRoutePath: '/app/v3/api/ai/routing/strategy',
      edgeSmokePath: '/app/v3/api/ai/routing/strategy',
    },
    {
      operation: 'fetchUsageData',
      method: 'GET',
      manifestPath: '/app/v3/api/ai/routing/usage',
      sdkPath: '/ai/routing/usage',
      frontendService: 'RoutingService',
      rustSource: appRoutingReadSource,
      rustRoutePath: '/app/v3/api/ai/routing/usage',
      edgeSmokePath: '/app/v3/api/ai/routing/usage',
    },
  ];

  const sdkServiceCallByOperation = {
    fetchModels: 'getClawRouterAppSdkClient().ai.models.list(',
    fetchGenerationHistory: 'getClawRouterAppSdkClient().ai.generations.list(',
    fetchChannels: 'getClawRouterAppSdkClient().ai.routing.channels.list()',
    createChannel: 'getClawRouterAppSdkClient().ai.routing.channels.create(',
    updateChannel: 'getClawRouterAppSdkClient().ai.routing.channels.update(',
    deleteChannel: 'getClawRouterAppSdkClient().ai.routing.channels.delete(',
    setChannelStatus: 'getClawRouterAppSdkClient().ai.routing.channels.status.update(',
    testChannel: 'getClawRouterAppSdkClient().ai.routing.channels.verify(',
    fetchApiKeys: 'getClawRouterAppSdkClient().ai.routing.apiKeys.list()',
    fetchRequestTraces: 'getClawRouterAppSdkClient().ai.routing.requestTraces.list()',
    fetchStrategy: 'getClawRouterAppSdkClient().ai.routing.strategy.list()',
    updateStrategy: 'getClawRouterAppSdkClient().ai.routing.strategy.update(',
    fetchUsageData: 'getClawRouterAppSdkClient().ai.routing.usage.list()',
  };

  const sdkMethodByOperation = {
    fetchModels: 'async list(',
    fetchGenerationHistory: 'async list(',
    fetchChannels: 'async list(',
    createChannel: 'async create(',
    updateChannel: 'async update(',
    deleteChannel: 'async delete(',
    setChannelStatus: 'async update(',
    testChannel: 'async verify(',
    fetchApiKeys: 'async list(',
    fetchRequestTraces: 'async list(',
    fetchStrategy: 'async list(',
    updateStrategy: 'async update(',
    fetchUsageData: 'async list(',
  };

  const sdkOperationIdByOperation = {
    fetchModels: 'models.list',
    fetchGenerationHistory: 'generations.list',
    fetchChannels: 'routing.channels.list',
    createChannel: 'routing.channels.create',
    updateChannel: 'routing.channels.update',
    deleteChannel: 'routing.channels.delete',
    setChannelStatus: 'routing.channels.status.update',
    testChannel: 'routing.channels.verify',
    fetchApiKeys: 'routing.apiKeys.list',
    fetchRequestTraces: 'routing.requestTraces.list',
    fetchStrategy: 'routing.strategy.list',
    updateStrategy: 'routing.strategy.update',
    fetchUsageData: 'routing.usage.list',
  };

  const assertGeneratedSdkPath = (operation) => {
    if (!operation.sdkPath.includes('${')) {
      assert.ok(
        appSdkRouterSource.includes(`appApiPath(\`${operation.sdkPath}\`)`),
        `${operation.operation} must use the generated app SDK path ${operation.sdkPath}`,
      );
      return;
    }

    const staticFragments = operation.sdkPath
      .split(/\$\{[^}]+\}/u)
      .filter(Boolean);
    for (const fragment of staticFragments) {
      assert.ok(
        appSdkRouterSource.includes(fragment),
        `${operation.operation} must include generated app SDK path fragment ${fragment}`,
      );
    }
    for (const paramName of operation.sdkPath.matchAll(/\$\{([^}]+)\}/gu)) {
      assert.ok(
        appSdkRouterSource.includes(`serializePathParameter(${paramName[1]}`),
        `${operation.operation} must serialize SDK path parameter ${paramName[1]}`,
      );
    }
  };

  for (const operation of requiredAppRouterOperations) {
    const manifestOperation = manifest.operations.find((entry) =>
      entry.source === (
        operation.operation === 'fetchModels'
          ? 'apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/modelService.ts'
          : operation.frontendService === 'PlaygroundService'
            ? 'apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-playground/src/playgroundService.ts'
          : 'apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-routing/src/routingService.ts'
      )
      && entry.operation === operation.operation
      && entry.api_path === operation.manifestPath
      && entry.api_method === operation.method
      && entry.sdk_client === 'SdkworkAppClient'
      && entry.sdk_family === 'clawrouter-app-sdk',
    );
    assert.ok(manifestOperation, `${operation.operation} must be declared in the app manifest`);
    assert.equal(
      manifestOperation.route,
      operation.operation === 'fetchModels'
        ? '/models'
        : operation.frontendService === 'PlaygroundService'
          ? '/playground'
          : '/console/routing',
    );
    assert.equal(manifestOperation.sdk_api_prefix, '/app/v3/api');
    assert.ok(
      appAiServiceSurface.includes(sdkServiceCallByOperation[operation.operation]),
      `${operation.operation} must call the generated app SDK from the portal service boundary`,
    );
    assert.ok(
      appSdkRouterSource.includes(sdkMethodByOperation[operation.operation]),
      `${operation.operation} must be exposed by the generated app SDK`,
    );
    assertGeneratedSdkPath(operation);
    assert.equal(
      openapi.paths[operation.manifestPath]?.[operation.method.toLowerCase()]?.operationId,
      sdkOperationIdByOperation[operation.operation],
      `${operation.operation} must be present in generated OpenAPI at ${operation.method} ${operation.manifestPath}`,
    );
    assert.ok(
      operation.rustSource.includes(operation.rustRoutePath),
      `${operation.operation} must be implemented by the Rust app API router`,
    );
    assert.ok(
      edgeSmokeSource.includes(operation.edgeSmokePath),
      `${operation.operation} must be exercised through the unified Rust edge server smoke test`,
    );
  }

  const playgroundModelGroupsOperation = manifest.operations.find((entry) =>
    entry.source === 'apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-playground/src/playgroundService.ts'
    && entry.operation === 'fetchModelGroups',
  );
  assert.ok(
    playgroundModelGroupsOperation,
    'fetchModelGroups must remain tracked as a local Playground view over the standard app model catalog',
  );
  assert.equal(playgroundModelGroupsOperation.api_path, '/app/v3/api/ai/models');
  assert.equal(playgroundModelGroupsOperation.api_method, 'GET');
  assert.equal(playgroundModelGroupsOperation.sdk_client, 'SdkworkAppClient');
  assert.equal(playgroundModelGroupsOperation.sdk_family, 'clawrouter-app-sdk');
  assert.equal(playgroundModelGroupsOperation.openapi_exposed, false);
  assert.equal(playgroundModelGroupsOperation.operation_id, 'models.list');
  assert.ok(
    appAiServiceSurface.includes('getClawRouterAppSdkClient().ai.models.list()'),
    'fetchModelGroups must reuse the generated app SDK model catalog method',
  );
  assert.ok(
    !appAiServiceSurface.includes(`getClawRouterAppSdkClient().ai.${['playground', 'models'].join('.')}.list(`),
    'fetchModelGroups must not call a Playground-specific SDK model catalog method',
  );
  assert.ok(
    !appSdkRouterSource.includes(['playground', 'models', 'list'].join('.')),
    'the generated app SDK must not expose a Playground-specific model catalog operation',
  );
  const removedPlaygroundModelsPath = [
    '/app/v3/api/ai/playground',
    '/models',
  ].join('');
  assert.equal(openapi.paths[removedPlaygroundModelsPath], undefined);
  assert.equal(openapi.paths['/app/v3/api/ai/models']?.get?.operationId, 'models.list');
  assert.ok(appModelsSource.includes('/app/v3/api/ai/models'));
  assert.ok(!appModelsSource.includes(removedPlaygroundModelsPath));

  for (const componentCall of [
    'RoutingService.fetchChannels',
    'RoutingService.createChannel',
    'RoutingService.updateChannel',
    'RoutingService.deleteChannel',
    'RoutingService.setChannelStatus',
    'RoutingService.testChannel',
    'RoutingService.fetchApiKeys',
    'RoutingService.fetchRequestTraces',
    'RoutingService.fetchStrategy',
    'RoutingService.updateStrategy',
    'RoutingService.fetchUsageData',
  ]) {
    assert.ok(routingComponentsSource.includes(componentCall), `${componentCall} must be wired into console routing UI`);
  }

  assert.ok(appApiSource.includes('app_routing_router_with_read_store'));
  assert.ok(appApiSource.includes('app_routing_strategy_router_with_store'));
  assert.ok(appApiSource.includes('app_routing_channel_command_router_with_store'));
  assert.ok(appApiSource.includes('app_model_catalog_router'));
  assert.ok(appDatabaseTestSource.includes('database_config_app_routing_routes_require_session_scope_and_redact_sensitive_data'));
  assert.ok(appDatabaseTestSource.includes('database_config_app_routing_channel_commands_persist_and_scope_without_secret_leakage'));
  assert.ok(appDatabaseTestSource.includes('/app/v3/api/ai/routing/strategy'));
  assert.ok(appDatabaseTestSource.includes('/app/v3/api/ai/routing/channels'));

  assert.ok(gatewayRuntimeSource.includes('router_with_openai_runtime_routes'));
  assert.ok(gatewayRuntimeSource.includes('openai_chat_completions_router_with_relays_and_usage_recorder'));
  assert.ok(openaiChatSource.includes('/v1/chat/completions'));
  assert.ok(openaiChatSource.includes('GatewayUsageRecorder'));
  assert.ok(openaiChatSource.includes('build_usage_record_command'));
  assert.ok(openaiChatSource.includes('record_gateway_usage(command)'));
  assert.ok(openaiChatSource.includes('provider_usage_record_failed'));
  assert.ok(openaiChatSource.includes('StreamingUsageRecordingBody'));
  assert.ok(openaiChatTestSource.includes('gateway_mounts_openai_chat_completions_boundary_without_fake_success'));
});

test('portal SDK reference uses real generated SDK package metadata for downloads', () => {
  const sdkReferenceSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-sdk-reference',
      'src',
      'pages',
      'SdkReference.tsx',
    ),
    'utf8',
  );
  const sdkDataSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-sdk-reference',
      'src',
      'data',
      'sdkData.ts',
    ),
    'utf8',
  );
  const sdkClientBoundarySource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-commons',
      'src',
      'sdk-clients.ts',
    ),
    'utf8',
  );
  const appSdkPackage = JSON.parse(
    readFileSync(
      path.join(
        workspaceRoot,
        'sdks',
        'clawrouter-app-sdk',
        'clawrouter-app-sdk-typescript',
        'package.json',
      ),
      'utf8',
    ),
  );
  const backendSdkPackage = JSON.parse(
    readFileSync(
      path.join(
        workspaceRoot,
        'sdks',
        'clawrouter-backend-sdk',
        'clawrouter-backend-sdk-typescript',
        'package.json',
      ),
      'utf8',
    ),
  );
  const referenceSurface = `${sdkReferenceSource}\n${sdkDataSource}`;
  const sdkMetadataSurface = `${referenceSurface}\n${sdkClientBoundarySource}`;

  assert.ok(sdkDataSource.includes('CLAWROUTER_APP_SDK_REFERENCE_METADATA'));
  assert.ok(sdkDataSource.includes('CLAWROUTER_BACKEND_SDK_REFERENCE_METADATA'));
  assert.ok(sdkMetadataSurface.includes(appSdkPackage.name));
  assert.ok(sdkMetadataSurface.includes(appSdkPackage.version));
  assert.ok(sdkMetadataSurface.includes(backendSdkPackage.name));
  assert.ok(sdkMetadataSurface.includes(backendSdkPackage.version));
  assert.ok(sdkMetadataSurface.includes('SdkworkAppClient'));
  assert.ok(sdkMetadataSurface.includes('SdkworkBackendClient'));
  assert.ok(sdkMetadataSurface.includes('/app/v3/api'));
  assert.ok(sdkMetadataSurface.includes('/backend/v3/api'));
  assert.ok(sdkMetadataSurface.includes('sdkwork-clawrouter-app-sdk-typescript-0.1.0.zip'));
  assert.ok(sdkMetadataSurface.includes('sdkwork-clawrouter-backend-sdk-typescript-0.1.0.zip'));
  assert.ok(referenceSurface.includes('isGeneratedSdkArchiveLanguage'));
  assert.ok(referenceSurface.includes('localToolApiEnabled && isGeneratedSdkArchiveLanguage(activeSdk.id)'));
  assert.ok(!referenceSurface.includes('@sdkwork/clawrouter-sdk'));
  assert.ok(!referenceSurface.includes('@sdkwork/clawrouter-management-sdk'));
  assert.ok(!referenceSurface.includes('@sdkwork/clawrouter-portal-sdk'));
  assert.ok(!sdkReferenceSource.includes("version: '1.0.0'"));
  assert.ok(!sdkReferenceSource.includes('systemNameSlug'));
});

test('portal model catalog API examples use the generated app SDK package', () => {
  const modelCatalogSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-models',
      'src',
      'modelCatalog.ts',
    ),
    'utf8',
  );
  const sdkClientBoundarySource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-commons',
      'src',
      'sdk-clients.ts',
    ),
    'utf8',
  );

  assert.ok(modelCatalogSource.includes('createClawRouterAppSdkModelExample'));
  assert.ok(sdkClientBoundarySource.includes("@sdkwork/clawrouter-app-sdk"));
  assert.ok(sdkClientBoundarySource.includes('SdkworkAppClient'));
  assert.ok(sdkClientBoundarySource.includes('/app/v3/api'));
  assert.ok(!modelCatalogSource.includes("@sdkwork/clawrouter-sdk"));
  assert.ok(!modelCatalogSource.includes('ClawRouterClient'));
});

test('postgres integration runner exposes optional and required execution modes', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'run-postgres-integration.mjs')).href
  );

  assert.deepEqual(module.parseArgs(['--require-database', '--', '--nocapture']), {
    withDocker: false,
    keepDocker: false,
    requireDatabase: true,
    dryRun: false,
    help: false,
    extraArgs: ['--nocapture'],
  });
  assert.deepEqual(module.postgresIntegrationCargoArgs(['--nocapture']), [
    'test',
    '-p',
    'sdkwork-claw-product',
    '--test',
    'postgres_generation_history_sql_contract',
    '--test',
    'postgres_transaction_integration',
    '--',
    '--nocapture',
  ]);
  assert.equal(
    module.hasPostgresDatabaseUrl({
      SDKWORK_CLAW_POSTGRES_TEST_DATABASE_URL: 'postgres://example',
    }),
    true,
  );
  assert.equal(module.hasPostgresDatabaseUrl({}), false);
});

test('postgres integration runner can plan an ephemeral Docker database', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'run-postgres-integration.mjs')).href
  );

  assert.deepEqual(module.parseArgs(['--with-docker', '--keep-docker', '--', '--nocapture']), {
    withDocker: true,
    keepDocker: true,
    requireDatabase: false,
    dryRun: false,
    help: false,
    extraArgs: ['--nocapture'],
  });

  const plan = module.createPostgresIntegrationPlan(
    {
      withDocker: true,
      keepDocker: false,
      requireDatabase: false,
      dryRun: false,
      help: false,
      extraArgs: ['--nocapture'],
    },
    { SDKWORK_CLAW_POSTGRES_TEST_PORT: '15439' },
    workspaceRoot,
  );

  assert.deepEqual(plan.steps.map((step) => step.label), [
    'docker availability check',
    'postgres docker up',
    'postgres transaction integration',
    'postgres docker down',
  ]);
  assert.deepEqual(plan.steps[0].args, ['version', '--format', '{{.Server.Version}}']);
  assert.equal(plan.steps[0].quiet, true);
  assert.deepEqual(plan.steps[1].args, [
    'compose',
    '-p',
    'sdkwork-claw-router-postgres-test',
    '-f',
    path.join(workspaceRoot, 'docker-compose.postgres-test.yml'),
    'up',
    '-d',
    '--wait',
  ]);
  assert.equal(
    plan.steps[2].env.SDKWORK_CLAW_POSTGRES_TEST_DATABASE_URL,
    'postgres://sdkwork_claw_test:sdkwork_claw_test_password@127.0.0.1:15439/sdkwork_claw_test',
  );
  assert.deepEqual(plan.steps[3].args.slice(-2), ['--volumes', '--remove-orphans']);
});

test('postgres integration runner handles package-manager argument separators', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'run-postgres-integration.mjs')).href
  );

  assert.deepEqual(module.parseArgs(['--with-docker', '--', '--dry-run']), {
    withDocker: true,
    keepDocker: false,
    requireDatabase: false,
    dryRun: true,
    help: false,
    extraArgs: [],
  });
  assert.deepEqual(module.parseArgs(['--with-docker', '--', '--nocapture']).extraArgs, [
    '--nocapture',
  ]);
  assert.deepEqual(module.postgresIntegrationCargoArgs(['--nocapture']), [
    'test',
    '-p',
    'sdkwork-claw-product',
    '--test',
    'postgres_generation_history_sql_contract',
    '--test',
    'postgres_transaction_integration',
    '--',
    '--nocapture',
  ]);
  assert.deepEqual(module.postgresIntegrationCargoArgs(['postgres_gateway_usage_recorder']), [
    'test',
    '-p',
    'sdkwork-claw-product',
    '--test',
    'postgres_generation_history_sql_contract',
    '--test',
    'postgres_transaction_integration',
    '--',
    'postgres_gateway_usage_recorder',
  ]);
  assert.deepEqual(
    module.postgresIntegrationCargoArgs(['postgres_gateway_usage_recorder', '--nocapture']),
    [
      'test',
      '-p',
      'sdkwork-claw-product',
      '--test',
      'postgres_generation_history_sql_contract',
      '--test',
      'postgres_transaction_integration',
      '--',
      'postgres_gateway_usage_recorder',
      '--nocapture',
    ],
  );
});

test('verification plan treats Rust warnings as compile failures', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );

  const plan = module.buildVerificationPlan(
    { skipRustTests: true, skipPythonTests: true, skipSchemaGate: true },
    { RUSTFLAGS: '-C debuginfo=0' },
  );
  const rustCheck = plan.find((step) => step.label === 'rust compile warnings gate');

  assert.equal(rustCheck.env.RUSTFLAGS, '-C debuginfo=0 -D warnings');
});

test('verification plan isolates cargo check and test targets from shared debug artifacts', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );

  const plan = module.buildVerificationPlan(
    {
      withEdgeDevSmoke: true,
      skipRustTests: false,
      skipPythonTests: true,
      skipSchemaGate: true,
    },
    {},
  );
  const rustCheck = plan.find((step) => step.label === 'rust compile warnings gate');
  const productionBuild = plan.find((step) => step.label === 'production artifact build');
  const edgeDevSmoke = plan.find((step) => step.label === 'edge dev server smoke');
  const edgeSmoke = plan.find((step) => step.label === 'portal production edge smoke');
  const rustWorkspaceTests = plan.find((step) => step.label === 'rust workspace tests');

  assert.equal(rustCheck.env.CARGO_TARGET_DIR, 'target-verify');
  assert.equal(edgeDevSmoke.env.CARGO_TARGET_DIR, 'target-verify');
  assert.equal(edgeSmoke.env.CARGO_TARGET_DIR, 'target-verify');
  assert.equal(rustWorkspaceTests.env.CARGO_TARGET_DIR, 'target-verify');
  assert.equal(productionBuild.env.CARGO_TARGET_DIR, undefined);
});

test('verification runner handles package-manager argument separators', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );

  assert.deepEqual(module.parseArgs(['--', '--dry-run']), {
    fast: false,
    withEdgeDevSmoke: false,
    skipEdgeDevSmoke: false,
    skipRustTests: false,
    skipPythonTests: false,
    skipSchemaGate: false,
    skipContractGuardians: false,
    dryRun: true,
    help: false,
  });
  assert.deepEqual(module.parseArgs(['--', '--with-edge-dev-smoke']).withEdgeDevSmoke, true);
  assert.deepEqual(module.parseArgs(['--', '--skip-edge-dev-smoke']).skipEdgeDevSmoke, true);
  assert.deepEqual(module.parseArgs(['--', '--skip-contract-guardians']).skipContractGuardians, true);
  assert.deepEqual(module.parseArgs(['--fast']), {
    fast: true,
    withEdgeDevSmoke: false,
    skipEdgeDevSmoke: false,
    skipRustTests: false,
    skipPythonTests: false,
    skipSchemaGate: false,
    skipContractGuardians: false,
    dryRun: false,
    help: false,
  });
});

test('fast verification plan keeps only low-cost Codex iteration checks', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );

  const plan = module.buildVerificationPlan({ fast: true }, {});
  const labels = plan.map((step) => step.label);
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);

  assert.deepEqual(labels, [
    'sdkwork-models catalog check',
    'app store seed check',
    'skills seed check',
    'tooling contract tests',
    'portal auth runtime tests',
    'frontend source hygiene tests',
  ]);
  assert.deepEqual(commandLines, [
    'pnpm.cmd models:check',
    'pnpm.cmd app-store:seed:check',
    'pnpm.cmd skills:seed:check',
    'node scripts/run-claw-router-product.test.mjs',
    'pnpm.cmd --dir apps/sdkwork-claw-router-portal exec tsx auth-runtime.test.ts',
    'python -B -m unittest tests.test_frontend_source_hygiene_standard',
  ]);
  assert.ok(!labels.includes('rust compile warnings gate'));
  assert.ok(!labels.includes('clawrouter generated SDK guard'));
  assert.ok(!labels.includes('portal vite config runtime tests'));
  assert.ok(!labels.includes('portal frontend typecheck'));
  assert.ok(!labels.includes('portal production build'));
  assert.ok(!labels.includes('portal production browser DOM smoke'));
  assert.ok(!labels.includes('edge dev server smoke'));
  assert.ok(!labels.includes('rust workspace tests'));
  assert.ok(!labels.includes('python standard tests'));
  assert.ok(!labels.includes('schema quality gate'));
});

test('verification plan skips edge dev server smoke by default', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: true, skipPythonTests: true, skipSchemaGate: true },
    {},
  );
  assert.ok(!plan.some((step) => step.label === 'edge dev server smoke'));
});

test('verification plan does not treat CI as implicit edge dev smoke opt-in', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: true, skipPythonTests: true, skipSchemaGate: true },
    { CI: 'true' },
  );
  assert.ok(!plan.some((step) => step.label === 'edge dev server smoke'));
});

test('verification plan can include edge dev server smoke through explicit environment opt-in', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: true, skipPythonTests: true, skipSchemaGate: true },
    { CLAWROUTER_VERIFY_EDGE_DEV_SMOKE: '1' },
  );
  assert.ok(plan.some((step) => step.label === 'edge dev server smoke'));
});

test('verification plan can include edge dev server smoke when explicitly requested', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    {
      withEdgeDevSmoke: true,
      skipRustTests: true,
      skipPythonTests: true,
      skipSchemaGate: true,
    },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const toolingIndex = plan.findIndex((step) => step.label === 'tooling contract tests');
  const viteConfigRuntimeIndex = plan.findIndex((step) => step.label === 'portal vite config runtime tests');
  const smokeIndex = plan.findIndex((step) => step.label === 'edge dev server smoke');
  const typecheckIndex = plan.findIndex((step) => step.label === 'portal frontend typecheck');
  const smokeSource = readFileSync(
    path.join(workspaceRoot, 'scripts', 'smoke-edge-dev-server.mjs'),
    'utf8',
  );
  const rootReadme = readFileSync(path.join(workspaceRoot, 'README.md'), 'utf8');
  const portalReadme = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'README.md'),
    'utf8',
  );

  assert.ok(smokeIndex > toolingIndex, 'edge dev smoke must run after launch-contract tests');
  assert.ok(smokeIndex > viteConfigRuntimeIndex, 'edge dev smoke must run after portal Vite config runtime tests');
  assert.ok(smokeIndex < typecheckIndex, 'edge dev smoke must run before artifact-only frontend checks');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/vite-config-runtime.test.ts',
  ));
  assert.ok(commandLines.includes('node scripts/smoke-edge-dev-server.mjs'));
  assert.ok(smokeSource.includes('pnpm dev'));
  assert.ok(smokeSource.includes('/healthz'));
  assert.ok(smokeSource.includes('/readyz'));
  assert.ok(smokeSource.includes('/openapi.json'));
  assert.ok(smokeSource.includes('/backend/v3/api/openapi.json'));
  assert.ok(smokeSource.includes('/app/v3/api/openapi.json'));
  assert.ok(smokeSource.includes('/runtime-env.js'));
  assert.ok(smokeSource.includes("label: 'direct portal gateway OpenAPI proxy'"));
  assert.ok(smokeSource.includes("label: 'direct portal backend OpenAPI proxy'"));
  assert.ok(smokeSource.includes("label: 'direct portal app OpenAPI proxy'"));
  assert.ok(smokeSource.includes('PORTAL_PUBLIC_API_BASE_URL=/v1'));
  assert.ok(smokeSource.includes('PORTAL_PUBLIC_BACKEND_API_BASE_URL=/backend/v3/api'));
  assert.ok(smokeSource.includes('PORTAL_PUBLIC_APP_API_BASE_URL=/app/v3/api'));
  assert.ok(
    smokeSource.includes("process.env.CLAWROUTER_EDGE_DEV_SMOKE_TIMEOUT_MS ?? '900000'"),
    'edge dev smoke default timeout must allow full seed install and five Rust services to start on Windows',
  );
  assert.ok(smokeSource.includes('CLAWROUTER_EDGE_DEV_SMOKE_REQUIRED'));
  assert.ok(smokeSource.includes('[edge-dev-smoke] skipped: ${diagnostic}'));
  assert.ok(smokeSource.includes('requires this smoke to launch real processes'));
  assert.ok(smokeSource.includes('local shell or CI runner that permits Node child_process.spawn'));
  assert.ok(smokeSource.includes('isProcessSpawnPermissionError(exit.error)'));
  assert.match(smokeSource, /taskkill/u);
  assert.match(smokeSource, /killProcessTree/u);
  assert.ok(rootReadme.includes('pnpm.cmd smoke:dev'));
  assert.ok(rootReadme.includes('Direct Portal Gateway API Proxy'));
  assert.ok(rootReadme.includes('Direct Portal App API OpenAPI Proxy'));
  assert.ok(rootReadme.includes('CLAWROUTER_EDGE_DEV_SMOKE_REQUIRED="1"'));
  assert.ok(rootReadme.includes('--with-edge-dev-smoke'));
  assert.ok(portalReadme.includes('pnpm.cmd smoke:dev'));
  assert.ok(portalReadme.includes('Direct Portal Gateway API Proxy'));
  assert.ok(portalReadme.includes('Direct Portal App API OpenAPI Proxy'));
  assert.ok(portalReadme.includes('CLAWROUTER_EDGE_DEV_SMOKE_REQUIRED="1"'));
});

test('edge dev smoke validates the current gateway and surface OpenAPI contract shapes', () => {
  const smokeSource = readFileSync(
    path.join(workspaceRoot, 'scripts', 'smoke-edge-dev-server.mjs'),
    'utf8',
  );
  const gatewayOpenApi = JSON.parse(
    readFileSync(path.join(portalRoot, 'public', 'openapi.json'), 'utf8'),
  );
  const backendOpenApi = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'generated', 'openapi', 'clawrouter-backend-openapi.json'), 'utf8'),
  );
  const appOpenApi = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'generated', 'openapi', 'clawrouter-app-openapi.json'), 'utf8'),
  );

  assert.equal(gatewayOpenApi.openapi, '3.0.3');
  assert.equal(gatewayOpenApi.info?.title, 'Claw Router Open API');
  assert.equal(gatewayOpenApi['x-api-prefix'], '/v1');
  for (const apiPath of [
    '/v1/models',
    '/v1/chat/completions',
    '/v1/responses',
    '/google/v1beta/models/{model}:generateContent',
  ]) {
    assert.ok(gatewayOpenApi.paths?.[apiPath], `gateway OpenAPI must expose ${apiPath}`);
    assert.ok(
      smokeSource.includes(`payload.paths?.['${apiPath}']`),
      `edge dev smoke must validate ${apiPath}`,
    );
  }
  assert.ok(smokeSource.includes("payload.openapi !== '3.0.3'"));
  assert.ok(smokeSource.includes("payload.info?.title !== 'Claw Router Open API'"));
  assert.ok(smokeSource.includes("payload['x-api-prefix'] !== '/v1'"));

  const surfaceAssertionStart = smokeSource.indexOf('function assertSurfaceOpenApi');
  const surfaceAssertionEnd = smokeSource.indexOf('function assertPortalHtml');
  assert.ok(surfaceAssertionStart >= 0, 'edge dev smoke must define surface OpenAPI validation');
  assert.ok(surfaceAssertionEnd > surfaceAssertionStart, 'surface OpenAPI validation must stay isolated');
  const surfaceAssertionSource = smokeSource.slice(surfaceAssertionStart, surfaceAssertionEnd);
  assert.ok(
    !surfaceAssertionSource.includes('x-api-prefix'),
    'app/backend SDK surface validation must not use URL prefix as SDK ownership signal',
  );
  assert.ok(
    !surfaceAssertionSource.includes("payload.openapi !== '3.0.3'"),
    'app/backend SDK surface validation must accept current OpenAPI 3.x contracts',
  );
  assert.ok(surfaceAssertionSource.includes('expectedTitle'));
  assert.ok(surfaceAssertionSource.includes('requiredPaths'));

  for (const contract of [
    {
      openApi: backendOpenApi,
      expectedTitle: 'SDKWork Claw Router Backend API',
      requiredPaths: [
        '/backend/v3/api/ai/model_vendors',
        '/backend/v3/api/billing/recharges/packages',
        '/backend/v3/api/ecosystem/skills',
      ],
    },
    {
      openApi: appOpenApi,
      expectedTitle: 'SDKWork Claw Router App API',
      requiredPaths: [
        '/app/v3/api/platform/apps/store',
        '/app/v3/api/ecosystem/skills',
        '/app/v3/api/billing/account/points/recharges/packages',
      ],
    },
  ]) {
    assert.match(String(contract.openApi.openapi ?? ''), /^3\./u);
    assert.equal(contract.openApi.info?.title, contract.expectedTitle);
    assert.ok(
      smokeSource.includes(`expectedTitle: '${contract.expectedTitle}'`),
      `edge dev smoke must validate ${contract.expectedTitle}`,
    );
    for (const apiPath of contract.requiredPaths) {
      assert.ok(contract.openApi.paths?.[apiPath], `${contract.expectedTitle} must expose ${apiPath}`);
      assert.ok(
        smokeSource.includes(`'${apiPath}'`),
        `edge dev smoke must validate ${apiPath}`,
      );
    }
  }
});

test('edge dev smoke isolates SQLite and validates public app and skills browse data', () => {
  const smokeSource = readFileSync(
    path.join(workspaceRoot, 'scripts', 'smoke-edge-dev-server.mjs'),
    'utf8',
  );

  assert.ok(smokeSource.includes('isolatedSmokeDatabaseUrl()'));
  assert.ok(smokeSource.includes("'--database-url'"));
  assert.match(smokeSource, /path\.join\(\s*'target',\s*'dev-smoke',/u);
  assert.ok(smokeSource.includes('/app/v3/api/platform/apps/store/categories'));
  assert.ok(smokeSource.includes('/app/v3/api/platform/apps/store?q=sdkwork-claw-router&page=1&page_size=6'));
  assert.ok(smokeSource.includes('/app/v3/api/ecosystem/skills/categories'));
  assert.ok(smokeSource.includes('/app/v3/api/ecosystem/skills?q=prompt&page=1&page_size=6'));
  assert.ok(smokeSource.includes('assertPublicBrowseEnvelope'));
  assert.ok(smokeSource.includes('SDKWork Claw Router'));
  assert.ok(smokeSource.includes('Prompt Optimizer'));
  assert.ok(smokeSource.includes('must not require authorization'));
});

test('verification plan can skip edge dev server smoke for constrained environments', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    {
      skipEdgeDevSmoke: true,
      skipRustTests: true,
      skipPythonTests: true,
      skipSchemaGate: true,
    },
    {},
  );

  assert.ok(!plan.some((step) => step.label === 'edge dev server smoke'));
});

test('workspace cleanup plan defaults to rebuildable local artifacts only', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'clean-claw-router-workspace.mjs')).href
  );

  assert.deepEqual(module.parseArgs(['--dry-run', '--rust-target', '--node-modules']), {
    dryRun: true,
    rustTarget: true,
    nodeModules: true,
    help: false,
  });

  const plan = module.buildCleanPlan({ workspaceRoot });
  const relativePaths = plan.map((entry) => entry.relativePath);

  assert.ok(relativePaths.includes('.tmp'));
  assert.ok(relativePaths.includes('.pytest_cache'));
  assert.ok(relativePaths.includes('.mypy_cache'));
  assert.ok(relativePaths.includes('.ruff_cache'));
  assert.ok(relativePaths.includes(path.join('apps', 'sdkwork-claw-router-portal', '.turbo')));
  assert.ok(relativePaths.includes(path.join('apps', 'sdkwork-claw-router-portal', 'dist')));
  assert.ok(!relativePaths.includes('target'));
  assert.ok(!relativePaths.includes(path.join('apps', 'sdkwork-claw-router-portal', 'node_modules')));

  const deepPlan = module.buildCleanPlan({
    workspaceRoot,
    rustTarget: true,
    nodeModules: true,
  });
  const deepRelativePaths = deepPlan.map((entry) => entry.relativePath);

  assert.ok(deepRelativePaths.includes('target'));
  assert.ok(deepRelativePaths.includes(path.join('apps', 'sdkwork-claw-router-portal', 'node_modules')));
});

test('release preflight parser supports strict, json, dry-run, and root cleanliness options', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'release-preflight.mjs')).href
  );

  assert.deepEqual(module.parseArgs(['--strict', '--json', '--dry-run', '--strict-root-clean']), {
    strict: true,
    json: true,
    dryRun: true,
    strictRootClean: true,
    help: false,
  });
  assert.deepEqual(module.parseArgs(['--', '--json']), {
    strict: false,
    json: true,
    dryRun: false,
    strictRootClean: false,
    help: false,
  });
});

test('release preflight parses main origin counts as local ahead then remote ahead', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'release-preflight.mjs')).href
  );

  assert.deepEqual(module.parseMainOriginCounts('2\t3'), {
    ahead: 2,
    behind: 3,
  });
});

test('release preflight documents child process probe requirements', () => {
  const rootReadme = readFileSync(path.join(workspaceRoot, 'README.md'), 'utf8');
  const releasePreflightSection = rootReadme.slice(
    rootReadme.indexOf('## Release Preflight'),
    rootReadme.indexOf('## Production Browser Smoke'),
  );
  const normalizedSection = releasePreflightSection.replace(/\s+/g, ' ');

  assert.ok(releasePreflightSection.includes('`runtime.childProcess`'));
  assert.ok(releasePreflightSection.includes('child_process.spawn'));
  assert.ok(releasePreflightSection.includes('spawn EPERM'));
  assert.ok(normalizedSection.includes('local shell or CI runner'));
  assert.ok(normalizedSection.includes('Git, tool availability, and Git object IO footprint checks are downgraded to warnings'));
});

test('release preflight dry-run reports plan-only probes without factual cleanliness claims', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'release-preflight.mjs')).href
  );

  const result = module.buildReleasePreflightReport({
    settings: module.parseArgs(['--dry-run']),
    platform: 'win32',
    env: {},
    probes: module.buildDryRunProbes('win32'),
  });
  const byId = Object.fromEntries(result.checks.map((check) => [check.id, check]));

  assert.equal(result.exitCode, 0);
  assert.equal(byId['runtime.childProcess'].status, 'WARN');
  assert.ok(byId['runtime.childProcess'].details.includes('dry-run: child process execution was not probed'));
  assert.equal(byId['git.branch'].status, 'WARN');
  assert.equal(byId['git.sync'].status, 'WARN');
  assert.equal(byId['git.appClean'].status, 'WARN');
  assert.equal(byId['git.rootClean'].status, 'WARN');
  assert.ok(byId['git.branch'].details.includes('dry-run: current branch was not probed'));
  assert.ok(byId['git.appClean'].details.includes('dry-run: application worktree was not probed'));
  assert.equal(byId['tools.git'].status, 'WARN');
  assert.equal(byId['tools.node'].status, 'WARN');
  assert.equal(byId['tools.pnpm'].status, 'WARN');
  assert.equal(byId['tools.cargo'].status, 'WARN');
  assert.equal(byId['tools.python'].status, 'WARN');
  assert.ok(byId['tools.pnpm'].details.includes('dry-run: would run pnpm.cmd --version'));
  assert.equal(byId['io.codexSessions'].status, 'WARN');
  assert.equal(byId['io.gitObjects'].status, 'WARN');
  assert.ok(byId['io.gitObjects'].details.includes('dry-run: Git object IO footprint was not probed'));
});

test('release preflight dry-run probe collector reuses plan-only semantics', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'release-preflight.mjs')).href
  );

  const probes = await module.collectReleasePreflightProbes({
    workspaceRoot,
    platform: 'win32',
    dryRun: true,
  });

  assert.deepEqual(probes, module.buildDryRunProbes('win32'));
  assert.equal(probes.childProcessProbe.status, 'DRY_RUN');
  assert.equal(probes.commandVersions.pnpm, 'dry-run: would run pnpm.cmd --version');
});

test('release preflight defaults missing staging environment to warnings', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'release-preflight.mjs')).href
  );

  const result = module.buildReleasePreflightReport({
    settings: module.parseArgs([]),
    platform: 'win32',
    env: {},
    probes: {
      branch: 'main',
      mainOriginCounts: { behind: 0, ahead: 0 },
      appStatusLines: [],
      rootStatusLines: [' M spring-ai-plus-business/apps/other-app'],
      commandVersions: {
        git: 'git version 2.51.0',
        node: 'v24.11.1',
        pnpm: '10.33.0',
        cargo: 'cargo 1.92.0',
        python: 'Python 3.13.7',
      },
      codexSessionStats: { count: 8, totalBytes: 349 * 1024 * 1024 },
      gitObjectHealth: { count: 0, size: '0 bytes', inPack: 100, sizePack: '20 MiB' },
    },
  });

  const byId = Object.fromEntries(result.checks.map((check) => [check.id, check]));

  assert.equal(result.exitCode, 0);
  assert.equal(byId['git.branch'].status, 'PASS');
  assert.equal(byId['git.sync'].status, 'PASS');
  assert.equal(byId['git.appClean'].status, 'PASS');
  assert.equal(byId['git.rootClean'].status, 'WARN');
  assert.equal(byId['env.postgres'].status, 'WARN');
  assert.equal(byId['env.portalPublic'].status, 'WARN');
  assert.equal(byId['io.codexSessions'].status, 'PASS');
  assert.equal(byId['io.gitObjects'].status, 'PASS');
  assert.deepEqual(result.recommendedCommands, [
    'pnpm.cmd models:check',
    'pnpm.cmd verify',
    'pnpm.cmd test:postgres:required',
    'pnpm.cmd server:plan',
    'pnpm.cmd clean:fast -- --dry-run',
  ]);
});

test('release preflight strict mode fails missing release environment and app dirty state', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'release-preflight.mjs')).href
  );

  const result = module.buildReleasePreflightReport({
    settings: module.parseArgs(['--strict']),
    platform: 'linux',
    env: {
      PORTAL_PUBLIC_API_BASE_URL: 'https://api.example.com',
      PORTAL_PUBLIC_APP_API_BASE_URL: 'https://api.example.com/app/v3/api',
    },
    probes: {
      branch: 'feature/preflight',
      mainOriginCounts: { behind: 1, ahead: 0 },
      appStatusLines: [' M scripts/release-preflight.mjs'],
      rootStatusLines: [' M spring-ai-plus-business/apps/sdkwork-claw-router/scripts/release-preflight.mjs'],
      commandVersions: {
        git: 'git version 2.51.0',
        node: 'v24.11.1',
        pnpm: '10.33.0',
        cargo: '',
        python: 'Python 3.13.7',
      },
      codexSessionStats: { count: 18, totalBytes: 2_200 * 1024 * 1024 },
      gitObjectHealth: { count: 5000, size: '950 MiB', inPack: 100, sizePack: '3 GiB' },
    },
  });

  const byId = Object.fromEntries(result.checks.map((check) => [check.id, check]));

  assert.equal(result.exitCode, 1);
  assert.equal(byId['git.branch'].status, 'FAIL');
  assert.equal(byId['git.sync'].status, 'FAIL');
  assert.equal(byId['git.appClean'].status, 'FAIL');
  assert.equal(byId['tools.cargo'].status, 'FAIL');
  assert.equal(byId['env.postgres'].status, 'FAIL');
  assert.equal(byId['env.portalPublic'].status, 'FAIL');
  assert.equal(byId['io.codexSessions'].status, 'WARN');
  assert.equal(byId['io.gitObjects'].status, 'WARN');
  assert.ok(byId['env.portalPublic'].details.includes('PORTAL_PUBLIC_BACKEND_API_BASE_URL'));
  assert.ok(byId['env.portalPublic'].details.includes('PORTAL_PUBLIC_TOOL_API_ENABLED'));
});

test('release preflight json output is machine readable', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'release-preflight.mjs')).href
  );

  const result = module.buildReleasePreflightReport({
    settings: module.parseArgs(['--json']),
    platform: 'linux',
    env: {
      SDKWORK_CLAW_POSTGRES_TEST_DATABASE_URL: 'postgres://example',
      PORTAL_PUBLIC_API_BASE_URL: 'https://api.example.com',
      PORTAL_PUBLIC_APP_API_BASE_URL: 'https://api.example.com/app/v3/api',
      PORTAL_PUBLIC_BACKEND_API_BASE_URL: 'https://api.example.com/backend/v3/api',
      PORTAL_PUBLIC_TOOL_API_ENABLED: 'false',
    },
    probes: {
      branch: 'main',
      mainOriginCounts: { behind: 0, ahead: 0 },
      appStatusLines: [],
      rootStatusLines: [],
      commandVersions: {
        git: 'git version 2.51.0',
        node: 'v24.11.1',
        pnpm: '10.33.0',
        cargo: 'cargo 1.92.0',
        python: 'Python 3.13.7',
      },
      codexSessionStats: { count: 0, totalBytes: 0 },
      gitObjectHealth: { count: 0, size: '0 bytes', inPack: 1, sizePack: '1 MiB' },
    },
  });
  const parsed = JSON.parse(module.formatReport(result, { json: true }));

  assert.equal(parsed.summary.fail, 0);
  assert.equal(parsed.summary.warn, 0);
  assert.equal(parsed.summary.pass, parsed.checks.length);
  assert.equal(parsed.recommendedCommands[0], 'pnpm models:check');
  assert.equal(parsed.recommendedCommands[1], 'pnpm verify');
});

test('release preflight report builder handles missing probes defensively', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'release-preflight.mjs')).href
  );

  const result = module.buildReleasePreflightReport({
    settings: module.parseArgs([]),
    platform: 'linux',
    env: {},
  });

  assert.equal(result.exitCode, 1);
  assert.equal(result.checks.find((check) => check.id === 'git.branch').status, 'FAIL');
  assert.equal(result.checks.find((check) => check.id === 'tools.git').status, 'FAIL');
  assert.equal(result.checks.find((check) => check.id === 'io.codexSessions').status, 'PASS');
});

test('release preflight reports blocked child process probes without misdiagnosing PATH', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'release-preflight.mjs')).href
  );

  const result = module.buildReleasePreflightReport({
    settings: module.parseArgs([]),
    platform: 'win32',
    env: {},
    probes: {
      childProcessProbe: {
        status: 'BLOCKED',
        details: 'child process execution is not available in this environment: spawn EPERM',
      },
      branch: '',
      mainOriginCounts: { behind: 0, ahead: 0 },
      appStatusLines: [],
      rootStatusLines: [],
      commandVersions: {
        git: '',
        node: '',
        pnpm: '',
        cargo: '',
        python: '',
      },
      codexSessionStats: { count: 0, totalBytes: 0 },
      gitObjectHealth: { count: 0, size: '0 bytes', inPack: 0, sizePack: '0 bytes' },
    },
  });

  const byId = Object.fromEntries(result.checks.map((check) => [check.id, check]));

  assert.equal(result.exitCode, 1);
  assert.equal(byId['runtime.childProcess'].status, 'FAIL');
  assert.ok(byId['runtime.childProcess'].details.includes('spawn EPERM'));
  assert.ok(byId['runtime.childProcess'].recommendation.includes('permits Node child_process'));
  assert.equal(byId['git.branch'].status, 'WARN');
  assert.equal(byId['git.sync'].status, 'WARN');
  assert.equal(byId['git.appClean'].status, 'WARN');
  assert.equal(byId['git.rootClean'].status, 'WARN');
  assert.ok(byId['git.sync'].details.includes('not probed because child process execution is blocked'));
  assert.ok(byId['git.appClean'].details.includes('not probed because child process execution is blocked'));
  assert.ok(byId['git.rootClean'].details.includes('not probed because child process execution is blocked'));
  assert.equal(byId['tools.git'].status, 'WARN');
  assert.equal(byId['tools.node'].status, 'WARN');
  assert.equal(byId['tools.pnpm'].status, 'WARN');
  assert.equal(byId['tools.cargo'].status, 'WARN');
  assert.equal(byId['tools.python'].status, 'WARN');
  assert.ok(byId['tools.git'].details.includes('not probed because child process execution is blocked'));
  assert.equal(byId['io.gitObjects'].status, 'WARN');
  assert.ok(byId['io.gitObjects'].details.includes('not probed because child process execution is blocked'));
});

test('release preflight reports late blocked tool probes without stringifying probe objects', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'release-preflight.mjs')).href
  );

  const result = module.buildReleasePreflightReport({
    settings: module.parseArgs([]),
    platform: 'win32',
    env: {},
    probes: {
      childProcessProbe: {
        status: 'PASS',
        details: 'child process execution is available',
      },
      branch: 'main',
      mainOriginCounts: { behind: 0, ahead: 0 },
      appStatusLines: [],
      rootStatusLines: [],
      commandVersions: {
        git: 'git version 2.51.0',
        node: 'v24.11.1',
        pnpm: {
          blocked: true,
          details: 'child process execution is not available in this environment: spawn EPERM',
        },
        cargo: 'cargo 1.92.0',
        python: 'Python 3.13.7',
      },
      codexSessionStats: { count: 0, totalBytes: 0 },
      gitObjectHealth: { count: 0, size: '0 bytes', inPack: 0, sizePack: '0 bytes' },
    },
  });

  const byId = Object.fromEntries(result.checks.map((check) => [check.id, check]));

  assert.equal(result.exitCode, 1);
  assert.equal(byId['runtime.childProcess'].status, 'FAIL');
  assert.ok(byId['runtime.childProcess'].details.includes('spawn EPERM'));
  assert.equal(byId['tools.pnpm'].status, 'WARN');
  assert.ok(byId['tools.pnpm'].details.includes('not probed because child process execution is blocked'));
  assert.ok(!byId['tools.pnpm'].details.includes('[object Object]'));
  assert.equal(byId['tools.git'].status, 'WARN');
  assert.equal(byId['git.branch'].status, 'WARN');
  assert.equal(byId['io.gitObjects'].status, 'WARN');
});

test('verification plan includes all commercial contract guardians before tests', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );

  const plan = module.buildVerificationPlan(
    {
      withEdgeDevSmoke: true,
      skipRustTests: true,
      skipPythonTests: true,
      skipSchemaGate: true,
    },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);

  assert.deepEqual(commandLines.slice(3, 18), [
    'node scripts/run-claw-router-product.test.mjs',
    'python -B -m tools.clawrouter_sdk_guardian',
    'python -B -m tools.clawrouter_skill_guardian',
    'python -B -m tools.architecture_standard_guardian',
    'python -B -m tools.rust_backend_architecture_guardian',
    'python -B -m tools.clawrouter_gateway_openapi_generator --check',
    'python -B -m tools.clawrouter_openapi_precision_audit',
    'python -B -m tools.clawrouter_payload_sdk_audit',
    'python -B -m tools.frontend_static_source_manifest --check',
    'python -B -m tools.frontend_contract_guardian',
    'python -B -m tools.schema_guardian',
    'python -B -m tools.flyway_schema_contract_audit',
    'python -B -m tools.frontend_operation_audit',
    'python -B -m tools.frontend_field_audit',
    'python -B -m tools.java_legacy_contract_audit',
  ]);
});

test('verification plan verifies production portal through Rust edge server without Node server tests', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    {
      withEdgeDevSmoke: true,
      skipRustTests: true,
      skipPythonTests: true,
      skipSchemaGate: true,
    },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);

  assert.ok(commandLines.includes(
    'cargo test -p sdkwork-claw-gateway --test edge_server edge_server_can_serve_portal_dist_without_node_server',
  ));
  assert.ok(!commandLines.some((commandLine) => commandLine.includes('server.test.ts')));
  assert.ok(!commandLines.some((commandLine) => commandLine.includes('smoke-production-server.mjs')));
});

test('verification plan runs frontend source hygiene before portal build', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    {
      withEdgeDevSmoke: true,
      skipRustTests: true,
      skipPythonTests: true,
      skipSchemaGate: true,
    },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const hygieneIndex = plan.findIndex((step) => step.label === 'frontend source hygiene tests');
  const typecheckIndex = plan.findIndex((step) => step.label === 'portal frontend typecheck');
  const buildIndex = plan.findIndex((step) => step.label === 'production artifact build');

  assert.ok(hygieneIndex > -1, 'frontend source hygiene must be part of the product verification plan');
  assert.ok(hygieneIndex < typecheckIndex, 'source hygiene must fail before expensive portal typecheck');
  assert.ok(hygieneIndex < buildIndex, 'source hygiene must fail before production build');
  assert.ok(commandLines.includes(
    'python -B -m unittest tests.test_frontend_source_hygiene_standard',
  ));
});

test('verification plan validates portal Vite config before dev smoke and build', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    {
      withEdgeDevSmoke: true,
      skipRustTests: true,
      skipPythonTests: true,
      skipSchemaGate: true,
    },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const hygieneIndex = plan.findIndex((step) => step.label === 'frontend source hygiene tests');
  const viteConfigRuntimeIndex = plan.findIndex((step) => step.label === 'portal vite config runtime tests');
  const smokeIndex = plan.findIndex((step) => step.label === 'edge dev server smoke');
  const typecheckIndex = plan.findIndex((step) => step.label === 'portal frontend typecheck');
  const buildIndex = plan.findIndex((step) => step.label === 'production artifact build');

  assert.ok(viteConfigRuntimeIndex > hygieneIndex, 'portal Vite config runtime tests must run after source hygiene');
  assert.ok(viteConfigRuntimeIndex < smokeIndex, 'portal Vite config runtime tests must run before edge dev smoke');
  assert.ok(viteConfigRuntimeIndex < typecheckIndex, 'portal Vite config runtime tests must run before frontend typecheck');
  assert.ok(viteConfigRuntimeIndex < buildIndex, 'portal Vite config runtime tests must run before production build');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/vite-config-runtime.test.ts',
  ));
});

test('portal service command results must not fabricate returned entities from empty objects', () => {
  const serviceRoot = path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'packages');
  const serviceFiles = [
    'sdkwork-claw-router-admin-announcement/src/announcementService.ts',
    'sdkwork-claw-router-admin-channel/src/channelService.ts',
    'sdkwork-claw-router-admin-group/src/groupService.ts',
    'sdkwork-claw-router-admin-marketing/src/marketingService.ts',
    'sdkwork-claw-router-admin-model/src/modelService.ts',
    'sdkwork-claw-router-admin-ratelimit/src/ratelimitService.ts',
    'sdkwork-claw-router-admin-user/src/userService.ts',
  ];

  for (const relativeFile of serviceFiles) {
    const source = readFileSync(path.join(serviceRoot, relativeFile), 'utf8');
    assert.doesNotMatch(
      source,
      /readApiItem\([^)]*\)\s*\?\?\s*\{\}/u,
      `${relativeFile} must use readRequiredApiItem for command responses that require returned entities`,
    );
    assert.doesNotMatch(
      source,
      /normalize[A-Za-z0-9_]+\([^)]*\?\?\s*\{\}\)/u,
      `${relativeFile} must not normalize missing command data into an empty entity`,
    );
  }
});

test('portal admin update commands must require returned entities instead of silent null success', () => {
  const serviceRoot = path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'packages');
  const serviceFiles = [
    'sdkwork-claw-router-admin-announcement/src/announcementService.ts',
    'sdkwork-claw-router-admin-channel/src/channelService.ts',
    'sdkwork-claw-router-admin-group/src/groupService.ts',
    'sdkwork-claw-router-admin-user/src/userService.ts',
  ];

  for (const relativeFile of serviceFiles) {
    const source = readFileSync(path.join(serviceRoot, relativeFile), 'utf8');
    assert.doesNotMatch(
      source,
      /Promise<[^>\n]*\|\s*null>/u,
      `${relativeFile} update command APIs must fail closed when required returned entities are missing`,
    );
    assert.doesNotMatch(
      source,
      /return\s+item\s*\?\s*normalize[A-Za-z0-9_]+\([^)]*\)\s*:\s*null/u,
      `${relativeFile} must not treat missing update response entities as successful null results`,
    );
  }
});

test('portal channel test commands must require returned channel entities', () => {
  const serviceRoot = path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'packages');
  const serviceFiles = [
    'sdkwork-claw-router-admin-channel/src/channelService.ts',
    'sdkwork-claw-router-console-routing/src/routingService.ts',
  ];

  for (const relativeFile of serviceFiles) {
    const source = readFileSync(path.join(serviceRoot, relativeFile), 'utf8');
    assert.doesNotMatch(
      source,
      /normalize[A-Za-z0-9_]+\(\s*isRecord\([^)]*\)\s*\?\s*[^:]+:\s*\{\}\s*\)/u,
      `${relativeFile} must fail closed when channel test responses omit item data`,
    );
    assert.match(
      source,
      /readRequiredApiItem\([^)]*test response is missing channel data/u,
      `${relativeFile} must use readRequiredApiItem for channel test response item data`,
    );
  }
});

test('portal mutable entity services must require backend stable ids', () => {
  const portalRoot = path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal');
  const commonsSource = readFileSync(
    path.join(portalRoot, 'packages', 'sdkwork-claw-router-commons', 'src', 'api-result.ts'),
    'utf8',
  );
  const guardedServices = [
    {
      file: path.join('sdkwork-claw-router-admin-group', 'src', 'groupService.ts'),
      requiredMessages: ['Group id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-admin-channel', 'src', 'channelService.ts'),
      requiredMessages: ['Channel id is required', 'Provider credential id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-console-routing', 'src', 'routingService.ts'),
      requiredMessages: ['Routing channel id is required'],
      forbidden: [
        /id:\s*readFirstString\([^)]*providerCode/u,
        /id:\s*readFirstString\([^)]*channelCode[^)]*,\s*providerCode/u,
      ],
    },
    {
      file: path.join('sdkwork-claw-router-admin-user', 'src', 'userService.ts'),
      requiredMessages: ['User id is required', 'API key id is required'],
      forbidden: [/id:\s*readNumber\(item,\s*['"]id['"]\)/u, /id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-admin-model', 'src', 'modelService.ts'),
      requiredMessages: ['Vendor id is required', 'Model id is required', 'Model vendor id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u, /vendorId:\s*readString\(item,\s*['"]vendorId['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-admin-ratelimit', 'src', 'ratelimitService.ts'),
      requiredMessages: [
        'IP limit id is required',
        'Token limit id is required',
        'Model limit id is required',
        'Firewall rule id is required',
      ],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-admin-marketing', 'src', 'marketingService.ts'),
      requiredMessages: [
        'Coupon id is required',
        'Coupon batch id is required',
        'Promo code id is required',
        'Redemption record id is required',
        'Recharge record id is required',
        'Referral stat id is required',
      ],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-admin-announcement', 'src', 'announcementService.ts'),
      requiredMessages: ['Announcement id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-admin-dashboard', 'src', 'dashboardService.ts'),
      requiredMessages: ['Recent usage trace id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-admin-finance', 'src', 'financeService.ts'),
      requiredMessages: ['Transaction id is required', 'Billing record id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-admin-monitor', 'src', 'monitorService.ts'),
      requiredMessages: ['System node id is required', 'Alert id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-admin-record', 'src', 'recordService.ts'),
      requiredMessages: ['Log record id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-console-billing', 'src', 'billingService.ts'),
      requiredMessages: ['Redeem history id is required', 'Recharge history id is required'],
      forbidden: [/id:\s*readNumber\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-console-providers', 'src', 'providerService.ts'),
      requiredMessages: ['Provider id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-console-recharge', 'src', 'rechargeService.ts'),
      requiredMessages: ['Recharge package id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-console-settlements', 'src', 'settlementsService.ts'),
      requiredMessages: ['Settlement bill id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
    {
      file: path.join('sdkwork-claw-router-console-usage', 'src', 'usageService.ts'),
      requiredMessages: ['Usage log id is required'],
      forbidden: [/id:\s*readString\(item,\s*['"]id['"]\)/u],
    },
  ];

  assert.match(
    commonsSource,
    /export function readRequiredString\(record: ApiRecord, key: string, message: string\): string/u,
    'shared API result boundary must expose required stable string validation',
  );

  for (const service of guardedServices) {
    const source = readFileSync(path.join(portalRoot, 'packages', service.file), 'utf8');
    for (const message of service.requiredMessages) {
      assert.ok(
        source.includes(`readRequiredString(item, 'id', '${message}')`)
          || source.includes(`readRequiredNumber(item, 'id', '${message}')`)
          || source.includes(`readRequiredString(item, 'vendorId', '${message}')`)
          || source.includes(`readRequiredString(item, 'couponId', '${message}')`)
          || source.includes(`readRequiredString(item, 'batchId', '${message}')`)
          || source.includes(`readRequiredAnyString(item, ['id', 'uuid', 'channelCode', 'channel_code'], '${message}')`),
        `${service.file} must fail closed with "${message}" when backend omits a stable id`,
      );
    }
    for (const pattern of service.forbidden) {
      assert.doesNotMatch(
        source,
        pattern,
        `${service.file} must not fabricate mutable entity ids from optional or display fields`,
      );
    }
  }
});

test('portal dev scripts run Vite without a Node server entrypoint', () => {
  const portalPackage = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'package.json'), 'utf8'),
  );
  const viteConfig = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'vite.config.ts'),
    'utf8',
  );

  assert.equal(portalPackage.scripts.dev, 'pnpm deps:check && vite --configLoader native');
  assert.equal(portalPackage.scripts['browser:dev'], 'pnpm deps:check && vite --configLoader native');
  assert.equal(portalPackage.scripts.preview, 'vite preview --configLoader native');
  assert.equal(
    portalPackage.scripts.typecheck,
    'tsc -p tsconfig.typecheck.json --noEmit',
    'portal typecheck must use the portal-only TypeScript project',
  );
  assert.equal(
    portalPackage.scripts.lint,
    'tsc -p tsconfig.typecheck.json --noEmit',
    'portal lint must use the portal-only TypeScript project',
  );
  assert.ok(!portalPackage.scripts.dev.includes('tsx'));
  assert.ok(portalPackage.scripts.dev.includes('--configLoader native'));
  assert.ok(!portalPackage.scripts['browser:dev'].includes('tsx'));
  assert.ok(portalPackage.scripts['browser:dev'].includes('--configLoader native'));
  assert.ok(portalPackage.scripts.preview.includes('--configLoader native'));
  assert.ok(!JSON.stringify(portalPackage.scripts).includes('server.ts'));
  assert.match(viteConfig, /host:\s*resolvePortalDevHost\(process\.env\)/u);
  assert.ok(viteConfig.includes('configureServer(server)'));
  assert.ok(viteConfig.includes("order: 'post'"));
  assert.ok(viteConfig.includes('type="module" src="${RUNTIME_ENV_SCRIPT_PATH}"'));
  assert.ok(viteConfig.includes('PORTAL_PUBLIC_API_BASE_URL'));
  assert.ok(viteConfig.includes('PORTAL_PUBLIC_APP_API_BASE_URL'));
  assert.ok(viteConfig.includes('PORTAL_PUBLIC_BACKEND_API_BASE_URL'));
  assert.ok(viteConfig.includes('optimizeDeps'));
  assert.ok(viteConfig.includes("'sdkwork-claw-router-api-reference'"));
  assert.ok(viteConfig.includes("'sdkwork-claw-router-sdk-reference'"));
});

test('portal typecheck project does not compile external appbase or UI source', () => {
  const portalPackage = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'package.json'), 'utf8'),
  );
  const typecheckConfig = JSON.parse(
    readFileSync(path.join(portalRoot, 'tsconfig.typecheck.json'), 'utf8'),
  );
  const typecheckShims = readFileSync(
    path.join(portalRoot, 'src', 'typecheck-shims.d.ts'),
    'utf8',
  );
  const packageTypecheckConfig = JSON.parse(
    readFileSync(path.join(portalRoot, 'packages', 'tsconfig.json'), 'utf8'),
  );
  const runtimeTsconfig = readFileSync(path.join(portalRoot, 'tsconfig.json'), 'utf8');

  assert.equal(portalPackage.scripts.typecheck, 'tsc -p tsconfig.typecheck.json --noEmit');
  assert.deepEqual(typecheckConfig.include, [
    'src/**/*.ts',
    'src/**/*.tsx',
    'packages/*/src/**/*.ts',
    'packages/*/src/**/*.tsx',
  ]);
  assert.equal(packageTypecheckConfig.extends, '../tsconfig.typecheck.json');
  assert.deepEqual(packageTypecheckConfig.include, [
    '../src/typecheck-shims.d.ts',
    '*/src/**/*.ts',
    '*/src/**/*.tsx',
  ]);
  assert.ok(typecheckConfig.exclude.includes('../../../sdkwork-appbase/**'));
  assert.ok(typecheckConfig.exclude.includes('../../../sdkwork-ui/**'));
  assert.ok(packageTypecheckConfig.exclude.includes('../../../../sdkwork-appbase/**'));
  assert.ok(packageTypecheckConfig.exclude.includes('../../../../sdkwork-ui/**'));
  assert.match(
    runtimeTsconfig,
    /sdkwork-appbase\/packages\/pc-react\/content\/sdkwork-generation-pc-react\/src\/index\.ts/u,
    'runtime tsconfig keeps source aliases for Vite dev/build',
  );
  for (const [specifier, target] of Object.entries(typecheckConfig.compilerOptions.paths)) {
    assert.ok(
      target.every((entry) => !entry.includes('../../../sdkwork-appbase/') && !entry.includes('../../../sdkwork-ui/')),
      `${specifier} must not resolve to external workspace source during portal typecheck`,
    );
  }
  for (const moduleName of [
    '@sdkwork/auth-pc-react',
    '@sdkwork/generation-pc-react',
    '@sdkwork/host-tauri-pc-react',
    '@sdkwork/iam-runtime',
    '@sdkwork/iam-service',
  ]) {
    assert.match(
      typecheckShims,
      new RegExp(`declare module ['"]${moduleName.replaceAll('/', '\\/')}['"]`, 'u'),
      `${moduleName} must have a portal-local typecheck shim`,
    );
  }
});

test('portal workspace packages declare ESM module metadata', () => {
  const packagesRoot = path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'packages');
  const packageNames = [
    'sdkwork-claw-router-admin-announcement',
    'sdkwork-claw-router-admin-channel',
    'sdkwork-claw-router-admin-dashboard',
    'sdkwork-claw-router-admin-finance',
    'sdkwork-claw-router-admin-group',
    'sdkwork-claw-router-admin-marketing',
    'sdkwork-claw-router-admin-model',
    'sdkwork-claw-router-admin-monitor',
    'sdkwork-claw-router-admin-ratelimit',
    'sdkwork-claw-router-admin-record',
    'sdkwork-claw-router-admin-user',
    'sdkwork-claw-router-api-reference',
    'sdkwork-claw-router-app-center',
    'sdkwork-claw-router-commons',
    'sdkwork-claw-router-console-account',
    'sdkwork-claw-router-console-api-keys',
    'sdkwork-claw-router-console-billing',
    'sdkwork-claw-router-console-core',
    'sdkwork-claw-router-console-dashboard',
    'sdkwork-claw-router-console-gateway',
    'sdkwork-claw-router-console-messages',
    'sdkwork-claw-router-console-providers',
    'sdkwork-claw-router-console-recharge',
    'sdkwork-claw-router-console-routing',
    'sdkwork-claw-router-console-settings',
    'sdkwork-claw-router-console-settlements',
    'sdkwork-claw-router-console-usage',
    'sdkwork-claw-router-console-user',
    'sdkwork-claw-router-core',
    'sdkwork-claw-router-courses',
    'sdkwork-claw-router-forum',
    'sdkwork-claw-router-home',
    'sdkwork-claw-router-i18n',
    'sdkwork-claw-router-models',
    'sdkwork-claw-router-playground',
    'sdkwork-claw-router-rankings',
    'sdkwork-claw-router-sdk-reference',
    'sdkwork-claw-router-skills-hub',
    'sdkwork-claw-router-types',
  ];

  for (const packageName of packageNames) {
    const packageJson = JSON.parse(
      readFileSync(path.join(packagesRoot, packageName, 'package.json'), 'utf8'),
    );

    assert.equal(packageJson.type, 'module', `${packageName} must declare type=module`);
  }
});

test('portal commons package exposes runtime subpath for ESM and SSR tooling', () => {
  const packageJson = JSON.parse(
    readFileSync(
      path.join(
        workspaceRoot,
        'apps',
        'sdkwork-claw-router-portal',
        'packages',
        'sdkwork-claw-router-commons',
        'package.json',
      ),
      'utf8',
    ),
  );

  assert.deepEqual(packageJson.exports['.'], {
    types: './src/index.ts',
    import: './src/index.ts',
    require: './src/index.ts',
    default: './src/index.ts',
  });
  assert.deepEqual(packageJson.exports['./runtime'], {
    types: './src/runtime.ts',
    import: './src/runtime.ts',
    require: './src/runtime.ts',
    default: './src/runtime.ts',
  });
});

test('standalone portal Vite dev server defaults to direct port 3901', () => {
  const viteConfig = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'vite.config.ts'),
    'utf8',
  );

  assert.match(viteConfig, /DEFAULT_PORTAL_DEV_PORT\s*=\s*3901/u);
  assert.match(viteConfig, /port:\s*resolvePortalDevPort\(/u);
  assert.match(viteConfig, /strictPort:\s*true/u);
});

test('standalone portal Vite dev server proxies same-origin API paths to Rust services', () => {
  const viteConfig = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'vite.config.ts'),
    'utf8',
  );

  assert.ok(viteConfig.includes('resolvePortalDevProxy'));
  assert.ok(viteConfig.includes('PORTAL_DEV_PROXY_GATEWAY_TARGET'));
  assert.ok(viteConfig.includes('PORTAL_DEV_PROXY_BACKEND_API_TARGET'));
  assert.ok(viteConfig.includes('PORTAL_DEV_PROXY_APP_API_TARGET'));
  assert.ok(viteConfig.includes("'/v1'"));
  assert.ok(viteConfig.includes("'/backend/v3/api'"));
  assert.ok(viteConfig.includes("'/app/v3/api'"));
  assert.match(viteConfig, /changeOrigin:\s*true/u);
  assert.match(viteConfig, /secure:\s*true/u);
  assert.match(viteConfig, /ws:\s*false/u);
});

test('portal build script uses native Vite config loading', () => {
  const portalPackage = JSON.parse(
    readFileSync(path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'package.json'), 'utf8'),
  );
  const buildScript = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'scripts', 'build-portal.mjs'),
    'utf8',
  );

  assert.equal(portalPackage.scripts.build, 'pnpm deps:check && node scripts/build-portal.mjs');
  assert.match(buildScript, /process\.env\.NODE_ENV\s*=\s*['"]production['"]/);
  assert.doesNotMatch(buildScript, /import\s*\{\s*build\s*\}\s*from\s*['"]vite['"]/);
  assert.match(buildScript, /await import\(['"]vite['"]\)/);
  assert.match(buildScript, /configLoader:\s*['"]native['"]/);
  assert.doesNotMatch(buildScript, /buildServer\(\)/);
  assert.doesNotMatch(buildScript, /build-server\.mjs/);
});

test('verification plan includes portal frontend typecheck', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: true, skipPythonTests: true, skipSchemaGate: true },
    {},
  );

  const portalTypecheck = plan.find((step) => step.label === 'portal frontend typecheck');
  const sdkBuilds = [
    ['app SDK runtime build', ['--dir', 'sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript', 'build']],
    ['backend SDK runtime build', ['--dir', 'sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript', 'build']],
    ['open SDK runtime build', ['--dir', 'sdks/clawrouter-open-sdk/clawrouter-open-sdk-typescript', 'build']],
  ];
  assert.ok(portalTypecheck);
  const portalTypecheckIndex = plan.indexOf(portalTypecheck);
  for (const [label, expectedArgs] of sdkBuilds) {
    const sdkBuild = plan.find((step) => step.label === label);
    assert.ok(sdkBuild, `${label} must run before portal frontend typecheck`);
    assert.ok(
      plan.indexOf(sdkBuild) < portalTypecheckIndex,
      `${label} must refresh package dist before portal packages resolve SDK types`,
    );
    assert.deepEqual(sdkBuild.args, expectedArgs);
  }
  assert.deepEqual(portalTypecheck.args, [
    '--dir',
    'apps/sdkwork-claw-router-portal',
    'typecheck',
  ]);
  assert.equal(module.pnpmCommand('win32'), 'pnpm.cmd');
  assert.equal(module.pnpmCommand('linux'), 'pnpm');
});

test('verification plan includes production artifact build and bundle budget audit', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: true, skipPythonTests: true, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const typecheckIndex = plan.findIndex((step) => step.label === 'portal frontend typecheck');
  const buildIndex = plan.findIndex((step) => step.label === 'production artifact build');
  const budgetIndex = plan.findIndex((step) => step.label === 'portal bundle budget audit');

  assert.ok(buildIndex > typecheckIndex, 'production build must run after portal typecheck');
  assert.ok(budgetIndex > buildIndex, 'bundle budget audit must inspect fresh production artifacts');
  assert.ok(commandLines.includes(
    `${module.pnpmCommand()} build`,
  ));
  assert.ok(commandLines.includes(
    'node apps/sdkwork-claw-router-portal/scripts/audit-bundle-budget.mjs',
  ));
});

test('verification plan includes portal production edge smoke after artifact audits', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: true, skipPythonTests: true, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const edgeServerSource = readFileSync(
    path.join(workspaceRoot, 'services', 'sdkwork-claw-gateway', 'src', 'edge_server.rs'),
    'utf8',
  );
  const budgetIndex = plan.findIndex((step) => step.label === 'portal bundle budget audit');
  const smokeIndex = plan.findIndex((step) => step.label === 'portal production edge smoke');
  const browserSmokeIndex = plan.findIndex((step) => step.label === 'portal production browser DOM smoke');

  assert.ok(smokeIndex > budgetIndex, 'production edge smoke must inspect the audited artifact');
  assert.ok(browserSmokeIndex > smokeIndex, 'browser DOM smoke must run after production edge smoke');
  assert.ok(commandLines.includes(
    'cargo test -p sdkwork-claw-gateway --test edge_server edge_server_can_serve_portal_dist_without_node_server',
  ));
  assert.ok(edgeServerSource.includes('with_portal_static_dist'));
  assert.ok(edgeServerSource.includes('runtime-env.js'));
  assert.ok(edgeServerSource.includes('path.starts_with("/api/")'));
});

test('verification plan includes real browser DOM smoke after production HTTP smoke', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: true, skipPythonTests: true, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const edgeSmokeIndex = plan.findIndex((step) => step.label === 'portal production edge smoke');
  const browserSmokeIndex = plan.findIndex((step) => step.label === 'portal production browser DOM smoke');
  const browserSmokeSource = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'scripts', 'smoke-production-browser.mjs'),
    'utf8',
  );
  const apiEndpointViewSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-api-reference',
      'src',
      'components',
      'ApiEndpointView.tsx',
    ),
    'utf8',
  );
  const codeSnippetClientSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-api-reference',
      'src',
      'codeSnippetClient.ts',
    ),
    'utf8',
  );

  assert.ok(browserSmokeIndex > edgeSmokeIndex, 'browser DOM smoke must run after Rust edge production smoke');
  assert.ok(commandLines.includes(
    'node apps/sdkwork-claw-router-portal/scripts/smoke-production-browser.mjs',
  ));
  assert.match(browserSmokeSource, /Chrome DevTools Protocol/);
  assert.match(browserSmokeSource, /findChromeExecutable/);
  assert.match(browserSmokeSource, /spawnRustEdgeServer/);
  assert.match(browserSmokeSource, /processSpawnPermissionDiagnostic/);
  assert.doesNotMatch(browserSmokeSource, /process\.env\.TOOL_API_ENABLED/);
  assert.match(browserSmokeSource, /verifyRuntimeEnvironment/);
  assert.match(browserSmokeSource, /verifyRouteDom/);
  assert.match(browserSmokeSource, /Runtime\.exceptionThrown/);
  assert.match(browserSmokeSource, /Log\.entryAdded/);
  assert.match(browserSmokeSource, /captureRouteSetupDiagnostics/);
  assert.match(browserSmokeSource, /setup expression \$\{index \+ 1\}/);
  assert.match(browserSmokeSource, /activeEndpointHeading/);
  assert.match(browserSmokeSource, /clickRoutePlaygroundTabByExactText\("Authorization"\)/);
  assert.match(browserSmokeSource, /Auth Type/);
  assert.match(browserSmokeSource, /input\[placeholder="Key"\]/);
  assert.match(browserSmokeSource, /API PLAYGROUND/);
  assert.match(browserSmokeSource, /REQ/);
  assert.match(browserSmokeSource, /bodyTextIncludesExpression\("Browser smoke playground response"\)/);
  assert.match(browserSmokeSource, /bodyTextIncludesExpression\("Browser smoke API key auth response"\)/);
  const playgroundSendRouteSource = browserSmokeSource.slice(
    browserSmokeSource.indexOf('pathName: "/api-reference?__browser-smoke-playground-send=1"'),
    browserSmokeSource.indexOf('pathName: "/api-reference?__browser-smoke-playground-primitive-response=1"'),
  );
  const playgroundApiKeyAuthRouteSource = browserSmokeSource.slice(
    browserSmokeSource.indexOf('pathName: "/api-reference?__browser-smoke-playground-api-key-auth=1"'),
    browserSmokeSource.indexOf('pathName: "/api-reference?__browser-smoke-playground-network-error=1"'),
  );
  assert.ok(playgroundSendRouteSource.includes('clickRouteResponseTabByExactText("Headers")'));
  assert.ok(playgroundSendRouteSource.includes('bodyTextIncludesExpression("Browser smoke playground response")'));
  const playgroundSendRequiredTextTokensSource = playgroundSendRouteSource.match(
    /requiredTextTokens:\s*\[([\s\S]*?)\],\s*requiredDomExpressions:/,
  )?.[1] ?? '';
  assert.doesNotMatch(playgroundSendRequiredTextTokensSource, /Browser smoke playground response/);
  assert.ok(playgroundApiKeyAuthRouteSource.includes('clickRouteResponseTabByExactText("Headers")'));
  assert.ok(playgroundApiKeyAuthRouteSource.includes('bodyTextIncludesExpression("Browser smoke API key auth response")'));
  const playgroundApiKeyAuthRequiredTextTokensSource = playgroundApiKeyAuthRouteSource.match(
    /requiredTextTokens:\s*\[([\s\S]*?)\],\s*requiredDomExpressions:/,
  )?.[1] ?? '';
  assert.doesNotMatch(playgroundApiKeyAuthRequiredTextTokensSource, /Browser smoke API key auth response/);
  const playgroundSendDownloadRouteSource = browserSmokeSource.slice(
    browserSmokeSource.indexOf('pathName: "/api-reference?__browser-smoke-playground-send-download=1"'),
    browserSmokeSource.indexOf('pathName: "/api-reference?__browser-smoke-playground-api-key-auth=1"'),
  );
  const playgroundSendDownloadRequiredTextTokensSource = playgroundSendDownloadRouteSource.match(
    /requiredTextTokens:\s*\[([\s\S]*?)\],\s*requiredDomExpressions:/,
  )?.[1] ?? '';
  assert.ok(playgroundSendDownloadRouteSource.includes('clickRouteButtonByExactText("Send and Download")'));
  assert.ok(playgroundSendDownloadRouteSource.includes('window.__BROWSER_SMOKE_DOWNLOAD__?.text?.includes("Browser smoke playground response")'));
  assert.doesNotMatch(playgroundSendDownloadRequiredTextTokensSource, /Send and Download/);
  assert.match(browserSmokeSource, /apiPlaygroundFixtureMode === API_PLAYGROUND_NETWORK_FAILURE_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /Failed to load resource: net::ERR_CONNECTION_FAILED/);
  assert.match(browserSmokeSource, /CLAWROUTER_BROWSER_SMOKE_REQUIRED/);
  assert.match(browserSmokeSource, /child process spawn is not available in this environment/);
  assert.match(browserSmokeSource, /local shell or CI runner that permits Node child_process.spawn/);
  assert.match(browserSmokeSource, /browserSmokeStartupErrorKind = isProcessSpawnPermissionError\(error\) \? "spawnPermission" : "process"/);
  assert.match(browserSmokeSource, /CLAWROUTER_BROWSER_DEBUG_PORT/);
  assert.match(browserSmokeSource, /skipBrowserSmoke/);
  assert.match(browserSmokeSource, /addEventListener/);
  assert.doesNotMatch(browserSmokeSource, /\.once\(["']open["']/);
  assert.doesNotMatch(browserSmokeSource, /\.on\(["']message["']/);
  assert.match(browserSmokeSource, /--lang=en-US/);
  assert.match(browserSmokeSource, /Emulation\.setLocaleOverride/);
  assert.match(browserSmokeSource, /Emulation\.setUserAgentOverride/);
  assert.match(browserSmokeSource, /PORTAL_PUBLIC_APP_API_BASE_URL/);
  assert.match(browserSmokeSource, /previousPublicAppApiBaseUrl/);
  assert.match(browserSmokeSource, /VITE_CLAWROUTER_APP_API_BASE_URL/);
  assert.match(browserSmokeSource, /const BROWSER_SMOKE_ROUTES = \[/);
  assert.match(browserSmokeSource, /for \(const route of BROWSER_SMOKE_ROUTES\)/);
  const defaultModelsRouteSource = browserSmokeSource.slice(
    browserSmokeSource.indexOf('pathName: "/models"'),
    browserSmokeSource.indexOf('pathName: "/models/openai%2Fglobal%2Fgpt-5.5-pro"'),
  );
  const defaultModelDetailRouteSource = browserSmokeSource.slice(
    browserSmokeSource.indexOf('pathName: "/models/openai%2Fglobal%2Fgpt-5.5-pro"'),
    browserSmokeSource.indexOf('pathName: "/models?__browser-smoke-runtime=1"'),
  );
  assert.match(defaultModelsRouteSource, /appSdkFixtureMode: APP_SDK_MODEL_FIXTURE_MODE/);
  assert.match(defaultModelDetailRouteSource, /appSdkFixtureMode: APP_SDK_MODEL_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /\/models\/openai%2Fglobal%2Fgpt-5\.5-pro/);
  assert.match(browserSmokeSource, /GPT-5\.5 Pro/);
  assert.match(browserSmokeSource, /Claude Opus 4\.7/);
  assert.ok(browserSmokeSource.includes('/models?__browser-smoke-runtime=1'));
  assert.ok(browserSmokeSource.includes('/models?__browser-smoke-groups=1'));
  assert.ok(browserSmokeSource.includes('/models?__browser-smoke-empty-runtime=1'));
  assert.ok(browserSmokeSource.includes('/models/newvendor%2Fglobal%2Fruntime-good?__browser-smoke-detail=1'));
  assert.match(browserSmokeSource, /BROWSER_SMOKE_MODEL_RECORDS/);
  assert.match(browserSmokeSource, /APP_SDK_MODEL_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /APP_SDK_MODEL_EMPTY_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /app\/v3\/api\/ai\/models/);
  assert.match(browserSmokeSource, /Runtime Good/);
  assert.match(browserSmokeSource, /Runtime Enterprise/);
  assert.match(browserSmokeSource, /Runtime Unpriced/);
  assert.match(browserSmokeSource, /Runtime model catalog filter/);
  assert.match(browserSmokeSource, /Enterprise exclusive/);
  assert.match(browserSmokeSource, /Try in Playground/);
  assert.match(browserSmokeSource, /CATALOG REFERENCE VALUES/);
  assert.match(browserSmokeSource, /REFERENCE \/ 1M TOKENS/);
  assert.match(browserSmokeSource, /UNAVAILABLE/);
  assert.match(browserSmokeSource, /Price is unavailable for the selected billing meter\./);
  assert.match(browserSmokeSource, /clickRouteModelCardByName\("Runtime Good"\)/);
  assert.match(browserSmokeSource, /clickRouteFilterLabelByText\("Enterprise exclusive"\)/);
  assert.match(browserSmokeSource, /setRouteTextInputByPlaceholder\("Search models\.\.\.", "no-match-runtime-model"\)/);
  assert.match(browserSmokeSource, /lowestUpstreamCostUnitPrice/);
  assert.match(browserSmokeSource, /customerUnitPrice/);
  assert.match(browserSmokeSource, /grossMarginPerUnit/);
  assert.match(browserSmokeSource, /\/rankings/);
  assert.match(browserSmokeSource, /Published catalog benchmark/);
  assert.match(browserSmokeSource, /Snapshot Benchmark/);
  assert.match(browserSmokeSource, /\/courses/);
  assert.match(browserSmokeSource, /\/courses\/c1/);
  assert.ok(browserSmokeSource.includes('/courses?__browser-smoke-category=1'));
  assert.ok(browserSmokeSource.includes('/courses?__browser-smoke-level=1'));
  assert.ok(browserSmokeSource.includes('/courses?__browser-smoke-search=1'));
  assert.ok(browserSmokeSource.includes('/courses?__browser-smoke-card-click=1'));
  assert.ok(browserSmokeSource.includes('/courses/c1?__browser-smoke-detail=1'));
  assert.ok(browserSmokeSource.includes('/courses/c1?__browser-smoke-lesson-grid=1'));
  assert.ok(browserSmokeSource.includes('/courses/c1?__browser-smoke-related=1'));
  assert.ok(browserSmokeSource.includes('/courses/__browser-smoke-missing'));
  const coursesSmokeStart = browserSmokeSource.indexOf('pathName: "/courses"');
  const forumSmokeStart = browserSmokeSource.indexOf('pathName: "/forum"');
  assert.ok(coursesSmokeStart >= 0);
  assert.ok(forumSmokeStart > coursesSmokeStart);
  const coursesSmokeSource = browserSmokeSource.slice(coursesSmokeStart, forumSmokeStart);
  assert.equal(
    coursesSmokeSource.match(/appSdkFixtureMode: APP_SDK_FIXTURE_MODE/g)?.length ?? 0,
    10,
    'production browser course smoke routes must use app SDK fixtures instead of live app API targets',
  );
  assert.match(browserSmokeSource, /BROWSER_SMOKE_COURSE_RECORDS/);
  assert.match(browserSmokeSource, /function resolveCourseAppSdkFixture\(request\)/);
  assert.match(browserSmokeSource, /method !== "GET"/);
  assert.match(browserSmokeSource, /pathName === "\/app\/v3\/api\/courses"/);
  assert.match(browserSmokeSource, /browserSmokeCourseListResponse\(parsedUrl\.searchParams\)/);
  assert.match(browserSmokeSource, /pathName === "\/app\/v3\/api\/courses\/categories"/);
  assert.match(browserSmokeSource, /BROWSER_SMOKE_COURSE_CATEGORIES/);
  assert.match(browserSmokeSource, /pathName === "\/app\/v3\/api\/courses\/overview"/);
  assert.match(browserSmokeSource, /browserSmokeCourseOverviewResponse\(\)/);
  assert.match(browserSmokeSource, /pathName\.startsWith\("\/app\/v3\/api\/courses\/"\)/);
  assert.match(browserSmokeSource, /browserSmokeCourseDetailResponse\(courseId\)/);
  assert.match(browserSmokeSource, /const courseFixture = resolveCourseAppSdkFixture\(request\)/);
  assert.match(browserSmokeSource, /Master Claw Router/);
  assert.match(browserSmokeSource, /Featured Courses/);
  assert.match(browserSmokeSource, /Claw Router Fundamentals: Zero to Hero/);
  assert.match(browserSmokeSource, /ABOUT THIS COURSE/);
  assert.match(browserSmokeSource, /Curated course content snapshot/);
  assert.match(browserSmokeSource, /Advanced API Architecture and Design/);
  assert.match(browserSmokeSource, /Authentication and Authorization Flows/);
  assert.match(browserSmokeSource, /Microservices and Distributed Tracing/);
  assert.match(browserSmokeSource, /Course not found\./);
  assert.match(browserSmokeSource, /Add a constructive course comment/);
  assert.match(browserSmokeSource, /Select lesson/);
  assert.match(browserSmokeSource, /Lesson grid/);
  assert.match(browserSmokeSource, /BV1GJ411x7h7/);
  assert.match(browserSmokeSource, /player\.bilibili\.com\/player\.html/);
  assert.match(browserSmokeSource, /clickRouteCourseFilterButtonByText\("Architecture"\)/);
  assert.match(browserSmokeSource, /clickRouteCourseFilterButtonByText\("Advanced"\)/);
  assert.match(browserSmokeSource, /clickRouteCourseCardByTitle\("Claw Router Fundamentals: Zero to Hero"\)/);
  assert.match(browserSmokeSource, /clickRouteCourseRelatedLinkByTitle\("Advanced API Architecture and Design"\)/);
  assert.match(browserSmokeSource, /setRouteTextInputByPlaceholder\("Search courses\.\.\.", "security"\)/);
  assert.match(browserSmokeSource, /clickRouteButtonByTitle\("Lesson grid"\)/);
  assert.match(browserSmokeSource, /iframe\[src\^="https:\/\/player\.bilibili\.com\/player\.html"\]/);
  assert.match(browserSmokeSource, /javascript:alert\(1\)/);
  assert.match(browserSmokeSource, /toLocaleDateString/);
  assert.match(browserSmokeSource, /Math\.random/);
  assert.match(browserSmokeSource, /\/forum/);
  assert.ok(browserSmokeSource.includes('/forum?__browser-smoke-live-empty=1'));
  assert.ok(browserSmokeSource.includes('/forum/__browser-smoke-missing'));
  const appSmokeStart = browserSmokeSource.indexOf('pathName: "/apps"');
  assert.ok(appSmokeStart > forumSmokeStart);
  const forumSmokeSource = browserSmokeSource.slice(forumSmokeStart, appSmokeStart);
  assert.equal(
    forumSmokeSource.match(/appSdkFixtureMode: APP_SDK_FIXTURE_MODE/g)?.length ?? 0,
    0,
  );
  assert.doesNotMatch(browserSmokeSource, /function resolveForumAppSdkFixture/);
  assert.doesNotMatch(browserSmokeSource, /\bBROWSER_SMOKE_FORUM_FEEDS\b/);
  assert.doesNotMatch(browserSmokeSource, /\bBROWSER_SMOKE_FORUM_COMMENTS_BY_FEED_ID\b/);
  assert.doesNotMatch(browserSmokeSource, /i\.pravatar/);
  assert.match(browserSmokeSource, /Developer Community/);
  assert.match(browserSmokeSource, /Live community feed/);
  assert.doesNotMatch(browserSmokeSource, /Published snapshot/);
  assert.doesNotMatch(browserSmokeSource, /How to optimize routing performance in the latest release\?/);
  assert.doesNotMatch(browserSmokeSource, /Best practices for organizing large API specs/);
  assert.doesNotMatch(browserSmokeSource, /Introducing the new Middleware Hooks/);
  assert.doesNotMatch(browserSmokeSource, /How should API keys be rotated across environments\?/);
  assert.match(browserSmokeSource, /Discussion not found\./);
  assert.match(browserSmokeSource, /No discussions found/);
  assert.match(browserSmokeSource, /Community links are not configured\./);
  assert.match(browserSmokeSource, /\/apps/);
  assert.match(browserSmokeSource, /\/apps\/app-1/);
  assert.match(browserSmokeSource, /APP_SDK_FAILURE_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /Browser smoke apps unavailable/);
  assert.match(browserSmokeSource, /Browser smoke app details unavailable/);
  assert.match(browserSmokeSource, /Apps could not be loaded/);
  assert.match(browserSmokeSource, /App details could not be loaded/);
  assert.match(browserSmokeSource, /\/apps\/__browser-smoke-success/);
  assert.match(browserSmokeSource, /Browser Smoke App/);
  assert.match(browserSmokeSource, /browser-smoke-app-web/);
  assert.match(browserSmokeSource, /https:\/\/apps\.example\.test\/browser-smoke-app/);
  assert.match(browserSmokeSource, /\/apps\?__browser-smoke-empty/);
  assert.match(browserSmokeSource, /No apps found/);
  assert.match(browserSmokeSource, /no-match-browser-smoke-app/);
  assert.match(browserSmokeSource, /\/apps\/__browser-smoke-missing/);
  assert.match(browserSmokeSource, /App not found/);
  assert.match(browserSmokeSource, /App categories could not be loaded/);
  assert.match(browserSmokeSource, /Browser smoke app categories unavailable/);
  assert.match(browserSmokeSource, /\/apps\?__browser-smoke-retry/);
  assert.match(browserSmokeSource, /Browser smoke apps transient failure/);
  assert.match(browserSmokeSource, /\/skills-hub/);
  assert.match(browserSmokeSource, /\/skills-hub\/skill-1/);
  assert.match(browserSmokeSource, /Browser smoke skills unavailable/);
  assert.match(browserSmokeSource, /Browser smoke skill details unavailable/);
  assert.match(browserSmokeSource, /Skills could not be loaded/);
  assert.match(browserSmokeSource, /Skill details could not be loaded/);
  assert.match(browserSmokeSource, /\/skills-hub\/__browser-smoke-success/);
  assert.match(browserSmokeSource, /Browser Smoke Skill/);
  assert.match(browserSmokeSource, /clawhub\.io\/sdkwork\/browser-smoke-skill:v1\.0\.0/);
  assert.match(browserSmokeSource, /npx clawhub@latest install clawhub\.io\/sdkwork\/browser-smoke-skill:v1\.0\.0/);
  assert.match(browserSmokeSource, /\/skills-hub\?__browser-smoke-empty/);
  assert.match(browserSmokeSource, /No skills found/);
  assert.match(browserSmokeSource, /no-match-browser-smoke-skill/);
  assert.match(browserSmokeSource, /\/skills-hub\/__browser-smoke-missing/);
  assert.match(browserSmokeSource, /Skill not found/);
  assert.match(browserSmokeSource, /Skill categories could not be loaded/);
  assert.match(browserSmokeSource, /Browser smoke skill categories unavailable/);
  assert.match(browserSmokeSource, /\/skills-hub\?__browser-smoke-retry/);
  assert.match(browserSmokeSource, /Browser smoke skills transient failure/);
  assert.match(browserSmokeSource, /\/api-reference/);
  assert.ok(browserSmokeSource.includes('/api-reference?__browser-smoke-playground-validation=1'));
  assert.ok(browserSmokeSource.includes('/api-reference?__browser-smoke-playground-managed-header=1'));
  assert.ok(browserSmokeSource.includes('/api-reference?__browser-smoke-playground-send=1'));
  assert.ok(browserSmokeSource.includes('/api-reference?__browser-smoke-playground-primitive-response=1'));
  assert.ok(browserSmokeSource.includes('/api-reference?__browser-smoke-playground-send-download=1'));
  assert.ok(browserSmokeSource.includes('/api-reference?__browser-smoke-playground-drawer=1'));
  assert.ok(browserSmokeSource.includes('/api-reference?__browser-smoke-playground-api-key-auth=1'));
  assert.ok(browserSmokeSource.includes('/api-reference?__browser-smoke-playground-network-error=1'));
  assert.ok(browserSmokeSource.includes('/api-reference?__browser-smoke-tool-api-disabled=1'));
  assert.ok(browserSmokeSource.includes('/api-reference?__browser-smoke-code-snippet-tabs=1'));
  assert.match(browserSmokeSource, /API_PLAYGROUND_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /API_PLAYGROUND_PRIMITIVE_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /API_PLAYGROUND_AUTH_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /API_PLAYGROUND_NETWORK_FAILURE_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /createToolApiRequestCollector/);
  assert.match(browserSmokeSource, /toolApiRequestCollector\.register\(cdp\)/);
  assert.match(browserSmokeSource, /forbiddenToolApiPaths: \["\/api\/code-snippet"\]/);
  assert.match(browserSmokeSource, /Network\.requestWillBeSent/);
  assert.match(browserSmokeSource, /\/api\/code-snippet/);
  assert.match(browserSmokeSource, /CLAWROUTER_API_KEY/);
  assert.match(browserSmokeSource, /clickRouteCodeLanguageButtonByExactText\("typescript"\)/);
  assert.match(browserSmokeSource, /clickRouteCodeLibraryButtonByExactText\("fetch"\)/);
  assert.match(browserSmokeSource, /clickRouteButtonByTitle\("Copy code"\)/);
  assert.match(browserSmokeSource, /window\.__BROWSER_SMOKE_CLIPBOARD__\?\.includes\("await fetch"\)/);
  assert.match(browserSmokeSource, /window\.__BROWSER_SMOKE_CLIPBOARD__\?\.includes\("CLAWROUTER_API_KEY"\)/);
  assert.match(browserSmokeSource, /axios\.request/);
  assert.match(browserSmokeSource, /await fetch/);
  assert.match(apiEndpointViewSource, /buildStaticCodeSnippet\(request\)/);
  assert.match(codeSnippetClientSource, /export function buildStaticCodeSnippet/);
  assert.match(browserSmokeSource, /installApiPlaygroundFetchInterceptor/);
  assert.match(browserSmokeSource, /resolveApiPlaygroundFixture/);
  assert.match(browserSmokeSource, /selectRouteApiReferenceEndpointByName\("Retrieve Model"\)/);
  assert.match(browserSmokeSource, /selectRouteApiReferenceEndpointByName\("Create Chat Completion"\)/);
  assert.match(browserSmokeSource, /clickRouteButtonByExactText\("Try it out"\)/);
  assert.match(browserSmokeSource, /function clickRoutePlaygroundBulkEditForSection/);
  assert.match(browserSmokeSource, /clickRoutePlaygroundBulkEditForSection\("Headers"\)/);
  assert.match(browserSmokeSource, /clickRoutePlaygroundBulkEditForSection\("Query Params"\)/);
  assert.doesNotMatch(
    browserSmokeSource,
    /clickRoutePlaygroundTabByExactText\("Headers"\),\s*clickRouteButtonByExactText\("Bulk Edit"\)/,
  );
  assert.match(browserSmokeSource, /setRouteBulkEditValue/);
  assert.match(browserSmokeSource, /clickRouteButtonByExactText\("Key-Value Edit"\)/);
  assert.match(browserSmokeSource, /setRouteParamTableInput/);
  assert.match(browserSmokeSource, /setRouteTextareaValue/);
  assert.match(browserSmokeSource, /installRouteDownloadProbe/);
  assert.match(browserSmokeSource, /installRouteClipboardProbe/);
  assert.match(browserSmokeSource, /clickRouteButtonByTitle\("Copy Response"\)/);
  assert.match(browserSmokeSource, /clickRouteButtonByExactText\("Send and Download"\)/);
  assert.match(browserSmokeSource, /clickRouteButtonByTitle\("Close Drawer"\)/);
  assert.match(browserSmokeSource, /setRouteSelectValueByOptionText\("Bearer Token"\)/);
  assert.match(browserSmokeSource, /setRoutePasswordInputByPlaceholder\("Enter your API Key \(sk-\.\.\.\)", "browser-smoke-api-key"\)/);
  assert.match(browserSmokeSource, /clickRouteResponseTabByExactText\("Headers"\)/);
  assert.match(browserSmokeSource, /clickRouteResponseTabByExactText\("Raw"\)/);
  assert.match(browserSmokeSource, /playground-response-200-ok\.json/);
  assert.match(browserSmokeSource, /Validation Error/);
  assert.match(browserSmokeSource, /Managed Header/);
  assert.match(browserSmokeSource, /Browser smoke playground response/);
  assert.match(browserSmokeSource, /Browser smoke primitive response/);
  assert.match(browserSmokeSource, /Browser smoke API key auth response/);
  assert.match(browserSmokeSource, /Network Error/);
  assert.match(browserSmokeSource, /This might be a CORS issue/);
  assert.match(browserSmokeSource, /requestHeaderValue\(request, "authorization"\)/);
  assert.match(browserSmokeSource, /Bearer \$\{API_PLAYGROUND_EXPECTED_API_KEY\}/);
  assert.match(browserSmokeSource, /document\.body\.innerText\.includes\("browser-smoke-api-key"\)/);
  assert.match(browserSmokeSource, /window\.__BROWSER_SMOKE_CLIPBOARD__ === "null"/);
  assert.match(browserSmokeSource, /window\.__BROWSER_SMOKE_DOWNLOAD__\?\.text === "null"/);
  assert.match(browserSmokeSource, /Status:/);
  assert.match(browserSmokeSource, /200 OK/);
  assert.match(browserSmokeSource, /0 Network Error/);
  assert.match(browserSmokeSource, /Save Response/);
  assert.match(browserSmokeSource, /Send and Download/);
  assert.match(browserSmokeSource, /button\[title="Close Drawer"\]/);
  assert.match(browserSmokeSource, /max-w-\[100vw\]/);
  assert.match(browserSmokeSource, /content-type/);
  assert.match(browserSmokeSource, /const APP_SDK_BROWSER_FIXTURES = new Map/);
  assert.match(browserSmokeSource, /APP_SDK_EMPTY_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /APP_SDK_CATEGORY_FAILURE_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /APP_SDK_MISSING_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /APP_SDK_RETRY_FIXTURE_MODE/);
  assert.match(browserSmokeSource, /app\/v3\/api\/platform\/apps\/store/);
  assert.match(browserSmokeSource, /app\/v3\/api\/ecosystem\/skills/);
  assert.match(browserSmokeSource, /Fetch\.enable/);
  assert.match(browserSmokeSource, /Fetch\.requestPaused/);
  assert.match(browserSmokeSource, /Fetch\.fulfillRequest/);
  assert.match(browserSmokeSource, /Fetch\.failRequest/);
  assert.match(browserSmokeSource, /networkErrorReason: "ConnectionFailed"/);
  assert.match(browserSmokeSource, /errorReason: fixture\.networkErrorReason/);
  assert.match(browserSmokeSource, /application\/json/);
  assert.match(browserSmokeSource, /Buffer\.from\(typeof fixture\.body === "string" \? fixture\.body : JSON\.stringify\(fixture\.body\)\)\.toString\("base64"\)/);
  assert.match(browserSmokeSource, /installAppSdkFixtureInterceptor/);
  assert.match(browserSmokeSource, /resolveAppSdkFixture/);
  assert.match(browserSmokeSource, /waitForRouteTextTokens/);
  assert.match(browserSmokeSource, /forbiddenTextTokens/);
  assert.match(browserSmokeSource, /waitForRouteForbiddenTextTokens/);
  assert.match(browserSmokeSource, /HTMLInputElement\.prototype/);
  assert.match(browserSmokeSource, /dispatchEvent\(new Event\("input", \{ bubbles: true \}\)\)/);
  assert.match(browserSmokeSource, /clickRouteButtonByExactText/);
  assert.match(browserSmokeSource, /Array\.isArray\(requiredTextTokens\)/);
  assert.match(browserSmokeSource, /document\.body\.innerText/);
  assert.match(browserSmokeSource, /window\.__CLAWROUTER_ENV__/);
}
);

test('verification plan includes portal models runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const browserSmokeIndex = plan.findIndex((step) => step.label === 'portal production browser DOM smoke');
  const commonsRuntimeIndex = plan.findIndex((step) => step.label === 'portal commons runtime tests');
  const modelsRuntimeIndex = plan.findIndex((step) => step.label === 'portal models runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(modelsRuntimeIndex > browserSmokeIndex, 'models runtime tests must run after production browser smoke');
  assert.ok(modelsRuntimeIndex > commonsRuntimeIndex, 'models runtime tests must run after shared commons runtime tests');
  assert.ok(modelsRuntimeIndex < rustTestsIndex, 'models runtime tests must run before broad Rust tests');
  assert.ok(modelsRuntimeIndex < pythonTestsIndex, 'models runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/models-runtime.test.ts',
  ));
});

test('verification plan includes portal commons runtime tests before route runtime tests', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const browserSmokeIndex = plan.findIndex((step) => step.label === 'portal production browser DOM smoke');
  const commonsRuntimeIndex = plan.findIndex((step) => step.label === 'portal commons runtime tests');
  const modelsRuntimeIndex = plan.findIndex((step) => step.label === 'portal models runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(commonsRuntimeIndex > browserSmokeIndex, 'commons runtime tests must run after production browser smoke');
  assert.ok(commonsRuntimeIndex < modelsRuntimeIndex, 'commons runtime tests must run before route runtime tests that depend on shared request tokens');
  assert.ok(commonsRuntimeIndex < rustTestsIndex, 'commons runtime tests must run before broad Rust tests');
  assert.ok(commonsRuntimeIndex < pythonTestsIndex, 'commons runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/commons-runtime.test.ts',
  ));
});

test('verification plan includes portal auth runtime tests before route runtime tests', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const commonsRuntimeIndex = plan.findIndex((step) => step.label === 'portal commons runtime tests');
  const authRuntimeIndex = plan.findIndex((step) => step.label === 'portal auth runtime tests');
  const modelsRuntimeIndex = plan.findIndex((step) => step.label === 'portal models runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(authRuntimeIndex > commonsRuntimeIndex, 'auth runtime tests must run after shared commons runtime tests');
  assert.ok(authRuntimeIndex < modelsRuntimeIndex, 'auth runtime tests must run before public route runtime tests');
  assert.ok(authRuntimeIndex < rustTestsIndex, 'auth runtime tests must run before broad Rust tests');
  assert.ok(authRuntimeIndex < pythonTestsIndex, 'auth runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    `${module.pnpmCommand()} --dir apps/sdkwork-claw-router-portal exec tsx auth-runtime.test.ts`,
  ));
});

test('verification plan includes portal skills runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const forumRuntimeIndex = plan.findIndex((step) => step.label === 'portal forum runtime tests');
  const skillsRuntimeIndex = plan.findIndex((step) => step.label === 'portal skills runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(skillsRuntimeIndex > forumRuntimeIndex, 'skills runtime tests must run after existing public route runtime tests');
  assert.ok(skillsRuntimeIndex < rustTestsIndex, 'skills runtime tests must run before broad Rust tests');
  assert.ok(skillsRuntimeIndex < pythonTestsIndex, 'skills runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/skills-runtime.test.ts',
  ));
});

test('verification plan includes portal app center runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const skillsRuntimeIndex = plan.findIndex((step) => step.label === 'portal skills runtime tests');
  const appCenterRuntimeIndex = plan.findIndex((step) => step.label === 'portal app center runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(appCenterRuntimeIndex > skillsRuntimeIndex, 'app center runtime tests must run after existing public SDK route runtime tests');
  assert.ok(appCenterRuntimeIndex < rustTestsIndex, 'app center runtime tests must run before broad Rust tests');
  assert.ok(appCenterRuntimeIndex < pythonTestsIndex, 'app center runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/app-runtime.test.ts',
  ));
});

test('verification plan includes portal api reference playground runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const appCenterRuntimeIndex = plan.findIndex((step) => step.label === 'portal app center runtime tests');
  const apiReferenceRuntimeIndex = plan.findIndex((step) => step.label === 'portal api reference playground runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(apiReferenceRuntimeIndex > appCenterRuntimeIndex, 'api reference playground runtime tests must run after public SDK route runtime tests');
  assert.ok(apiReferenceRuntimeIndex < rustTestsIndex, 'api reference playground runtime tests must run before broad Rust tests');
  assert.ok(apiReferenceRuntimeIndex < pythonTestsIndex, 'api reference playground runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    `${module.pnpmCommand()} --dir apps/sdkwork-claw-router-portal exec tsx api-reference-playground-runtime.test.ts`,
  ));
});

test('verification plan includes portal api reference SSR smoke before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const apiReferenceRuntimeIndex = plan.findIndex((step) => step.label === 'portal api reference playground runtime tests');
  const apiReferenceSsrIndex = plan.findIndex((step) => step.label === 'portal api reference SSR smoke tests');
  const apiKeyRuntimeIndex = plan.findIndex((step) => step.label === 'portal api key runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(apiReferenceSsrIndex > apiReferenceRuntimeIndex, 'api reference SSR smoke must run after pure playground runtime tests');
  assert.ok(apiReferenceSsrIndex < apiKeyRuntimeIndex, 'api reference SSR smoke must run before console API key runtime tests');
  assert.ok(apiReferenceSsrIndex < rustTestsIndex, 'api reference SSR smoke must run before broad Rust tests');
  assert.ok(apiReferenceSsrIndex < pythonTestsIndex, 'api reference SSR smoke must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node apps/sdkwork-claw-router-portal/api-reference-ssr-smoke.test.cjs',
  ));
});

test('production browser smoke validates api reference route bundle semantics', () => {
  const smokeSource = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'scripts', 'smoke-production-browser.mjs'),
    'utf8',
  );
  const playgroundRowsSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-api-reference',
      'src',
      'apiPlaygroundRows.ts',
    ),
    'utf8',
  );
  const playgroundRequestSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-api-reference',
      'src',
      'playgroundRequest.ts',
    ),
    'utf8',
  );
  const playgroundSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-api-reference',
      'src',
      'components',
      'ApiPlayground.tsx',
    ),
    'utf8',
  );
  const playgroundDownloadSource = readFileSync(
    path.join(
      workspaceRoot,
      'apps',
      'sdkwork-claw-router-portal',
      'packages',
      'sdkwork-claw-router-api-reference',
      'src',
      'playgroundResponseDownload.ts',
    ),
    'utf8',
  );
  const apiReferenceSmokeStart = smokeSource.indexOf('pathName: "/api-reference"');
  const toolApiSmokeStart = smokeSource.indexOf('async function canBindPort');
  assert.notEqual(apiReferenceSmokeStart, -1);
  assert.notEqual(toolApiSmokeStart, -1);
  const apiReferenceSmokeSource = smokeSource.slice(apiReferenceSmokeStart, toolApiSmokeStart);

  assert.ok(smokeSource.includes('pathName: "/api-reference"'));
  assert.ok(apiReferenceSmokeSource.includes('/api-reference?__browser-smoke-playground-validation=1'));
  assert.ok(apiReferenceSmokeSource.includes('/api-reference?__browser-smoke-playground-managed-header=1'));
  assert.ok(apiReferenceSmokeSource.includes('/api-reference?__browser-smoke-playground-send=1'));
  assert.ok(apiReferenceSmokeSource.includes('/api-reference?__browser-smoke-tool-api-disabled=1'));
  assert.ok(playgroundRowsSource.includes('createApiPlaygroundInitialState'));
  assert.ok(playgroundRowsSource.includes('createApiPlaygroundInitialStateKey'));
  assert.ok(playgroundRowsSource.includes('extractApiPlaygroundPathTemplateVariables'));
  assert.ok(playgroundRowsSource.includes('parseApiPlaygroundBulkRows'));
  assert.ok(playgroundSource.includes('buildPlaygroundRequest'));
  assert.ok(playgroundRequestSource.includes('buildPlaygroundRequest'));
  assert.ok(playgroundRequestSource.includes('FORBIDDEN_HEADER_NAMES'));
  assert.ok(playgroundRequestSource.includes('Unresolved Path Variable'));
  assert.ok(playgroundRequestSource.includes('resolveRequiredErrorTab'));
  assert.ok(playgroundRequestSource.includes('content-type'));
  assert.ok(playgroundRequestSource.includes('Managed Header'));
  assert.ok(playgroundSource.includes('headers'));
  assert.ok(playgroundSource.includes('downloadApiPlaygroundResponse'));
  assert.ok(playgroundDownloadSource.includes('createApiPlaygroundResponseDownload'));
  assert.ok(playgroundDownloadSource.includes('serializeApiPlaygroundResponseData'));
  assert.ok(playgroundDownloadSource.includes('playground-response'));
  assert.ok(smokeSource.includes('Math.random'));
});

test('production browser smoke validates admin skill route through backend SDK fixtures', () => {
  const smokeSource = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'scripts', 'smoke-production-browser.mjs'),
    'utf8',
  );

  assert.ok(smokeSource.includes('BACKEND_SDK_SKILL_FIXTURE_MODE'));
  assert.ok(smokeSource.includes('/admin/skill?__browser-smoke-admin-skill=1'));
  assert.ok(smokeSource.includes('requiresPortalSession: true'));
  assert.ok(smokeSource.includes('sdkwork.clawRouter.appSession.v1'));
  assert.ok(smokeSource.includes('urlPattern: "*://*/backend/v3/api/*"'));
  assert.ok(smokeSource.includes('/backend/v3/api/ecosystem/skills/categories'));
  assert.ok(smokeSource.includes('/backend/v3/api/ecosystem/skills/package'));
  assert.ok(smokeSource.includes('/backend/v3/api/ecosystem/skills'));
  assert.ok(smokeSource.includes('Browser Smoke Admin Skill'));
});

test('production browser smoke validates admin app route through backend SDK fixtures', () => {
  const smokeSource = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'scripts', 'smoke-production-browser.mjs'),
    'utf8',
  );

  assert.ok(smokeSource.includes('BACKEND_SDK_APP_FIXTURE_MODE'));
  assert.ok(smokeSource.includes('/admin/app?__browser-smoke-admin-app=1'));
  assert.ok(smokeSource.includes('requiresPortalSession: true'));
  assert.ok(smokeSource.includes('sdkwork.clawRouter.appSession.v1'));
  assert.ok(smokeSource.includes('urlPattern: "*://*/backend/v3/api/*"'));
  assert.ok(smokeSource.includes('/backend/v3/api/platform/apps'));
  assert.ok(smokeSource.includes('Browser Smoke Admin App'));
  assert.ok(smokeSource.includes('app-browser-smoke'));
  assert.ok(!smokeSource.includes('app_browser_smoke'));
});

test('production browser smoke keeps current-user playground CORS compatible with app session tokens', () => {
  const smokeSource = readFileSync(
    path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'scripts', 'smoke-production-browser.mjs'),
    'utf8',
  );

  assert.ok(smokeSource.includes('apiPlaygroundCorsHeaders'));
  assert.ok(smokeSource.includes('sdkwork-access-token'));
  assert.ok(smokeSource.includes('authorization, content-type, sdkwork-access-token, x-browser-smoke'));
});

test('verification plan includes portal api key runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const apiReferenceRuntimeIndex = plan.findIndex((step) => step.label === 'portal api reference playground runtime tests');
  const apiKeyRuntimeIndex = plan.findIndex((step) => step.label === 'portal api key runtime tests');
  const consoleRoutingRuntimeIndex = plan.findIndex((step) => step.label === 'portal console routing runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(apiKeyRuntimeIndex > apiReferenceRuntimeIndex, 'api key runtime tests must run after public route runtime tests');
  assert.ok(apiKeyRuntimeIndex < consoleRoutingRuntimeIndex, 'api key runtime tests must run before console routing runtime tests');
  assert.ok(apiKeyRuntimeIndex < rustTestsIndex, 'api key runtime tests must run before broad Rust tests');
  assert.ok(apiKeyRuntimeIndex < pythonTestsIndex, 'api key runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/api-key-runtime.test.ts',
  ));
});

test('verification plan includes portal billing runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const apiKeyRuntimeIndex = plan.findIndex((step) => step.label === 'portal api key runtime tests');
  const billingRuntimeIndex = plan.findIndex((step) => step.label === 'portal billing runtime tests');
  const consoleRoutingRuntimeIndex = plan.findIndex((step) => step.label === 'portal console routing runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(billingRuntimeIndex > apiKeyRuntimeIndex, 'billing runtime tests must run after account API key runtime tests');
  assert.ok(billingRuntimeIndex < consoleRoutingRuntimeIndex, 'billing runtime tests must run before console routing runtime tests');
  assert.ok(billingRuntimeIndex < rustTestsIndex, 'billing runtime tests must run before broad Rust tests');
  assert.ok(billingRuntimeIndex < pythonTestsIndex, 'billing runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/billing-runtime.test.ts',
  ));
});

test('verification plan includes portal console app runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const billingRuntimeIndex = plan.findIndex((step) => step.label === 'portal billing runtime tests');
  const consoleAppRuntimeIndex = plan.findIndex((step) => step.label === 'portal console app runtime tests');
  const consoleRoutingRuntimeIndex = plan.findIndex((step) => step.label === 'portal console routing runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(consoleAppRuntimeIndex > billingRuntimeIndex, 'console app runtime tests must run after billing runtime tests');
  assert.ok(consoleAppRuntimeIndex < consoleRoutingRuntimeIndex, 'console app runtime tests must run before console routing runtime tests');
  assert.ok(consoleAppRuntimeIndex < rustTestsIndex, 'console app runtime tests must run before broad Rust tests');
  assert.ok(consoleAppRuntimeIndex < pythonTestsIndex, 'console app runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/console-app-runtime.test.ts',
  ));
});

test('verification plan includes portal console routing runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const apiReferenceRuntimeIndex = plan.findIndex((step) => step.label === 'portal api reference playground runtime tests');
  const consoleRoutingRuntimeIndex = plan.findIndex((step) => step.label === 'portal console routing runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(consoleRoutingRuntimeIndex > apiReferenceRuntimeIndex, 'console routing runtime tests must run after public route runtime tests');
  assert.ok(consoleRoutingRuntimeIndex < rustTestsIndex, 'console routing runtime tests must run before broad Rust tests');
  assert.ok(consoleRoutingRuntimeIndex < pythonTestsIndex, 'console routing runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/console-routing-runtime.test.ts',
  ));
});

test('verification plan includes portal admin group runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const consoleRoutingRuntimeIndex = plan.findIndex((step) => step.label === 'portal console routing runtime tests');
  const adminGroupRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin group runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(adminGroupRuntimeIndex > consoleRoutingRuntimeIndex, 'admin group runtime tests must run after console routing runtime tests');
  assert.ok(adminGroupRuntimeIndex < rustTestsIndex, 'admin group runtime tests must run before broad Rust tests');
  assert.ok(adminGroupRuntimeIndex < pythonTestsIndex, 'admin group runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-group-runtime.test.ts',
  ));
});

test('verification plan includes portal console operations runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const consoleRoutingRuntimeIndex = plan.findIndex((step) => step.label === 'portal console routing runtime tests');
  const consoleOperationsRuntimeIndex = plan.findIndex((step) => step.label === 'portal console operations runtime tests');
  const adminGroupRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin group runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(consoleOperationsRuntimeIndex > consoleRoutingRuntimeIndex, 'console operations runtime tests must run after console routing runtime tests');
  assert.ok(consoleOperationsRuntimeIndex < adminGroupRuntimeIndex, 'console operations runtime tests must run before admin runtime tests');
  assert.ok(consoleOperationsRuntimeIndex < rustTestsIndex, 'console operations runtime tests must run before broad Rust tests');
  assert.ok(consoleOperationsRuntimeIndex < pythonTestsIndex, 'console operations runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/console-operations-runtime.test.ts',
  ));
});

test('verification plan includes portal admin user runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const adminGroupRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin group runtime tests');
  const adminChannelRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin channel runtime tests');
  const adminUserRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin user runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(adminUserRuntimeIndex > adminGroupRuntimeIndex, 'admin user runtime tests must run after admin group runtime tests');
  assert.ok(adminUserRuntimeIndex > adminChannelRuntimeIndex, 'admin user runtime tests must run after admin channel runtime tests');
  assert.ok(adminUserRuntimeIndex < rustTestsIndex, 'admin user runtime tests must run before broad Rust tests');
  assert.ok(adminUserRuntimeIndex < pythonTestsIndex, 'admin user runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-user-runtime.test.ts',
  ));
});

test('verification plan includes portal admin channel runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const adminGroupRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin group runtime tests');
  const adminChannelRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin channel runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(adminChannelRuntimeIndex > adminGroupRuntimeIndex, 'admin channel runtime tests must run after admin group runtime tests');
  assert.ok(adminChannelRuntimeIndex < rustTestsIndex, 'admin channel runtime tests must run before broad Rust tests');
  assert.ok(adminChannelRuntimeIndex < pythonTestsIndex, 'admin channel runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-channel-runtime.test.ts',
  ));
});

test('verification plan includes portal admin model runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const adminUserRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin user runtime tests');
  const adminModelRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin model runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(adminModelRuntimeIndex > adminUserRuntimeIndex, 'admin model runtime tests must run after admin user runtime tests');
  assert.ok(adminModelRuntimeIndex < rustTestsIndex, 'admin model runtime tests must run before broad Rust tests');
  assert.ok(adminModelRuntimeIndex < pythonTestsIndex, 'admin model runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-model-runtime.test.ts',
  ));
});

test('verification plan includes portal admin skill runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const adminModelRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin model runtime tests');
  const adminSkillRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin skill runtime tests');
  const adminRatelimitRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin ratelimit runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(adminSkillRuntimeIndex > adminModelRuntimeIndex, 'admin skill runtime tests must run after admin model runtime tests');
  assert.ok(adminSkillRuntimeIndex < adminRatelimitRuntimeIndex, 'admin skill runtime tests must run before admin ratelimit runtime tests');
  assert.ok(adminSkillRuntimeIndex < rustTestsIndex, 'admin skill runtime tests must run before broad Rust tests');
  assert.ok(adminSkillRuntimeIndex < pythonTestsIndex, 'admin skill runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-skill-runtime.test.ts',
  ));
});

test('verification plan includes portal admin app runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const adminModelRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin model runtime tests');
  const adminAppRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin app runtime tests');
  const adminSkillRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin skill runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(adminAppRuntimeIndex > adminModelRuntimeIndex, 'admin app runtime tests must run after admin model runtime tests');
  assert.ok(adminAppRuntimeIndex < adminSkillRuntimeIndex, 'admin app runtime tests must run before admin skill runtime tests');
  assert.ok(adminAppRuntimeIndex < rustTestsIndex, 'admin app runtime tests must run before broad Rust tests');
  assert.ok(adminAppRuntimeIndex < pythonTestsIndex, 'admin app runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-app-runtime.test.ts',
  ));
});

test('verification plan includes portal admin ratelimit runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const adminModelRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin model runtime tests');
  const adminRatelimitRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin ratelimit runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(adminRatelimitRuntimeIndex > adminModelRuntimeIndex, 'admin ratelimit runtime tests must run after admin model runtime tests');
  assert.ok(adminRatelimitRuntimeIndex < rustTestsIndex, 'admin ratelimit runtime tests must run before broad Rust tests');
  assert.ok(adminRatelimitRuntimeIndex < pythonTestsIndex, 'admin ratelimit runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-ratelimit-runtime.test.ts',
  ));
});

test('verification plan includes portal admin marketing runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const adminRatelimitRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin ratelimit runtime tests');
  const adminMarketingRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin marketing runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(adminMarketingRuntimeIndex > adminRatelimitRuntimeIndex, 'admin marketing runtime tests must run after admin ratelimit runtime tests');
  assert.ok(adminMarketingRuntimeIndex < rustTestsIndex, 'admin marketing runtime tests must run before broad Rust tests');
  assert.ok(adminMarketingRuntimeIndex < pythonTestsIndex, 'admin marketing runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-marketing-runtime.test.ts',
  ));
});

test('verification plan includes portal admin announcement runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const adminMarketingRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin marketing runtime tests');
  const adminAnnouncementRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin announcement runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(adminAnnouncementRuntimeIndex > adminMarketingRuntimeIndex, 'admin announcement runtime tests must run after admin marketing runtime tests');
  assert.ok(adminAnnouncementRuntimeIndex < rustTestsIndex, 'admin announcement runtime tests must run before broad Rust tests');
  assert.ok(adminAnnouncementRuntimeIndex < pythonTestsIndex, 'admin announcement runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-announcement-runtime.test.ts',
  ));
});

test('verification plan includes portal admin operations runtime tests before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const adminMarketingRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin marketing runtime tests');
  const adminOperationsRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin operations runtime tests');
  const adminAnnouncementRuntimeIndex = plan.findIndex((step) => step.label === 'portal admin announcement runtime tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(adminOperationsRuntimeIndex > adminMarketingRuntimeIndex, 'admin operations runtime tests must run after admin marketing runtime tests');
  assert.ok(adminOperationsRuntimeIndex < adminAnnouncementRuntimeIndex, 'admin operations runtime tests must run before admin announcement runtime tests');
  assert.ok(adminOperationsRuntimeIndex < rustTestsIndex, 'admin operations runtime tests must run before broad Rust tests');
  assert.ok(adminOperationsRuntimeIndex < pythonTestsIndex, 'admin operations runtime tests must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node --experimental-strip-types apps/sdkwork-claw-router-portal/admin-operations-runtime.test.ts',
  ));
});

test('verification plan includes portal models SSR smoke before broad suites', async () => {
  const module = await import(
    pathToFileURL(path.join(workspaceRoot, 'scripts', 'verify-claw-router-product.mjs')).href
  );
  const plan = module.buildVerificationPlan(
    { skipRustTests: false, skipPythonTests: false, skipSchemaGate: true },
    {},
  );
  const commandLines = plan.map((step) => `${step.command} ${step.args.join(' ')}`);
  const modelsRuntimeIndex = plan.findIndex((step) => step.label === 'portal models runtime tests');
  const modelsSsrIndex = plan.findIndex((step) => step.label === 'portal models SSR smoke tests');
  const rustTestsIndex = plan.findIndex((step) => step.label === 'rust workspace tests');
  const pythonTestsIndex = plan.findIndex((step) => step.label === 'python standard tests');

  assert.ok(modelsSsrIndex > modelsRuntimeIndex, 'models SSR smoke must run after model data runtime tests');
  assert.ok(modelsSsrIndex < rustTestsIndex, 'models SSR smoke must run before broad Rust tests');
  assert.ok(modelsSsrIndex < pythonTestsIndex, 'models SSR smoke must run before broad Python tests');
  assert.ok(commandLines.includes(
    'node apps/sdkwork-claw-router-portal/models-ssr-smoke.test.cjs',
  ));
});

let failed = 0;
for (const { name, fn } of tests) {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`not ok - ${name}`);
    console.error(error instanceof Error ? error.stack : String(error));
  }
}

if (failed > 0) {
  process.exit(1);
}
