#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createRuntimeConfigTemplate } from './build-claw-router-install-package.mjs';
import { productionGatewayBinaryPath } from './claw-router-production-artifacts.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..');
const portalDist = path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'dist');
const SERVER_DEFAULT_POSTGRES_URL = 'postgresql://sdkwork_claw_router:change-me@localhost:5432/sdkwork_claw_router';
const EXAMPLE_POSTGRES_URL = 'postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router';

function cargoCommand(platform = process.platform) {
  return platform === 'win32' ? 'cargo.exe' : 'cargo';
}

function buildStartProductionHelpText() {
  return `Usage: node scripts/start-claw-router-production.mjs [options]

Start the production portal through the Rust edge server.

Options:
  --server-bind <bind>
                  Rust edge server HOST:PORT override (default 0.0.0.0:3900).
  --gateway-forward-url <url>
                  Rust edge server target origin for /v1 and /openapi.json.
  --backend-api-forward-url <url>
                  Rust edge server target origin for /backend/v3/api.
  --app-api-forward-url <url>
                  Rust edge server target origin for /app/v3/api.
  --deployment-mode <mode>
                  Runtime config profile: server or desktop (default server).
  --config-file <path>
                  Runtime TOML config path. Defaults to the OS-standard location.
  --database-url <url>
                  PostgreSQL or SQLite URL used when initializing a missing config file.
  --database-max-connections <n>
                  Database pool size used when initializing a missing config file.
  --init-config-only
                  Initialize the runtime config file and print startup help without launching.
  --external-scheme <scheme>
                  External request scheme reported upstream: http or https.
  --trust-forwarded-headers
                  Trust inbound x-forwarded-host/proto/for from a controlled proxy.
  --dry-run       Print the production access matrix without starting Cargo.
  -h, --help      Show this help.

Runtime config initialization:
  Missing runtime TOML files are created automatically before startup.
  Server deployments require PostgreSQL before the process can start.
  Desktop deployments default to SQLite and can start from the generated config.

Common initialization commands:
  pnpm start -- --init-config-only --deployment-mode server
  pnpm start -- --init-config-only --deployment-mode desktop

Server PostgreSQL configuration:
  SDKWORK_CLAW_DATABASE_URL="${EXAMPLE_POSTGRES_URL}" pnpm start -- --deployment-mode server
  pnpm start -- --deployment-mode server --database-url "${EXAMPLE_POSTGRES_URL}"
  Or edit [database].url in the generated runtime TOML.

Default runtime config paths:
  Linux server: /etc/sdkwork-claw-router/sdkwork-claw-router.toml
  Linux desktop: \${XDG_CONFIG_HOME:-~/.config}/sdkwork-claw-router/sdkwork-claw-router.toml
  Windows server: %ProgramData%/SdkWork/Claw Router/sdkwork-claw-router.toml
  Windows desktop: %APPDATA%/SdkWork/Claw Router/sdkwork-claw-router.toml
  macOS server: /Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml
  macOS desktop: ~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml
`;
}

function printHelp() {
  console.log(buildStartProductionHelpText());
}

