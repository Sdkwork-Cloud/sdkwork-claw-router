#!/usr/bin/env node

import { spawn } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const PROFILES = new Set(['quick', 'admin-api', 'app-api', 'gateway', 'product-relay', 'runtime', 'full']);

function printHelp() {
  console.log(`Usage: node scripts/run-claw-router-rust-tests.mjs <profile> [options]

Run scoped Rust verification profiles without reusing the shared target/debug tree.

Profiles:
  quick       Format and focused high-signal package tests for daily iteration.
  admin-api   Admin API route tests split by test target.
  app-api     App API route tests split by test target.
  gateway     Gateway edge and provider relay tests split by test target.
  product-relay
              Product OpenAI-compatible relay and provider adapter tests.
  runtime     Product/gateway/admin/app/installer runtime integration package group.
  full        Full cargo workspace tests.

Options:
  --target-dir <path>     Override Cargo target directory.
                          Defaults to target-rust-tests/daily for scoped profiles
                          and target-rust-tests/full for the full workspace profile.
  --test-threads <count>  Forward --test-threads to cargo test binaries.
  --dry-run               Print commands without executing them.
  -h, --help              Show this help.
`);
}

function parseArgs(argv) {
  const settings = {
    profile: null,
    targetDir: null,
    testThreads: null,
    dryRun: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--') {
      continue;
    }
    switch (arg) {
      case '--dry-run':
        settings.dryRun = true;
        break;
      case '--help':
      case '-h':
        settings.help = true;
        break;
      case '--target-dir':
        index += 1;
        if (!argv[index]) {
          throw new Error('--target-dir requires a value');
        }
        settings.targetDir = argv[index];
        break;
      case '--test-threads':
        index += 1;
        if (!argv[index] || !/^[1-9][0-9]*$/u.test(argv[index])) {
          throw new Error('--test-threads requires a positive integer');
        }
        settings.testThreads = argv[index];
        break;
      default:
        if (!settings.profile && PROFILES.has(arg)) {
          settings.profile = arg;
          break;
        }
        throw new Error(`Unsupported rust test option: ${arg}`);
    }
  }

  if (!settings.help && !settings.profile) {
    settings.profile = 'quick';
  }
  return settings;
}

function normalizeTargetDir(profile, targetDir, platform = process.platform) {
  const selected = targetDir || path.join('target-rust-tests', profile === 'full' ? 'full' : 'daily');
  return platform === 'win32' ? selected.replaceAll('/', '\\') : selected.replaceAll('\\', '/');
}

function cargoStep(label, args, env, settings) {
  const stepArgs = [...args];
  if (settings.testThreads && args[0] === 'test') {
    stepArgs.push('--', '--test-threads', settings.testThreads);
  }
  return {
    label,
    command: 'cargo',
    args: stepArgs,
    env,
  };
}

function buildQuickSteps(env, settings) {
  return [
    cargoStep(
      'rust format for frequently touched packages',
      [
        'fmt',
        '-p',
        'sdkwork-claw-config',
        '-p',
        'sdkwork-claw-http',
        '-p',
        'sdkwork-claw-security',
        '-p',
        'sdkwork-claw-test-support',
        '-p',
        'sdkwork-claw-product',
        '-p',
        'sdkwork-claw-admin-api',
        '--check',
      ],
      env,
      settings,
    ),
    cargoStep(
      'redis config regression tests',
      ['test', '-p', 'sdkwork-claw-config', '--test', 'redis_config'],
      env,
      settings,
    ),
    cargoStep(
      'sqlite product model route smoke',
      [
        'test',
        '-p',
        'sdkwork-claw-admin-api',
        '--test',
        'sqlite_product_model_route',
        'sqlite_product_catalog_route_serves_real_backend_model_list',
      ],
      env,
      settings,
    ),
  ];
}

