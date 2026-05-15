#!/usr/bin/env node

import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_WORKSPACE_ROOT = path.resolve(__dirname, '..');
const DEFAULT_APPS_ROOT = path.resolve(DEFAULT_WORKSPACE_ROOT, '..');
const DEFAULT_ENVIRONMENT = 'production';
const DEFAULT_CHANNEL = 'STABLE';

function printHelp() {
  console.log(`Usage: node scripts/update-app-store-seed.mjs [options]

Refresh SDKWork App Store install-time seed data from all apps under spring-ai-plus-business/apps.

Options:
  --apps-root <path>       Apps root to scan, default ../ from sdkwork-claw-router.
  --environment <name>     PlusApp projection environment, default production.
  --channel <name>         PlusApp release channel, default STABLE.
  --platform <name>        Optional package platform selector.
  --architecture <value>   Optional package architecture selector.
  --distro <value>         Optional Linux distro selector.
  --check                  Check data/app seed files without writing them.
  --sync-db                After writing seed files, run sdkwork-claw-installer ensure.
  --no-initialize-missing  Do not create missing sdkwork.app.config.json files.
  --force                  Rewrite existing app manifests through the standard initializer.
  --dry-run                Print intended writes and commands without changing files or database.
  --json                   Print a machine-readable summary.
  -h, --help               Show this help.

Examples:
  pnpm app-store:seed:update
  pnpm app-store:seed:check
  pnpm app-store:seed:update -- --sync-db
`);
}

