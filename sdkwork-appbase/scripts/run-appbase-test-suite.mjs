import process from "node:process";
import { pathToFileURL } from "node:url";

import { runAppbaseGovernanceNodeTests } from "./run-appbase-governance-node-tests.mjs";
import { runCommerceStandardContracts } from "./run-commerce-standard-contracts.mjs";
import { runIamStandardContracts } from "./run-iam-standard-contracts.mjs";
import { runUserCenterStandardContracts } from "./run-user-center-standard-contracts.mjs";
import { runWorkspaceVitest } from "./run-workspace-vitest.mjs";

function normalizeRunnerStatus(result) {
  if (typeof result === "number") {
    return result;
  }

  if (typeof result?.status === "number") {
    return result.status;
  }

  return 0;
}

export function runAppbaseTestSuite({
  cwd = process.cwd(),
  env = process.env,
  runGovernanceNodeTests = runAppbaseGovernanceNodeTests,
  runCommerceContracts = runCommerceStandardContracts,
  runIamContracts = runIamStandardContracts,
  runContracts = runUserCenterStandardContracts,
  runVitest = runWorkspaceVitest,
} = {}) {
  const vitestStatus = runVitest({ cwd, env });
  if (vitestStatus !== 0) {
    return vitestStatus;
  }

  const governanceStatus = normalizeRunnerStatus(runGovernanceNodeTests({ cwd, env }));
  if (governanceStatus !== 0) {
    return governanceStatus;
  }

  const iamStatus = normalizeRunnerStatus(runIamContracts({ cwd, env }));
  if (iamStatus !== 0) {
    return iamStatus;
  }

  const commerceStatus = normalizeRunnerStatus(runCommerceContracts({ cwd, env }));
  if (commerceStatus !== 0) {
    return commerceStatus;
  }

  return normalizeRunnerStatus(runContracts({ cwd, env }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(runAppbaseTestSuite());
}
