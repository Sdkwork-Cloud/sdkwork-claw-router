#!/usr/bin/env node

import { spawn } from 'node:child_process';
import process from 'node:process';

function printHelp() {
  console.log(`Usage: node scripts/verify-claw-router-product.mjs [options]

Run the standard sdkwork-claw-router verification sequence.

Options:
  --fast                 Run the low-cost local iteration gate for Codex loops.
  --with-edge-dev-smoke  Also run the real pnpm dev edge server smoke.
  --skip-edge-dev-smoke
                         Skip the real pnpm dev edge server smoke even when CI or env opts in.
  --skip-rust-tests      Skip cargo test --workspace.
  --skip-python-tests    Skip python -B -m unittest discover tests.
  --skip-schema-gate     Skip python -B -m tools.schema_quality_gate.
  --skip-contract-guardians
                         Skip SDK, architecture, OpenAPI, frontend, Flyway, and legacy audits.
  --dry-run              Print commands without executing them.
  -h, --help             Show this help.
`);
}

function parseArgs(argv) {
  const settings = {
    fast: false,
    withEdgeDevSmoke: false,
    skipEdgeDevSmoke: false,
    skipRustTests: false,
    skipPythonTests: false,
    skipSchemaGate: false,
    skipContractGuardians: false,
    dryRun: false,
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--') {
      continue;
    }
    switch (arg) {
      case '--fast':
        settings.fast = true;
        break;
      case '--with-edge-dev-smoke':
        settings.withEdgeDevSmoke = true;
        settings.skipEdgeDevSmoke = false;
        break;
      case '--skip-edge-dev-smoke':
        settings.withEdgeDevSmoke = false;
        settings.skipEdgeDevSmoke = true;
        break;
      case '--skip-rust-tests':
        settings.skipRustTests = true;
        break;
      case '--skip-python-tests':
        settings.skipPythonTests = true;
        break;
      case '--skip-schema-gate':
        settings.skipSchemaGate = true;
        break;
      case '--skip-contract-guardians':
        settings.skipContractGuardians = true;
        break;
      case '--dry-run':
        settings.dryRun = true;
        break;
      case '--help':
      case '-h':
        settings.help = true;
        break;
      default:
        throw new Error(`Unsupported verify option: ${arg}`);
    }
  }

  return settings;
}

function mergeRustFlags(existing, requiredFlag) {
  const flags = (existing ?? '').trim();
  if (!flags) {
    return requiredFlag;
  }
  if (flags.includes(requiredFlag)) {
    return flags;
  }
  return `${flags} ${requiredFlag}`;
}

function pnpmCommand(platform = process.platform) {
  return platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
}

function isEnabled(value) {
  return ['1', 'true', 'yes', 'on'].includes(String(value ?? '').trim().toLowerCase());
}

function shouldRunEdgeDevSmoke(settings, env = process.env) {
  if (settings.skipEdgeDevSmoke || isEnabled(env.CLAWROUTER_EDGE_DEV_SMOKE_SKIP)) {
    return false;
  }
  return (
    settings.withEdgeDevSmoke === true
    || isEnabled(env.CLAWROUTER_VERIFY_EDGE_DEV_SMOKE)
    || isEnabled(env.CLAWROUTER_EDGE_DEV_SMOKE_REQUIRED)
  );
}

function cargoVerifyEnv(env = process.env) {
  return {
    ...env,
    CARGO_TARGET_DIR: env.CLAWROUTER_VERIFY_CARGO_TARGET_DIR || env.CARGO_TARGET_DIR || 'target-verify',
  };
}

const COMMERCIAL_CONTRACT_GUARDIANS = [
  ['repository delivery guard', 'tools.repository_delivery_guardian'],
  ['clawrouter generated SDK guard', 'tools.clawrouter_sdk_guardian'],
  ['clawrouter project skill guard', 'tools.clawrouter_skill_guardian'],
  ['architecture standard guard', 'tools.architecture_standard_guardian'],
  ['rust backend architecture guard', 'tools.rust_backend_architecture_guardian'],
  ['gateway openapi freshness check', 'tools.clawrouter_gateway_openapi_generator', ['--check']],
  ['openapi precision audit', 'tools.clawrouter_openapi_precision_audit'],
  ['payload SDK audit', 'tools.clawrouter_payload_sdk_audit'],
  ['frontend static source manifest check', 'tools.frontend_static_source_manifest', ['--check']],
  ['frontend contract guard', 'tools.frontend_contract_guardian'],
  ['schema registry guard', 'tools.schema_guardian'],
  ['flyway schema contract audit', 'tools.flyway_schema_contract_audit'],
  ['frontend operation audit', 'tools.frontend_operation_audit'],
  ['frontend field audit', 'tools.frontend_field_audit'],
  ['java legacy contract audit', 'tools.java_legacy_contract_audit'],
];

