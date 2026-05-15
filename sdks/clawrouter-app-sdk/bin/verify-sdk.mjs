#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const workspaceRoot = path.resolve(path.dirname(__filename), '..');
const required = [
  '.sdkwork-assembly.json',
  'openapi/clawrouter-app-sdk.openapi.json',
  'openapi/clawrouter-app-sdk.sdkgen.json',
  'clawrouter-app-sdk-typescript/package.json',
  'clawrouter-app-sdk-typescript/sdkwork-sdk.json',
  'clawrouter-app-sdk-typescript/src/index.ts',
];
const missing = required.filter((entry) => !existsSync(path.join(workspaceRoot, entry)));
if (missing.length > 0) {
  throw new Error('clawrouter-app-sdk SDK family is incomplete: ' + missing.join(', '));
}
const assembly = JSON.parse(readFileSync(path.join(workspaceRoot, '.sdkwork-assembly.json'), 'utf8'));
if (assembly.workspace !== 'clawrouter-app-sdk') {
  throw new Error('SDK assembly workspace drifted');
}
if (!Array.isArray(assembly.languages) || !assembly.languages.some((item) => item.language === 'typescript')) {
  throw new Error('SDK assembly must include the TypeScript workspace');
}
console.log('Verified clawrouter-app-sdk SDK family.');