function requireValue(argv, index, flag) {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function splitBind(bind, flagName) {
  const match = String(bind ?? '').trim().match(/^(.*):(\d+)$/u);
  if (!match) {
    throw new Error(`${flagName} must be a host:port value`);
  }

  const host = match[1];
  const port = Number.parseInt(match[2], 10);
  if (!host || !Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${flagName} must be a host:port value`);
  }

  return { host, port: String(port) };
}

function originUrl(value, flagName) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`${flagName} must be an HTTP/HTTPS origin`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error(`${flagName} must be an HTTP/HTTPS origin`);
  }
  if ((parsed.pathname && parsed.pathname !== '/') || parsed.search || parsed.hash) {
    throw new Error(`${flagName} must be an HTTP/HTTPS origin without path, query, or hash`);
  }

  return parsed.origin;
}

function normalizeExternalScheme(value, flagName) {
  const scheme = String(value ?? '').trim().toLowerCase();
  if (scheme !== 'http' && scheme !== 'https') {
    throw new Error(`${flagName} must be http or https`);
  }
  return scheme;
}

function appendPath(origin, pathSuffix) {
  return `${String(origin).replace(/\/+$/u, '')}${pathSuffix}`;
}

function normalizePlatform(platform = process.platform) {
  if (platform === 'win32' || platform === 'windows') {
    return 'windows';
  }
  if (platform === 'darwin' || platform === 'macos' || platform === 'mac') {
    return 'macos';
  }
  return 'linux';
}

function toPortablePath(value) {
  return String(value ?? '').replaceAll('\\', '/');
}

function parseStartProductionArgs(argv) {
  const settings = {
    help: false,
    dryRun: false,
    initConfigOnly: false,
    deploymentMode: null,
    configFile: null,
    databaseUrl: null,
    databaseMaxConnections: null,
    serverBind: null,
    gatewayForwardUrl: null,
    backendApiForwardUrl: null,
    appApiForwardUrl: null,
    externalScheme: null,
    trustForwardedHeaders: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--') {
      continue;
    }
    switch (arg) {
      case '--help':
      case '-h':
        settings.help = true;
        break;
      case '--dry-run':
        settings.dryRun = true;
        break;
      case '--init-config-only':
        settings.initConfigOnly = true;
        break;
      case '--deployment-mode':
        settings.deploymentMode = normalizeDeploymentMode(requireValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--config-file':
        settings.configFile = requireValue(argv, index, arg);
        index += 1;
        break;
      case '--database-url':
        settings.databaseUrl = originDatabaseUrl(requireValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--database-max-connections':
        settings.databaseMaxConnections = normalizePositiveIntegerValue(
          requireValue(argv, index, arg),
          arg,
        );
        index += 1;
        break;
      case '--server-bind':
        settings.serverBind = requireValue(argv, index, arg);
        splitBind(settings.serverBind, arg);
        index += 1;
        break;
      case '--gateway-forward-url':
        settings.gatewayForwardUrl = originUrl(requireValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--backend-api-forward-url':
        settings.backendApiForwardUrl = originUrl(requireValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--app-api-forward-url':
        settings.appApiForwardUrl = originUrl(requireValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--external-scheme':
        settings.externalScheme = normalizeExternalScheme(requireValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--trust-forwarded-headers':
        settings.trustForwardedHeaders = true;
        break;
      default:
        throw new Error(`Unsupported production start option: ${arg}`);
    }
  }

  return settings;
}

function normalizeDeploymentMode(value, flagName = 'deployment mode') {
  const mode = String(value ?? '').trim().toLowerCase();
  if (mode !== 'server' && mode !== 'desktop') {
    throw new Error(`${flagName} must be server or desktop`);
  }
  return mode;
}

function normalizePositiveIntegerValue(value, flagName) {
  const normalized = String(value ?? '').trim();
  if (!/^[1-9]\d*$/u.test(normalized)) {
    throw new Error(`${flagName} must be a positive integer`);
  }
  return normalized;
}

function originDatabaseUrl(value, flagName) {
  const normalized = String(value ?? '').trim();
  if (!normalized) {
    throw new Error(`${flagName} must be a PostgreSQL or SQLite connection string`);
  }
  if (
    normalized.startsWith('sqlite:')
    || normalized.startsWith('postgres://')
    || normalized.startsWith('postgresql://')
  ) {
    return normalized;
  }
  throw new Error(`${flagName} must be a PostgreSQL or SQLite connection string`);
}

function runtimeConfigLocationForPlatform(
  platform,
  deploymentMode,
  env = process.env,
) {
  const normalizedPlatform = normalizePlatform(platform);
  const normalizedDeploymentMode = normalizeDeploymentMode(deploymentMode);
  const getEnv = (key) => String(env?.[key] ?? '').trim();
  if (normalizedPlatform === 'windows') {
    if (normalizedDeploymentMode === 'server') {
      const programData = getEnv('ProgramData') || getEnv('PROGRAMDATA') || 'C:/ProgramData';
      const root = joinRuntimePath(programData, 'SdkWork/Claw Router');
      return {
        configFile: joinRuntimePath(root, 'sdkwork-claw-router.toml'),
        dataDirectory: joinRuntimePath(root, 'Data'),
        sqlitePath: null,
      };
    }
    const appData = getEnv('APPDATA') || 'C:/Users/Default/AppData/Roaming';
    const localAppData = getEnv('LOCALAPPDATA') || 'C:/Users/Default/AppData/Local';
    const configRoot = joinRuntimePath(appData, 'SdkWork/Claw Router');
    const dataDirectory = joinRuntimePath(localAppData, 'SdkWork/Claw Router');
    return {
      configFile: joinRuntimePath(configRoot, 'sdkwork-claw-router.toml'),
      dataDirectory,
      sqlitePath: joinRuntimePath(dataDirectory, 'sdkwork-claw-router.sqlite'),
    };
  }
  if (normalizedPlatform === 'macos') {
    if (normalizedDeploymentMode === 'server') {
      const root = '/Library/Application Support/SdkWork/Claw Router';
      return {
        configFile: joinRuntimePath(root, 'sdkwork-claw-router.toml'),
        dataDirectory: root,
        sqlitePath: null,
      };
    }
    const home = getEnv('HOME') || '~';
    const root = joinRuntimePath(home, 'Library/Application Support/SdkWork/Claw Router');
    return {
      configFile: joinRuntimePath(root, 'sdkwork-claw-router.toml'),
      dataDirectory: root,
      sqlitePath: joinRuntimePath(root, 'sdkwork-claw-router.sqlite'),
    };
  }

  if (normalizedDeploymentMode === 'server') {
    return {
      configFile: '/etc/sdkwork-claw-router/sdkwork-claw-router.toml',
      dataDirectory: '/var/lib/sdkwork-claw-router',
      sqlitePath: null,
    };
  }
  const home = getEnv('HOME') || '~';
  const configHome = getEnv('XDG_CONFIG_HOME') || joinRuntimePath(home, '.config');
  const dataHome = getEnv('XDG_DATA_HOME') || joinRuntimePath(home, '.local/share');
  const configRoot = joinRuntimePath(configHome, 'sdkwork-claw-router');
  const dataDirectory = joinRuntimePath(dataHome, 'sdkwork-claw-router');
  return {
    configFile: joinRuntimePath(configRoot, 'sdkwork-claw-router.toml'),
    dataDirectory,
    sqlitePath: joinRuntimePath(dataDirectory, 'sdkwork-claw-router.sqlite'),
  };
}

function joinRuntimePath(base, child) {
  const normalizedBase = String(base ?? '').trim().replaceAll('\\', '/').replace(/\/+$/u, '');
  const normalizedChild = String(child ?? '').trim().replaceAll('\\', '/').replace(/^\/+/u, '');
  if (!normalizedBase) {
    return normalizedChild;
  }
  if (!normalizedChild) {
    return normalizedBase;
  }
  return `${normalizedBase}/${normalizedChild}`;
}

function runtimeConfigEngineForMode(deploymentMode) {
  return normalizeDeploymentMode(deploymentMode) === 'desktop' ? 'sqlite' : 'postgresql';
}

function runtimeConfigDefaultUrlForMode(deploymentMode, sqlitePath = null) {
  if (normalizeDeploymentMode(deploymentMode) === 'desktop') {
    if (!sqlitePath) {
      throw new Error('desktop runtime config requires a SQLite path');
    }
    return `sqlite://${toPortablePath(path.resolve(sqlitePath))}`;
  }
  return SERVER_DEFAULT_POSTGRES_URL;
}

function runtimeConfigDefaultMaxConnectionsForMode(deploymentMode) {
  return normalizeDeploymentMode(deploymentMode) === 'desktop' ? 1 : 16;
}

function runtimeConfigRedactedUrl(url) {
  const trimmed = String(url ?? '').trim();
  if (!trimmed) {
    return '(missing)';
  }
  if (trimmed.startsWith('sqlite:')) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    const username = parsed.username ? `${parsed.username}:***@` : '';
    parsed.username = '';
    parsed.password = '';
    return `${parsed.protocol}//${username}${parsed.host}${parsed.pathname}`;
  } catch {
    return trimmed.replace(/:\/\/([^@/]+)@/u, '://***@');
  }
}

