import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  appbaseArchitectureCatalog,
  rootPackageDirectoriesToRemove,
  toCapabilityName,
  toWorkspacePackageName,
} from "./package-catalog.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");
const packagesRoot = path.join(workspaceRoot, "packages");
const dryRun = process.argv.includes("--dry-run");

function log(message) {
  process.stdout.write(`${message}\n`);
}

async function ensureDirectory(directoryPath) {
  if (dryRun) {
    log(`[dry-run] mkdir ${path.relative(workspaceRoot, directoryPath) || "."}`);
    return;
  }

  await mkdir(directoryPath, { recursive: true });
}

async function writeIfChanged(filePath, content) {
  let current = null;
  try {
    current = await readFile(filePath, "utf8");
  } catch {
    current = null;
  }

  if (current === content) {
    return;
  }

  if (dryRun) {
    log(`[dry-run] write ${path.relative(workspaceRoot, filePath)}`);
    return;
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content, "utf8");
}

async function removeRootPackageDirectory(directoryName) {
  const absolutePath = path.join(workspaceRoot, directoryName);

  let entries;
  try {
    entries = await readdir(absolutePath);
  } catch {
    return;
  }

  if (entries.length > 0) {
    log(`skip root package directory with content: ${directoryName}`);
    return;
  }

  if (dryRun) {
    log(`[dry-run] remove ${directoryName}`);
    return;
  }

  await rm(absolutePath, { recursive: true, force: true });
}

function renderArchitectureReadme(architecture) {
  return `# ${architecture.architecture}

${architecture.summary}

Grouped domains:

${architecture.domains.map((domain) => `- \`${domain.domain}\`: ${domain.summary}`).join("\n")}
`;
}

function renderDomainReadme(architectureName, domain) {
  const packageBlock =
    domain.packages.length > 0
      ? `Packages in this domain:\n\n${domain.packages.map((pkg) => `- \`${pkg.directory}\``).join("\n")}\n`
      : "Reserved for future packages under this architecture.\n";

  return `# ${architectureName}/${domain.domain}

${domain.summary}

${packageBlock}`;
}

function renderPackageReadme({ architecture, domain, pkg }) {
  const packageName = toWorkspacePackageName(pkg.directory);
  const capability = toCapabilityName(pkg.directory);
  const references =
    pkg.derivedFrom.length > 0
      ? pkg.derivedFrom.map((source) => `- \`${source}\``).join("\n")
      : "- No external reference packages";

  return `# ${packageName}

## Purpose

${pkg.description}

## Placement

- Architecture: \`${architecture.architecture}\`
- Domain: \`${domain.domain}\`
- Capability: \`${capability}\`
- Status: \`scaffold\`

## Depends on

- \`@sdkwork/ui-pc-react\` for shared UI primitives and patterns
- Domain-owned service and route contracts
- Generated SDK access through shared service boundaries when remote business is required

## Ownership

This package owns the \`${capability}\` capability surface for the \`${domain.domain}\` domain.

## Runtime boundary

Do not add package-local SDK forks or transport bypasses. Reusable remote business logic must flow through the shared SDK/service boundary for its domain.

## References

${references}
`;
}

function renderPackageJson({ architecture, domain, pkg }) {
  const packageName = toWorkspacePackageName(pkg.directory);
  const capability = toCapabilityName(pkg.directory);

  return `${JSON.stringify(
    {
      name: packageName,
      private: true,
      version: "0.1.0",
      type: "module",
      description: pkg.description,
      exports: {
        ".": {
          types: "./src/index.ts",
          import: "./src/index.ts",
          default: "./src/index.ts",
        },
      },
      files: ["src", "README.md"],
      scripts: {
        typecheck: "tsc --noEmit",
      },
      peerDependencies: {
        "@sdkwork/ui-pc-react": "*",
        react: ">=18.2.0 <20.0.0",
        "react-dom": ">=18.2.0 <20.0.0",
      },
      peerDependenciesMeta: {
        "@sdkwork/ui-pc-react": {
          optional: true,
        },
      },
      sdkwork: {
        workspace: "sdkwork-appbase",
        architecture: architecture.architecture,
        domain: domain.domain,
        capability,
        status: "scaffold",
      },
    },
    null,
    2
  )}\n`;
}

function renderPackageTsconfig() {
  return `{
  "extends": "../../../../tsconfig.base.json",
  "include": ["src", "tests"]
}
`;
}

function toCamelCase(value) {
  return value
    .split("-")
    .map((segment, index) =>
      index === 0 ? segment : `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`
    )
    .join("");
}

function renderPackageIndex({ architecture, domain, pkg }) {
  const exportName = `${toCamelCase(toCapabilityName(pkg.directory))}PackageMeta`;
  const typeName = `${exportName.charAt(0).toUpperCase()}${exportName.slice(1)}`;

  return `export const ${exportName} = {
  package: "${toWorkspacePackageName(pkg.directory)}",
  architecture: "${architecture.architecture}",
  domain: "${domain.domain}",
  status: "scaffold",
} as const;

export type ${typeName} = typeof ${exportName};
`;
}

async function scaffold() {
  await ensureDirectory(packagesRoot);

  for (const rootPackageDirectory of rootPackageDirectoriesToRemove) {
    await removeRootPackageDirectory(rootPackageDirectory);
  }

  for (const architecture of appbaseArchitectureCatalog) {
    const architecturePath = path.join(packagesRoot, architecture.architecture);
    await ensureDirectory(architecturePath);
    await writeIfChanged(
      path.join(architecturePath, "README.md"),
      renderArchitectureReadme(architecture)
    );

    for (const domain of architecture.domains) {
      const domainPath = path.join(architecturePath, domain.domain);
      await ensureDirectory(domainPath);
      await writeIfChanged(
        path.join(domainPath, "README.md"),
        renderDomainReadme(architecture.architecture, domain)
      );

      if (!architecture.scaffoldPackages) {
        continue;
      }

      for (const pkg of domain.packages) {
        const packageRoot = path.join(domainPath, pkg.directory);
        await ensureDirectory(packageRoot);
        await ensureDirectory(path.join(packageRoot, "src"));
        await ensureDirectory(path.join(packageRoot, "tests"));
        await writeIfChanged(
          path.join(packageRoot, "README.md"),
          renderPackageReadme({ architecture, domain, pkg })
        );
        await writeIfChanged(
          path.join(packageRoot, "package.json"),
          renderPackageJson({ architecture, domain, pkg })
        );
        await writeIfChanged(path.join(packageRoot, "tsconfig.json"), renderPackageTsconfig());
        await writeIfChanged(
          path.join(packageRoot, "src", "index.ts"),
          renderPackageIndex({ architecture, domain, pkg })
        );
        await writeIfChanged(path.join(packageRoot, "tests", ".gitkeep"), "");
      }
    }
  }
}

await scaffold();
