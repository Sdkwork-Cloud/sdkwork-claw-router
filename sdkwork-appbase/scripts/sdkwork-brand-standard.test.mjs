import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const appbaseRoot = path.resolve(import.meta.dirname, "..");
const forbiddenTerms = ["c" + "law", "C" + "law"];
const textFileExtensions = new Set([
  ".json",
  ".md",
  ".mjs",
  ".rs",
  ".toml",
  ".ts",
  ".tsx",
]);
const scanRoots = [
  "README.md",
  "sdks/README.md",
  "scripts/package-catalog.mjs",
  "packages",
];

function isTextFile(filePath) {
  return textFileExtensions.has(path.extname(filePath));
}

function collectTextFiles(targetPath) {
  const stat = fs.statSync(targetPath);
  if (stat.isFile()) {
    return isTextFile(targetPath) ? [targetPath] : [];
  }

  const entries = fs.readdirSync(targetPath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === "target" || entry.name === "dist") {
      return [];
    }

    return collectTextFiles(path.join(targetPath, entry.name));
  });
}

function findForbiddenBrandMentions() {
  const files = scanRoots.flatMap((scanRoot) => collectTextFiles(path.join(appbaseRoot, scanRoot)));
  return files.flatMap((filePath) => {
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/u);
    return lines.flatMap((line, lineIndex) => {
      if (!forbiddenTerms.some((term) => line.includes(term))) {
        return [];
      }

      return [{
        filePath: path.relative(appbaseRoot, filePath).replaceAll("\\", "/"),
        line: lineIndex + 1,
        text: line.trim(),
      }];
    });
  });
}

test("appbase public packages use Sdkwork branding instead of legacy product names", () => {
  const violations = findForbiddenBrandMentions();

  assert.deepEqual(violations, []);
});
