import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';

const appbaseRoot = path.resolve(import.meta.dirname, '..');

async function loadModule() {
  return import(
    pathToFileURL(
      path.join(appbaseRoot, 'scripts', 'appbase-governance-node-test-catalog.mjs'),
    ).href,
  );
}

test('appbase governance node test catalog publishes the exact governed test surface', async () => {
  const module = await loadModule();

  assert.equal(typeof module.listAppbaseGovernanceNodeTestFiles, 'function');
  assert.deepEqual(
    module.listAppbaseGovernanceNodeTestFiles(),
    [
      'scripts/appbase-governance-node-test-catalog.test.mjs',
      'scripts/api-prefix-standard-governance.test.mjs',
      'scripts/common-package-test-script-standard.test.mjs',
      'scripts/run-iam-standard-governance.test.mjs',
      'scripts/run-appbase-governance-node-tests.test.mjs',
      'scripts/run-workspace-vitest.test.mjs',
      'scripts/sdkwork-brand-standard.test.mjs',
      'scripts/run-user-center-standard-contracts.test.mjs',
      'scripts/user-center-command-matrix.test.mjs',
      'scripts/user-center-upstream-dispatch-target-catalog.test.mjs',
      'scripts/user-center-upstream-dispatch.test.mjs',
      'scripts/user-center-upstream-dispatch-workflow.test.mjs',
    ],
  );
});
