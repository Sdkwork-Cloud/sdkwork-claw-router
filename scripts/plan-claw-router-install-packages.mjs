#!/usr/bin/env node

import process from 'node:process';

const INSTALL_PACKAGE_SCHEMA_VERSION = '2026-05-15.install-packages.v2';
const SUPPORTED_PLATFORMS = Object.freeze(['windows', 'linux', 'macos']);
const SUPPORTED_ARCHITECTURES = Object.freeze(['x64', 'arm64']);
const SUPPORTED_DEPLOYMENT_MODES = Object.freeze(['archive', 'service', 'container', 'desktop']);
const DEFAULT_VERSION = '0.1.0';
const HEALTH_CHECKS = Object.freeze(['/healthz', '/readyz']);
const RUNTIME_CONFIG_TEMPLATE_PATH = 'config/sdkwork-claw-router.toml.example';
const SERVER_POSTGRES_DEFAULT_URL = 'postgresql://sdkwork_claw_router:change-me@localhost:5432/sdkwork_claw_router';
const FAST_INITIALIZATION_CONTRACT = Object.freeze([
  'release-env-check',
  'release-env-write',
  'runtime-config-write',
  'database-ensure',
  'catalog-refresh',
  'edge-readiness',
]);

function printHelp() {
  console.log(`Usage: node scripts/plan-claw-router-install-packages.mjs [options]

Create and validate the cross-platform install package plan.

Options:
  --check             Validate the generated plan and exit nonzero on issues.
  --json              Print machine-readable JSON.
  --version <value>   Product package version (default ${DEFAULT_VERSION}).
  -h, --help          Show this help.
`);
}

function requireValue(argv, index, flag) {
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function parseArgs(argv) {
  const settings = {
    check: false,
    json: false,
    help: false,
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
      case '--json':
        settings.json = true;
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
        throw new Error(`Unsupported install package planner option: ${arg}`);
    }
  }

  return settings;
}

function createInstallPackagePlan({
  version = DEFAULT_VERSION,
  platforms = SUPPORTED_PLATFORMS,
  architectures = SUPPORTED_ARCHITECTURES,
  deploymentModes = SUPPORTED_DEPLOYMENT_MODES,
} = {}) {
  const normalizedVersion = normalizeVersion(version);
  const selectedPlatforms = validateSelection('platforms', platforms, SUPPORTED_PLATFORMS);
  const selectedArchitectures = validateSelection('architectures', architectures, SUPPORTED_ARCHITECTURES);
  const selectedDeploymentModes = validateSelection(
    'deploymentModes',
    deploymentModes,
    SUPPORTED_DEPLOYMENT_MODES,
  );

  const packages = [];
  for (const platform of selectedPlatforms) {
    for (const architecture of selectedArchitectures) {
      for (const deploymentMode of selectedDeploymentModes) {
        packages.push(createInstallPackageItem({
          platform,
          architecture,
          deploymentMode,
          version: normalizedVersion,
        }));
      }
    }
  }

  return {
    schemaVersion: INSTALL_PACKAGE_SCHEMA_VERSION,
    product: 'sdkwork-claw-router',
    version: normalizedVersion,
    platforms: selectedPlatforms,
    architectures: selectedArchitectures,
    deploymentModes: selectedDeploymentModes,
    fastInitializationContract: [...FAST_INITIALIZATION_CONTRACT],
    artifactPolicy: {
      noSecretsInPackage: true,
      envLocalGeneratedOnHost: true,
      envExampleReferenceOnly: true,
      releaseEnvLocalExcluded: true,
      generatedFromProductionBuild: true,
    },
    packages,
  };
}