function runtimeConfigTemplateContent({
  deploymentMode,
  configFile,
  dataDirectory,
  databaseUrl,
  databaseEngine,
  maxConnections,
  sqlitePath,
}) {
  return createRuntimeConfigTemplate({
    runtimeProfile: deploymentMode,
    databasePolicy: {
      defaultEngine: databaseEngine,
      defaultUrl: databaseUrl,
      defaultSqlitePath: sqlitePath,
      defaultSqliteUrl: sqlitePath ? `sqlite://${toPortablePath(path.resolve(sqlitePath))}` : null,
      maxConnections,
      configFile: {
        path: configFile,
      },
      dataDirectory: {
        path: dataDirectory,
      },
    },
  });
}

function readRuntimeConfigSnapshot(configFile) {
  if (!configFile || !existsSync(configFile)) {
    return {
      exists: false,
      content: null,
      databaseUrl: null,
      databaseEngine: null,
      maxConnections: null,
    };
  }
  const content = readFileSync(configFile, 'utf8');
  const databaseUrl = matchConfigValue(content, 'url');
  const databaseEngine = matchConfigValue(content, 'engine');
  const maxConnections = matchConfigNumber(content, 'max_connections');
  return {
    exists: true,
    content,
    databaseUrl,
    databaseEngine,
    maxConnections,
  };
}

