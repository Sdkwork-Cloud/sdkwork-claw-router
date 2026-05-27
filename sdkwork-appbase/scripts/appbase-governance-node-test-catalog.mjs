export const APPBASE_GOVERNANCE_NODE_TEST_FILES = [
  'scripts/appbase-governance-node-test-catalog.test.mjs',
  'scripts/api-prefix-standard-governance.test.mjs',
  'scripts/common-package-test-script-standard.test.mjs',
  'scripts/request-identity-standard-governance.test.mjs',
  'scripts/run-iam-standard-governance.test.mjs',
  'scripts/run-appbase-governance-node-tests.test.mjs',
  'scripts/run-workspace-vitest.test.mjs',
  'scripts/sdkwork-brand-standard.test.mjs',
  'scripts/run-user-center-standard-contracts.test.mjs',
  'scripts/user-center-command-matrix.test.mjs',
  'scripts/user-center-upstream-dispatch-target-catalog.test.mjs',
  'scripts/user-center-upstream-dispatch.test.mjs',
  'scripts/user-center-upstream-dispatch-workflow.test.mjs',
];

export function listAppbaseGovernanceNodeTestFiles() {
  return [...APPBASE_GOVERNANCE_NODE_TEST_FILES];
}

export function findAppbaseGovernanceNodeTestFile(filePath) {
  const match = APPBASE_GOVERNANCE_NODE_TEST_FILES.find((candidate) => candidate === filePath);
  if (!match) {
    throw new Error(`missing appbase governance node test file: ${filePath}`);
  }

  return match;
}

export function listAppbaseGovernanceNodeTestFilesByPaths(filePaths = []) {
  return filePaths.map((filePath) => findAppbaseGovernanceNodeTestFile(filePath));
}