function createInstallPackageItem({ platform, architecture, deploymentMode, version }) {
  const exeSuffix = platform === 'windows' ? '.exe' : '';
  const pnpm = platform === 'windows' ? 'pnpm.cmd' : 'pnpm';
  const archiveExtension = platform === 'windows' ? 'zip' : 'tar.gz';
  const binaryName = `sdkwork-claw-gateway${exeSuffix}`;
  const installerBinaryName = `sdkwork-claw-installer${exeSuffix}`;
  const id = `${platform}-${architecture}-${deploymentMode}`;
  const runtimeProfile = runtimeProfileForMode(deploymentMode);
  const databasePolicy = databasePolicyFor({ platform, runtimeProfile });

  return {
    id,
    platform,
    architecture,
    deploymentMode,
    runtimeProfile,
    archiveName: `sdkwork-claw-router-${id}-${version}.${archiveExtension}`,
    binaryName,
    installerBinaryName,
    packageKind: packageKindForMode(deploymentMode),
    artifacts: buildArtifacts(binaryName, installerBinaryName, deploymentMode, platform),
    initCommands: [
      `${pnpm} release:env:write -- --check`,
      `${pnpm} release:env:write -- --force`,
      `${installerBinaryName} ensure`,
      `${installerBinaryName} refresh-catalog --force`,
    ],
    startCommand: startCommandForMode({
      platform,
      deploymentMode,
      binaryName,
    }),
    databasePolicy,
    serviceIntegration: serviceIntegrationFor(platform, deploymentMode),
    containerIntegration: containerIntegrationFor(platform, deploymentMode, binaryName),
    healthChecks: [...HEALTH_CHECKS],
    security: {
      noSecretsInPackage: true,
      envLocalGeneratedOnHost: true,
      envExampleReferenceOnly: true,
      releaseEnvLocalExcluded: true,
      trustForwardedHeadersDefault: false,
      sameOriginBrowserApiDefaults: true,
    },
  };
}

function buildArtifacts(binaryName, installerBinaryName, deploymentMode, platform) {
  const artifacts = [
    {
      kind: 'edge-binary',
      path: `bin/${binaryName}`,
      source: 'target/release',
      required: true,
    },
    {
      kind: 'installer-binary',
      path: `bin/${installerBinaryName}`,
      source: 'target/release',
      required: true,
    },
    {
      kind: 'portal-dist',
      path: 'portal/dist',
      source: 'apps/sdkwork-claw-router-portal/dist',
      required: true,
    },
    {
      kind: 'sdk-archives',
      path: 'portal/dist/sdk-archives',
      source: 'apps/sdkwork-claw-router-portal/dist/sdk-archives',
      required: true,
    },
    {
      kind: 'env-template',
      path: '.env.release.example',
      source: '.env.release.example',
      required: true,
    },
    {
      kind: 'runtime-config-template',
      path: RUNTIME_CONFIG_TEMPLATE_PATH,
      source: 'generated by install package builder',
      required: true,
    },
    {
      kind: 'install-manifest',
      path: 'install-manifest.json',
      source: 'generated by install package builder',
      required: true,
    },
  ];

  if (deploymentMode === 'service') {
    artifacts.push({
      kind: 'service-manifest',
      path: 'service',
      source: 'generated by install package builder',
      required: true,
    });
  }
  if (deploymentMode === 'container') {
    artifacts.push({
      kind: 'container-entrypoint',
      path: platform === 'windows' ? 'container/entrypoint.ps1' : 'container/entrypoint',
      source: 'generated by install package builder',
      required: true,
    });
  }
  if (deploymentMode === 'desktop') {
    artifacts.push({
      kind: 'desktop-manifest',
      path: 'desktop',
      source: 'generated by install package builder',
      required: true,
    });
  }

  return artifacts;
}

function packageKindForMode(deploymentMode) {
  if (deploymentMode === 'archive') {
    return 'self-contained-archive';
  }
  if (deploymentMode === 'service') {
    return 'host-service-package';
  }
  if (deploymentMode === 'desktop') {
    return 'desktop-app-installer';
  }
  return 'container-image';
}

function runtimeProfileForMode(deploymentMode) {
  return deploymentMode === 'desktop' ? 'desktop' : 'server';
}

