#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { relative } from 'node:path';
import process from 'node:process';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    shell: process.platform === 'win32' && command.endsWith('.cmd'),
    windowsHide: process.platform === 'win32',
    ...options,
  });
  if (result.error) {
    throw result.error;
  }
  return result;
}

function runInherited(command, args) {
  const result = run(command, args, { stdio: 'inherit' });
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

function readCargoMetadata() {
  const result = run('cargo', ['metadata', '--format-version', '1', '--no-deps']);
  if ((result.status ?? 1) !== 0) {
    process.stderr.write(result.stderr || result.stdout);
    process.exit(result.status ?? 1);
  }
  return JSON.parse(result.stdout);
}

function formatWorkspace({ check }) {
  const metadata = readCargoMetadata();
  const packagesById = new Map(metadata.packages.map((pkg) => [pkg.id, pkg]));
  const workspacePackages = metadata.workspace_members
    .map((id) => packagesById.get(id))
    .filter(Boolean)
    .sort((left, right) => left.name.localeCompare(right.name));

  for (const pkg of workspacePackages) {
    const manifestPath = relative(process.cwd(), pkg.manifest_path);
    const args = ['fmt', '--manifest-path', manifestPath];
    if (check) {
      args.push('--check');
    }
    console.error(`[cargo-fmt-workspace] ${pkg.name}: cargo ${args.join(' ')}`);
    runInherited('cargo', args);
  }
}

const args = process.argv.slice(2);
formatWorkspace({
  check: args.includes('--check'),
});
