import { access, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  appbaseArchitectureCatalog,
  rootPackageDirectoriesToRemove,
} from "./package-catalog.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");
const packagesRoot = path.join(workspaceRoot, "packages");
const summaryOnly = process.argv.includes("--summary");

async function exists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const issues = [];
  const summary = [];

  for (const architecture of appbaseArchitectureCatalog) {
    const architecturePath = path.join(packagesRoot, architecture.architecture);
    if (!(await exists(architecturePath))) {
      issues.push(`Missing architecture directory: packages/${architecture.architecture}`);
      continue;
    }

    let packageCount = 0;

    for (const domain of architecture.domains) {
      const domainPath = path.join(architecturePath, domain.domain);
      if (!(await exists(domainPath))) {
        issues.push(`Missing domain directory: packages/${architecture.architecture}/${domain.domain}`);
        continue;
      }

      if (!architecture.scaffoldPackages) {
        continue;
      }

      for (const pkg of domain.packages) {
        packageCount += 1;
        const packageRoot = path.join(domainPath, pkg.directory);
        const requiredPaths = architecture.packageKind === "rust"
          ? [
              packageRoot,
              path.join(packageRoot, "Cargo.toml"),
              path.join(packageRoot, "src", "lib.rs"),
            ]
          : [
              packageRoot,
              path.join(packageRoot, "README.md"),
              path.join(packageRoot, "package.json"),
              path.join(packageRoot, "tsconfig.json"),
              path.join(packageRoot, "src", architecture.architecture === "pc-react" && pkg.directory === "sdkwork-iam-react" ? "index.tsx" : "index.ts"),
            ];

        for (const requiredPath of requiredPaths) {
          if (!(await exists(requiredPath))) {
            issues.push(`Missing required path: ${path.relative(workspaceRoot, requiredPath)}`);
          }
        }
      }
    }

    summary.push({
      architecture: architecture.architecture,
      scaffolded: architecture.scaffoldPackages ? packageCount : 0,
      reservedDomains: architecture.scaffoldPackages ? 0 : architecture.domains.length,
    });
  }

  for (const rootPackageDirectory of rootPackageDirectoriesToRemove) {
    if (await exists(path.join(workspaceRoot, rootPackageDirectory))) {
      issues.push(`Root package directory still present: ${rootPackageDirectory}`);
    }
  }

  if (summaryOnly) {
    for (const item of summary) {
      process.stdout.write(
        `${item.architecture}: scaffolded=${item.scaffolded} reservedDomains=${item.reservedDomains}\n`
      );
    }
    return;
  }

  if (issues.length > 0) {
    process.stderr.write(`Structure review failed with ${issues.length} issue(s):\n`);
    for (const issue of issues) {
      process.stderr.write(`- ${issue}\n`);
    }
    process.exitCode = 1;
    return;
  }

  const topLevelEntries = await readdir(packagesRoot);
  const packageTotal = summary.reduce((total, item) => total + item.scaffolded, 0);
  process.stdout.write(
    `Structure review passed. Architectures=${topLevelEntries.length} packages=${packageTotal}\n`
  );
}

await main();