function matchConfigValue(content, key) {
  const pattern = new RegExp(`^\\s*${key}\\s*=\\s*["']([^"']+)["']\\s*$`, 'm');
  const match = content.match(pattern);
  return match ? match[1].trim() : null;
}

function matchConfigNumber(content, key) {
  const pattern = new RegExp(`^\\s*${key}\\s*=\\s*(\\d+)\\s*$`, 'm');
  const match = content.match(pattern);
  return match ? Number.parseInt(match[1], 10) : null;
}

function buildRuntimeConfigHelpLines(result) {
  if (!result.blockingIssue) {
    return [];
  }

  const lines = [
    '[start-production] Runtime configuration help',
    `[start-production]   ${result.blockingIssue.message}`,
    `[start-production]   Config file: ${result.configFile}`,
    `[start-production]   Data directory: ${result.dataDirectory}`,
    `[start-production]   Engine: ${result.databaseEngine}`,
  ];

  if (result.deploymentMode === 'server') {
    lines.push(
      `[start-production]   Configure PostgreSQL in ${result.configFile} or set SDKWORK_CLAW_DATABASE_URL`,
      `[start-production]   Example: SDKWORK_CLAW_DATABASE_URL="${EXAMPLE_POSTGRES_URL}" pnpm start -- --deployment-mode server`,
      `[start-production]   CLI override: pnpm start -- --deployment-mode server --database-url "${EXAMPLE_POSTGRES_URL}"`,
      '[start-production]   Initialize only: pnpm start -- --init-config-only --deployment-mode server',
      '[start-production]   Desktop initialize: pnpm start -- --init-config-only --deployment-mode desktop',
    );
  } else {
    lines.push(
      '[start-production]   Desktop runtime defaults to SQLite and creates its config automatically',
      `[start-production]   SQLite file: ${result.sqlitePath}`,
      '[start-production]   Initialize only: pnpm start -- --init-config-only --deployment-mode desktop',
    );
  }

  return lines;
}

function buildRuntimeConfigStatusLines(result) {
  const lines = [
    '[start-production] Runtime Configuration',
    `[start-production]   Deployment mode: ${result.deploymentMode}`,
    `[start-production]   Config file: ${result.configFile}`,
    `[start-production]   Data directory: ${result.dataDirectory}`,
    `[start-production]   Status: ${result.action === 'existing' ? 'reused existing runtime config' : result.action === 'planned' ? 'planned runtime config' : 'created runtime config'}`,
    `[start-production]   Database engine: ${result.databaseEngine}`,
    `[start-production]   Database URL: ${runtimeConfigRedactedUrl(result.databaseUrl)}`,
  ];
  if (result.sqlitePath) {
    lines.push(`[start-production]   SQLite file: ${result.sqlitePath}`);
  }
  return lines;
}

