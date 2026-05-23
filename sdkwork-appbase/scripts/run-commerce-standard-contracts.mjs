import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { runCommandSequence } from "./run-command-sequence.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sdkworkAppbaseRoot = path.resolve(__dirname, "..");

export function createCommerceStandardContractsPlan({ cwd = sdkworkAppbaseRoot } = {}) {
  const vitestCliPath = path.join(cwd, "node_modules", "vitest", "vitest.mjs");

  return [
    {
      command: process.execPath,
      args: [
        vitestCliPath,
        "run",
        path.join(cwd, "packages/common/commerce/sdkwork-commerce-contracts/tests/commerce-contracts.standard.test.ts"),
        path.join(cwd, "packages/common/commerce/sdkwork-commerce-sdk-ports/tests/commerce-sdk-ports.standard.test.ts"),
        path.join(cwd, "packages/common/commerce/sdkwork-commerce-service/tests/commerce-service.standard.test.ts"),
        path.join(cwd, "packages/common/commerce/sdkwork-commerce-runtime/tests/commerce-runtime.standard.test.ts"),
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
        path.join(cwd, "packages/native-rust/commerce/sdkwork-commerce-core-rust/Cargo.toml"),
      ],
    },
    {
      command: "cargo",
      args: [
        "test",
        "--manifest-path",
        path.join(cwd, "packages/native-rust/commerce/sdkwork-commerce-http-rust/Cargo.toml"),
      ],
    },
    {
      command: "cargo",
      args: [
        "test",
        "--manifest-path",
        path.join(cwd, "packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/Cargo.toml"),
      ],
    },
    {
      command: "cargo",
      args: [
        "test",
        "--manifest-path",
        path.join(cwd, "packages/native-rust/commerce/sdkwork-commerce-tauri-rust/Cargo.toml"),
      ],
    },
  ];
}

export function runCommerceStandardContracts({ cwd = sdkworkAppbaseRoot, env = process.env } = {}) {
  return runCommandSequence({
    commands: createCommerceStandardContractsPlan({ cwd }),
    cwd,
    env,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(runCommerceStandardContracts());
}
