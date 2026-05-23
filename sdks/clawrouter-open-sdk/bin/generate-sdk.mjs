#!/usr/bin/env node
import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const workspaceRoot = path.resolve(path.dirname(__filename), '..', '..', '..');
const command = process.platform === 'win32' ? 'node.exe' : 'node';
const sdkFamily = 'clawrouter-open-sdk';
const sdkType = 'ai';
const authorityInputPath = `sdks/${sdkFamily}/openapi/${sdkFamily}.openapi.json`;
const sdkgenInputPath = `sdks/${sdkFamily}/openapi/${sdkFamily}.sdkgen.json`;
const baseUrl = 'https://api.sdkwork.com';
const apiPrefix = '/v1';
const description = 'SDKWork Claw Router OpenAI-compatible gateway SDK';
const OFFICIAL_LANGUAGES = ['typescript', 'flutter', 'rust', 'java', 'csharp', 'swift', 'kotlin', 'go', 'python'];
const packageNames = {"csharp": "Sdkwork.ClawRouter.Open.Sdk", "flutter": "clawrouter_open_sdk", "go": "github.com/sdkwork/clawrouter-open-sdk", "java": "com.sdkwork.clawrouter:clawrouter-open-sdk", "kotlin": "com.sdkwork.clawrouter:clawrouter-open-sdk", "python": "sdkwork-clawrouter-open-sdk", "rust": "clawrouter-open-sdk", "swift": "ClawRouterOpenSdk", "typescript": "@sdkwork/clawrouter-open-sdk"};
const namespaces = {"csharp": "Sdkwork.ClawRouter.Open", "java": "com.sdkwork.clawrouter.open", "kotlin": "com.sdkwork.clawrouter.open"};

const languages = parseLanguages(process.argv.slice(2));
for (const language of languages) {
  runLanguage(language);
}

function parseLanguages(argv) {
  const selected = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--language' || arg === '-l') {
      const value = argv[index + 1];
      if (!value || value.startsWith('-')) {
        throw new Error(`${arg} requires a language value`);
      }
      selected.push(...splitLanguages(value));
      index += 1;
      continue;
    }
    if (arg.startsWith('--language=')) {
      selected.push(...splitLanguages(arg.slice('--language='.length)));
      continue;
    }
    if (arg === '--all') {
      selected.push(...OFFICIAL_LANGUAGES);
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
    throw new Error(`Unsupported SDK generation option: ${arg}`);
  }
  const normalized = selected.length === 0 ? ['typescript'] : selected;
  return [...new Set(normalized.map((item) => item.toLowerCase()))].map((language) => {
    if (!OFFICIAL_LANGUAGES.includes(language)) {
      throw new Error(`Unsupported SDK language for ${sdkFamily}: ${language}`);
    }
    return language;
  });
}

function splitLanguages(value) {
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function printHelp() {
  console.log(`Usage: node ./sdks/${sdkFamily}/bin/generate-sdk.mjs [--language <language>] [--all]

Options:
  --language, -l <name>  Generate one language. May be repeated or comma-separated.
  --all                 Generate all official SDK languages.
  --help, -h            Show this help.

Official languages: ${OFFICIAL_LANGUAGES.join(', ')}`);
}

function runLanguage(language) {
  if (language !== 'typescript') {
    rmSync(path.join(workspaceRoot, `sdks/${sdkFamily}/${sdkFamily}-${language}/generated/server-openapi`), { recursive: true, force: true });
  }
  const args = language === 'typescript'
    ? strictTypeScriptArgs()
    : generatorArgs(language);
  const result = spawnSync(command, args, { cwd: workspaceRoot, stdio: 'inherit' });
  if (result.error) {
    throw result.error;
  }
  if ((result.status ?? 1) !== 0) {
    process.exit(result.status ?? 1);
  }
}

function strictTypeScriptArgs() {
  return [
    'tools/clawrouter_strict_sdk_generate.mjs',
    'generate',
    '-i', sdkgenInputPath,
    '-o', 'sdks/clawrouter-open-sdk/clawrouter-open-sdk-typescript',
    '-n', sdkFamily,
    '-t', sdkType,
    '-l', 'typescript',
    '--base-url', baseUrl,
    '--api-prefix', apiPrefix,
    '--package-name', packageNames.typescript,
    '--description', description,
    '--fixed-sdk-version', '0.1.0',
    '--no-sync-published-version',
  ];
}

function generatorArgs(language) {
  const args = [
    path.resolve(workspaceRoot, '..', '..', 'sdk', 'sdkwork-sdk-generator', 'bin', 'sdkgen.js'),
    'generate',
    '-i', sdkgenInputPath,
    '-o', `sdks/${sdkFamily}/${sdkFamily}-${language}/generated/server-openapi`,
    '-n', sdkFamily,
    '-t', sdkType,
    '-l', language,
    '--base-url', baseUrl,
    '--api-prefix', apiPrefix,
    '--package-name', packageNames[language],
    '--description', `${description} ${language} generated transport SDK`,
    '--fixed-sdk-version', '0.1.0',
    '--sdk-root', `sdks/${sdkFamily}`,
    '--sdk-name', sdkFamily,
    '--npm-package-name', packageNames.typescript,
    '--no-sync-published-version',
  ];
  if (namespaces[language]) {
    args.push('--namespace', namespaces[language]);
  }
  return args;
}
