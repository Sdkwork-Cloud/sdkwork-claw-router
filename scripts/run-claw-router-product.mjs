#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function pnpmCommand(platform = process.platform) {
  return platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
}

function shellForPnpm(platform = process.platform) {
  return platform === 'win32';
}

function toPortablePath(value) {
  return value.replaceAll(path.sep, '/');
}

function appendForwardArgs(args, extraArgs) {
  return extraArgs.length > 0 ? [...args, ...extraArgs] : args;
}

function installCandidatesForMode(mode) {
  switch (mode) {
    case 'desktop':
    case 'service':
    case 'server':
    case 'browser':
    case 'check':
      return [toPortablePath(path.join('apps', 'sdkwork-claw-router-portal'))];
    default:
      return [];
  }
}

export function parseClawRouterProductArgs(argv) {
  const result = {
    mode: 'desktop',
    install: false,
    dryRun: false,
    help: false,
    extraArgs: [],
  };

  let modeSet = false;
  let forwardOnly = false;
  for (const arg of argv) {
    if (forwardOnly) {
      result.extraArgs.push(arg);
      continue;
    }
    if (arg === '--') {
      forwardOnly = true;
      continue;
    }
    if (arg === '--install') {
      result.install = true;
      continue;
    }
    if (arg === '--dry-run') {
      result.dryRun = true;
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      if (modeSet) {
        result.extraArgs.push(arg);
      } else {
        result.help = true;
      }
      continue;
    }
    if (!modeSet && !arg.startsWith('-')) {
      result.mode = arg;
      modeSet = true;
      continue;
    }
    result.extraArgs.push(arg);
  }

  return result;
}

function portalDesktopEnv(env) {
  return {
    ...env,
    SDKWORK_CLAW_DEPLOYMENT_MODE: 'desktop',
  };
}

function portalServiceEnv(env) {
  return {
    ...portalDesktopEnv(env),
    SDKWORK_CLAW_SERVICE_MODE: '1',
    SDKWORK_CLAW_PORTAL_START_HIDDEN: '1',
  };
}

export function createClawRouterProductLaunchPlan({
  workspaceRoot = path.resolve(__dirname, '..'),
  mode = 'desktop',
  install = false,
  platform = process.platform,
  env = process.env,
  extraArgs = [],
} = {}) {
  const portalRelativeDir = toPortablePath(path.join('apps', 'sdkwork-claw-router-portal'));
  const portalAbsoluteDir = path.join(workspaceRoot, portalRelativeDir);
  const pnpm = pnpmCommand(platform);
  const shell = shellForPnpm(platform);
  const nodeCommand = process.execPath;
  const plan = [];

  for (const relativeDir of installCandidatesForMode(mode)) {
    const absoluteDir = path.join(workspaceRoot, relativeDir);
    if (!install && existsSync(path.join(absoluteDir, 'node_modules'))) {
      continue;
    }

    plan.push({
      label: 'portal install',
      command: pnpm,
      args: ['--dir', relativeDir, 'install'],
      cwd: workspaceRoot,
      env,
      shell,
      windowsHide: platform === 'win32',
    });
  }

  switch (mode) {
    case 'desktop':
      plan.push({
        label: 'portal local desktop runtime',
        command: pnpm,
        args: appendForwardArgs(['--dir', portalRelativeDir, 'browser:dev'], extraArgs),
        cwd: workspaceRoot,
        env: portalDesktopEnv(env),
        shell,
        windowsHide: platform === 'win32',
      });
      return plan;
    case 'service':
      plan.push({
        label: 'portal local service runtime',
        command: pnpm,
        args: appendForwardArgs(['--dir', portalRelativeDir, 'browser:dev'], extraArgs),
        cwd: workspaceRoot,
        env: portalServiceEnv(env),
        shell,
        windowsHide: platform === 'win32',
      });
      return plan;
    case 'server':
      plan.push({
        label: 'server development workspace',
        command: nodeCommand,
        args: [
          path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs'),
          ...extraArgs,
        ],
        cwd: workspaceRoot,
        env,
        shell: false,
        windowsHide: platform === 'win32',
      });
      return plan;
    case 'plan':
      plan.push({
        label: 'server development plan',
        command: nodeCommand,
        args: [
          path.join(workspaceRoot, 'scripts', 'dev', 'start-workspace.mjs'),
          '--dry-run',
          ...extraArgs,
        ],
        cwd: workspaceRoot,
        env,
        shell: false,
        windowsHide: platform === 'win32',
      });
      return plan;
    case 'browser':
      plan.push({
        label: 'portal browser runtime',
        command: pnpm,
        args: appendForwardArgs(['--dir', portalRelativeDir, 'browser:dev'], extraArgs),
        cwd: workspaceRoot,
        env,
        shell,
        windowsHide: platform === 'win32',
      });
      return plan;
    case 'check':
      plan.push({
        label: 'portal product check',
        command: pnpm,
        args: ['--dir', portalRelativeDir, 'product:check'],
        cwd: workspaceRoot,
        env,
        shell,
        windowsHide: platform === 'win32',
      });
      return plan;
    default:
      throw new Error(
        `Unsupported claw router product mode: ${mode}. Expected one of desktop, service, server, plan, check, browser.`,
      );
  }
}

