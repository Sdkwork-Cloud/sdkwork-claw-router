import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { runCommandSequence } from "./run-command-sequence.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sdkworkAppbaseRoot = path.resolve(__dirname, "..");

export function createUserCenterStandardContractsPlan({
  cwd = sdkworkAppbaseRoot,
} = {}) {
  const userCenterCoreTestsDir = path.join(
    cwd,
    "packages",
    "pc-react",
    "iam",
    "sdkwork-user-center-core-pc-react",
    "tests",
  );
  const authRuntimeTestsDir = path.join(
    cwd,
    "packages",
    "pc-react",
    "iam",
    "sdkwork-auth-runtime-pc-react",
    "tests",
  );
  const userCenterTestsDir = path.join(
    cwd,
    "packages",
    "pc-react",
    "iam",
    "sdkwork-user-center-pc-react",
    "tests",
  );
  const validationTestsDir = path.join(
    cwd,
    "packages",
    "pc-react",
    "iam",
    "sdkwork-user-center-validation-pc-react",
    "tests",
  );
  const vitestCliPath = path.join(cwd, "node_modules", "vitest", "vitest.mjs");

  return [
    {
      args: [
        vitestCliPath,
        "run",
        path.join(userCenterTestsDir, "userCenterSurfaceNodeContract.test.ts"),
        path.join(userCenterCoreTestsDir, "userCenterDeploymentContract.test.ts"),
        path.join(userCenterCoreTestsDir, "userCenterCommandMatrixContract.test.ts"),
        path.join(userCenterCoreTestsDir, "userCenterRuntimeBridgeContract.test.ts"),
        path.join(userCenterCoreTestsDir, "userCenterSeedContract.test.ts"),
        path.join(authRuntimeTestsDir, "authRuntimeComposition.test.ts"),
        "--config",
        path.join(cwd, "vitest.config.ts"),
        "--configLoader",
        "native",
        "--pool",
        "vmThreads",
      ],
      command: process.execPath,
    },
    {
      args: [
        "--experimental-strip-types",
        path.join(validationTestsDir, "userCenterValidationNodeContract.test.ts"),
      ],
      command: process.execPath,
    },
    {
      args: [
        "--experimental-strip-types",
        path.join(validationTestsDir, "userCenterServerValidationNodeContract.test.ts"),
      ],
      command: process.execPath,
    },
  ];
}

export function runUserCenterStandardContracts({
  cwd = sdkworkAppbaseRoot,
  env = process.env,
} = {}) {
  return runCommandSequence({
    commands: createUserCenterStandardContractsPlan({ cwd }),
    cwd,
    env,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(runUserCenterStandardContracts());
}