function buildAdminApiSteps(env, settings) {
  return [
    cargoStep('admin api health tests', ['test', '-p', 'sdkwork-claw-admin-api', '--test', 'health'], env, settings),
    cargoStep(
      'admin api contract route tests',
      ['test', '-p', 'sdkwork-claw-admin-api', '--test', 'contract_routes'],
      env,
      settings,
    ),
    cargoStep(
      'admin api database router integration tests',
      ['test', '-p', 'sdkwork-claw-admin-api', '--test', 'database_config_router'],
      env,
      settings,
    ),
    cargoStep(
      'admin api installation status tests',
      ['test', '-p', 'sdkwork-claw-admin-api', '--test', 'installation_status_route'],
      env,
      settings,
    ),
    cargoStep(
      'admin api product model route tests',
      ['test', '-p', 'sdkwork-claw-admin-api', '--test', 'product_model_route'],
      env,
      settings,
    ),
    cargoStep(
      'admin api sqlite product model route tests',
      ['test', '-p', 'sdkwork-claw-admin-api', '--test', 'sqlite_product_model_route'],
      env,
      settings,
    ),
  ];
}

function buildAppApiSteps(env, settings) {
  return [
    cargoStep('app api health tests', ['test', '-p', 'sdkwork-claw-app-api', '--test', 'health'], env, settings),
    cargoStep(
      'app api contract route tests',
      ['test', '-p', 'sdkwork-claw-app-api', '--test', 'contract_routes'],
      env,
      settings,
    ),
    cargoStep(
      'app api database router integration tests',
      ['test', '-p', 'sdkwork-claw-app-api', '--test', 'database_config_router'],
      env,
      settings,
    ),
    cargoStep(
      'app api session route tests',
      ['test', '-p', 'sdkwork-claw-app-api', '--test', 'app_session_route'],
      env,
      settings,
    ),
    cargoStep(
      'app api model ranking route tests',
      ['test', '-p', 'sdkwork-claw-app-api', '--test', 'model_rankings_route'],
      env,
      settings,
    ),
  ];
}

function buildGatewaySteps(env, settings) {
  return [
    cargoStep('gateway health tests', ['test', '-p', 'sdkwork-claw-gateway', '--test', 'health'], env, settings),
    cargoStep(
      'gateway edge server tests',
      ['test', '-p', 'sdkwork-claw-gateway', '--test', 'edge_server'],
      env,
      settings,
    ),
    cargoStep(
      'gateway database router integration tests',
      ['test', '-p', 'sdkwork-claw-gateway', '--test', 'database_config_router'],
      env,
      settings,
    ),
    cargoStep(
      'gateway provider passthrough route tests',
      ['test', '-p', 'sdkwork-claw-gateway', '--test', 'provider_passthrough_route'],
      env,
      settings,
    ),
    cargoStep(
      'gateway provider adapter invocation tests',
      ['test', '-p', 'sdkwork-claw-gateway', '--test', 'provider_adapter_invocation'],
      env,
      settings,
    ),
    cargoStep(
      'gateway OpenAI relay route tests',
      [
        'test',
        '-p',
        'sdkwork-claw-gateway',
        '--test',
        'openai_chat_relay_route',
        '--test',
        'openai_embeddings_relay_route',
        '--test',
        'openai_responses_relay_route',
      ],
      env,
      settings,
    ),
  ];
}