function prepareStartProductionRuntimeConfig({
  baseEnv = process.env,
  settings = parseStartProductionArgs([]),
  platform = process.platform,
  write = true,
} = {}) {
  const deploymentMode = normalizeDeploymentMode(
    settings.deploymentMode ?? baseEnv.SDKWORK_CLAW_DEPLOYMENT_MODE ?? 'server',
  );
  const defaults = runtimeConfigLocationForPlatform(platform, deploymentMode, baseEnv);
  const configFile = String(
    settings.configFile ?? baseEnv.SDKWORK_CLAW_CONFIG_FILE ?? defaults.configFile,
  ).trim();
  const dataDirectory = defaults.dataDirectory;
  const sqlitePath = defaults.sqlitePath;
  const explicitDatabaseUrl = String(settings.databaseUrl ?? baseEnv.SDKWORK_CLAW_DATABASE_URL ?? '').trim();
  const defaultDatabaseUrl = runtimeConfigDefaultUrlForMode(
    deploymentMode,
    sqlitePath,
  );
  const databaseUrl = explicitDatabaseUrl || defaultDatabaseUrl;
  const databaseEngine = runtimeConfigEngineForMode(deploymentMode);
  const databaseMaxConnections = String(
    settings.databaseMaxConnections
      ?? baseEnv.SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS
      ?? runtimeConfigDefaultMaxConnectionsForMode(deploymentMode),
  ).trim();
  const configSnapshot = readRuntimeConfigSnapshot(configFile);
  const desiredTemplate = runtimeConfigTemplateContent({
    deploymentMode,
    configFile,
    dataDirectory,
    databaseUrl,
    databaseEngine,
    maxConnections: databaseMaxConnections,
    sqlitePath,
  });
  let action = configSnapshot.exists ? 'existing' : 'planned';

  if (write && !configSnapshot.exists) {
    mkdirSync(path.dirname(configFile), { recursive: true });
    writeFileSync(configFile, desiredTemplate, 'utf8');
    action = 'created';
  }

  const finalConfigSnapshot = configSnapshot.exists ? configSnapshot : {
    exists: true,
    content: desiredTemplate,
    databaseUrl,
    databaseEngine,
    maxConnections: Number.parseInt(databaseMaxConnections, 10),
  };
  const normalizedDatabaseUrl = explicitDatabaseUrl
    || finalConfigSnapshot.databaseUrl
    || databaseUrl;
  const normalizedDatabaseEngine = runtimeConfigEngineForUrl(normalizedDatabaseUrl)
    || finalConfigSnapshot.databaseEngine
    || databaseEngine;
  const blockingIssue = determineRuntimeConfigBlockingIssue({
    deploymentMode,
    configFile,
    databaseEngine: normalizedDatabaseEngine,
    databaseUrl: normalizedDatabaseUrl,
    configSnapshot: finalConfigSnapshot,
    explicitDatabaseUrl,
  });
  const result = {
    action,
    deploymentMode,
    configFile,
    dataDirectory,
    sqlitePath,
    databaseEngine: normalizedDatabaseEngine,
    databaseUrl: normalizedDatabaseUrl,
    databaseMaxConnections: finalConfigSnapshot.maxConnections ?? Number.parseInt(databaseMaxConnections, 10),
    env: {
      SDKWORK_CLAW_CONFIG_FILE: configFile,
      SDKWORK_CLAW_DEPLOYMENT_MODE: deploymentMode,
      ...(explicitDatabaseUrl ? { SDKWORK_CLAW_DATABASE_URL: explicitDatabaseUrl } : {}),
      ...(settings.databaseMaxConnections
        ? { SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS: String(settings.databaseMaxConnections) }
        : {}),
    },
    helpLines: [],
    blockingIssue,
  };
  result.helpLines = buildRuntimeConfigHelpLines(result);
  return result;
}

function determineRuntimeConfigBlockingIssue({
  deploymentMode,
  configFile,
  databaseEngine,
  databaseUrl,
  configSnapshot,
  explicitDatabaseUrl,
}) {
  if (deploymentMode !== 'server') {
    return null;
  }
  if (explicitDatabaseUrl) {
    if (
      explicitDatabaseUrl.startsWith('postgres://')
      || explicitDatabaseUrl.startsWith('postgresql://')
    ) {
      if (explicitDatabaseUrl !== SERVER_DEFAULT_POSTGRES_URL) {
        return null;
      }
    }
    return {
      code: 'postgresql_configuration_required',
      message: `runtime config ${configFile} must use a PostgreSQL database URL`,
    };
  }
  if (!configSnapshot?.exists) {
    return {
      code: 'postgresql_configuration_required',
      message: 'PostgreSQL configuration is required before the server can start.',
    };
  }
  if (databaseEngine !== 'postgresql') {
    return {
      code: 'postgresql_configuration_required',
      message: `runtime config ${configFile} must use a PostgreSQL database for server deployment`,
    };
  }
  if (!databaseUrl || databaseUrl === SERVER_DEFAULT_POSTGRES_URL) {
    return {
      code: 'postgresql_configuration_required',
      message: `runtime config ${configFile} still points at the default placeholder PostgreSQL URL`,
    };
  }
  return null;
}