function databasePolicyFor({ platform, runtimeProfile }) {
  const locations = runtimeConfigLocationsFor(platform, runtimeProfile);
  const basePolicy = {
    configurableFromFile: true,
    configFormat: 'toml',
    configFile: {
      path: locations.configFile,
      precedence: 2,
    },
    dataDirectory: {
      path: locations.dataDirectory,
    },
    envOverrides: [
      'SDKWORK_CLAW_CONFIG_FILE',
      'SDKWORK_CLAW_DATABASE_URL',
      'SDKWORK_CLAW_DATABASE_MAX_CONNECTIONS',
      'SDKWORK_CLAW_DEPLOYMENT_MODE',
    ],
  };

  if (runtimeProfile === 'desktop') {
    return {
      ...basePolicy,
      defaultEngine: 'sqlite',
      defaultUrl: `sqlite://${locations.sqlitePath}`,
      defaultSqlitePath: locations.sqlitePath,
      defaultSqliteUrl: `sqlite://${locations.sqlitePath}`,
      maxConnections: 1,
      requiresExternalDatabase: false,
    };
  }

  return {
    ...basePolicy,
    defaultEngine: 'postgresql',
    defaultUrl: SERVER_POSTGRES_DEFAULT_URL,
    defaultSqlitePath: null,
    defaultSqliteUrl: null,
    maxConnections: 16,
    requiresExternalDatabase: true,
  };
}

function runtimeConfigLocationsFor(platform, runtimeProfile) {
  if (runtimeProfile === 'desktop') {
    if (platform === 'windows') {
      return {
        configFile: '%APPDATA%/SdkWork/Claw Router/sdkwork-claw-router.toml',
        dataDirectory: '%LOCALAPPDATA%/SdkWork/Claw Router',
        sqlitePath: '%LOCALAPPDATA%/SdkWork/Claw Router/sdkwork-claw-router.sqlite',
      };
    }
    if (platform === 'macos') {
      return {
        configFile: '~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml',
        dataDirectory: '~/Library/Application Support/SdkWork/Claw Router',
        sqlitePath: '~/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.sqlite',
      };
    }
    return {
      configFile: '${XDG_CONFIG_HOME:-~/.config}/sdkwork-claw-router/sdkwork-claw-router.toml',
      dataDirectory: '${XDG_DATA_HOME:-~/.local/share}/sdkwork-claw-router',
      sqlitePath: '${XDG_DATA_HOME:-~/.local/share}/sdkwork-claw-router/sdkwork-claw-router.sqlite',
    };
  }

  if (platform === 'windows') {
    return {
      configFile: '%ProgramData%/SdkWork/Claw Router/sdkwork-claw-router.toml',
      dataDirectory: '%ProgramData%/SdkWork/Claw Router/Data',
      sqlitePath: null,
    };
  }
  if (platform === 'macos') {
    return {
      configFile: '/Library/Application Support/SdkWork/Claw Router/sdkwork-claw-router.toml',
      dataDirectory: '/Library/Application Support/SdkWork/Claw Router',
      sqlitePath: null,
    };
  }
  return {
    configFile: '/etc/sdkwork-claw-router/sdkwork-claw-router.toml',
    dataDirectory: '/var/lib/sdkwork-claw-router',
    sqlitePath: null,
  };
}

function startCommandForMode({ platform, deploymentMode, binaryName }) {
  if (deploymentMode === 'container') {
    return containerEntrypoint(platform, binaryName);
  }
  return binaryName;
}

function serviceIntegrationFor(platform, deploymentMode) {
  if (deploymentMode !== 'service') {
    return null;
  }
  if (platform === 'windows') {
    return {
      kind: 'windows-service',
      manifest: 'service/windows/sdkwork-claw-router.xml',
    };
  }
  if (platform === 'linux') {
    return {
      kind: 'systemd',
      manifest: 'service/linux/sdkwork-claw-router.service',
    };
  }
  return {
    kind: 'launchd',
    manifest: 'service/macos/com.sdkwork.claw-router.plist',
  };
}