function printHelp() {
  console.log(`Usage: node scripts/run-claw-router-product.mjs [mode] [options] [mode-args...]

Start sdkwork-claw-router through a root pnpm-compatible entrypoint.

Modes:
  desktop  Start the portal in local desktop deployment mode (default)
  service  Start the portal with local service-mode environment flags
  server   Start Rust gateway/admin/app services plus the portal dev server
  plan     Print the resolved server development URLs and command plan
  check    Run the portal product check
  browser  Start only the standalone portal browser dev server

Options:
  --install   Run portal pnpm install before starting
  --dry-run   Print the planned commands without running them
  -h, --help  Show this help

Examples:
  pnpm desktop:dev
  pnpm service:dev
  pnpm server:dev -- --gateway-bind 0.0.0.0:19080
  pnpm server:plan
`);
}

function formatCommand(step) {
  return `${step.command} ${step.args.join(' ')}`;
}

async function printDryRun(step) {
  console.error(`[run-claw-router-product] ${formatCommand(step)}`);

  const startWorkspacePath = path.join(step.cwd, 'scripts', 'dev', 'start-workspace.mjs');
  if (step.command === process.execPath && path.resolve(step.args[0] ?? '') === startWorkspacePath) {
    const workspaceModule = await import(pathToFileURL(startWorkspacePath).href);
    const forwardedArgs = step.args.slice(1).filter((arg) => arg !== '--dry-run');
    const settings = workspaceModule.parseWorkspaceArgs([
      ...forwardedArgs,
      '--dry-run',
    ]);
    const plan = workspaceModule.buildWorkspaceCommandPlan(settings, {
      workspaceRoot: step.cwd,
    });
    for (const line of workspaceModule.renderWorkspaceDryRun(settings, plan)) {
      console.log(line);
    }
  }
}

async function runStep(step) {
  await new Promise((resolve, reject) => {
    const child = spawn(step.command, step.args, {
      cwd: step.cwd,
      env: step.env,
      stdio: 'inherit',
      shell: step.shell ?? false,
      windowsHide: step.windowsHide ?? process.platform === 'win32',
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
  const settings = parseClawRouterProductArgs(process.argv.slice(2));
  if (settings.help) {
    printHelp();
    return;
  }

  const plan = createClawRouterProductLaunchPlan({
    mode: settings.mode,
    install: settings.install,
    extraArgs: settings.extraArgs,
  });

  for (const step of plan) {
    if (settings.dryRun) {
      await printDryRun(step);
      continue;
    }

    console.error(`[run-claw-router-product] ${formatCommand(step)}`);
    await runStep(step);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((error) => {
    console.error(`[run-claw-router-product] ${error.message}`);
    process.exit(1);
  });
}