function runtimeConfigEngineForUrl(value) {
  const url = String(value ?? '').trim();
  if (url.startsWith('sqlite:')) {
    return 'sqlite';
  }
  if (url.startsWith('postgres://') || url.startsWith('postgresql://')) {
    return 'postgresql';
  }
  return null;
}

function mergeRuntimeConfigEnv(baseEnv, runtimeConfig) {
  return {
    ...baseEnv,
    ...runtimeConfig.env,
  };
}

function resolveStartProductionEnv(
  baseEnv = process.env,
  distRoot = portalDist,
  settings = parseStartProductionArgs([]),
) {
  const defaultSdkArchiveRoot = path.join(distRoot, 'sdk-archives');
  return {
    ...baseEnv,
    SDKWORK_CLAW_EDGE_SERVER: '1',
    SDKWORK_CLAW_EDGE_PORTAL_STATIC_DIST: distRoot,
    SDKWORK_CLAW_SERVER_BIND:
      settings.serverBind ?? baseEnv.SDKWORK_CLAW_SERVER_BIND ?? '0.0.0.0:3900',
    SDKWORK_CLAW_EDGE_GATEWAY_BASE_URL:
      settings.gatewayForwardUrl
      ?? baseEnv.SDKWORK_CLAW_EDGE_GATEWAY_BASE_URL
      ?? 'http://127.0.0.1:18080',
    SDKWORK_CLAW_EDGE_BACKEND_API_BASE_URL:
      settings.backendApiForwardUrl
      ?? baseEnv.SDKWORK_CLAW_EDGE_BACKEND_API_BASE_URL
      ?? 'http://127.0.0.1:18081',
    SDKWORK_CLAW_EDGE_APP_API_BASE_URL:
      settings.appApiForwardUrl
      ?? baseEnv.SDKWORK_CLAW_EDGE_APP_API_BASE_URL
      ?? 'http://127.0.0.1:18082',
    SDKWORK_CLAW_EDGE_EXTERNAL_SCHEME:
      settings.externalScheme ?? baseEnv.SDKWORK_CLAW_EDGE_EXTERNAL_SCHEME ?? 'http',
    SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS:
      settings.trustForwardedHeaders
        ? '1'
        : baseEnv.SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS ?? '0',
    PORTAL_PUBLIC_API_BASE_URL: baseEnv.PORTAL_PUBLIC_API_BASE_URL ?? '/v1',
    PORTAL_PUBLIC_OPEN_API_BASE_URL:
      baseEnv.PORTAL_PUBLIC_OPEN_API_BASE_URL
      ?? baseEnv.PORTAL_PUBLIC_API_BASE_URL
      ?? '/v1',
    PORTAL_PUBLIC_APP_API_BASE_URL: baseEnv.PORTAL_PUBLIC_APP_API_BASE_URL ?? '/app/v3/api',
    PORTAL_PUBLIC_BACKEND_API_BASE_URL:
      baseEnv.PORTAL_PUBLIC_BACKEND_API_BASE_URL ?? '/backend/v3/api',
    PORTAL_PUBLIC_TOOL_API_ENABLED: baseEnv.PORTAL_PUBLIC_TOOL_API_ENABLED ?? 'false',
    PORTAL_TOOL_API_RATE_LIMIT_REQUESTS:
      baseEnv.PORTAL_TOOL_API_RATE_LIMIT_REQUESTS ?? '120',
    PORTAL_TOOL_API_RATE_LIMIT_WINDOW_SECONDS:
      baseEnv.PORTAL_TOOL_API_RATE_LIMIT_WINDOW_SECONDS ?? '60',
    PORTAL_TOOL_API_SDK_ARCHIVE_ROOT:
      baseEnv.PORTAL_TOOL_API_SDK_ARCHIVE_ROOT ?? defaultSdkArchiveRoot,
  };
}