function buildCommercialContractGuardianPlan(env = process.env) {
  return COMMERCIAL_CONTRACT_GUARDIANS.map(([label, moduleName, extraArgs = []]) => ({
    label,
    command: 'python',
    args: ['-B', '-m', moduleName, ...extraArgs],
    env,
  }));
}

function buildFastVerificationPlan(env = process.env) {
  return [
    {
      label: 'sdkwork-models catalog check',
      command: pnpmCommand(),
      args: ['models:check'],
      env,
    },
    {
      label: 'claw router download catalog check',
      command: pnpmCommand(),
      args: ['downloads:check'],
      env,
    },
    {
      label: 'app store seed check',
      command: pnpmCommand(),
      args: ['app-store:seed:check'],
      env,
    },
    {
      label: 'skills seed check',
      command: pnpmCommand(),
      args: ['skills:seed:check'],
      env,
    },
    {
      label: 'repository delivery guard',
      command: 'python',
      args: ['-B', '-m', 'tools.repository_delivery_guardian'],
      env,
    },
    {
      label: 'tooling contract tests',
      command: 'node',
      args: ['scripts/run-claw-router-product.test.mjs'],
      env,
    },
    {
      label: 'portal auth runtime tests',
      command: pnpmCommand(),
      args: ['--dir', 'apps/sdkwork-claw-router-portal', 'exec', 'tsx', 'auth-runtime.test.ts'],
      env,
    },
    {
      label: 'frontend source hygiene tests',
      command: 'python',
      args: ['-B', '-m', 'unittest', 'tests.test_frontend_source_hygiene_standard'],
      env,
    },
  ];
}

