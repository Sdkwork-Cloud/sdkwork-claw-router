#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { createZip } from './archive-claw-router-sdks.mjs';
import {
  DEFAULT_VERSION,
  INTERNAL_PROJECT_NAME,
  PACKAGE_NAME,
  POSIX_INSTALL_ROOT,
  createInstallPackagePlan,
  RUNTIME_CONFIG_TEMPLATE_PATH,
  RUNTIME_DISPLAY_NAME,
  WINDOWS_INSTALL_ROOT,
  validateInstallPackagePlan,
} from './plan-claw-router-install-packages.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..');
const AGGREGATE_MANIFEST_FILE = 'install-packages-manifest.json';
const PACKAGE_MANIFEST_FILE = 'install-manifest.json';
const INSTALL_MANIFEST_SCHEMA_VERSION = '2026-05-15.install-manifest.v1';
const INSTALL_PACKAGES_MANIFEST_SCHEMA_VERSION = '2026-05-15.install-packages-manifest.v1';

function printHelp() {
  console.log(`Usage: node scripts/build-claw-router-install-package.mjs [options]

Build one manifest-backed install package archive from staged production files.

Options:
  --package-id <id>    Package id from install package plan.
  --all                Validate or build all package ids from the install package plan.
  --staging-root <dir> Directory containing staged package files.
  --output-dir <dir>   Output directory (default dist/install-packages).
  --version <value>    Product package version (default ${DEFAULT_VERSION}).
  --check              Validate the package build plan.
  --dry-run            Print the package build plan without writing archives.
  --json               Print machine-readable JSON.
  -h, --help           Show this help.
`);
}