function edgeAccessBaseUrl(env) {
  const bind = env.SDKWORK_CLAW_SERVER_BIND ?? '0.0.0.0:3900';
  const parts = bind.split(':');
  const port = parts.at(-1) || '3900';
  const bindHost = parts.length > 1 ? parts.slice(0, -1).join(':') : '127.0.0.1';
  const host = bindHost === '0.0.0.0' || bindHost === '' ? '127.0.0.1' : bindHost;
  return `http://${host}:${port}`;
}

function buildStartProductionAccessLines(env) {
  const baseUrl = edgeAccessBaseUrl(env);
  const gatewayTarget = env.SDKWORK_CLAW_EDGE_GATEWAY_BASE_URL ?? 'http://127.0.0.1:18080';
  const backendTarget = env.SDKWORK_CLAW_EDGE_BACKEND_API_BASE_URL ?? 'http://127.0.0.1:18081';
  const appTarget = env.SDKWORK_CLAW_EDGE_APP_API_BASE_URL ?? 'http://127.0.0.1:18082';
  return [
    '[start-production] Edge Server Access',
    `[start-production]   Portal: ${baseUrl}/`,
    `[start-production]   Gateway API: ${baseUrl}/v1`,
    `[start-production]   Backend/Admin API: ${baseUrl}/backend/v3/api`,
    `[start-production]   App API: ${baseUrl}/app/v3/api`,
    `[start-production]   Gateway OpenAPI: ${baseUrl}/openapi.json`,
    `[start-production]   Admin API OpenAPI: ${baseUrl}/backend/v3/api/openapi.json`,
    `[start-production]   App API OpenAPI: ${baseUrl}/app/v3/api/openapi.json`,
    `[start-production]   Edge Server Health: ${baseUrl}/healthz`,
    `[start-production]   Edge Server Ready: ${baseUrl}/readyz`,
    '[start-production] Edge Forwarding Targets',
    `[start-production]   Gateway Target: ${gatewayTarget}`,
    `[start-production]   Backend/Admin Target: ${backendTarget}`,
    `[start-production]   App Target: ${appTarget}`,
    '[start-production] Direct Service Access',
    `[start-production]   Gateway OpenAPI: ${appendPath(gatewayTarget, '/openapi.json')}`,
    `[start-production]   Admin API OpenAPI: ${appendPath(backendTarget, '/backend/v3/api/openapi.json')}`,
    `[start-production]   App API OpenAPI: ${appendPath(appTarget, '/app/v3/api/openapi.json')}`,
    `[start-production]   OpenAI-compatible Gateway API: ${appendPath(gatewayTarget, '/v1')}`,
    `[start-production]   Backend/Admin API: ${appendPath(backendTarget, '/backend/v3/api')}`,
    `[start-production]   App API: ${appendPath(appTarget, '/app/v3/api')}`,
    `[start-production]   PORTAL_PUBLIC_API_BASE_URL=${env.PORTAL_PUBLIC_API_BASE_URL}`,
    `[start-production]   PORTAL_PUBLIC_OPEN_API_BASE_URL=${env.PORTAL_PUBLIC_OPEN_API_BASE_URL}`,
    `[start-production]   PORTAL_PUBLIC_BACKEND_API_BASE_URL=${env.PORTAL_PUBLIC_BACKEND_API_BASE_URL}`,
    `[start-production]   PORTAL_PUBLIC_APP_API_BASE_URL=${env.PORTAL_PUBLIC_APP_API_BASE_URL}`,
    `[start-production]   PORTAL_PUBLIC_TOOL_API_ENABLED=${env.PORTAL_PUBLIC_TOOL_API_ENABLED}`,
    `[start-production]   PORTAL_TOOL_API_RATE_LIMIT_REQUESTS=${env.PORTAL_TOOL_API_RATE_LIMIT_REQUESTS}`,
    `[start-production]   PORTAL_TOOL_API_RATE_LIMIT_WINDOW_SECONDS=${env.PORTAL_TOOL_API_RATE_LIMIT_WINDOW_SECONDS}`,
    `[start-production]   PORTAL_TOOL_API_SDK_ARCHIVE_ROOT=${env.PORTAL_TOOL_API_SDK_ARCHIVE_ROOT || '(not configured)'}`,
    `[start-production]   SDKWORK_CLAW_EDGE_EXTERNAL_SCHEME=${env.SDKWORK_CLAW_EDGE_EXTERNAL_SCHEME}`,
    `[start-production]   SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS=${env.SDKWORK_CLAW_EDGE_TRUST_FORWARDED_HEADERS}`,
  ];
}

