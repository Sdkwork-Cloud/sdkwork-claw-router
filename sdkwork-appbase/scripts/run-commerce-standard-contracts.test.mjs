import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { createCommerceStandardContractsPlan } from "./run-commerce-standard-contracts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appbaseRoot = path.resolve(__dirname, "..");

test("commerce standard contracts plan resolves TypeScript and Rust contract suites", () => {
  const plan = createCommerceStandardContractsPlan();

  assert.equal(plan[0]?.command, process.execPath);
  assert.equal(plan[0]?.args[0], path.join(appbaseRoot, "node_modules", "vitest", "vitest.mjs"));
  assert.equal(plan[0]?.args[1], "run");
  assert.equal(
    plan[0]?.args[2],
    path.join(appbaseRoot, "packages/common/commerce/sdkwork-commerce-contracts/tests/commerce-contracts.standard.test.ts"),
  );
  assert.equal(
    plan[0]?.args[5],
    path.join(appbaseRoot, "packages/common/commerce/sdkwork-commerce-runtime/tests/commerce-runtime.standard.test.ts"),
  );
  assert.equal(plan[0]?.args[6], "--config");
  assert.equal(plan[0]?.args[7], path.join(appbaseRoot, "vitest.config.ts"));

  assert.equal(
    plan[1]?.args[2],
    path.join(appbaseRoot, "packages/native-rust/commerce/sdkwork-commerce-core-rust/Cargo.toml"),
  );
  assert.equal(
    plan[2]?.args[2],
    path.join(appbaseRoot, "packages/native-rust/commerce/sdkwork-commerce-http-rust/Cargo.toml"),
  );
  assert.equal(
    plan[3]?.args[2],
    path.join(appbaseRoot, "packages/native-rust/commerce/sdkwork-commerce-storage-sqlx-rust/Cargo.toml"),
  );
  assert.equal(
    plan[4]?.args[2],
    path.join(appbaseRoot, "packages/native-rust/commerce/sdkwork-commerce-tauri-rust/Cargo.toml"),
  );
  assert.equal(plan.length, 5);
});