function containerIntegrationFor(platform, deploymentMode, binaryName) {
  if (deploymentMode !== 'container') {
    return null;
  }
  if (platform === 'windows') {
    return {
      kind: 'container-image',
      baseImagePolicy: 'windows-nanoserver-runtime',
      entrypoint: `C:/sdkwork-claw-router/bin/${binaryName}`,
      workingDirectory: 'C:/sdkwork-claw-router',
      runtimeUser: 'ContainerUser',
      exposedPorts: [3900],
    };
  }
  return {
    kind: 'container-image',
    baseImagePolicy: 'distroless-or-minimal-runtime',
    entrypoint: containerEntrypoint(platform, binaryName),
    workingDirectory: '/opt/sdkwork-claw-router',
    runtimeUser: 'sdkwork',
    exposedPorts: [3900],
  };
}

function containerEntrypoint(platform, binaryName) {
  if (platform === 'windows') {
    return `C:/sdkwork-claw-router/bin/${binaryName}`;
  }
  return `/opt/sdkwork-claw-router/bin/${binaryName}`;
}

function validateInstallPackagePlan(plan) {
  const issues = [];
  if (plan.schemaVersion !== INSTALL_PACKAGE_SCHEMA_VERSION) {
    issues.push(`schemaVersion must be ${INSTALL_PACKAGE_SCHEMA_VERSION}`);
  }
  if (!plan.product || plan.product !== 'sdkwork-claw-router') {
    issues.push('product must be sdkwork-claw-router');
  }
  if (!plan.version || !/^[0-9A-Za-z][0-9A-Za-z._-]*$/u.test(plan.version)) {
    issues.push('version must be a non-empty package-safe value');
  }
  validateArrayMatches('platforms', plan.platforms, SUPPORTED_PLATFORMS, issues);
  validateArrayMatches('architectures', plan.architectures, SUPPORTED_ARCHITECTURES, issues);
  validateArrayMatches('deploymentModes', plan.deploymentModes, SUPPORTED_DEPLOYMENT_MODES, issues);
  for (const contractStep of FAST_INITIALIZATION_CONTRACT) {
    if (!plan.fastInitializationContract?.includes(contractStep)) {
      issues.push(`fastInitializationContract must include ${contractStep}`);
    }
  }
  for (const [field, expected] of Object.entries({
    noSecretsInPackage: true,
    envLocalGeneratedOnHost: true,
    envExampleReferenceOnly: true,
    releaseEnvLocalExcluded: true,
  })) {
    if (plan.artifactPolicy?.[field] !== expected) {
      issues.push(`artifactPolicy.${field} must be ${expected}`);
    }
  }

  const expectedPackageCount =
    (plan.platforms?.length ?? 0)
    * (plan.architectures?.length ?? 0)
    * (plan.deploymentModes?.length ?? 0);
  if (!Array.isArray(plan.packages) || plan.packages.length !== expectedPackageCount) {
    issues.push(`packages must contain ${expectedPackageCount} entries`);
    return issues;
  }

  const seenIds = new Set();
  for (const packageItem of plan.packages) {
    validatePackageItem(packageItem, seenIds, issues);
  }

  return issues;
}

