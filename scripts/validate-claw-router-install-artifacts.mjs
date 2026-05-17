#!/usr/bin/env node

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { gunzipSync } from 'node:zlib';
import { createInstallPackagePlan } from './plan-claw-router-install-packages.mjs';

function printHelp() {
  console.log(`Usage: node scripts/validate-claw-router-install-artifacts.mjs --package-id <id> --artifact-path <path> [options]

Validate release package payload layout before upload.

Options:
  --package-id <id>       Package id from install package plan.
  --artifact-path <path>  Built package artifact path.
  --version <value>       Package version used by the release build.
  --json                  Print machine-readable JSON.
  -h, --help              Show this help.
`);
}

function parseValidateArgs(argv = process.argv.slice(2)) {
  const settings = {
    artifactPath: null,
    help: false,
    json: false,
    packageId: null,
    version: '0.3.0',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case '--artifact-path':
        settings.artifactPath = requireValue(argv, index, arg);
        index += 1;
        break;
      case '--package-id':
        settings.packageId = requireValue(argv, index, arg);
        index += 1;
        break;
      case '--version':
        settings.version = requireValue(argv, index, arg);
        index += 1;
        break;
      case '--json':
        settings.json = true;
        break;
      case '--help':
      case '-h':
        settings.help = true;
        break;
      default:
        throw new Error(`Unsupported install artifact validation option: ${arg}`);
    }
  }

  return settings;
}