function buildVerificationPlan(settings, env = process.env) {
  if (settings.fast) {
    return buildFastVerificationPlan(env);
  }

  const rustEnv = cargoVerifyEnv(env);
  const plan = [
    {
      label: 'sdkwork-models catalog check',
      command: pnpmCommand(),
      args: ['models:check'],
      env,
    },
    {
      label: 'claw router download catalog check',
      command: pnpmCommand(),
      args: ['downloads:check'],
      env,
    },
    {
      label: 'rust format',
      command: 'node',
      args: ['scripts/cargo-fmt-workspace.mjs', '--check'],
      env,
    },
    {
      label: 'rust compile warnings gate',
      command: 'cargo',
      args: ['check', '--all-targets'],
      env: {
        ...rustEnv,
        RUSTFLAGS: mergeRustFlags(env.RUSTFLAGS, '-D warnings'),
      },
    },
    {
      label: 'tooling contract tests',
      command: 'node',
      args: ['scripts/run-claw-router-product.test.mjs'],
      env,
    },
  ];

  if (!settings.skipContractGuardians) {
    plan.push(...buildCommercialContractGuardianPlan(env));
  }
  plan.push({
    label: 'frontend source hygiene tests',
    command: 'python',
    args: ['-B', '-m', 'unittest', 'tests.test_frontend_source_hygiene_standard'],
    env,
  });
  plan.push({
    label: 'portal vite config runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/vite-config-runtime.test.ts'],
    env,
  });
  if (shouldRunEdgeDevSmoke(settings, env)) {
    plan.push({
      label: 'edge dev server smoke',
      command: 'node',
      args: ['scripts/smoke-edge-dev-server.mjs'],
      env: rustEnv,
    });
  }
  plan.push({
    label: 'app SDK runtime build',
    command: pnpmCommand(),
    args: ['--dir', 'sdks/clawrouter-app-sdk/clawrouter-app-sdk-typescript', 'build'],
    env,
  });
  plan.push({
    label: 'backend SDK runtime build',
    command: pnpmCommand(),
    args: ['--dir', 'sdks/clawrouter-backend-sdk/clawrouter-backend-sdk-typescript', 'build'],
    env,
  });
  plan.push({
    label: 'open SDK runtime build',
    command: pnpmCommand(),
    args: ['--dir', 'sdks/clawrouter-open-sdk/clawrouter-open-sdk-typescript', 'build'],
    env,
  });
  plan.push({
    label: 'portal frontend typecheck',
    command: pnpmCommand(),
    args: ['--dir', 'apps/sdkwork-claw-router-portal', 'typecheck'],
    env,
  });
  plan.push({
    label: 'production artifact build',
    command: pnpmCommand(),
    args: ['build'],
    env,
  });
  plan.push({
    label: 'portal bundle budget audit',
    command: 'node',
    args: ['apps/sdkwork-claw-router-portal/scripts/audit-bundle-budget.mjs'],
    env,
  });
  plan.push({
    label: 'portal production edge smoke',
    command: 'cargo',
    args: ['test', '-p', 'sdkwork-claw-gateway', '--test', 'edge_server', 'edge_server_can_serve_portal_dist_without_node_server'],
    env: rustEnv,
  });
  plan.push({
    label: 'portal production browser DOM smoke',
    command: 'node',
    args: ['apps/sdkwork-claw-router-portal/scripts/smoke-production-browser.mjs'],
    env,
  });
  plan.push({
    label: 'portal commons runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/commons-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal auth runtime tests',
    command: pnpmCommand(),
    args: ['--dir', 'apps/sdkwork-claw-router-portal', 'exec', 'tsx', 'auth-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal models runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/models-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal rankings runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/rankings-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal courses runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/courses-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal forum runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/forum-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal skills runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/skills-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal app center runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/app-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal home downloads runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/home-downloads-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal api reference playground runtime tests',
    command: pnpmCommand(),
    args: ['--dir', 'apps/sdkwork-claw-router-portal', 'exec', 'tsx', 'api-reference-playground-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal api reference SSR smoke tests',
    command: 'node',
    args: ['apps/sdkwork-claw-router-portal/api-reference-ssr-smoke.test.cjs'],
    env,
  });
  plan.push({
    label: 'portal playground chat runtime tests',
    command: pnpmCommand(),
    args: ['--dir', 'apps/sdkwork-claw-router-portal', 'exec', 'tsx', 'playground-chat-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal api key runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/api-key-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal commerce business runtime tests',
    command: pnpmCommand(),
    args: ['--dir', 'apps/sdkwork-claw-router-portal', 'exec', 'tsx', 'commerce-business-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal console app runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/console-app-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal console agents runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/console-agents-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal console routing runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/console-routing-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal console operations runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/console-operations-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal admin group runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/admin-group-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal admin channel runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/admin-channel-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal admin user runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/admin-user-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal admin model runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/admin-model-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal admin app runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/admin-app-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal admin skill runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/admin-skill-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal admin ratelimit runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/admin-ratelimit-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal admin marketing runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/admin-marketing-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal admin operations runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/admin-operations-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal admin announcement runtime tests',
    command: 'node',
    args: ['--experimental-strip-types', 'apps/sdkwork-claw-router-portal/admin-announcement-runtime.test.ts'],
    env,
  });
  plan.push({
    label: 'portal models SSR smoke tests',
    command: 'node',
    args: ['apps/sdkwork-claw-router-portal/models-ssr-smoke.test.cjs'],
    env,
  });
  if (!settings.skipRustTests) {
    plan.push({
      label: 'rust workspace tests',
      command: 'cargo',
      args: ['test', '--workspace'],
      env: rustEnv,
    });
  }
  if (!settings.skipPythonTests) {
    plan.push({
      label: 'python standard tests',
      command: 'python',
      args: ['-B', '-m', 'unittest', 'discover', 'tests'],
      env,
    });
  }
  if (!settings.skipSchemaGate) {
    plan.push({
      label: 'schema quality gate',
      command: 'python',
      args: ['-B', '-m', 'tools.schema_quality_gate'],
      env,
    });
  }

  return plan;
}

function runStep(step, { dryRun = false } = {}) {
  const commandLine = `${step.command} ${step.args.join(' ')}`;
  if (dryRun) {
    console.log(commandLine);
    return Promise.resolve();
  }

  console.error(`[verify-claw-router-product] ${step.label}: ${commandLine}`);
  return new Promise((resolve, reject) => {
    const child = spawn(step.command, step.args, {
      cwd: process.cwd(),
      env: step.env,
      stdio: 'inherit',
      shell: step.shell ?? (process.platform === 'win32' && step.command.endsWith('.cmd')),
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

  for (const step of buildVerificationPlan(settings)) {
    await runStep(step, { dryRun: settings.dryRun });
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\', '/'))) {
  main().catch((error) => {
    console.error(`[verify-claw-router-product] ${error.message}`);
    process.exit(1);
  });
}

export {
  buildFastVerificationPlan,
  buildVerificationPlan,
  cargoVerifyEnv,
  mergeRustFlags,
  parseArgs,
  pnpmCommand,
  shouldRunEdgeDevSmoke,
};