function validatePackageItem(packageItem, seenIds, issues) {
  const expectedId = `${packageItem.platform}-${packageItem.architecture}-${packageItem.deploymentMode}`;
  if (packageItem.id !== expectedId) {
    issues.push(`${packageItem.id ?? '(missing id)'} id must be ${expectedId}`);
  }
  if (seenIds.has(packageItem.id)) {
    issues.push(`${packageItem.id} is duplicated`);
  }
  seenIds.add(packageItem.id);

  for (const artifactKind of [
    'edge-binary',
    'installer-binary',
    'portal-dist',
    'sdk-archives',
    'env-template',
    'runtime-config-template',
    'install-manifest',
  ]) {
    if (!packageItem.artifacts?.some((artifact) => artifact.kind === artifactKind && artifact.required === true)) {
      issues.push(`${packageItem.id} must include required ${artifactKind} artifact`);
    }
  }
  if (packageItem.artifacts?.some((artifact) => String(artifact.path).includes('.env.release.local'))) {
    issues.push(`${packageItem.id} must not include host-local release env output`);
  }
  if (!Array.isArray(packageItem.initCommands) || packageItem.initCommands.length < 4) {
    issues.push(`${packageItem.id} must include fast initialization commands`);
  } else {
    for (const command of [
      'release:env:write -- --check',
      'release:env:write -- --force',
      'ensure',
      'refresh-catalog --force',
    ]) {
      if (!packageItem.initCommands.some((initCommand) => initCommand.includes(command))) {
        issues.push(`${packageItem.id} initCommands must include ${command}`);
      }
    }
    if (packageItem.initCommands.some((initCommand) => /pnpm(\.cmd)?\s+dev|smoke:dev/u.test(initCommand))) {
      issues.push(`${packageItem.id} must not start the live development workspace during install initialization`);
    }
  }
  if (!arraysEqual(packageItem.healthChecks, HEALTH_CHECKS)) {
    issues.push(`${packageItem.id} healthChecks must be ${HEALTH_CHECKS.join(', ')}`);
  }
  if (packageItem.security?.noSecretsInPackage !== true) {
    issues.push(`${packageItem.id} security.noSecretsInPackage must be true`);
  }
  if (packageItem.security?.trustForwardedHeadersDefault !== false) {
    issues.push(`${packageItem.id} security.trustForwardedHeadersDefault must be false`);
  }
  if (packageItem.deploymentMode === 'service' && !packageItem.serviceIntegration?.kind) {
    issues.push(`${packageItem.id} service mode must declare a service integration`);
  }
  if (packageItem.deploymentMode === 'container' && packageItem.containerIntegration?.kind !== 'container-image') {
    issues.push(`${packageItem.id} container mode must declare a container image integration`);
  }
  if (packageItem.deploymentMode === 'desktop' && packageItem.runtimeProfile !== 'desktop') {
    issues.push(`${packageItem.id} desktop mode must declare the desktop runtime profile`);
  }
  if (packageItem.deploymentMode !== 'desktop' && packageItem.runtimeProfile !== 'server') {
    issues.push(`${packageItem.id} server package modes must declare the server runtime profile`);
  }
  if (!packageItem.databasePolicy?.configurableFromFile) {
    issues.push(`${packageItem.id} databasePolicy must support runtime config files`);
  }
  if (!packageItem.databasePolicy?.configFile?.path) {
    issues.push(`${packageItem.id} databasePolicy must declare an OS-standard config file path`);
  }
  if (!packageItem.databasePolicy?.envOverrides?.includes('SDKWORK_CLAW_DATABASE_URL')) {
    issues.push(`${packageItem.id} databasePolicy must preserve SDKWORK_CLAW_DATABASE_URL override support`);
  }
  if (packageItem.runtimeProfile === 'desktop') {
    if (packageItem.databasePolicy?.defaultEngine !== 'sqlite') {
      issues.push(`${packageItem.id} desktop packages must default to SQLite`);
    }
    if (!packageItem.databasePolicy?.defaultSqlitePath) {
      issues.push(`${packageItem.id} desktop packages must declare the default SQLite file path`);
    }
  } else if (packageItem.databasePolicy?.defaultEngine !== 'postgresql') {
    issues.push(`${packageItem.id} server packages must default to PostgreSQL`);
  } else if (packageItem.databasePolicy?.defaultSqliteUrl !== null) {
    issues.push(`${packageItem.id} server packages must not default to SQLite`);
  }
  if (
    packageItem.deploymentMode === 'container'
    && packageItem.startCommand !== packageItem.containerIntegration?.entrypoint
  ) {
    issues.push(`${packageItem.id} startCommand must match the container entrypoint`);
  }
}

