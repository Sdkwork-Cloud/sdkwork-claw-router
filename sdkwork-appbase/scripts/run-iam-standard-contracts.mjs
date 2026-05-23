import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { runCommandSequence } from "./run-command-sequence.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sdkworkAppbaseRoot = path.resolve(__dirname, "..");

export function createIamStandardContractsPlan({ cwd = sdkworkAppbaseRoot } = {}) {
  const vitestCliPath = path.join(cwd, "node_modules", "vitest", "vitest.mjs");

  return [
    {
      command: process.execPath,
      args: [
        vitestCliPath,
        "run",
        path.join(cwd, "packages/common/iam/sdkwork-iam-contracts/tests/iam-contracts.standard.test.ts"),
        path.join(cwd, "packages/common/iam/sdkwork-iam-sdk-ports/tests/iam-sdk-ports.standard.test.ts"),
        path.join(cwd, "packages/common/iam/sdkwork-iam-service/tests/iam-service.standard.test.ts"),
        path.join(cwd, "packages/common/iam/sdkwork-iam-runtime/tests/iam-runtime.standard.test.ts"),
        "--config",
        path.join(cwd, "vitest.config.ts"),
        "--configLoader",
        "native",
        "--pool",
        "vmThreads",
      ],
    },
    {
      command: "cargo",
      args: [
        "test",
        "--manifest-path",
        path.join(cwd, "packages/native-rust/iam/sdkwork-iam-core-rust/Cargo.toml"),
      ],
    },
    {
      command: "cargo",
      args: [
        "test",
        "--manifest-path",
        path.join(cwd, "packages/native-rust/iam/sdkwork-iam-http-rust/Cargo.toml"),
      ],
    },
    {
      command: "cargo",
      args: [
        "test",
        "--manifest-path",
        path.join(cwd, "packages/native-rust/iam/sdkwork-iam-storage-sqlx-rust/Cargo.toml"),
      ],
    },
    {
      command: "cargo",
      args: [
        "test",
        "--manifest-path",
        path.join(cwd, "packages/native-rust/iam/sdkwork-iam-tauri-rust/Cargo.toml"),
      ],
    },
  ];
}

export function runIamStandardContracts({ cwd = sdkworkAppbaseRoot, env = process.env } = {}) {
  return runCommandSequence({
    commands: createIamStandardContractsPlan({ cwd }),
    cwd,
    env,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(runIamStandardContracts());
}
