#!/usr/bin/env node

import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  chmod,
  mkdir,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import {
  AGGREGATE_MANIFEST_FILE,
  PACKAGE_MANIFEST_FILE,
  createAggregateManifest,
  createGeneratedArtifactBytes,
  createInstallPackageBuildPlan,
  createPackageManifest,
  createTar,
  defaultInstallPackageOutputDir,
  defaultStagingRoot,
  modeForArchivePath,
  sha256,
  validateInstallPackageBuildPlan,
} from './build-claw-router-install-package.mjs';
import {
  DEFAULT_VERSION,
  createInstallPackagePlan,
  validateInstallPackagePlan,
} from './plan-claw-router-install-packages.mjs';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..');
const NATIVE_INSTALLER_SCHEMA_VERSION = '2026-05-16.native-installer-build.v1';
const NATIVE_INSTALLER_DEPLOYMENT_MODES = Object.freeze(['service', 'desktop']);
const WINDOWS_UPGRADE_CODE = '9D40C7E8-CE6F-4AB3-9D91-1E969070D7E2';

function printHelp() {
  console.log(`Usage: node scripts/build-claw-router-native-installer.mjs [options]

Build platform-native install packages from staged production files.

Native package mapping:
  linux service/desktop   .deb
  macos service/desktop   .pkg
  windows service/desktop .msi

Options:
  --package-id <id>    service or desktop package id from install package plan.
  --all                Validate or build all native installer package ids.
  --staging-root <dir> Directory containing staged package files.
  --output-dir <dir>   Output directory (default dist/install-packages).
  --version <value>    Product package version (default ${DEFAULT_VERSION}).
  --check              Validate the native installer build plan.
  --dry-run            Print the native installer build plan without writing packages.
  --json               Print machine-readable JSON.
  -h, --help           Show this help.
`);
}

