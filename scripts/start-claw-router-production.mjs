#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { productionGatewayBinaryPath } from './claw-router-production-artifacts.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..');
const portalDist = path.join(workspaceRoot, 'apps', 'sdkwork-claw-router-portal', 'dist');

function cargoCommand(platform = process.platform) {
  return platform === 'win32' ? 'cargo.exe' : 'cargo';
}

function printHelp() {
  console.log(`Usage: node scripts/start-claw-router-production.mjs [options]

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
  --external-scheme <scheme>
                  External request scheme reported upstream: http or https.
  --trust-forwarded-headers
                  Trust inbound x-forwarded-host/proto/for from a controlled proxy.
  --dry-run       Print the production access matrix without starting Cargo.
  -h, --help      Show this help.
`);
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

function parseStartProductionArgs(argv) {
  const settings = {
    help: false,
    dryRun: false,
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

  assertPortalDistReadyForStart(settings.dryRun, portalDist);
  const env = resolveStartProductionEnv(process.env, portalDist, settings);
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
  cargoCommand,
  edgeAccessBaseUrl,
  main,
  parseStartProductionArgs,
  resolveStartProductionCommand,
  resolveStartProductionEnv,
  splitBind,
};