function requireValue(argv, index, flag) {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function validateInstallArtifact(settings) {
  const issues = [];
  const artifactPath = settings.artifactPath ? path.resolve(settings.artifactPath) : null;
  if (!settings.packageId) {
    issues.push('--package-id is required');
  }
  if (!artifactPath) {
    issues.push('--artifact-path is required');
  } else if (!existsSync(artifactPath)) {
    issues.push(`artifact does not exist: ${artifactPath}`);
  }
  if (issues.length > 0) {
    return { ok: false, issues, packageId: settings.packageId, artifactPath };
  }

  const installPlan = createInstallPackagePlan({ version: settings.version });
  const packageItem = installPlan.packages.find((item) => item.id === settings.packageId);
  if (!packageItem) {
    issues.push(`unknown package id: ${settings.packageId}`);
    return { ok: false, issues, packageId: settings.packageId, artifactPath };
  }

  const artifactBytes = readFileSync(artifactPath);
  if (artifactBytes.length === 0) {
    issues.push(`artifact is empty: ${artifactPath}`);
  }
  const artifactName = path.basename(artifactPath);
  if (!artifactName.startsWith(`clawrouter-${packageItem.artifactId}-${packageItem.version}.`)) {
    issues.push(`artifact name ${artifactName} does not match ${packageItem.artifactId} ${packageItem.version}`);
  }

  const extension = artifactExtension(artifactName);
  const adjacentManifest = readAdjacentManifest(artifactPath, extension, issues);
  if (adjacentManifest) {
    issues.push(...validatePackageManifest(packageItem, adjacentManifest));
  }
  if (packageItem.deploymentMode === 'service' || packageItem.deploymentMode === 'desktop') {
    if (packageItem.platform === 'linux') {
      if (extension !== 'deb') {
        issues.push(`${packageItem.id} native Linux package must be a .deb artifact`);
      } else {
        issues.push(...validateDebianArtifact(packageItem, artifactBytes));
      }
    } else if (packageItem.platform === 'macos') {
      if (extension !== 'pkg') {
        issues.push(`${packageItem.id} native macOS package must be a .pkg artifact`);
      }
    } else if (packageItem.platform === 'windows') {
      if (extension !== 'msi') {
        issues.push(`${packageItem.id} native Windows package must be a .msi artifact`);
      }
    }
  } else if (extension === 'tar.gz') {
    issues.push(...validateTarGzArtifact(packageItem, artifactBytes));
  } else if (extension === 'zip') {
    issues.push(...validateZipArtifact(packageItem, artifactBytes));
  } else {
    issues.push(`unsupported artifact extension for ${packageItem.id}: ${extension}`);
  }

  return {
    ok: issues.length === 0,
    issues,
    packageId: packageItem.id,
    artifactPath,
    artifactName,
    extension,
  };
}

function artifactExtension(fileName) {
  if (fileName.endsWith('.tar.gz')) {
    return 'tar.gz';
  }
  return path.extname(fileName).replace(/^\./u, '');
}

function readAdjacentManifest(artifactPath, extension, issues) {
  const manifestPath = extension === 'tar.gz'
    ? artifactPath.replace(/\.tar\.gz$/u, '.manifest.json')
    : artifactPath.replace(new RegExp(`\\.${escapeRegExp(extension)}$`, 'u'), '.manifest.json');
  if (!existsSync(manifestPath)) {
    issues.push(`missing adjacent manifest: ${manifestPath}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    issues.push(`adjacent manifest is invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function validateDebianArtifact(packageItem, artifactBytes) {
  const issues = [];
  const arEntries = readArEntries(artifactBytes);
  for (const requiredArEntry of ['debian-binary', 'control.tar.gz', 'data.tar.gz']) {
    if (!arEntries.has(requiredArEntry)) {
      issues.push(`.deb missing ${requiredArEntry}`);
    }
  }
  if (issues.length > 0) {
    return issues;
  }
  if (arEntries.get('debian-binary').toString('utf8') !== '2.0\n') {
    issues.push('.deb debian-binary must be 2.0');
  }

  const controlEntries = readTarEntries(gunzipSync(arEntries.get('control.tar.gz')));
  if (!controlEntries.has('./control')) {
    issues.push('control.tar.gz missing ./control');
  }
  if (!controlEntries.has('./postinst')) {
    issues.push('control.tar.gz missing ./postinst');
  }
  const postinst = controlEntries.get('./postinst')?.data.toString('utf8') ?? '';
  if (packageItem.deploymentMode === 'service') {
    requireText(postinst, 'chown root:root /usr/lib/clawrouter /usr/lib/clawrouter/bin /usr/bin/clawrouter /usr/bin/clawrouterctl', 'postinst runtime binary ownership', issues);
    requireText(postinst, 'chmod 0755 /usr/lib/clawrouter /usr/lib/clawrouter/bin /usr/bin/clawrouter /usr/bin/clawrouterctl', 'postinst runtime binary modes', issues);
    requireText(postinst, 'chmod 0750 /etc/clawrouter', 'postinst config directory mode', issues);
    requireText(postinst, 'chmod 0640 /etc/clawrouter/.env.release.example', 'postinst release env template mode', issues);
    requireText(postinst, 'chmod 0640 /etc/clawrouter/clawrouter.toml.example', 'postinst config template mode', issues);
    requireText(postinst, 'chmod 0750 /var/lib/clawrouter /var/log/clawrouter', 'postinst state/log directory modes', issues);
  } else {
    requireText(postinst, 'chmod 0755 /usr/lib/clawrouter /usr/lib/clawrouter/bin /usr/bin/clawrouter /usr/bin/clawrouterctl', 'desktop postinst binary modes', issues);
    if (postinst.includes('/etc/clawrouter/database.secret') || postinst.includes('systemctl enable clawrouter.service')) {
      issues.push('desktop postinst must not configure server secrets or systemd service');
    }
  }

  const dataEntries = readTarEntries(gunzipSync(arEntries.get('data.tar.gz')));
  const dataEntryNames = [...dataEntries.keys()];
  if (dataEntryNames.some((entry) => entry.startsWith('./opt/clawrouter'))) {
    issues.push('Linux native .deb payload must not install files under /opt/clawrouter');
  }
  requireTarEntry(dataEntries, './usr/bin', 'directory', 0o755, issues);
  requireTarEntry(dataEntries, './usr/bin/clawrouter', 'file', 0o755, issues);
  requireTarEntry(dataEntries, './usr/bin/clawrouterctl', 'file', 0o755, issues);
  requireTarEntry(dataEntries, './usr/lib/clawrouter', 'directory', 0o755, issues);
  requireTarEntry(dataEntries, './usr/lib/clawrouter/bin', 'directory', 0o755, issues);
  requireTarEntry(dataEntries, './usr/lib/clawrouter/bin/clawrouter', 'file', 0o755, issues);
  requireTarEntry(dataEntries, './usr/lib/clawrouter/bin/clawrouterctl', 'file', 0o755, issues);
  requireTarEntry(dataEntries, './usr/lib/clawrouter/portal/dist/index.html', 'file', 0o644, issues);
  requireTarEntry(dataEntries, './usr/share/clawrouter/install-manifest.json', 'file', 0o644, issues);
  requireParentBeforeChild(dataEntryNames, './usr/bin', './usr/bin/clawrouter', issues);
  requireParentBeforeChild(dataEntryNames, './usr/lib/clawrouter', './usr/lib/clawrouter/bin/clawrouter', issues);
  if (dataEntries.has('./opt/clawrouter/.env.release.example') || dataEntries.has('./usr/lib/clawrouter/.env.release.example')) {
    issues.push('release env template must not be installed under /opt/clawrouter or /usr/lib/clawrouter');
  }

  if (packageItem.deploymentMode === 'service') {
    requireTarEntry(dataEntries, './etc/clawrouter', 'directory', 0o750, issues);
    requireTarEntry(dataEntries, './etc/clawrouter/.env.release.example', 'file', 0o640, issues);
    requireTarEntry(dataEntries, './etc/clawrouter/clawrouter.toml.example', 'file', 0o640, issues);
    requireTarEntry(dataEntries, './lib/systemd/system/clawrouter.service', 'file', 0o644, issues);
    requireParentBeforeChild(dataEntryNames, './etc/clawrouter', './etc/clawrouter/.env.release.example', issues);
    requireParentBeforeChild(dataEntryNames, './etc/clawrouter', './etc/clawrouter/clawrouter.toml.example', issues);
    const systemdUnit = dataEntries.get('./lib/systemd/system/clawrouter.service')?.data.toString('utf8') ?? '';
    requireText(systemdUnit, 'WorkingDirectory=/usr/lib/clawrouter', 'systemd working directory', issues);
    requireText(systemdUnit, 'ExecStartPre=/usr/bin/clawrouterctl ensure', 'systemd ensure command', issues);
    requireText(systemdUnit, 'ExecStart=/usr/bin/clawrouter', 'systemd start command', issues);
    requireText(systemdUnit, 'UMask=0027', 'systemd umask', issues);
    requireText(systemdUnit, 'StateDirectoryMode=0750', 'systemd state directory mode', issues);
    requireText(systemdUnit, 'LogsDirectoryMode=0750', 'systemd logs directory mode', issues);
    requireText(systemdUnit, 'ConfigurationDirectoryMode=0750', 'systemd config directory mode', issues);
    requireText(systemdUnit, 'ReadWritePaths=/var/lib/clawrouter /var/log/clawrouter', 'systemd writable paths', issues);
    requireText(systemdUnit, 'ReadOnlyPaths=/usr/lib/clawrouter /etc/clawrouter', 'systemd readonly paths', issues);
  } else {
    requireTarEntry(dataEntries, './usr/share/clawrouter/config', 'directory', 0o755, issues);
    requireTarEntry(dataEntries, './usr/share/clawrouter/config/clawrouter.toml.example', 'file', 0o644, issues);
    requireParentBeforeChild(dataEntryNames, './usr/share/clawrouter/config', './usr/share/clawrouter/config/clawrouter.toml.example', issues);
    if ([...dataEntries.keys()].some((entry) => entry.endsWith('/.env.release.example'))) {
      issues.push('Linux desktop native package must not install .env.release.example into system payload');
    }
    if (dataEntries.has('./etc/clawrouter/clawrouter.toml.example')) {
      issues.push('Linux desktop native package must keep runtime config template under /usr/share/clawrouter/config');
    }
  }

  const manifestText = dataEntries.get('./usr/share/clawrouter/install-manifest.json')?.data.toString('utf8') ?? '';
  if (manifestText) {
    try {
      const manifest = JSON.parse(manifestText);
      issues.push(...validateNativeManifest(packageItem, manifest));
    } catch (error) {
      issues.push(`install-manifest.json is invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return issues;
}

function validateNativeManifest(packageItem, manifest) {
  const issues = [];
  if (manifest.package?.id !== packageItem.id) {
    issues.push(`manifest package id must be ${packageItem.id}`);
  }
  const nativeInstall = manifest.nativeInstall;
  if (!nativeInstall) {
    issues.push('native install-manifest.json missing nativeInstall');
    return issues;
  }
  requireManifestPath(nativeInstall, 'files.binary', '/usr/bin/clawrouter', issues);
  requireManifestPath(nativeInstall, 'files.installer', '/usr/bin/clawrouterctl', issues);
  requireManifestPath(nativeInstall, 'files.privateBinary', '/usr/lib/clawrouter/bin/clawrouter', issues);
  requireManifestPath(nativeInstall, 'files.portal', '/usr/lib/clawrouter/portal/dist', issues);
  if (packageItem.deploymentMode === 'service') {
    requireManifestPath(nativeInstall, 'installRoot', '/usr/lib/clawrouter', issues);
    requireManifestPath(nativeInstall, 'files.releaseEnvTemplate', '/etc/clawrouter/.env.release.example', issues);
    requireManifestPath(nativeInstall, 'files.runtimeConfigTemplate', '/etc/clawrouter/clawrouter.toml.example', issues);
    requirePermission(nativeInstall, '/etc/clawrouter', 'root', 'sdkwork', '0750', issues);
    requirePermission(nativeInstall, '/etc/clawrouter/.env.release.example', 'root', 'sdkwork', '0640', issues);
    requirePermission(nativeInstall, '/var/lib/clawrouter', 'sdkwork', 'sdkwork', '0750', issues);
    requirePermission(nativeInstall, '/var/log/clawrouter', 'sdkwork', 'sdkwork', '0750', issues);
  } else {
    requireManifestPath(nativeInstall, 'files.releaseEnvTemplate', '${XDG_CONFIG_HOME:-~/.config}/clawrouter/.env.release.example', issues);
    requireManifestPath(nativeInstall, 'files.runtimeConfigTemplate', '/usr/share/clawrouter/config/clawrouter.toml.example', issues);
    requirePermission(nativeInstall, '/usr/lib/clawrouter', 'root', 'root', '0755', issues);
    requirePermission(nativeInstall, '/usr/bin/clawrouter', 'root', 'root', '0755', issues);
  }
  return issues;
}

function validatePackageManifest(packageItem, manifest) {
  const issues = [];
  if (manifest.package?.id !== packageItem.id) {
    issues.push(`adjacent manifest package id must be ${packageItem.id}`);
  }
  if (manifest.package?.version !== packageItem.version) {
    issues.push(`adjacent manifest version must be ${packageItem.version}`);
  }
  if (packageItem.deploymentMode === 'service' || packageItem.deploymentMode === 'desktop') {
    if (packageItem.platform === 'linux') {
      issues.push(...validateNativeManifest(packageItem, manifest));
    } else if (packageItem.platform === 'windows') {
      issues.push(...validateWindowsNativeManifest(packageItem, manifest));
    } else if (packageItem.platform === 'macos') {
      issues.push(...validateMacosNativeManifest(packageItem, manifest));
    }
  }
  return issues;
}

function validateWindowsNativeManifest(packageItem, manifest) {
  const issues = [];
  const nativeInstall = manifest.nativeInstall;
  if (!nativeInstall) {
    issues.push('Windows native manifest missing nativeInstall');
    return issues;
  }
  requireManifestPath(nativeInstall, 'installRoot', '%ProgramFiles%/ClawRouter', issues);
  requireManifestPath(nativeInstall, 'files.binary', '%ProgramFiles%/ClawRouter/bin/clawrouter.exe', issues);
  requireManifestPath(nativeInstall, 'files.installer', '%ProgramFiles%/ClawRouter/bin/clawrouterctl.exe', issues);
  requireManifestPath(nativeInstall, 'files.portal', '%ProgramFiles%/ClawRouter/portal/dist', issues);
  requirePermission(nativeInstall, '%ProgramFiles%/ClawRouter', 'SYSTEM', 'Administrators', 'inherited-programfiles-acl', issues);
  requirePermission(nativeInstall, '%ProgramData%/SdkWork/ClawRouter', 'SYSTEM', 'Administrators', 'inherited-programdata-acl', issues);
  requirePermission(nativeInstall, '%ProgramData%/SdkWork/ClawRouter/.env.release.example', 'SYSTEM', 'Administrators', 'inherited-programdata-acl', issues);
  requirePermission(nativeInstall, '%ProgramData%/SdkWork/ClawRouter/clawrouter.toml.example', 'SYSTEM', 'Administrators', 'inherited-programdata-acl', issues);
  if (packageItem.deploymentMode === 'service') {
    requireManifestPath(nativeInstall, 'files.releaseEnvTemplate', '%ProgramData%/SdkWork/ClawRouter/.env.release.example', issues);
    requireManifestPath(nativeInstall, 'files.runtimeConfigTemplate', '%ProgramData%/SdkWork/ClawRouter/clawrouter.toml.example', issues);
    requireManifestPath(nativeInstall, 'files.runtimeConfig', '%ProgramData%/SdkWork/ClawRouter/clawrouter.toml', issues);
    requirePermission(nativeInstall, '%ProgramData%/SdkWork/ClawRouter/clawrouter.toml', 'SYSTEM', 'Administrators', 'inherited-programdata-acl', issues);
    requirePermission(nativeInstall, '%ProgramData%/SdkWork/ClawRouter/database.secret', 'SYSTEM', 'Administrators', 'inherited-programdata-acl', issues);
    requirePermission(nativeInstall, '%ProgramData%/SdkWork/ClawRouter/redis.secret', 'SYSTEM', 'Administrators', 'inherited-programdata-acl', issues);
    requirePermission(nativeInstall, '%ProgramData%/SdkWork/ClawRouter/Data', 'SYSTEM', 'Administrators', 'inherited-programdata-acl', issues);
  } else {
    requireManifestPath(nativeInstall, 'files.releaseEnvTemplate', '%ProgramData%/SdkWork/ClawRouter/.env.release.example', issues);
    requireManifestPath(nativeInstall, 'files.runtimeConfigTemplate', '%ProgramData%/SdkWork/ClawRouter/clawrouter.toml.example', issues);
    requireManifestPath(nativeInstall, 'files.runtimeConfig', '%APPDATA%/SdkWork/ClawRouter/clawrouter.toml', issues);
    requirePermission(nativeInstall, '%APPDATA%/SdkWork/ClawRouter/clawrouter.toml', 'current-user', 'current-user', 'user-profile-acl', issues);
    requirePermission(nativeInstall, '%LOCALAPPDATA%/SdkWork/ClawRouter', 'current-user', 'current-user', 'user-profile-acl', issues);
  }
  return issues;
}

function validateMacosNativeManifest(packageItem, manifest) {
  const issues = [];
  const nativeInstall = manifest.nativeInstall;
  if (!nativeInstall) {
    issues.push('macOS native manifest missing nativeInstall');
    return issues;
  }
  if (packageItem.deploymentMode === 'service') {
    requireManifestPath(nativeInstall, 'installRoot', '/Library/Application Support/SdkWork/ClawRouter', issues);
    requireManifestPath(nativeInstall, 'files.binary', '/Library/Application Support/SdkWork/ClawRouter/bin/clawrouter', issues);
    requireManifestPath(nativeInstall, 'files.installer', '/Library/Application Support/SdkWork/ClawRouter/bin/clawrouterctl', issues);
    requireManifestPath(nativeInstall, 'files.releaseEnvTemplate', '/Library/Application Support/SdkWork/ClawRouter/.env.release.example', issues);
    requireManifestPath(nativeInstall, 'files.runtimeConfigTemplate', '/Library/Application Support/SdkWork/ClawRouter/clawrouter.toml.example', issues);
    requireManifestPath(nativeInstall, 'files.serviceRunner', '/Library/Application Support/SdkWork/ClawRouter/service/macos/clawrouter-service-runner', issues);
    requirePermission(nativeInstall, '/Library/Application Support/SdkWork/ClawRouter', 'root', 'wheel', '0750', issues);
    requirePermission(nativeInstall, '/Library/Application Support/SdkWork/ClawRouter/bin', 'root', 'wheel', '0755', issues);
    requirePermission(nativeInstall, '/Library/Application Support/SdkWork/ClawRouter/.env.release.example', 'root', 'wheel', '0640', issues);
    requirePermission(nativeInstall, '/Library/Application Support/SdkWork/ClawRouter/clawrouter.toml.example', 'root', 'wheel', '0640', issues);
    requirePermission(nativeInstall, '/Library/Application Support/SdkWork/ClawRouter/clawrouter.toml', 'root', 'wheel', '0640', issues);
    requirePermission(nativeInstall, '/var/log/clawrouter', 'root', 'wheel', '0750', issues);
    requirePermission(nativeInstall, '/Library/LaunchDaemons/com.sdkwork.clawrouter.plist', 'root', 'wheel', '0644', issues);
  } else {
    requireManifestPath(nativeInstall, 'installRoot', '/opt/clawrouter', issues);
    requireManifestPath(nativeInstall, 'files.binary', '/opt/clawrouter/bin/clawrouter', issues);
    requireManifestPath(nativeInstall, 'files.installer', '/opt/clawrouter/bin/clawrouterctl', issues);
    requireManifestPath(nativeInstall, 'files.releaseEnvTemplate', '~/Library/Application Support/SdkWork/ClawRouter/.env.release.example', issues);
    requireManifestPath(nativeInstall, 'files.runtimeConfigTemplate', '/usr/local/share/clawrouter/config/clawrouter.toml.example', issues);
    requirePermission(nativeInstall, '/opt/clawrouter', 'root', 'wheel', '0755', issues);
    requirePermission(nativeInstall, '/opt/clawrouter/bin', 'root', 'wheel', '0755', issues);
    requirePermission(nativeInstall, '/usr/local/share/clawrouter/config', 'root', 'wheel', '0755', issues);
  }
  return issues;
}

function validateTarGzArtifact(packageItem, artifactBytes) {
  const issues = [];
  const entries = readTarEntries(gunzipSync(artifactBytes));
  const binaryName = packageItem.platform === 'windows' ? 'clawrouter.exe' : 'clawrouter';
  const installerName = packageItem.platform === 'windows' ? 'clawrouterctl.exe' : 'clawrouterctl';
  for (const requiredEntry of [`bin/${binaryName}`, `bin/${installerName}`, 'portal/dist/index.html', 'config/clawrouter.toml.example', 'INSTALL.md', 'install-manifest.json']) {
    if (!entries.has(requiredEntry)) {
      issues.push(`${packageItem.id} archive missing ${requiredEntry}`);
    }
  }
  if (entries.has('.env.release.local')) {
    issues.push(`${packageItem.id} archive must not include .env.release.local`);
  }
  return issues;
}

function validateZipArtifact(packageItem, artifactBytes) {
  const issues = [];
  const entries = readZipEntries(artifactBytes);
  const binaryName = packageItem.platform === 'windows' ? 'clawrouter.exe' : 'clawrouter';
  const installerName = packageItem.platform === 'windows' ? 'clawrouterctl.exe' : 'clawrouterctl';
  for (const requiredEntry of [`bin/${binaryName}`, `bin/${installerName}`, 'portal/dist/index.html', 'config/clawrouter.toml.example', 'INSTALL.md', 'install-manifest.json']) {
    if (!entries.has(requiredEntry)) {
      issues.push(`${packageItem.id} zip missing ${requiredEntry}`);
    }
  }
  if (entries.has('.env.release.local')) {
    issues.push(`${packageItem.id} zip must not include .env.release.local`);
  }
  return issues;
}

function requireText(text, expected, label, issues) {
  if (!text.includes(expected)) {
    issues.push(`missing ${label}: ${expected}`);
  }
}

function requireTarEntry(entries, name, type, mode, issues) {
  const entry = entries.get(name);
  if (!entry) {
    issues.push(`missing tar entry ${name}`);
    return;
  }
  if (entry.type !== type) {
    issues.push(`${name} must be tar ${type}, got ${entry.type}`);
  }
  if (entry.mode !== mode) {
    issues.push(`${name} mode must be ${mode.toString(8)}, got ${entry.mode.toString(8)}`);
  }
}

function requireParentBeforeChild(entryNames, parent, child, issues) {
  const parentIndex = entryNames.indexOf(parent);
  const childIndex = entryNames.indexOf(child);
  if (parentIndex < 0) {
    issues.push(`missing parent directory tar entry ${parent}`);
    return;
  }
  if (childIndex < 0) {
    issues.push(`missing child tar entry ${child}`);
    return;
  }
  if (parentIndex > childIndex) {
    issues.push(`${parent} must appear before ${child}`);
  }
}

function requireManifestPath(nativeInstall, dottedPath, expected, issues) {
  const actual = dottedPath.split('.').reduce((value, key) => value?.[key], nativeInstall);
  if (actual !== expected) {
    issues.push(`nativeInstall.${dottedPath} must be ${expected}, got ${actual ?? '(missing)'}`);
  }
}

function requirePermission(nativeInstall, pathValue, owner, group, mode, issues) {
  const found = nativeInstall.permissions?.some((item) =>
    item.path === pathValue
    && item.owner === owner
    && item.group === group
    && item.mode === mode
  );
  if (!found) {
    issues.push(`nativeInstall.permissions missing ${pathValue} ${owner}:${group} ${mode}`);
  }
}

function readArEntries(buffer) {
  assert.equal(buffer.subarray(0, 8).toString('ascii'), '!<arch>\n');
  const entries = new Map();
  for (let offset = 8; offset + 60 <= buffer.length;) {
    const header = buffer.subarray(offset, offset + 60);
    const name = header.subarray(0, 16).toString('ascii').trim().replace(/\/$/u, '');
    const size = Number.parseInt(header.subarray(48, 58).toString('ascii').trim(), 10);
    assert.equal(header.subarray(58, 60).toString('ascii'), '`\n');
    const dataOffset = offset + 60;
    entries.set(name, buffer.subarray(dataOffset, dataOffset + size));
    offset = dataOffset + size + (size % 2);
  }
  return entries;
}

function readTarEntries(buffer) {
  const entries = new Map();
  for (let offset = 0; offset + 512 <= buffer.length;) {
    const header = buffer.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      break;
    }
    const namePart = readTarString(header, 0, 100);
    const prefixPart = readTarString(header, 345, 155);
    const name = prefixPart ? `${prefixPart}/${namePart}` : namePart;
    const mode = Number.parseInt(readTarString(header, 100, 8) || '0', 8);
    const size = Number.parseInt(readTarString(header, 124, 12) || '0', 8);
    const typeflag = header.subarray(156, 157).toString('ascii');
    const dataOffset = offset + 512;
    entries.set(name, {
      data: buffer.subarray(dataOffset, dataOffset + size),
      mode,
      size,
      type: typeflag === '5' ? 'directory' : 'file',
      typeflag,
    });
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return entries;
}

function readTarString(buffer, offset, length) {
  return buffer
    .subarray(offset, offset + length)
    .toString('utf8')
    .replace(/\0.*$/u, '')
    .trim();
}

function readZipEntries(buffer) {
  const entries = new Set();
  for (let offset = 0; offset + 30 <= buffer.length;) {
    const signature = buffer.readUInt32LE(offset);
    if (signature !== 0x04034b50) {
      break;
    }
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const name = buffer.subarray(offset + 30, offset + 30 + nameLength).toString('utf8');
    entries.add(name);
    offset += 30 + nameLength + extraLength + compressedSize;
  }
  return entries;
}

async function main(argv = process.argv.slice(2)) {
  const settings = parseValidateArgs(argv);
  if (settings.help) {
    printHelp();
    return 0;
  }

  const result = validateInstallArtifact(settings);
  if (settings.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.ok) {
    console.log(`[install-artifact-validate] ok: ${result.packageId} ${result.artifactName}`);
  } else {
    console.error(`[install-artifact-validate] failed: ${result.packageId ?? '(missing package id)'}`);
    for (const issue of result.issues) {
      console.error(`[install-artifact-validate]   ${issue}`);
    }
  }
  return result.ok ? 0 : 1;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\', '/'))) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(`[install-artifact-validate] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}

export {
  parseValidateArgs,
  readArEntries,
  readTarEntries,
  readZipEntries,
  validateDebianArtifact,
  validateInstallArtifact,
  validateMacosNativeManifest,
  validateTarGzArtifact,
  validateWindowsNativeManifest,
  validateZipArtifact,
};