function parseInstallPackageBuildArgs(argv = process.argv.slice(2)) {
  const settings = {
    all: false,
    check: false,
    dryRun: false,
    help: false,
    json: false,
    outputDir: null,
    packageId: currentHostArchivePackageId(process.platform, process.arch),
    stagingRoot: null,
    version: DEFAULT_VERSION,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--') {
      continue;
    }
    switch (arg) {
      case '--check':
        settings.check = true;
        break;
      case '--all':
        settings.all = true;
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
        throw new Error(`Unsupported install package build option: ${arg}`);
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

function createInstallPackageBuildPlan({
  packageId = currentHostArchivePackageId(process.platform, process.arch),
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
    throw new Error(`Unknown install package id: ${packageId}`);
  }

  const absoluteStagingRoot = path.resolve(root, stagingRoot);
  const absoluteOutputDir = path.resolve(root, outputDir);
  const entries = createArchiveEntriesForPackage(packageItem, absoluteStagingRoot, {
    requireStagedFiles,
  });
  const archivePath = path.join(absoluteOutputDir, packageItem.archiveName);
  const manifestPath = path.join(
    absoluteOutputDir,
    packageItem.archiveName.replace(/\.(zip|tar\.gz)$/u, '.manifest.json'),
  );

  return {
    schemaVersion: '2026-05-15.install-package-build.v1',
    package: packageItem,
    stagingRoot: absoluteStagingRoot,
    outputDir: absoluteOutputDir,
    archivePath,
    manifestPath,
    aggregateManifestPath: path.join(absoluteOutputDir, AGGREGATE_MANIFEST_FILE),
    entries,
  };
}

function createArchiveEntriesForPackage(packageItem, stagingRoot, { requireStagedFiles = true } = {}) {
  const entries = [];
  const usedArchivePaths = new Set();
  for (const artifact of packageItem.artifacts) {
    if (artifact.path === '.env.release.local') {
      continue;
    }
    if (artifact.kind === 'install-manifest') {
      continue;
    }
    if (artifact.kind === 'runtime-config-template') {
      entries.push(createGeneratedRuntimeConfigTemplateEntry());
      continue;
    }
    if (artifact.kind === 'install-guide') {
      entries.push(createGeneratedInstallGuideEntry());
      continue;
    }
    if (artifact.kind === 'service-manifest') {
      entries.push(createGeneratedServiceManifestEntry(packageItem));
      continue;
    }
    if (artifact.kind === 'container-entrypoint') {
      entries.push(...createGeneratedContainerEntries(packageItem));
      continue;
    }
    if (artifact.kind === 'desktop-manifest') {
      entries.push(...createGeneratedDesktopEntries());
      continue;
    }
    entries.push(...artifactEntries({
      artifact,
      stagingRoot,
      usedArchivePaths,
      requireStagedFiles,
    }));
  }
  entries.push({
    archivePath: PACKAGE_MANIFEST_FILE,
    sourcePath: null,
    generated: true,
    generatedKind: 'install-manifest',
    mode: 0o644,
    required: true,
  });
  return entries.sort((left, right) => left.archivePath.localeCompare(right.archivePath));
}

function createGeneratedRuntimeConfigTemplateEntry() {
  return {
    archivePath: RUNTIME_CONFIG_TEMPLATE_PATH,
    sourcePath: null,
    generated: true,
    generatedKind: 'runtime-config-template',
    mode: 0o644,
    required: true,
  };
}

function createGeneratedInstallGuideEntry() {
  return {
    archivePath: 'INSTALL.md',
    sourcePath: null,
    generated: true,
    generatedKind: 'install-guide',
    mode: 0o644,
    required: true,
  };
}

function createGeneratedServiceManifestEntry(packageItem) {
  return {
    archivePath: normalizeArchivePath(packageItem.serviceIntegration.manifest),
    sourcePath: null,
    generated: true,
    generatedKind: 'service-manifest',
    mode: 0o644,
    required: true,
  };
}

function createGeneratedDesktopEntries() {
  return [
    {
      archivePath: 'desktop/metadata.json',
      sourcePath: null,
      generated: true,
      generatedKind: 'desktop-metadata',
      mode: 0o644,
      required: true,
    },
  ];
}

function createGeneratedContainerEntries(packageItem) {
  const entrypointPath = packageItem.platform === 'windows'
    ? 'container/entrypoint.ps1'
    : 'container/entrypoint';
  return [
    {
      archivePath: 'container/Containerfile',
      sourcePath: null,
      generated: true,
      generatedKind: 'containerfile',
      mode: 0o644,
      required: true,
    },
    {
      archivePath: entrypointPath,
      sourcePath: null,
      generated: true,
      generatedKind: 'container-entrypoint',
      mode: modeForArchivePath(entrypointPath),
      required: true,
    },
    {
      archivePath: 'container/metadata.json',
      sourcePath: null,
      generated: true,
      generatedKind: 'container-metadata',
      mode: 0o644,
      required: true,
    },
  ];
}

function artifactEntries({ artifact, stagingRoot, usedArchivePaths, requireStagedFiles }) {
  const relativePath = normalizeArchivePath(artifact.path);
  if (relativePath === '.env.release.local') {
    return [];
  }
  const sourcePath = path.join(stagingRoot, relativePath);
  if (!existsSync(sourcePath)) {
    if (!requireStagedFiles) {
      if (artifact.required) {
        return [{
          archivePath: relativePath,
          sourcePath,
          mode: modeForArchivePath(relativePath),
          planned: true,
          required: true,
        }];
      }
      return [];
    }
    if (artifact.required) {
      return [{
        archivePath: relativePath,
        sourcePath,
        mode: modeForArchivePath(relativePath),
        missing: true,
        required: true,
      }];
    }
    return [];
  }

  const archivePaths = collectArchivePaths(sourcePath, relativePath);
  const entries = [];
  for (const archivePath of archivePaths) {
    if (usedArchivePaths.has(archivePath)) {
      continue;
    }
    usedArchivePaths.add(archivePath);
    entries.push({
      archivePath,
      sourcePath: path.join(stagingRoot, archivePath),
      generated: false,
      mode: modeForArchivePath(archivePath),
      required: true,
    });
  }
  return entries;
}

function collectArchivePaths(sourcePath, relativePath) {
  const info = statSync(sourcePath);
  if (info.isFile()) {
    return [normalizeArchivePath(relativePath)];
  }
  if (!info.isDirectory()) {
    return [];
  }
  const result = [];
  for (const child of readdirSync(sourcePath).sort()) {
    if (child === '.env.release.local' || child === 'node_modules' || child === '.git') {
      continue;
    }
    result.push(...collectArchivePaths(
      path.join(sourcePath, child),
      `${relativePath}/${child}`,
    ));
  }
  return result;
}

function validateInstallPackageBuildPlan(buildPlan) {
  const issues = [];
  if (buildPlan.schemaVersion !== '2026-05-15.install-package-build.v1') {
    issues.push('schemaVersion must be 2026-05-15.install-package-build.v1');
  }
  if (!buildPlan.package?.id) {
    issues.push('package id is required');
  }
  if (!buildPlan.archivePath || !buildPlan.archivePath.endsWith(buildPlan.package.archiveName)) {
    issues.push('archivePath must end with package archiveName');
  }
  if (buildPlan.entries.some((entry) => entry.archivePath === '.env.release.local')) {
    issues.push('.env.release.local must not be packaged');
  }
  if (buildPlan.entries.some((entry) => /secret/u.test(entry.archivePath))) {
    issues.push('archive entry paths must not contain secret material markers');
  }
  if (!buildPlan.entries.some((entry) => entry.archivePath === PACKAGE_MANIFEST_FILE && entry.generated)) {
    issues.push('install-manifest.json must be generated into the archive');
  }
  if (!buildPlan.entries.some((entry) =>
    entry.archivePath === RUNTIME_CONFIG_TEMPLATE_PATH
    && entry.generated
    && entry.generatedKind === 'runtime-config-template'
  )) {
    issues.push(`${buildPlan.package.id} must generate ${RUNTIME_CONFIG_TEMPLATE_PATH}`);
  }
  if (!buildPlan.entries.some((entry) =>
    entry.archivePath === 'INSTALL.md'
    && entry.generated
    && entry.generatedKind === 'install-guide'
  )) {
    issues.push(`${buildPlan.package.id} must generate INSTALL.md`);
  }
  if (buildPlan.package.deploymentMode === 'service') {
    const expectedManifest = buildPlan.package.serviceIntegration?.manifest;
    if (!expectedManifest || !buildPlan.entries.some((entry) =>
      entry.archivePath === expectedManifest && entry.generated && entry.generatedKind === 'service-manifest'
    )) {
      issues.push(`${buildPlan.package.id} must generate ${expectedManifest ?? 'a service manifest'}`);
    }
  }
  if (buildPlan.package.deploymentMode === 'container') {
    const expectedContainerArtifacts = [
      'container/Containerfile',
      'container/metadata.json',
      buildPlan.package.platform === 'windows' ? 'container/entrypoint.ps1' : 'container/entrypoint',
    ];
    for (const containerArtifact of expectedContainerArtifacts) {
      if (!buildPlan.entries.some((entry) => entry.archivePath === containerArtifact && entry.generated)) {
        issues.push(`${buildPlan.package.id} must generate ${containerArtifact}`);
      }
    }
  }
  if (buildPlan.package.deploymentMode === 'desktop') {
    if (!buildPlan.entries.some((entry) =>
      entry.archivePath === 'desktop/metadata.json'
      && entry.generated
      && entry.generatedKind === 'desktop-metadata'
    )) {
      issues.push(`${buildPlan.package.id} must generate desktop/metadata.json`);
    }
  }
  for (const entry of buildPlan.entries) {
    if (entry.missing && entry.required) {
      issues.push(`${buildPlan.package.id} requires staged artifact ${entry.archivePath}`);
    }
  }
  return issues;
}

async function buildInstallPackageArchive(buildPlan) {
  const issues = validateInstallPackageBuildPlan(buildPlan);
  if (issues.length > 0) {
    throw new Error(`install package build plan is invalid: ${issues.join('; ')}`);
  }
  await mkdir(buildPlan.outputDir, { recursive: true });

  const fileEntries = [];
  const artifactFiles = [];
  const generatedArtifacts = [];
  for (const entry of buildPlan.entries.filter((item) => !item.generated)) {
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
  for (const entry of buildPlan.entries.filter((item) => item.generated && item.archivePath !== PACKAGE_MANIFEST_FILE)) {
    const data = createGeneratedArtifactBytes(buildPlan, entry);
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

  const generatedAt = resolveManifestGeneratedAt();
  const packageManifest = createPackageManifest(buildPlan, artifactFiles, generatedArtifacts, { generatedAt });
  const manifestBytes = Buffer.from(`${JSON.stringify(packageManifest, null, 2)}\n`, 'utf8');
  fileEntries.push({
    relativePath: PACKAGE_MANIFEST_FILE,
    data: manifestBytes,
    mode: 0o644,
  });

  const archiveBytes = createInstallArchiveBytes(
    buildPlan,
    fileEntries.sort((left, right) => left.relativePath.localeCompare(right.relativePath)),
  );
  await writeFile(buildPlan.archivePath, archiveBytes);
  await writeFile(buildPlan.manifestPath, manifestBytes);

  const archive = {
    file: path.basename(buildPlan.archivePath),
    packageId: buildPlan.package.id,
    version: buildPlan.package.version,
    size: archiveBytes.length,
    sha256: sha256(archiveBytes),
  };
  const aggregateManifest = createAggregateManifest(buildPlan, archive, { generatedAt });
  await writeFile(
    buildPlan.aggregateManifestPath,
    `${JSON.stringify(aggregateManifest, null, 2)}\n`,
    'utf8',
  );

  return {
    archive,
    archivePath: buildPlan.archivePath,
    manifest: packageManifest,
    manifestPath: buildPlan.manifestPath,
    aggregateManifest,
    aggregateManifestPath: buildPlan.aggregateManifestPath,
  };
}

function normalizeManifestTimestamp(value, label) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) {
    throw new Error(`${label} must be a valid timestamp`);
  }
  return date.toISOString();
}

function resolveManifestGeneratedAt({ env = process.env, now = new Date() } = {}) {
  const explicitGeneratedAt = String(env.SDKWORK_CLAW_RELEASE_GENERATED_AT ?? '').trim();
  if (explicitGeneratedAt) {
    return normalizeManifestTimestamp(explicitGeneratedAt, 'SDKWORK_CLAW_RELEASE_GENERATED_AT');
  }

  const sourceDateEpoch = String(env.SOURCE_DATE_EPOCH ?? '').trim();
  if (sourceDateEpoch) {
    if (!/^\d+$/u.test(sourceDateEpoch)) {
      throw new Error('SOURCE_DATE_EPOCH must be an integer Unix timestamp in seconds');
    }
    return normalizeManifestTimestamp(new Date(Number(sourceDateEpoch) * 1000), 'SOURCE_DATE_EPOCH');
  }

  return normalizeManifestTimestamp(now, 'manifest generation time');
}

function createPackageManifest(buildPlan, artifactFiles, generatedArtifacts = [], options = {}) {
  const generatedAt = options.generatedAt ?? resolveManifestGeneratedAt();
  return {
    schemaVersion: INSTALL_MANIFEST_SCHEMA_VERSION,
    generatedAt,
    product: INTERNAL_PROJECT_NAME,
    packageName: PACKAGE_NAME,
    runtimeName: PACKAGE_NAME,
    displayName: RUNTIME_DISPLAY_NAME,
    package: {
      id: buildPlan.package.id,
      version: buildPlan.package.version,
      platform: buildPlan.package.platform,
      architecture: buildPlan.package.architecture,
      deploymentMode: buildPlan.package.deploymentMode,
      runtimeProfile: buildPlan.package.runtimeProfile,
      archiveName: buildPlan.package.archiveName,
      binaryName: buildPlan.package.binaryName,
      installerBinaryName: buildPlan.package.installerBinaryName,
      startCommand: buildPlan.package.startCommand,
      healthChecks: buildPlan.package.healthChecks,
    },
    initCommands: buildPlan.package.initCommands,
    databasePolicy: buildPlan.package.databasePolicy,
    runtimeConfig: {
      templatePath: RUNTIME_CONFIG_TEMPLATE_PATH,
      configFile: buildPlan.package.databasePolicy.configFile.path,
      dataDirectory: buildPlan.package.databasePolicy.dataDirectory.path,
    },
    artifacts: artifactFiles,
    generatedArtifacts,
    security: buildPlan.package.security,
  };
}

function createGeneratedArtifactBytes(buildPlan, entry) {
  switch (entry.generatedKind) {
    case 'service-manifest':
      return Buffer.from(createServiceManifest(buildPlan.package), 'utf8');
    case 'install-guide':
      return Buffer.from(createInstallGuide(buildPlan.package), 'utf8');
    case 'runtime-config-template':
      return Buffer.from(createRuntimeConfigTemplate(buildPlan.package), 'utf8');
    case 'containerfile':
      return Buffer.from(createContainerfile(buildPlan.package), 'utf8');
    case 'container-entrypoint':
      return Buffer.from(createContainerEntrypoint(buildPlan.package), 'utf8');
    case 'container-metadata':
      return Buffer.from(`${JSON.stringify(createContainerMetadata(buildPlan.package), null, 2)}\n`, 'utf8');
    case 'desktop-metadata':
      return Buffer.from(`${JSON.stringify(createDesktopMetadata(buildPlan.package), null, 2)}\n`, 'utf8');
    default:
      throw new Error(`Unsupported generated install package artifact: ${entry.generatedKind}`);
  }
}

function createInstallGuide(packageItem) {
  const policy = packageItem.databasePolicy;
  const lines = [
    `# ${RUNTIME_DISPLAY_NAME} Install Guide`,
    '',
    `Package: ${packageItem.id}`,
    `Version: ${packageItem.version}`,
    `Deployment mode: ${packageItem.deploymentMode}`,
    `Runtime profile: ${packageItem.runtimeProfile}`,
    `Config file: ${policy.configFile.path}`,
    `Data directory: ${policy.dataDirectory.path}`,
    '',
    '## Runtime Configuration',
    '',
    `The runtime TOML template is packaged at ${RUNTIME_CONFIG_TEMPLATE_PATH}.`,
    `Set SDKWORK_CLAW_CONFIG_FILE to use a custom config file path; otherwise use ${policy.configFile.path}.`,
    'Set SDKWORK_CLAW_DEPLOYMENT_MODE to server for archive, service, and container deployments, or desktop for desktop deployments.',
    '',
  ];

  if (packageItem.databasePolicy.defaultEngine === 'sqlite') {
    lines.push(
      'Desktop deployments default to SQLite.',
      `Default SQLite file: ${policy.defaultSqlitePath}`,
      'Override SDKWORK_CLAW_DATABASE_URL only for diagnostics or managed private deployments.',
      '',
    );
  } else {
    lines.push(
      'This package is configured for external PostgreSQL.',
      `Set [database].host, [database].database, [database].username, and [database].password_file in ${policy.configFile.path}.`,
      `Write the PostgreSQL password to ${policy.passwordFile.path}, or set [database].password directly in protected TOML for controlled deployments.`,
      'SDKWORK_CLAW_DATABASE_URL remains available only as an explicit operator override.',
      `Set SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS to ${policy.maxConnections} or another capacity-planned value.`,
      '',
    );
  }

  lines.push(
    '## Fast Initialization',
    '',
  );
  if (packageItem.deploymentMode === 'service' && packageItem.platform === 'linux') {
    lines.push(
      'Linux service packages run initialization automatically from systemd before the gateway starts:',
      '',
      '```sh',
      ...packageItem.initCommands.map((command) => command.replace('./bin/', `${POSIX_INSTALL_ROOT}/bin/`)),
      '```',
      '',
      'Use the commands manually only for recovery or operator-driven catalog refreshes.',
      '',
    );
  } else {
    lines.push(
      'Run these commands after unpacking and before enabling traffic:',
      '',
      '```sh',
      ...packageItem.initCommands,
      '```',
      '',
    );
  }
  lines.push(
    'The installer writes missing runtime config files, validates database readiness, refreshes the SDK catalog, and then leaves startup to the package mode.',
    '',
    '## Security',
    '',
    'Do not package .env.release.local.',
    'Generate host-local env files on the target machine and keep secret values outside browser-visible PORTAL_PUBLIC_* variables.',
    'Prefer password_file for database secrets. Use [database].password only when the runtime TOML is protected as a secret-bearing file.',
    '',
  );

  if (packageItem.deploymentMode === 'service' && packageItem.serviceIntegration?.manifest) {
    lines.push(
      '## Service Integration',
      '',
      `Service manifest: ${packageItem.serviceIntegration.manifest}`,
      `Start command: ${packageItem.startCommand}`,
      '',
    );
  }
  if (packageItem.deploymentMode === 'container' && packageItem.containerIntegration) {
    lines.push(
      '## Container Integration',
      '',
      `Entrypoint: ${packageItem.containerIntegration.entrypoint}`,
      `Working directory: ${packageItem.containerIntegration.workingDirectory}`,
      'Mount runtime config and mutable data instead of baking secrets or database state into the image.',
      '',
    );
  }
  if (packageItem.deploymentMode === 'desktop') {
    lines.push(
      '## Desktop First Run',
      '',
      'The desktop package can initialize its config file and SQLite database automatically for the current OS user.',
      'Use SDKWORK_CLAW_CONFIG_FILE only when an administrator needs to manage a non-default config location.',
      '',
    );
  }

  return `${lines.join('\n')}\n`;
}

function createRuntimeConfigTemplate(packageItem) {
  const policy = packageItem.databasePolicy;
  const lines = [
    `# ${RUNTIME_DISPLAY_NAME} runtime configuration template.`,
    `# Install this file as: ${policy.configFile.path}`,
    `# Runtime profile: ${packageItem.runtimeProfile}`,
    '',
  ];

  if (policy.defaultEngine === 'postgresql') {
    lines.push(
      '# Server and container-grade releases require external PostgreSQL.',
      '# Configure connection location here. Store secret material in password_file,',
      '# or set password directly only when this TOML is protected as a secret-bearing file.',
      '',
    );
  } else {
    lines.push(
      '# Desktop releases default to a local SQLite database in the OS user data directory.',
      `# Default SQLite file: ${policy.defaultSqlitePath}`,
      '',
    );
  }

  lines.push(
    '[database]',
    `engine = "${policy.defaultEngine}"`,
  );

  if (policy.defaultEngine === 'postgresql') {
    lines.push(
      `host = "${policy.defaultHost}"`,
      `port = ${policy.defaultPort}`,
      `database = "${policy.defaultDatabase}"`,
      `username = "${policy.defaultUsername}"`,
      `password_file = "${policy.passwordFile.path}"`,
      '# password = "change-me"',
      'ssl_mode = "require"',
      `max_connections = ${policy.maxConnections}`,
    );
  } else {
    lines.push(
      `url = "${policy.defaultUrl}"`,
      `max_connections = ${policy.maxConnections}`,
    );
  }

  lines.push(
    '',
    '[paths]',
    `data_directory = "${policy.dataDirectory.path}"`,
    '',
    '[runtime]',
    `deployment_mode = "${packageItem.runtimeProfile === 'desktop' ? 'desktop' : 'server'}"`,
    '',
  );

  return lines.join('\n');
}

function createServiceManifest(packageItem) {
  if (packageItem.platform === 'windows') {
    return [
      '<service>',
      '  <id>clawrouter</id>',
      `  <name>${RUNTIME_DISPLAY_NAME}</name>`,
      `  <description>${RUNTIME_DISPLAY_NAME} edge server</description>`,
      `  <executable>%BASE%\\bin\\${packageItem.binaryName}</executable>`,
      '  <workingdirectory>%BASE%</workingdirectory>',
      `  <env name="SDKWORK_CLAW_CONFIG_FILE" value="${packageItem.databasePolicy.configFile.path.replaceAll('/', '\\')}"/>`,
      '  <onfailure action="restart" delay="5 sec"/>',
      '</service>',
      '',
    ].join('\n');
  }
  if (packageItem.platform === 'macos') {
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
      '<plist version="1.0">',
      '<dict>',
      '  <key>Label</key>',
      '  <string>com.sdkwork.clawrouter</string>',
      '  <key>ProgramArguments</key>',
      '  <array>',
      `    <string>${POSIX_INSTALL_ROOT}/bin/${packageItem.binaryName}</string>`,
      '  </array>',
      '  <key>WorkingDirectory</key>',
      `  <string>${POSIX_INSTALL_ROOT}</string>`,
      '  <key>EnvironmentVariables</key>',
      '  <dict>',
      '    <key>SDKWORK_CLAW_CONFIG_FILE</key>',
      `    <string>${packageItem.databasePolicy.configFile.path}</string>`,
      '  </dict>',
      '  <key>RunAtLoad</key>',
      '  <true/>',
      '  <key>KeepAlive</key>',
      '  <true/>',
      '  <key>StandardOutPath</key>',
      '  <string>/var/log/clawrouter/stdout.log</string>',
      '  <key>StandardErrorPath</key>',
      '  <string>/var/log/clawrouter/stderr.log</string>',
      '</dict>',
      '</plist>',
      '',
    ].join('\n');
  }
  return [
    '[Unit]',
    `Description=${RUNTIME_DISPLAY_NAME} edge server`,
    'After=network-online.target',
    'Wants=network-online.target',
    '',
    '[Service]',
    'Type=simple',
    `WorkingDirectory=${POSIX_INSTALL_ROOT}`,
    'EnvironmentFile=-/etc/clawrouter/clawrouter.env',
    `Environment=SDKWORK_CLAW_CONFIG_FILE=${packageItem.databasePolicy.configFile.path}`,
    'Environment=SDKWORK_CLAW_DEPLOYMENT_MODE=server',
    `ExecStartPre=${POSIX_INSTALL_ROOT}/bin/${packageItem.installerBinaryName} ensure`,
    `ExecStartPre=${POSIX_INSTALL_ROOT}/bin/${packageItem.installerBinaryName} refresh-catalog --force`,
    `ExecStart=${POSIX_INSTALL_ROOT}/bin/${packageItem.binaryName}`,
    'Restart=on-failure',
    'RestartSec=5',
    'User=sdkwork',
    'Group=sdkwork',
    'NoNewPrivileges=true',
    'PrivateTmp=true',
    'ProtectSystem=strict',
    'ProtectHome=true',
    'ReadWritePaths=/var/lib/clawrouter /var/log/clawrouter /etc/clawrouter',
    '',
    '[Install]',
    'WantedBy=multi-user.target',
    '',
  ].join('\n');
}

function createContainerfile(packageItem) {
  const entrypoint = packageItem.platform === 'windows'
    ? `["powershell.exe", "-ExecutionPolicy", "Bypass", "-File", "${WINDOWS_INSTALL_ROOT}/container/entrypoint.ps1"]`
    : `["${POSIX_INSTALL_ROOT}/container/entrypoint"]`;
  if (packageItem.platform === 'windows') {
    return [
      '# syntax=docker/dockerfile:1',
      'FROM mcr.microsoft.com/windows/nanoserver:ltsc2022',
      `WORKDIR ${WINDOWS_INSTALL_ROOT}`,
      `COPY . ${WINDOWS_INSTALL_ROOT}`,
      `ENV SDKWORK_CLAW_CONFIG_FILE="${packageItem.databasePolicy.configFile.path}"`,
      'EXPOSE 3900',
      `ENTRYPOINT ${entrypoint}`,
      '',
    ].join('\n');
  }
  return [
    '# syntax=docker/dockerfile:1',
    'FROM debian:bookworm-slim',
    `RUN groupadd --system sdkwork && useradd --system --gid sdkwork --home-dir ${POSIX_INSTALL_ROOT} sdkwork`,
    `WORKDIR ${POSIX_INSTALL_ROOT}`,
    `COPY . ${POSIX_INSTALL_ROOT}`,
    `RUN chmod 0755 ${POSIX_INSTALL_ROOT}/bin/${packageItem.binaryName} ${POSIX_INSTALL_ROOT}/bin/${packageItem.installerBinaryName} ${POSIX_INSTALL_ROOT}/container/entrypoint`,
    `ENV SDKWORK_CLAW_CONFIG_FILE="${packageItem.databasePolicy.configFile.path}"`,
    'USER sdkwork',
    'EXPOSE 3900',
    `ENTRYPOINT ${entrypoint}`,
    '',
  ].join('\n');
}

function createContainerEntrypoint(packageItem) {
  if (packageItem.platform === 'windows') {
    return [
      '$ErrorActionPreference = "Stop"',
      `& "C:\\clawrouter\\bin\\${packageItem.installerBinaryName}" ensure`,
      `& "C:\\clawrouter\\bin\\${packageItem.installerBinaryName}" refresh-catalog --force`,
      `& "C:\\clawrouter\\bin\\${packageItem.binaryName}" @args`,
      '',
    ].join('\n');
  }
  return [
    '#!/bin/sh',
    'set -eu',
    `${POSIX_INSTALL_ROOT}/bin/${packageItem.installerBinaryName} ensure`,
    `${POSIX_INSTALL_ROOT}/bin/${packageItem.installerBinaryName} refresh-catalog --force`,
    `exec ${POSIX_INSTALL_ROOT}/bin/${packageItem.binaryName} "$@"`,
    '',
  ].join('\n');
}

function createContainerMetadata(packageItem) {
  return {
    schemaVersion: '2026-05-15.container-package.v1',
    packageId: packageItem.id,
    version: packageItem.version,
    platform: packageItem.platform,
    architecture: packageItem.architecture,
    entrypoint: packageItem.containerIntegration.entrypoint,
    entrypointScript: packageItem.platform === 'windows'
      ? `${WINDOWS_INSTALL_ROOT}/container/entrypoint.ps1`
      : `${POSIX_INSTALL_ROOT}/container/entrypoint`,
    workingDirectory: packageItem.containerIntegration.workingDirectory,
    runtimeUser: packageItem.containerIntegration.runtimeUser,
    exposedPorts: packageItem.containerIntegration.exposedPorts,
    configFile: packageItem.databasePolicy.configFile.path,
    database: packageItem.databasePolicy,
    healthChecks: packageItem.healthChecks,
    initCommands: packageItem.initCommands,
    noSecretsInPackage: packageItem.security.noSecretsInPackage,
  };
}

function createDesktopMetadata(packageItem) {
  return {
    schemaVersion: '2026-05-15.desktop-package.v1',
    packageId: packageItem.id,
    version: packageItem.version,
    platform: packageItem.platform,
    architecture: packageItem.architecture,
    runtimeProfile: packageItem.runtimeProfile,
    configFile: packageItem.databasePolicy.configFile.path,
    dataDirectory: packageItem.databasePolicy.dataDirectory.path,
    database: packageItem.databasePolicy,
    healthChecks: packageItem.healthChecks,
    initCommands: packageItem.initCommands,
    noSecretsInPackage: packageItem.security.noSecretsInPackage,
  };
}

function createAggregateManifest(buildPlan, archive, options = {}) {
  const existingArchives = readExistingAggregateArchives(buildPlan.aggregateManifestPath);
  const archivesByPackageId = new Map();
  for (const existingArchive of existingArchives) {
    if (existingArchive?.packageId) {
      archivesByPackageId.set(existingArchive.packageId, existingArchive);
    }
  }
  archivesByPackageId.set(archive.packageId, archive);
  const generatedAt = options.generatedAt ?? resolveManifestGeneratedAt();
  return {
    schemaVersion: INSTALL_PACKAGES_MANIFEST_SCHEMA_VERSION,
    generatedAt,
    product: INTERNAL_PROJECT_NAME,
    packageName: PACKAGE_NAME,
    archives: [...archivesByPackageId.values()].sort((left, right) =>
      left.packageId.localeCompare(right.packageId)
    ),
  };
}

function readExistingAggregateArchives(aggregateManifestPath) {
  if (!existsSync(aggregateManifestPath)) {
    return [];
  }
  try {
    const payload = JSON.parse(readFileSync(aggregateManifestPath, 'utf8'));
    if (
      payload?.schemaVersion !== INSTALL_PACKAGES_MANIFEST_SCHEMA_VERSION
      || payload?.product !== INTERNAL_PROJECT_NAME
      || !Array.isArray(payload.archives)
    ) {
      return [];
    }
    return payload.archives.filter((archive) =>
      archive
      && typeof archive.file === 'string'
      && typeof archive.packageId === 'string'
      && typeof archive.version === 'string'
      && typeof archive.size === 'number'
      && typeof archive.sha256 === 'string'
    );
  } catch {
    return [];
  }
}

function createInstallArchiveBytes(buildPlan, fileEntries) {
  if (buildPlan.package.archiveName.endsWith('.zip')) {
    return createZip(fileEntries);
  }
  if (buildPlan.package.archiveName.endsWith('.tar.gz')) {
    return gzipSync(createTar(fileEntries), { mtime: 0 });
  }
  throw new Error(`Unsupported install package archive extension: ${buildPlan.package.archiveName}`);
}

function createTar(fileEntries) {
  const chunks = [];
  for (const entry of fileEntries) {
    const data = Buffer.from(entry.data);
    const name = normalizeArchivePath(entry.relativePath);
    const header = createTarHeader(name, data.length, entry.mode ?? modeForArchivePath(name));
    chunks.push(header, data, Buffer.alloc(paddingForTar(data.length)));
  }
  chunks.push(Buffer.alloc(1024));
  return Buffer.concat(chunks);
}

function createTarHeader(name, size, mode = 0o644) {
  const tarPath = splitTarPath(name);
  const nameBytes = Buffer.from(tarPath.name, 'utf8');
  const prefixBytes = Buffer.from(tarPath.prefix, 'utf8');
  if (nameBytes.length > 100 || prefixBytes.length > 155) {
    throw new Error(`tar entry path is too long: ${name}`);
  }
  const header = Buffer.alloc(512, 0);
  nameBytes.copy(header, 0);
  prefixBytes.copy(header, 345);
  writeTarOctal(header, 100, 8, mode);
  writeTarOctal(header, 108, 8, 0);
  writeTarOctal(header, 116, 8, 0);
  writeTarOctal(header, 124, 12, size);
  writeTarOctal(header, 136, 12, 0);
  header.fill(0x20, 148, 156);
  header[156] = 0x30;
  Buffer.from('ustar\0', 'ascii').copy(header, 257);
  Buffer.from('00', 'ascii').copy(header, 263);
  const checksum = header.reduce((sum, byte) => sum + byte, 0);
  writeTarChecksum(header, checksum);
  return header;
}

function splitTarPath(name) {
  const normalized = normalizeArchivePath(name);
  const normalizedBytes = Buffer.from(normalized, 'utf8');
  if (normalizedBytes.length <= 100) {
    return {
      name: normalized,
      prefix: '',
    };
  }

  const segments = normalized.split('/');
  for (let index = segments.length - 1; index > 0; index -= 1) {
    const prefix = segments.slice(0, index).join('/');
    const basename = segments.slice(index).join('/');
    if (Buffer.byteLength(prefix, 'utf8') <= 155 && Buffer.byteLength(basename, 'utf8') <= 100) {
      return {
        name: basename,
        prefix,
      };
    }
  }

  throw new Error(`tar entry path is too long: ${name}`);
}

function writeTarOctal(buffer, offset, length, value) {
  const text = value.toString(8).padStart(length - 1, '0').slice(-(length - 1));
  buffer.write(text, offset, length - 1, 'ascii');
  buffer[offset + length - 1] = 0;
}

function writeTarChecksum(buffer, checksum) {
  const text = checksum.toString(8).padStart(6, '0').slice(-6);
  buffer.write(text, 148, 6, 'ascii');
  buffer[154] = 0;
  buffer[155] = 0x20;
}

function paddingForTar(size) {
  return (512 - (size % 512)) % 512;
}

function renderInstallPackageBuildPlan(buildPlan) {
  return [
    `[install-package-build] package: ${buildPlan.package.id}`,
    `[install-package-build] archive: ${buildPlan.archivePath}`,
    `[install-package-build] manifest: ${buildPlan.manifestPath}`,
    `[install-package-build] entries: ${buildPlan.entries.length}`,
    ...buildPlan.entries.map((entry) => `[install-package-build]   ${entry.archivePath}`),
  ];
}

async function main(argv = process.argv.slice(2)) {
  const settings = parseInstallPackageBuildArgs(argv);
  if (settings.help) {
    printHelp();
    return 0;
  }

  if (settings.all) {
    return await runAllInstallPackageBuilds(settings);
  }

  const buildPlan = createInstallPackageBuildPlan({
    packageId: settings.packageId,
    stagingRoot: settings.stagingRoot ?? defaultStagingRoot(workspaceRoot),
    outputDir: settings.outputDir ?? defaultInstallPackageOutputDir(workspaceRoot),
    version: settings.version,
    root: workspaceRoot,
    requireStagedFiles: !settings.dryRun,
  });
  const issues = validateInstallPackageBuildPlan(buildPlan);

  if (settings.json && (settings.dryRun || settings.check)) {
    console.log(JSON.stringify({
      ok: issues.length === 0,
      issues,
      plan: buildPlan,
    }, null, 2));
  } else if (!settings.json) {
    for (const line of renderInstallPackageBuildPlan(buildPlan)) {
      console.log(line);
    }
    if (issues.length > 0) {
      console.error('[install-package-build] validation issues:');
      for (const issue of issues) {
        console.error(`[install-package-build]   ${issue}`);
      }
    }
  }

  if (settings.check && issues.length > 0) {
    return 1;
  }
  if (settings.dryRun) {
    return 0;
  }

  const result = await buildInstallPackageArchive(buildPlan);
  if (settings.json) {
    console.log(JSON.stringify({
      ok: true,
      archive: result.archive,
      manifestPath: result.manifestPath,
      aggregateManifestPath: result.aggregateManifestPath,
    }, null, 2));
  } else {
    console.log(`[install-package-build] written: ${result.archivePath}`);
    console.log(`[install-package-build] sha256: ${result.archive.sha256}`);
  }
  return 0;
}

async function runAllInstallPackageBuilds(settings) {
  const packageIds = createInstallPackagePlan({ version: settings.version })
    .packages
    .map((packageItem) => packageItem.id);
  const plans = packageIds.map((packageId) => createInstallPackageBuildPlan({
    packageId,
    stagingRoot: settings.stagingRoot ?? defaultStagingRoot(workspaceRoot),
    outputDir: settings.outputDir ?? defaultInstallPackageOutputDir(workspaceRoot),
    version: settings.version,
    root: workspaceRoot,
    requireStagedFiles: !settings.dryRun,
  }));
  const issues = plans.flatMap((plan) =>
    validateInstallPackageBuildPlan(plan).map((issue) => `${plan.package.id}: ${issue}`)
  );

  if (settings.json && (settings.dryRun || settings.check)) {
    console.log(JSON.stringify({
      ok: issues.length === 0,
      issues,
      plans,
    }, null, 2));
  } else if (!settings.json) {
    console.log(`[install-package-build] packages: ${plans.length}`);
    for (const plan of plans) {
      for (const line of renderInstallPackageBuildPlan(plan)) {
        console.log(line);
      }
    }
    if (issues.length > 0) {
      console.error('[install-package-build] validation issues:');
      for (const issue of issues) {
        console.error(`[install-package-build]   ${issue}`);
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
    results.push(await buildInstallPackageArchive(plan));
  }
  if (settings.json) {
    console.log(JSON.stringify({
      ok: true,
      archives: results.map((result) => result.archive),
      aggregateManifestPath: results.at(-1)?.aggregateManifestPath ?? null,
    }, null, 2));
  } else {
    for (const result of results) {
      console.log(`[install-package-build] written: ${result.archivePath}`);
      console.log(`[install-package-build] sha256: ${result.archive.sha256}`);
    }
  }
  return 0;
}

function currentHostArchivePackageId(platform = process.platform, arch = process.arch) {
  const normalizedPlatform = platform === 'win32' ? 'windows' : platform === 'darwin' ? 'macos' : 'linux';
  const normalizedArch = arch === 'arm64' ? 'arm64' : 'x64';
  return `${normalizedPlatform}-${normalizedArch}-archive`;
}

function defaultStagingRoot(root = workspaceRoot) {
  return path.join(root, 'dist', 'install-package-staging');
}

function defaultInstallPackageOutputDir(root = workspaceRoot) {
  return path.join(root, 'dist', 'install-packages');
}

function normalizeArchivePath(value) {
  const normalized = String(value ?? '').replaceAll('\\', '/').replace(/^\/+/u, '');
  if (!normalized || normalized === '.' || normalized.includes('..') || path.isAbsolute(normalized)) {
    throw new Error(`Unsafe archive path: ${value}`);
  }
  return normalized;
}

function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

function modeForArchivePath(archivePath) {
  const normalized = normalizeArchivePath(archivePath);
  if (normalized.startsWith('bin/') && !normalized.endsWith('.exe')) {
    return 0o755;
  }
  if (normalized === 'container/entrypoint') {
    return 0o755;
  }
  return 0o644;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\', '/'))) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(`[install-package-build] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}

export {
  AGGREGATE_MANIFEST_FILE,
  PACKAGE_MANIFEST_FILE,
  buildInstallPackageArchive,
  createAggregateManifest,
  createGeneratedArtifactBytes,
  createInstallArchiveBytes,
  createInstallPackageBuildPlan,
  createPackageManifest,
  createRuntimeConfigTemplate,
  createServiceManifest,
  createTar,
  currentHostArchivePackageId,
  defaultInstallPackageOutputDir,
  defaultStagingRoot,
  main,
  modeForArchivePath,
  normalizeArchivePath,
  parseInstallPackageBuildArgs,
  resolveManifestGeneratedAt,
  renderInstallPackageBuildPlan,
  runAllInstallPackageBuilds,
  sha256,
  splitTarPath,
  validateInstallPackageBuildPlan,
};
