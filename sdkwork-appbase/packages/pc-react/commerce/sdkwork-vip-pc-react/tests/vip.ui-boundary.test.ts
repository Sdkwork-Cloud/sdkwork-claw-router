import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const packageRoot = resolve(import.meta.dirname, "..");

describe("sdkwork-vip-pc-react UI boundary", () => {
  it("imports only narrow sdkwork UI component entrypoints", () => {
    const sourceFiles = [
      "src/components/vip-level-comparison.tsx",
      "src/components/vip-membership-hero.tsx",
      "src/pages/VipPage.tsx",
    ];

    for (const sourceFile of sourceFiles) {
      const source = readFileSync(resolve(packageRoot, sourceFile), "utf8");

      expect(source).not.toMatch(/from ["']@sdkwork\/ui-pc-react["']/);
      expect(source).not.toMatch(/from ["']@sdkwork\/ui-pc-react\/components\/ui["']/);
    }
  });
});