function buildProductRelaySteps(env, settings) {
  return [
    cargoStep(
      'product OpenAI-compatible HTTP relay tests',
      [
        'test',
        '-p',
        'sdkwork-claw-product',
        '--test',
        'openai_compatible_http_relay',
        '--test',
        'openai_compatible_chat_stream_http_relay',
        '--test',
        'openai_compatible_embeddings_http_relay',
        '--test',
        'openai_compatible_responses_http_relay',
      ],
      env,
      settings,
    ),
    cargoStep(
      'product secret-ref relay tests',
      [
        'test',
        '-p',
        'sdkwork-claw-product',
        '--test',
        'secret_ref_openai_compatible_http_relay',
        '--test',
        'secret_ref_openai_compatible_chat_stream_http_relay',
        '--test',
        'secret_ref_openai_compatible_embeddings_http_relay',
        '--test',
        'secret_ref_openai_compatible_responses_http_relay',
      ],
      env,
      settings,
    ),
    cargoStep(
      'product provider adapter API tests',
      [
        'test',
        '-p',
        'sdkwork-claw-product',
        '--test',
        'openai_chat_adapter_api',
        '--test',
        'openai_embeddings_adapter_api',
        '--test',
        'openai_responses_adapter_api',
      ],
      env,
      settings,
    ),
  ];
}

function buildRuntimeSteps(env, settings) {
  return [
    cargoStep(
      'runtime integration package group',
      [
        'test',
        '-p',
        'sdkwork-claw-product',
        '-p',
        'sdkwork-claw-gateway',
        '-p',
        'sdkwork-claw-admin-api',
        '-p',
        'sdkwork-claw-app-api',
        '-p',
        'sdkwork-claw-installer',
      ],
      env,
      settings,
    ),
  ];
}

function buildFullSteps(env, settings) {
  return [cargoStep('rust workspace tests', ['test', '--workspace'], env, settings)];
}

function buildRustTestPlan(settings, { env = process.env, platform = process.platform } = {}) {
  const profile = settings.profile || 'quick';
  if (!PROFILES.has(profile)) {
    throw new Error(`Unsupported rust test profile: ${profile}`);
  }
  const targetDir = normalizeTargetDir(profile, settings.targetDir, platform);
  const stepEnv = {
    ...env,
    CARGO_TARGET_DIR: targetDir,
  };
  if (profile !== 'full' && !stepEnv.SDKWORK_CLAW_HTTP_OPENAPI_BUILD_MODE) {
    stepEnv.SDKWORK_CLAW_HTTP_OPENAPI_BUILD_MODE = 'copy';
  }
  const planSettings = { ...settings, profile };
  const steps = {
    quick: buildQuickSteps,
    'admin-api': buildAdminApiSteps,
    'app-api': buildAppApiSteps,
    gateway: buildGatewaySteps,
    'product-relay': buildProductRelaySteps,
    runtime: buildRuntimeSteps,
    full: buildFullSteps,
  }[profile](stepEnv, planSettings);
  return { profile, targetDir, steps };
}

function commandLine(step) {
  return `${step.command} ${step.args.join(' ')}`;
}

function runStep(step, { dryRun = false } = {}) {
  if (dryRun) {
    console.log(commandLine(step));
    return Promise.resolve();
  }

  const startedAt = Date.now();
  console.error(`[run-claw-router-rust-tests] ${step.label}: ${commandLine(step)}`);
  return new Promise((resolve, reject) => {
    const child = spawn(step.command, step.args, {
      cwd: process.cwd(),
      env: step.env,
      stdio: 'inherit',
      windowsHide: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${step.label} exited with signal ${signal}`));
        return;
      }
      if ((code ?? 1) !== 0) {
        reject(new Error(`${step.label} exited with code ${code}`));
        return;
      }
      const elapsedSeconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      console.error(`[run-claw-router-rust-tests] ${step.label}: completed in ${elapsedSeconds}s`);
      resolve();
    });
  });
}

async function main() {
  const settings = parseArgs(process.argv.slice(2));
  if (settings.help) {
    printHelp();
    return;
  }
  const plan = buildRustTestPlan(settings);
  for (const step of plan.steps) {
    await runStep(step, { dryRun: settings.dryRun });
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\', '/'))) {
  main().catch((error) => {
    console.error(`[run-claw-router-rust-tests] ${error.message}`);
    process.exit(1);
  });
}

export {
  buildRustTestPlan,
  commandLine,
  normalizeTargetDir,
  parseArgs,
};