function renderInstallPackagePlan(plan) {
  return [
    `[install-packages] product: ${plan.product}`,
    `[install-packages] schema: ${plan.schemaVersion}`,
    `[install-packages] version: ${plan.version}`,
    `[install-packages] supported platforms: ${plan.platforms.join(', ')}`,
    `[install-packages] supported architectures: ${plan.architectures.join(', ')}`,
    `[install-packages] deployment modes: ${plan.deploymentModes.join(', ')}`,
    `[install-packages] fast init: ${plan.fastInitializationContract.join(', ')}`,
    `[install-packages] packages: ${plan.packages.length}`,
    ...plan.packages.map((packageItem) => [
      `[install-packages]   ${packageItem.id}`,
      `archive=${packageItem.archiveName}`,
      `kind=${packageItem.packageKind}`,
      `profile=${packageItem.runtimeProfile}`,
      `database=${packageItem.databasePolicy.defaultEngine}`,
      `binary=${packageItem.binaryName}`,
      `installer=${packageItem.installerBinaryName}`,
      `health=${packageItem.healthChecks.join('+')}`,
    ].join(' ')),
  ];
}

async function main(argv = process.argv.slice(2)) {
  const settings = parseArgs(argv);
  if (settings.help) {
    printHelp();
    return 0;
  }

  const plan = createInstallPackagePlan({ version: settings.version });
  const issues = validateInstallPackagePlan(plan);
  if (settings.json) {
    console.log(JSON.stringify({
      ok: issues.length === 0,
      issues,
      plan,
    }, null, 2));
  } else {
    for (const line of renderInstallPackagePlan(plan)) {
      console.log(line);
    }
    if (issues.length > 0) {
      console.error('[install-packages] validation issues:');
      for (const issue of issues) {
        console.error(`[install-packages]   ${issue}`);
      }
    } else if (settings.check) {
      console.log('[install-packages] validation passed');
    }
  }

  if (settings.check && issues.length > 0) {
    return 1;
  }
  return 0;
}

function normalizeVersion(version) {
  const normalized = String(version ?? '').trim();
  if (!/^[0-9A-Za-z][0-9A-Za-z._-]*$/u.test(normalized)) {
    throw new Error('version must be a non-empty package-safe value');
  }
  return normalized;
}

function validateSelection(label, selected, supported) {
  if (!Array.isArray(selected) || selected.length === 0) {
    throw new Error(`${label} must contain at least one value`);
  }
  const unique = [...new Set(selected.map((value) => String(value).trim()))];
  for (const value of unique) {
    if (!supported.includes(value)) {
      throw new Error(`${label} contains unsupported value: ${value}`);
    }
  }
  return unique;
}

function validateArrayMatches(label, actual, expected, issues) {
  if (!arraysEqual(actual, expected)) {
    issues.push(`${label} must be ${expected.join(', ')}`);
  }
}

function arraysEqual(actual, expected) {
  return Array.isArray(actual)
    && actual.length === expected.length
    && actual.every((value, index) => value === expected[index]);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replaceAll('\\', '/'))) {
  main().then((code) => {
    process.exitCode = code;
  }).catch((error) => {
    console.error(`[install-packages] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  });
}

export {
  FAST_INITIALIZATION_CONTRACT,
  INSTALL_PACKAGE_SCHEMA_VERSION,
  RUNTIME_CONFIG_TEMPLATE_PATH,
  SERVER_POSTGRES_DEFAULT_URL,
  SUPPORTED_ARCHITECTURES,
  SUPPORTED_DEPLOYMENT_MODES,
  SUPPORTED_PLATFORMS,
  createInstallPackagePlan,
  databasePolicyFor,
  main,
  parseArgs,
  renderInstallPackagePlan,
  runtimeConfigLocationsFor,
  runtimeProfileForMode,
  validateInstallPackagePlan,
};