function nextValue(argv, index, name) {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value`);
  }
  return value;
}

function normalizeNonBlank(value, name) {
  const normalized = `${value ?? ''}`.trim();
  if (!normalized) {
    throw new Error(`${name} must not be blank`);
  }
  return normalized;
}

export function parseAppStoreSeedArgs(argv) {
  const settings = {
    appsRoot: DEFAULT_APPS_ROOT,
    environment: DEFAULT_ENVIRONMENT,
    channel: DEFAULT_CHANNEL,
    platform: null,
    architecture: null,
    distro: null,
    check: false,
    syncDb: false,
    initializeMissing: true,
    force: false,
    dryRun: false,
    json: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case '--apps-root':
        settings.appsRoot = path.resolve(nextValue(argv, index, arg));
        index += 1;
        break;
      case '--environment':
        settings.environment = normalizeNonBlank(nextValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--channel':
        settings.channel = normalizeNonBlank(nextValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--platform':
        settings.platform = normalizeNonBlank(nextValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--architecture':
        settings.architecture = normalizeNonBlank(nextValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--distro':
        settings.distro = normalizeNonBlank(nextValue(argv, index, arg), arg);
        index += 1;
        break;
      case '--check':
        settings.check = true;
        break;
      case '--sync-db':
        settings.syncDb = true;
        break;
      case '--no-initialize-missing':
        settings.initializeMissing = false;
        break;
      case '--force':
        settings.force = true;
        break;
      case '--dry-run':
        settings.dryRun = true;
        break;
      case '--json':
        settings.json = true;
        break;
      case '--help':
      case '-h':
        settings.help = true;
        break;
      case '--':
        break;
      default:
        throw new Error(`unknown app store seed option: ${arg}`);
    }
  }

  if (settings.check && settings.syncDb) {
    throw new Error('--check cannot be combined with --sync-db');
  }
  if (settings.check && settings.force) {
    throw new Error('--check cannot be combined with --force');
  }

  return settings;
}

export function buildAppStoreSeedCommandPlan(settings, { workspaceRoot = DEFAULT_WORKSPACE_ROOT } = {}) {
  const appSeedPath = path.join(workspaceRoot, 'data', 'app', 'sdkwork-apps.json');
  const categorySeedPath = path.join(workspaceRoot, 'data', 'app', 'sdkwork-app-categories.json');
  const mode = settings.check ? 'check' : settings.dryRun ? 'dry-run' : 'write';
  const steps = [];

  if (settings.initializeMissing) {
    steps.push({
      name: 'initialize-missing-app-manifests',
      mode,
      appsRoot: settings.appsRoot,
      force: settings.force,
    });
  }

  steps.push({
    name: 'export-plus-app-seed',
    mode,
    appsRoot: settings.appsRoot,
    output: appSeedPath,
    environment: settings.environment,
    channel: settings.channel,
  });
  steps.push({
    name: 'generate-app-category-seed',
    mode,
    seed: appSeedPath,
    output: categorySeedPath,
  });

  if (settings.syncDb) {
    steps.push({
      name: 'sync-database',
      command: 'cargo',
      args: ['run', '-p', 'sdkwork-claw-installer', '--', 'ensure'],
      requiresDatabaseUrl: true,
    });
  }

  return {
    workspaceRoot,
    appSeedPath,
    categorySeedPath,
    steps,
  };
}

async function loadAppStandardInitModule() {
  const modulePath = path.join(DEFAULT_APPS_ROOT, 'scripts', 'lib', 'sdkwork-app-standard-init-all.mjs');
  return import(pathToFileURL(modulePath).href);
}

function posixRelative(from, to) {
  return path.relative(from, to).replace(/\\/gu, '/');
}

function firstJsonMismatch(left, right, location = '$') {
  if (JSON.stringify(left) === JSON.stringify(right)) {
    return null;
  }
  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return `${location}.length expected ${left.length} actual ${right.length}`;
    }
    for (let index = 0; index < left.length; index += 1) {
      const mismatch = firstJsonMismatch(left[index], right[index], `${location}[${index}]`);
      if (mismatch) {
        return mismatch;
      }
    }
    return null;
  }
  if (left && right && typeof left === 'object' && typeof right === 'object') {
    const keys = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort();
    for (const key of keys) {
      if (!Object.hasOwn(left, key)) {
        return `${location}.${key} missing from expected`;
      }
      if (!Object.hasOwn(right, key)) {
        return `${location}.${key} missing from actual`;
      }
      const mismatch = firstJsonMismatch(left[key], right[key], `${location}.${key}`);
      if (mismatch) {
        return mismatch;
      }
    }
    return null;
  }
  return `${location} expected ${JSON.stringify(left)} actual ${JSON.stringify(right)}`;
}

async function readJsonIfExists(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function runCommand(command, args, {
  cwd,
  env = process.env,
  dryRun = false,
  quiet = false,
} = {}) {
  if (dryRun) {
    if (!quiet) {
      console.log(`${command} ${args.join(' ')}`);
    }
    return;
  }

  await new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: quiet ? ['ignore', 'pipe', 'pipe'] : 'inherit',
      windowsHide: process.platform === 'win32',
    });
    let output = '';
    if (quiet) {
      child.stdout?.on('data', (chunk) => {
        output += chunk.toString();
      });
      child.stderr?.on('data', (chunk) => {
        output += chunk.toString();
      });
    }
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${command} exited with signal ${signal}`));
        return;
      }
      if ((code ?? 1) !== 0) {
        const details = output.trim();
        reject(new Error(details ? `${command} exited with code ${code}: ${details}` : `${command} exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}

async function initializeMissingAppManifests(settings, initModule) {
  if (!settings.initializeMissing) {
    return {
      planned: 0,
      written: 0,
      checked: false,
    };
  }

  const results = await initModule.initializeSdkworkAppConfigs(settings.appsRoot, {
    force: settings.force,
    dryRun: settings.check || settings.dryRun,
  });
  const failed = results.filter((result) => !result.validation?.ok);
  if (failed.length > 0) {
    throw new Error(
      [
        'sdkwork app manifest initialization failed:',
        ...failed.flatMap((result) =>
          (result.validation?.errors ?? ['unknown validation error']).map((error) =>
            `${posixRelative(settings.appsRoot, result.configPath)}: ${error}`,
          ),
        ),
      ].join('\n'),
    );
  }

  if (settings.check && results.length > 0) {
    throw new Error(
      [
        'app store seed check found app roots without sdkwork.app.config.json:',
        ...results.map((result) => `- ${posixRelative(settings.appsRoot, result.appRoot)}`),
        'Run pnpm app-store:seed:update to initialize the missing manifests.',
      ].join('\n'),
    );
  }

  return {
    planned: results.length,
    written: settings.check || settings.dryRun ? 0 : results.length,
    checked: settings.check,
  };
}

async function exportAppSeed(settings, initModule, appSeedPath) {
  const result = await initModule.buildSdkworkAppPlusAppRegistrationBundle(settings.appsRoot, {
    environment: settings.environment,
    channel: settings.channel,
    platform: settings.platform,
    architecture: settings.architecture,
    distro: settings.distro,
  });
  if (!result.ok) {
    throw new Error(
      [
        'app store PlusApp seed export failed:',
        ...result.errors,
      ].join('\n'),
    );
  }

  const rendered = `${JSON.stringify(result, null, 2)}\n`;
  const existing = await readJsonIfExists(appSeedPath);
  const mismatch = existing ? firstJsonMismatch(result, existing) : `missing file: ${appSeedPath}`;
  if (settings.check && mismatch) {
    throw new Error(
      `app store PlusApp seed is stale: ${appSeedPath}\nfirst mismatch: ${mismatch}\nRun pnpm app-store:seed:update.`,
    );
  }
  if (!settings.check && !settings.dryRun) {
    await fs.mkdir(path.dirname(appSeedPath), { recursive: true });
    await fs.writeFile(appSeedPath, rendered, 'utf8');
  }

  return {
    appCount: result.apps.length,
    written: !settings.check && !settings.dryRun,
    changed: Boolean(mismatch),
  };
}

async function updateCategorySeed(settings, workspaceRoot, appSeedPath, categorySeedPath) {
  const args = ['-B', '-m', 'tools.app_seed_category_manifest', '--root', workspaceRoot, '--seed', appSeedPath, '--output', categorySeedPath];
  if (settings.check || settings.dryRun) {
    args.push('--check');
  }
  await runCommand('python', args, {
    cwd: workspaceRoot,
    dryRun: false,
    quiet: settings.json,
  });
  const categorySeed = await readJsonIfExists(categorySeedPath);
  return {
    categoryCount: categorySeed?.count ?? 0,
    written: !settings.check && !settings.dryRun,
  };
}

async function syncDatabase(settings, workspaceRoot) {
  if (!settings.syncDb) {
    return {
      requested: false,
      ran: false,
    };
  }

  const databaseUrl = `${process.env.SDKWORK_CLAW_DATABASE_URL ?? ''}`.trim();
  if (!databaseUrl && !settings.dryRun) {
    throw new Error('--sync-db requires SDKWORK_CLAW_DATABASE_URL to be set');
  }

  await runCommand('cargo', ['run', '-p', 'sdkwork-claw-installer', '--', 'ensure'], {
    cwd: workspaceRoot,
    dryRun: settings.dryRun,
    quiet: settings.json,
  });
  return {
    requested: true,
    ran: !settings.dryRun,
  };
}

async function runAppStoreSeedUpdate(settings, { workspaceRoot = DEFAULT_WORKSPACE_ROOT } = {}) {
  const plan = buildAppStoreSeedCommandPlan(settings, { workspaceRoot });
  const initModule = await loadAppStandardInitModule();

  const initialization = await initializeMissingAppManifests(settings, initModule);
  const appSeed = await exportAppSeed(settings, initModule, plan.appSeedPath);
  const categorySeed = await updateCategorySeed(settings, workspaceRoot, plan.appSeedPath, plan.categorySeedPath);
  const database = await syncDatabase(settings, workspaceRoot);

  return {
    ok: true,
    mode: settings.check ? 'check' : settings.dryRun ? 'dry-run' : 'write',
    appsRoot: settings.appsRoot,
    appSeedPath: plan.appSeedPath,
    categorySeedPath: plan.categorySeedPath,
    appCount: appSeed.appCount,
    categoryCount: categorySeed.categoryCount,
    initializedManifests: initialization.written,
    plannedManifests: initialization.planned,
    seedChanged: appSeed.changed,
    databaseSynced: database.ran,
    plan,
  };
}

function printSummary(summary) {
  const action = summary.mode === 'check' ? 'checked' : summary.mode === 'dry-run' ? 'planned' : 'updated';
  console.log(`[app-store-seed] ${action} App Store seed data`);
  console.log(`[app-store-seed] appsRoot=${summary.appsRoot}`);
  console.log(`[app-store-seed] apps=${summary.appCount} categories=${summary.categoryCount}`);
  console.log(`[app-store-seed] appSeed=${summary.appSeedPath}`);
  console.log(`[app-store-seed] categorySeed=${summary.categorySeedPath}`);
  if (summary.plannedManifests > 0) {
    console.log(`[app-store-seed] initializedManifests=${summary.initializedManifests}`);
  }
  if (summary.databaseSynced) {
    console.log('[app-store-seed] database synchronized through sdkwork-claw-installer ensure');
  }
}

async function main() {
  const settings = parseAppStoreSeedArgs(process.argv.slice(2));
  if (settings.help) {
    printHelp();
    return;
  }
  const summary = await runAppStoreSeedUpdate(settings);
  if (settings.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }
  printSummary(summary);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : `${error}`;
    console.error(`[app-store-seed] ${message}`);
    process.exitCode = 1;
  });
}