function assertPortalDistReadyForStart(dryRun, distRoot = portalDist) {
  if (dryRun) {
    return;
  }
  if (!existsSync(path.join(distRoot, 'index.html'))) {
    throw new Error(
      'portal production dist is missing. Run `pnpm build` before `pnpm start`.',
    );
  }
}

function resolveStartProductionCommand(
  env = process.env,
  platform = process.platform,
  root = workspaceRoot,
) {
  const configuredGatewayBinary = env.SDKWORK_CLAW_GATEWAY_BIN?.trim();
  if (configuredGatewayBinary) {
    return {
      command: configuredGatewayBinary,
      args: [],
      source: 'env',
    };
  }

  const releaseGatewayBinary = productionGatewayBinaryPath({
    env,
    platform,
    workspaceRoot: root,
  });
  if (existsSync(releaseGatewayBinary)) {
    return {
      command: releaseGatewayBinary,
      args: [],
      source: 'release',
    };
  }

  return {
    command: cargoCommand(platform),
    args: ['run', '-p', 'sdkwork-claw-gateway'],
    source: 'cargo',
  };
}

function main(argv = process.argv.slice(2)) {
  const settings = parseStartProductionArgs(argv);
  if (settings.help) {
    printHelp();
    return;
  }

  const runtimeConfig = prepareStartProductionRuntimeConfig({
    baseEnv: process.env,
    settings,
    platform: process.platform,
    write: !settings.dryRun,
  });
  for (const line of buildRuntimeConfigStatusLines(runtimeConfig)) {
    console.log(line);
  }
  for (const line of runtimeConfig.helpLines) {
    console.log(line);
  }

  if (settings.initConfigOnly) {
    return;
  }

  if (runtimeConfig.blockingIssue && !settings.dryRun) {
    throw new Error(runtimeConfig.blockingIssue.message);
  }

  assertPortalDistReadyForStart(settings.dryRun, portalDist);
  const env = mergeRuntimeConfigEnv(resolveStartProductionEnv(process.env, portalDist, settings), runtimeConfig);
  for (const line of buildStartProductionAccessLines(env)) {
    console.log(line);
  }
  const startCommand = resolveStartProductionCommand(env, process.platform, workspaceRoot);
  if (settings.dryRun) {
    console.log(
      `[start-production] start command (${startCommand.source}): ${startCommand.command} ${startCommand.args.join(' ')}`.trimEnd(),
    );
    return;
  }

  const child = spawn(startCommand.command, startCommand.args, {
    cwd: workspaceRoot,
    env,
    stdio: 'inherit',
    windowsHide: process.platform === 'win32',
  });

  child.on('error', (error) => {
    console.error(`[start-production] failed: ${error.message}`);
    process.exit(1);
  });
  child.on('exit', (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\', '/'))) {
  try {
    main();
  } catch (error) {
    console.error(`[start-production] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

export {
  assertPortalDistReadyForStart,
  buildStartProductionAccessLines,
  buildStartProductionHelpText,
  cargoCommand,
  edgeAccessBaseUrl,
  main,
  mergeRuntimeConfigEnv,
  parseStartProductionArgs,
  resolveStartProductionCommand,
  resolveStartProductionEnv,
  runtimeConfigDefaultMaxConnectionsForMode,
  runtimeConfigDefaultUrlForMode,
  runtimeConfigEngineForMode,
  runtimeConfigLocationForPlatform,
  runtimeConfigRedactedUrl,
  runtimeConfigTemplateContent,
  prepareStartProductionRuntimeConfig,
  splitBind,
};