function parseNativeInstallerBuildArgs(argv = process.argv.slice(2)) {
  const settings = {
    all: false,
    check: false,
    dryRun: false,
    help: false,
    json: false,
    outputDir: null,
    packageId: currentHostNativePackageId(process.platform, process.arch),
    stagingRoot: null,
    version: DEFAULT_VERSION,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--') {
      continue;
    }
    switch (arg) {
      case '--all':
        settings.all = true;
        break;
      case '--check':
        settings.check = true;
        break;
      case '--dry-run':
        settings.dryRun = true;
        break;
      case '--json':
        settings.json = true;
        break;
      case '--package-id':
        settings.packageId = requireValue(argv, index, arg);
        index += 1;
        break;
      case '--staging-root':
        settings.stagingRoot = requireValue(argv, index, arg);
        index += 1;
        break;
      case '--output-dir':
        settings.outputDir = requireValue(argv, index, arg);
        index += 1;
        break;
      case '--version':
        settings.version = requireValue(argv, index, arg);
        index += 1;
        break;
      case '--help':
      case '-h':
        settings.help = true;
        break;
      default:
        throw new Error(`Unsupported native installer build option: ${arg}`);
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

function createNativeInstallerBuildPlan({
  packageId = currentHostNativePackageId(process.platform, process.arch),
  stagingRoot = defaultStagingRoot(workspaceRoot),
  outputDir = defaultInstallPackageOutputDir(workspaceRoot),
  version = DEFAULT_VERSION,
  root = workspaceRoot,
  requireStagedFiles = true,
} = {}) {
  const installPlan = createInstallPackagePlan({ version });
  const planIssues = validateInstallPackagePlan(installPlan);
  if (planIssues.length > 0) {
    throw new Error(`install package plan is invalid: ${planIssues.join('; ')}`);
  }

  const packageItem = installPlan.packages.find((item) => item.id === packageId);
  if (!packageItem) {
    throw new Error(`Unknown native installer package id: ${packageId}`);
  }
  if (!NATIVE_INSTALLER_DEPLOYMENT_MODES.includes(packageItem.deploymentMode)) {
    throw new Error(`${packageId} is not a native installer package; use archive builder for ${packageItem.deploymentMode}`);
  }

  const archiveBuildPlan = createInstallPackageBuildPlan({
    packageId,
    stagingRoot,
    outputDir,
    version,
    root,
    requireStagedFiles,
  });
  const absoluteOutputDir = path.resolve(root, outputDir);
  const installerName = nativeInstallerNameForPackage(packageItem);

  return {
    schemaVersion: NATIVE_INSTALLER_SCHEMA_VERSION,
    package: packageItem,
    nativeFormat: nativeInstallerFormatForPlatform(packageItem.platform),
    buildTool: nativeInstallerToolForPlatform(packageItem.platform),
    installerName,
    installerPath: path.join(absoluteOutputDir, installerName),
    manifestPath: path.join(absoluteOutputDir, installerName.replace(/\.(deb|pkg|msi)$/u, '.manifest.json')),
    aggregateManifestPath: path.join(absoluteOutputDir, AGGREGATE_MANIFEST_FILE),
    stagingRoot: archiveBuildPlan.stagingRoot,
    outputDir: absoluteOutputDir,
    archiveBuildPlan,
  };
}

function validateNativeInstallerBuildPlan(plan) {
  const issues = [];
  if (plan.schemaVersion !== NATIVE_INSTALLER_SCHEMA_VERSION) {
    issues.push(`schemaVersion must be ${NATIVE_INSTALLER_SCHEMA_VERSION}`);
  }
  if (!plan.package?.id) {
    issues.push('package id is required');
  }
  if (!NATIVE_INSTALLER_DEPLOYMENT_MODES.includes(plan.package?.deploymentMode)) {
    issues.push(`${plan.package?.id ?? '(missing id)'} must be service or desktop deployment mode`);
  }
  const expectedFormat = nativeInstallerFormatForPlatform(plan.package?.platform);
  if (plan.nativeFormat !== expectedFormat) {
    issues.push(`${plan.package?.id} nativeFormat must be ${expectedFormat}`);
  }
  if (!plan.installerPath || !plan.installerPath.endsWith(plan.installerName)) {
    issues.push('installerPath must end with installerName');
  }
  const archiveIssues = validateInstallPackageBuildPlan(plan.archiveBuildPlan ?? {});
  issues.push(...archiveIssues.map((issue) => `${plan.package?.id}: ${issue}`));
  if (plan.package?.platform === 'macos' && process.platform !== 'darwin') {
    issues.push(`${plan.package.id} .pkg build requires macOS pkgbuild; use --dry-run on non-macOS hosts`);
  }
  if (plan.package?.platform === 'windows' && process.platform !== 'win32') {
    issues.push(`${plan.package.id} .msi build requires Windows WiX tooling; use --dry-run on non-Windows hosts`);
  }
  return issues;
}

async function buildNativeInstaller(plan) {
  const issues = validateNativeInstallerBuildPlan(plan);
  if (issues.length > 0) {
    throw new Error(`native installer build plan is invalid: ${issues.join('; ')}`);
  }
  await mkdir(plan.outputDir, { recursive: true });

  const packageFiles = await collectPackageFileEntries(plan.archiveBuildPlan);
  if (plan.package.platform === 'linux') {
    await writeFile(plan.installerPath, createDebianPackage(plan, packageFiles.fileEntries));
  } else if (plan.package.platform === 'macos') {
    await buildMacosPkg(plan, packageFiles.fileEntries);
  } else if (plan.package.platform === 'windows') {
    await buildWindowsMsi(plan, packageFiles.fileEntries);
  } else {
    throw new Error(`Unsupported native installer platform: ${plan.package.platform}`);
  }

  const installerBytes = await readFile(plan.installerPath);
  await writeFile(plan.manifestPath, `${JSON.stringify(packageFiles.manifest, null, 2)}\n`, 'utf8');
  const installer = {
    file: path.basename(plan.installerPath),
    packageId: plan.package.id,
    version: plan.package.version,
    kind: 'native-installer',
    format: plan.nativeFormat,
    size: installerBytes.length,
    sha256: sha256(installerBytes),
  };
  const aggregateManifest = createAggregateManifest(plan, installer);
  await writeFile(
    plan.aggregateManifestPath,
    `${JSON.stringify(aggregateManifest, null, 2)}\n`,
    'utf8',
  );

  return {
    installer,
    installerPath: plan.installerPath,
    manifest: packageFiles.manifest,
    manifestPath: plan.manifestPath,
    aggregateManifest,
    aggregateManifestPath: plan.aggregateManifestPath,
  };
}

async function collectPackageFileEntries(archiveBuildPlan) {
  const artifactFiles = [];
  const generatedArtifacts = [];
  const fileEntries = [];

  for (const entry of archiveBuildPlan.entries.filter((item) => !item.generated)) {
    const data = await readFile(entry.sourcePath);
    artifactFiles.push({
      path: entry.archivePath,
      size: data.length,
      sha256: sha256(data),
    });
    fileEntries.push({
      relativePath: entry.archivePath,
      data,
      mode: entry.mode ?? modeForArchivePath(entry.archivePath),
    });
  }
  for (const entry of archiveBuildPlan.entries.filter((item) => item.generated && item.archivePath !== PACKAGE_MANIFEST_FILE)) {
    const data = createGeneratedArtifactBytes(archiveBuildPlan, entry);
    generatedArtifacts.push({
      kind: entry.generatedKind,
      path: entry.archivePath,
      size: data.length,
      sha256: sha256(data),
    });
    fileEntries.push({
      relativePath: entry.archivePath,
      data,
      mode: entry.mode ?? modeForArchivePath(entry.archivePath),
    });
  }

  const manifest = createPackageManifest(archiveBuildPlan, artifactFiles, generatedArtifacts);
  fileEntries.push({
    relativePath: PACKAGE_MANIFEST_FILE,
    data: Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`, 'utf8'),
    mode: 0o644,
  });

  return {
    fileEntries: fileEntries.sort((left, right) => left.relativePath.localeCompare(right.relativePath)),
    manifest,
  };
}

function createDebianPackage(plan, fileEntries) {
  const controlTar = createTar([
    {
      relativePath: './control',
      data: Buffer.from(createDebianControl(plan), 'utf8'),
      mode: 0o644,
    },
    {
      relativePath: './postinst',
      data: Buffer.from(createDebianPostinst(plan), 'utf8'),
      mode: 0o755,
    },
    {
      relativePath: './prerm',
      data: Buffer.from(createDebianPrerm(plan), 'utf8'),
      mode: 0o755,
    },
  ]);
  const dataTar = createTar(fileEntries.flatMap((entry) => debianDataEntriesForPackageFile(plan, entry)));
  return createArArchive([
    {
      name: 'debian-binary',
      data: Buffer.from('2.0\n', 'utf8'),
      mode: 0o644,
    },
    {
      name: 'control.tar.gz',
      data: gzipSync(controlTar, { mtime: 0 }),
      mode: 0o644,
    },
    {
      name: 'data.tar.gz',
      data: gzipSync(dataTar, { mtime: 0 }),
      mode: 0o644,
    },
  ]);
}

function createDebianControl(plan) {
  const packageItem = plan.package;
  return [
    'Package: sdkwork-claw-router',
    `Version: ${debianVersion(packageItem.version)}`,
    'Section: utils',
    'Priority: optional',
    `Architecture: ${debianArchitecture(packageItem.architecture)}`,
    'Maintainer: SdkWork Cloud <release@sdkwork.cloud>',
    'Homepage: https://github.com/Sdkwork-Cloud/sdkwork-claw-router',
    'Description: SdkWork Claw Router edge runtime',
    ` Native ${packageItem.deploymentMode} installer for ${packageItem.platform}-${packageItem.architecture}.`,
    ' Installs the edge gateway, installer utility, production portal assets, runtime',
    ' configuration template, and platform service metadata without packaging secrets.',
    '',
  ].join('\n');
}

function createDebianPostinst(plan) {
  const serviceCommands = plan.package.deploymentMode === 'service'
    ? [
      'if command -v systemctl >/dev/null 2>&1; then',
      '  systemctl daemon-reload || true',
      'fi',
    ]
    : [];
  return [
    '#!/bin/sh',
    'set -e',
    'if ! getent group sdkwork >/dev/null; then',
    '  groupadd --system sdkwork',
    'fi',
    'if ! id -u sdkwork >/dev/null 2>&1; then',
    '  useradd --system --gid sdkwork --home-dir /opt/sdkwork-claw-router --shell /usr/sbin/nologin sdkwork',
    'fi',
    'mkdir -p /etc/sdkwork-claw-router /etc/default /var/lib/sdkwork-claw-router /var/log/sdkwork-claw-router',
    'chown -R sdkwork:sdkwork /var/lib/sdkwork-claw-router /var/log/sdkwork-claw-router',
    'chmod 0750 /var/lib/sdkwork-claw-router /var/log/sdkwork-claw-router',
    'if [ ! -f /etc/sdkwork-claw-router/sdkwork-claw-router.toml ] && [ -f /etc/sdkwork-claw-router/sdkwork-claw-router.toml.example ]; then',
    '  cp /etc/sdkwork-claw-router/sdkwork-claw-router.toml.example /etc/sdkwork-claw-router/sdkwork-claw-router.toml',
    'fi',
    'if [ -f /etc/sdkwork-claw-router/sdkwork-claw-router.toml ]; then',
    '  chown root:sdkwork /etc/sdkwork-claw-router/sdkwork-claw-router.toml || true',
    '  chmod 0640 /etc/sdkwork-claw-router/sdkwork-claw-router.toml || true',
    'fi',
    'if [ ! -f /etc/default/sdkwork-claw-router ]; then',
    '  if [ -f /etc/sdkwork-claw-router/.env.release.local ]; then',
    '    cp /etc/sdkwork-claw-router/.env.release.local /etc/default/sdkwork-claw-router',
    '  else',
    '    cat > /etc/default/sdkwork-claw-router <<\'EOF\'',
    '# SdkWork Claw Router service environment.',
    '# Created by the Debian package for zero-config local startup.',
    '# Keep secrets out of PORTAL_PUBLIC_* values because they are visible to browsers.',
    'SDKWORK_CLAW_DEPLOYMENT_MODE=server',
    'PORTAL_PUBLIC_API_BASE_URL=/v1',
    'PORTAL_PUBLIC_OPEN_API_BASE_URL=/v1',
    'PORTAL_PUBLIC_APP_API_BASE_URL=/app/v3/api',
    'PORTAL_PUBLIC_BACKEND_API_BASE_URL=/backend/v3/api',
    'PORTAL_PUBLIC_TOOL_API_ENABLED=false',
    '# Production example:',
    '# SDKWORK_CLAW_DATABASE_URL=postgresql://sdkwork_claw_router:<password>@db.example.com:5432/sdkwork_claw_router',
    'EOF',
    '  fi',
    'fi',
    'if [ -f /etc/default/sdkwork-claw-router ]; then',
    '  chown root:sdkwork /etc/default/sdkwork-claw-router || true',
    '  chmod 0640 /etc/default/sdkwork-claw-router || true',
    'fi',
    ...serviceCommands,
    'exit 0',
    '',
  ].join('\n');
}

function createDebianPrerm(plan) {
  if (plan.package.deploymentMode !== 'service') {
    return [
      '#!/bin/sh',
      'set -e',
      'exit 0',
      '',
    ].join('\n');
  }
  return [
    '#!/bin/sh',
    'set -e',
    'if [ "$1" = "remove" ] && command -v systemctl >/dev/null 2>&1; then',
    '  systemctl stop sdkwork-claw-router.service >/dev/null 2>&1 || true',
    '  systemctl disable sdkwork-claw-router.service >/dev/null 2>&1 || true',
    'fi',
    'exit 0',
    '',
  ].join('\n');
}

function debianDataEntriesForPackageFile(plan, entry) {
  const targetPath = debianInstallPathForArchivePath(plan, entry.relativePath);
  if (!targetPath) {
    return [];
  }
  return [{
    relativePath: `.${targetPath}`,
    data: entry.data,
    mode: entry.mode ?? modeForArchivePath(entry.relativePath),
  }];
}

function debianInstallPathForArchivePath(plan, archivePath) {
  const normalized = String(archivePath).replaceAll('\\', '/');
  if (normalized.startsWith('bin/') || normalized.startsWith('portal/')) {
    return `/opt/sdkwork-claw-router/${normalized}`;
  }
  if (normalized === '.env.release.example') {
    return '/opt/sdkwork-claw-router/.env.release.example';
  }
  if (normalized === 'config/sdkwork-claw-router.toml.example') {
    return '/etc/sdkwork-claw-router/sdkwork-claw-router.toml.example';
  }
  if (normalized === 'service/linux/sdkwork-claw-router.service') {
    return plan.package.deploymentMode === 'service'
      ? '/lib/systemd/system/sdkwork-claw-router.service'
      : null;
  }
  if (normalized === 'INSTALL.md') {
    return '/usr/share/doc/sdkwork-claw-router/INSTALL.md';
  }
  if (normalized === PACKAGE_MANIFEST_FILE) {
    return '/usr/share/sdkwork-claw-router/install-manifest.json';
  }
  if (normalized.startsWith('desktop/')) {
    return `/usr/share/sdkwork-claw-router/${normalized}`;
  }
  return `/opt/sdkwork-claw-router/${normalized}`;
}

async function buildMacosPkg(plan, fileEntries) {
  if (process.platform !== 'darwin') {
    throw new Error('macOS .pkg builds require pkgbuild on a macOS host');
  }
  const buildRoot = path.join(plan.outputDir, '.native-build', `${plan.package.id}-pkg`);
  const payloadRoot = path.join(buildRoot, 'payload');
  const scriptsRoot = path.join(buildRoot, 'scripts');
  await rm(buildRoot, { recursive: true, force: true });
  await mkdir(payloadRoot, { recursive: true });
  await mkdir(scriptsRoot, { recursive: true });
  await writeMappedPackageFiles(payloadRoot, fileEntries, (entry) =>
    macosInstallPathForArchivePath(plan, entry.relativePath)
  );
  const postinstallPath = path.join(scriptsRoot, 'postinstall');
  await writeFile(postinstallPath, createMacosPostinstall(plan), 'utf8');
  await chmod(postinstallPath, 0o755);
  await execFileAsync('pkgbuild', [
    '--root',
    payloadRoot,
    '--scripts',
    scriptsRoot,
    '--identifier',
    `cloud.sdkwork.claw-router.${plan.package.deploymentMode}`,
    '--version',
    macosPackageVersion(plan.package.version),
    '--install-location',
    '/',
    plan.installerPath,
  ], {
    cwd: workspaceRoot,
    maxBuffer: 1024 * 1024 * 8,
  });
  await rm(buildRoot, { recursive: true, force: true });
}

function macosInstallPathForArchivePath(plan, archivePath) {
  const normalized = String(archivePath).replaceAll('\\', '/');
  if (normalized.startsWith('bin/') || normalized.startsWith('portal/')) {
    return `/opt/sdkwork-claw-router/${normalized}`;
  }
  if (normalized === '.env.release.example') {
    return '/opt/sdkwork-claw-router/.env.release.example';
  }
  if (normalized === 'config/sdkwork-claw-router.toml.example') {
    return '/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml.example';
  }
  if (normalized === 'service/macos/com.sdkwork.claw-router.plist') {
    return plan.package.deploymentMode === 'service'
      ? '/Library/LaunchDaemons/com.sdkwork.claw-router.plist'
      : null;
  }
  if (normalized === 'INSTALL.md') {
    return '/usr/local/share/sdkwork-claw-router/INSTALL.md';
  }
  if (normalized === PACKAGE_MANIFEST_FILE) {
    return '/usr/local/share/sdkwork-claw-router/install-manifest.json';
  }
  if (normalized.startsWith('desktop/')) {
    return `/usr/local/share/sdkwork-claw-router/${normalized}`;
  }
  return `/opt/sdkwork-claw-router/${normalized}`;
}

function createMacosPostinstall(plan) {
  const launchDaemon = plan.package.deploymentMode === 'service'
    ? [
      'if [ -f /Library/LaunchDaemons/com.sdkwork.claw-router.plist ]; then',
      '  chown root:wheel /Library/LaunchDaemons/com.sdkwork.claw-router.plist || true',
      '  chmod 0644 /Library/LaunchDaemons/com.sdkwork.claw-router.plist || true',
      'fi',
    ]
    : [];
  return [
    '#!/bin/sh',
    'set -e',
    'mkdir -p "/Library/Application Support/SdkWork/Claw Router" /var/log/sdkwork-claw-router',
    'if [ ! -f "/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml" ] && [ -f "/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml.example" ]; then',
    '  cp "/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml.example" "/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml"',
    'fi',
    'chmod 0755 /opt/sdkwork-claw-router/bin/sdkwork-claw-gateway /opt/sdkwork-claw-router/bin/sdkwork-claw-installer 2>/dev/null || true',
    ...launchDaemon,
    'exit 0',
    '',
  ].join('\n');
}

async function buildWindowsMsi(plan, fileEntries) {
  if (process.platform !== 'win32') {
    throw new Error('Windows .msi builds require WiX on a Windows host');
  }
  const buildRoot = path.join(plan.outputDir, '.native-build', `${plan.package.id}-msi`);
  const payloadRoot = path.join(buildRoot, 'payload');
  await rm(buildRoot, { recursive: true, force: true });
  await mkdir(payloadRoot, { recursive: true });
  await writeMappedPackageFiles(payloadRoot, fileEntries, (entry) =>
    windowsPayloadPathForArchivePath(plan, entry.relativePath)
  );
  const wixSourcePath = path.join(buildRoot, 'sdkwork-claw-router.wxs');
  await writeFile(wixSourcePath, createWixSource(plan, payloadRoot, fileEntries), 'utf8');
  await execFileAsync('wix', [
    'build',
    wixSourcePath,
    '-arch',
    plan.package.architecture === 'arm64' ? 'arm64' : 'x64',
    '-pdbtype',
    'none',
    '-out',
    plan.installerPath,
  ], {
    cwd: workspaceRoot,
    maxBuffer: 1024 * 1024 * 16,
  });
  await rm(buildRoot, { recursive: true, force: true });
}

function windowsPayloadPathForArchivePath(_plan, archivePath) {
  const normalized = String(archivePath).replaceAll('\\', '/');
  if (normalized === PACKAGE_MANIFEST_FILE) {
    return 'install-manifest.json';
  }
  return normalized;
}

function createWixSource(plan, payloadRoot, fileEntries) {
  const componentRefs = [];
  const directoryTree = new DirectoryNode('INSTALLFOLDER', 'SdkWork Claw Router');
  for (const entry of fileEntries) {
    const payloadPath = windowsPayloadPathForArchivePath(plan, entry.relativePath);
    if (!payloadPath) {
      continue;
    }
    const fileId = stableWixId('fil', payloadPath);
    const componentId = stableWixId('cmp', payloadPath);
    componentRefs.push(componentId);
    directoryTree.addFile(payloadPath.split('/'), {
      componentId,
      fileId,
      source: path.join(payloadRoot, ...payloadPath.split('/')),
    });
  }

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<Wix xmlns="http://wixtoolset.org/schemas/v4/wxs">',
    `  <Package Name="SdkWork Claw Router" Manufacturer="SdkWork Cloud" Version="${xmlEscape(windowsPackageVersion(plan.package.version))}" UpgradeCode="{${WINDOWS_UPGRADE_CODE}}" Scope="perMachine">`,
    '    <MajorUpgrade DowngradeErrorMessage="A newer version of SdkWork Claw Router is already installed." />',
    '    <MediaTemplate EmbedCab="yes" />',
    '    <StandardDirectory Id="ProgramFiles64Folder">',
    ...renderWixDirectory(directoryTree, 3),
    '    </StandardDirectory>',
    '    <Feature Id="MainFeature" Title="SdkWork Claw Router" Level="1">',
    ...componentRefs.map((componentId) => `      <ComponentRef Id="${componentId}" />`),
    '    </Feature>',
    '  </Package>',
    '</Wix>',
    '',
  ].join('\n');
}

class DirectoryNode {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.directories = new Map();
    this.files = [];
  }

  addFile(parts, file) {
    if (parts.length === 1) {
      this.files.push({ ...file, name: parts[0] });
      return;
    }
    const directoryName = parts[0];
    const directoryId = stableWixId('dir', parts.slice(0, -1).join('/'));
    if (!this.directories.has(directoryName)) {
      this.directories.set(directoryName, new DirectoryNode(directoryId, directoryName));
    }
    this.directories.get(directoryName).addFile(parts.slice(1), file);
  }
}

function renderWixDirectory(node, indentLevel) {
  const indent = '  '.repeat(indentLevel);
  const lines = [`${indent}<Directory Id="${node.id}" Name="${xmlEscape(node.name)}">`];
  for (const child of [...node.directories.values()].sort((left, right) => left.name.localeCompare(right.name))) {
    lines.push(...renderWixDirectory(child, indentLevel + 1));
  }
  for (const file of node.files.sort((left, right) => left.name.localeCompare(right.name))) {
    lines.push(`${indent}  <Component Id="${file.componentId}" Guid="*">`);
    lines.push(`${indent}    <File Id="${file.fileId}" Source="${xmlEscape(file.source)}" KeyPath="yes" />`);
    lines.push(`${indent}  </Component>`);
  }
  lines.push(`${indent}</Directory>`);
  return lines;
}

async function writeMappedPackageFiles(root, fileEntries, mapPath) {
  for (const entry of fileEntries) {
    const target = mapPath(entry);
    if (!target) {
      continue;
    }
    const safeTarget = String(target).replace(/^\/+/u, '');
    const targetPath = path.join(root, ...safeTarget.split('/'));
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, entry.data);
    if ((entry.mode ?? 0o644) & 0o111) {
      await chmod(targetPath, 0o755);
    }
  }
}

function createArArchive(entries) {
  const chunks = [Buffer.from('!<arch>\n', 'ascii')];
  for (const entry of entries) {
    const data = Buffer.from(entry.data);
    const header = Buffer.alloc(60, 0x20);
    const name = `${entry.name}/`;
    if (Buffer.byteLength(name, 'ascii') > 16) {
      throw new Error(`ar entry name is too long: ${entry.name}`);
    }
    header.write(name.padEnd(16, ' '), 0, 16, 'ascii');
    header.write('0'.padEnd(12, ' '), 16, 12, 'ascii');
    header.write('0'.padEnd(6, ' '), 28, 6, 'ascii');
    header.write('0'.padEnd(6, ' '), 34, 6, 'ascii');
    header.write((entry.mode ?? 0o644).toString(8).padEnd(8, ' '), 40, 8, 'ascii');
    header.write(String(data.length).padEnd(10, ' '), 48, 10, 'ascii');
    header.write('`\n', 58, 2, 'ascii');
    chunks.push(header, data);
    if (data.length % 2 === 1) {
      chunks.push(Buffer.from('\n', 'ascii'));
    }
  }
  return Buffer.concat(chunks);
}

function currentHostNativePackageId(platform = process.platform, arch = process.arch) {
  const normalizedPlatform = platform === 'win32' ? 'windows' : platform === 'darwin' ? 'macos' : 'linux';
  const normalizedArch = arch === 'arm64' ? 'arm64' : 'x64';
  return `${normalizedPlatform}-${normalizedArch}-service`;
}

function nativeInstallerNameForPackage(packageItem) {
  return `sdkwork-claw-router-${packageItem.id}-${packageItem.version}.${nativeInstallerFormatForPlatform(packageItem.platform)}`;
}

function nativeInstallerFormatForPlatform(platform) {
  if (platform === 'linux') {
    return 'deb';
  }
  if (platform === 'macos') {
    return 'pkg';
  }
  if (platform === 'windows') {
    return 'msi';
  }
  throw new Error(`Unsupported native installer platform: ${platform}`);
}

function nativeInstallerToolForPlatform(platform) {
  if (platform === 'linux') {
    return 'internal-deb';
  }
  if (platform === 'macos') {
    return 'pkgbuild';
  }
  if (platform === 'windows') {
    return 'wix';
  }
  throw new Error(`Unsupported native installer platform: ${platform}`);
}

function debianArchitecture(architecture) {
  return architecture === 'arm64' ? 'arm64' : 'amd64';
}

function debianVersion(version) {
  return String(version).replace(/[^0-9A-Za-z.+:~-]/gu, '-');
}

function macosPackageVersion(version) {
  return numericTripletVersion(version);
}

function windowsPackageVersion(version) {
  return numericTripletVersion(version);
}

function numericTripletVersion(version) {
  const parts = String(version)
    .split(/[^\d]+/u)
    .filter(Boolean)
    .slice(0, 3);
  while (parts.length < 3) {
    parts.push('0');
  }
  return parts.join('.');
}

function stableWixId(prefix, value) {
  const digest = createHash('sha1').update(String(value)).digest('hex').slice(0, 24);
  return `${prefix}_${digest}`;
}

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function renderNativeInstallerBuildPlan(plan) {
  return [
    `[native-installer-build] package: ${plan.package.id}`,
    `[native-installer-build] format: ${plan.nativeFormat}`,
    `[native-installer-build] tool: ${plan.buildTool}`,
    `[native-installer-build] installer: ${plan.installerPath}`,
    `[native-installer-build] manifest: ${plan.manifestPath}`,
    `[native-installer-build] source entries: ${plan.archiveBuildPlan.entries.length}`,
  ];
}

async function main(argv = process.argv.slice(2)) {
  const settings = parseNativeInstallerBuildArgs(argv);
  if (settings.help) {
    printHelp();
    return 0;
  }
  if (settings.all) {
    return await runAllNativeInstallerBuilds(settings);
  }

  const plan = createNativeInstallerBuildPlan({
    packageId: settings.packageId,
    stagingRoot: settings.stagingRoot ?? defaultStagingRoot(workspaceRoot),
    outputDir: settings.outputDir ?? defaultInstallPackageOutputDir(workspaceRoot),
    version: settings.version,
    root: workspaceRoot,
    requireStagedFiles: !settings.dryRun,
  });
  const issues = settings.dryRun
    ? validateNativeInstallerBuildPlanForDryRun(plan)
    : validateNativeInstallerBuildPlan(plan);

  if (settings.json && (settings.check || settings.dryRun)) {
    console.log(JSON.stringify({
      ok: issues.length === 0,
      issues,
      plan,
    }, null, 2));
  } else if (!settings.json) {
    for (const line of renderNativeInstallerBuildPlan(plan)) {
      console.log(line);
    }
    if (issues.length > 0) {
      console.error('[native-installer-build] validation issues:');
      for (const issue of issues) {
        console.error(`[native-installer-build]   ${issue}`);
      }
    }
  }

  if (settings.check && issues.length > 0) {
    return 1;
  }
  if (settings.dryRun) {
    return 0;
  }

  const result = await buildNativeInstaller(plan);
  if (settings.json) {
    console.log(JSON.stringify({
      ok: true,
      installer: result.installer,
      manifestPath: result.manifestPath,
      aggregateManifestPath: result.aggregateManifestPath,
    }, null, 2));
  } else {
    console.log(`[native-installer-build] written: ${result.installerPath}`);
    console.log(`[native-installer-build] sha256: ${result.installer.sha256}`);
  }
  return 0;
}

async function runAllNativeInstallerBuilds(settings) {
  const packageIds = nativeInstallerPackageIds(settings.version);
  const plans = packageIds.map((packageId) => createNativeInstallerBuildPlan({
    packageId,
    stagingRoot: settings.stagingRoot ?? defaultStagingRoot(workspaceRoot),
    outputDir: settings.outputDir ?? defaultInstallPackageOutputDir(workspaceRoot),
    version: settings.version,
    root: workspaceRoot,
    requireStagedFiles: !settings.dryRun,
  }));
  const issues = plans.flatMap((plan) =>
    (settings.dryRun ? validateNativeInstallerBuildPlanForDryRun(plan) : validateNativeInstallerBuildPlan(plan))
      .map((issue) => `${plan.package.id}: ${issue}`)
  );

  if (settings.json && (settings.check || settings.dryRun)) {
    console.log(JSON.stringify({
      ok: issues.length === 0,
      issues,
      plans,
    }, null, 2));
  } else if (!settings.json) {
    console.log(`[native-installer-build] packages: ${plans.length}`);
    for (const plan of plans) {
      for (const line of renderNativeInstallerBuildPlan(plan)) {
        console.log(line);
      }
    }
  }
  if (settings.check && issues.length > 0) {
    return 1;
  }
  if (settings.dryRun) {
    return 0;
  }

  const results = [];
  for (const plan of plans) {
    results.push(await buildNativeInstaller(plan));
  }
  if (settings.json) {
    console.log(JSON.stringify({
      ok: true,
      installers: results.map((result) => result.installer),
      aggregateManifestPath: results.at(-1)?.aggregateManifestPath ?? null,
    }, null, 2));
  } else {
    for (const result of results) {
      console.log(`[native-installer-build] written: ${result.installerPath}`);
      console.log(`[native-installer-build] sha256: ${result.installer.sha256}`);
    }
  }
  return 0;
}

function validateNativeInstallerBuildPlanForDryRun(plan) {
  return validateNativeInstallerBuildPlan(plan)
    .filter((issue) =>
      !issue.includes('requires staged artifact')
      && !issue.includes('requires macOS pkgbuild')
      && !issue.includes('requires Windows WiX tooling')
    );
}

function nativeInstallerPackageIds(version = DEFAULT_VERSION) {
  return createInstallPackagePlan({
    version,
    deploymentModes: [...NATIVE_INSTALLER_DEPLOYMENT_MODES],
  }).packages.map((packageItem) => packageItem.id);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\', '/'))) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(`[native-installer-build] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}

export {
  NATIVE_INSTALLER_DEPLOYMENT_MODES,
  NATIVE_INSTALLER_SCHEMA_VERSION,
  buildNativeInstaller,
  collectPackageFileEntries,
  createArArchive,
  createDebianPackage,
  createNativeInstallerBuildPlan,
  currentHostNativePackageId,
  debianArchitecture,
  debianInstallPathForArchivePath,
  main,
  nativeInstallerNameForPackage,
  nativeInstallerPackageIds,
  parseNativeInstallerBuildArgs,
  renderNativeInstallerBuildPlan,
  validateNativeInstallerBuildPlan,
};
