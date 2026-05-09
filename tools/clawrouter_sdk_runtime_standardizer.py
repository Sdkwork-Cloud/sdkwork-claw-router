from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


SDK_DIRECTORIES = ("clawrouter-app-sdk", "clawrouter-backend-sdk")
SDK_COMMON_VERSION = "^1.0.2"
SDK_TYPES = {
    "clawrouter-app-sdk": "app",
    "clawrouter-backend-sdk": "backend",
}
UNION_ARRAY_TYPE_PATTERN = re.compile(
    r"(?P<operator>\??:\s*)"
    r"(?P<union>(?:(?:'[^'\r\n]+'|\"[^\"\r\n]+\"|\d+)\s*\|\s*)+"
    r"(?:'[^'\r\n]+'|\"[^\"\r\n]+\"|\d+))"
    r"\[\](?P<trailer>\s*[;,])"
)

BUILD_SCRIPT = r'''#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import { rollup } from 'rollup';

const projectDir = process.cwd();
const srcDir = path.join(projectDir, 'src');
const distDir = path.join(projectDir, 'dist');
const tempDir = path.join(projectDir, '.sdkwork', 'build-runtime');
const tempEsmDir = path.join(tempDir, 'esm');

async function main() {
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.rm(tempDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });

  emitDeclarations();
  emitRuntimeModules();
  await bundleRuntime('es', path.join(distDir, 'index.js'));
  await bundleRuntime('cjs', path.join(distDir, 'index.cjs'));

  await fs.rm(tempDir, { recursive: true, force: true });
}

function loadConfig(overrides) {
  const configPath = ts.findConfigFile(projectDir, ts.sys.fileExists, 'tsconfig.json');
  if (!configPath) {
    throw new Error(`tsconfig.json not found under ${projectDir}`);
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(formatDiagnostics([configFile.error]));
  }

  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, projectDir, overrides, configPath);
  if (parsed.errors.length > 0) {
    throw new Error(formatDiagnostics(parsed.errors));
  }

  return parsed;
}

function emitDeclarations() {
  const parsed = loadConfig({
    declaration: true,
    declarationMap: true,
    emitDeclarationOnly: true,
    noEmit: false,
    noEmitOnError: true,
    outDir: distDir,
    rootDir: srcDir,
    sourceMap: false,
  });
  emitProgram(parsed);
}

function emitRuntimeModules() {
  const parsed = loadConfig({
    declaration: false,
    declarationMap: false,
    emitDeclarationOnly: false,
    module: ts.ModuleKind.ESNext,
    noEmit: false,
    noEmitOnError: true,
    outDir: tempEsmDir,
    rootDir: srcDir,
    sourceMap: false,
  });
  emitProgram(parsed);
}

function emitProgram(parsed) {
  const program = ts.createProgram(parsed.fileNames, parsed.options);
  const emitResult = program.emit();
  const diagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);
  if (diagnostics.length > 0) {
    throw new Error(formatDiagnostics(diagnostics));
  }
}

async function bundleRuntime(format, file) {
  const bundle = await rollup({
    input: path.join(tempEsmDir, 'index.js'),
    external: (source) => source.startsWith('@sdkwork/'),
    plugins: [relativeExtensionResolver()],
    onwarn(warning, warn) {
      if (warning.code === 'EMPTY_BUNDLE') {
        throw new Error(warning.message);
      }
      warn(warning);
    },
  });

  try {
    await bundle.write({
      file,
      format,
      exports: 'named',
      interop: 'auto',
      sourcemap: false,
    });
  } finally {
    await bundle.close();
  }
}

function relativeExtensionResolver() {
  return {
    name: 'relative-extension-resolver',
    async resolveId(source, importer) {
      if (!importer || !source.startsWith('.')) {
        return null;
      }

      const base = path.resolve(path.dirname(importer), source);
      for (const candidate of [base, `${base}.js`, path.join(base, 'index.js')]) {
        try {
          const stat = await fs.stat(candidate);
          if (stat.isFile()) {
            return candidate;
          }
        } catch {
          // Try the next candidate.
        }
      }

      return null;
    },
  };
}

function formatDiagnostics(diagnostics) {
  return ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => projectDir,
    getNewLine: () => '\n',
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
'''


class SdkRuntimeStandardizer:
    """Apply the project SDK runtime build standard after generated SDK refreshes."""

    def __init__(self, root: Path) -> None:
        self.root = Path(root).resolve()

    def run(self) -> list[Path]:
        updated: list[Path] = []
        for sdk_dir in SDK_DIRECTORIES:
            base = self.root / "sdks" / sdk_dir
            if not base.is_dir():
                raise FileNotFoundError(f"generated SDK directory is missing: {base}")
            updated.extend(self._standardize_sdk(base))
        return updated

    def _standardize_sdk(self, base: Path) -> list[Path]:
        updated: list[Path] = []
        package_path = base / "package.json"
        package = self._read_json(package_path)

        scripts = package.setdefault("scripts", {})
        if not isinstance(scripts, dict):
            scripts = {}
            package["scripts"] = scripts
        scripts["build"] = "node custom/build-runtime.mjs"
        scripts["dev"] = "node custom/build-runtime.mjs"
        scripts["prepublishOnly"] = "npm run build"

        dev_dependencies = package.setdefault("devDependencies", {})
        if not isinstance(dev_dependencies, dict):
            dev_dependencies = {}
            package["devDependencies"] = dev_dependencies
        dev_dependencies.pop("vite", None)
        dev_dependencies.pop("vite-plugin-dts", None)
        dev_dependencies.setdefault("@types/node", "^20.0.0")
        dev_dependencies.setdefault("typescript", "^5.3.0")
        dev_dependencies.setdefault("rollup", "^4.0.0")

        dependencies = package.setdefault("dependencies", {})
        if not isinstance(dependencies, dict):
            dependencies = {}
            package["dependencies"] = dependencies
        dependencies["@sdkwork/sdk-common"] = SDK_COMMON_VERSION

        self._write_json(package_path, package)
        updated.append(package_path)

        build_script_path = base / "custom" / "build-runtime.mjs"
        build_script_path.parent.mkdir(parents=True, exist_ok=True)
        build_script_path.write_text(BUILD_SCRIPT, encoding="utf-8", newline="\n")
        updated.append(build_script_path)

        custom_readme_path = base / "custom" / "README.md"
        custom_readme = (
            "# Custom SDK Extensions\n\n"
            "This directory is reserved for handwritten extensions that are not owned by the SDK generator.\n"
        )
        if not custom_readme_path.is_file() or custom_readme_path.read_text(encoding="utf-8") != custom_readme:
            custom_readme_path.write_text(custom_readme, encoding="utf-8", newline="\n")
            updated.append(custom_readme_path)

        metadata_path = base / "sdkwork-sdk.json"
        metadata = {
            "language": "typescript",
            "sdkType": SDK_TYPES[base.name],
            "name": base.name,
            "packageName": package.get("name"),
            "version": package.get("version"),
        }
        if not metadata_path.is_file() or self._read_json_or_none(metadata_path) != metadata:
            self._write_json(metadata_path, metadata)
            updated.append(metadata_path)

        manifest_path = base / ".sdkwork" / "sdkwork-generator-manifest.json"
        manifest_path.parent.mkdir(parents=True, exist_ok=True)
        generator_manifest = self._read_json_or_none(manifest_path)
        if not self._is_sdk_generator_manifest(generator_manifest):
            manifest = {
                "generator": "sdk/sdkwork-sdk-generator",
                "language": "typescript",
                "sdkType": SDK_TYPES[base.name],
                "packageName": package.get("name"),
                "version": package.get("version"),
            }
            if generator_manifest != manifest:
                self._write_json(manifest_path, manifest)
                updated.append(manifest_path)

        http_client_path = base / "src" / "http" / "client.ts"
        if http_client_path.is_file():
            source = http_client_path.read_text(encoding="utf-8")
            normalized = self._standardize_http_client_content_type(source)
            if normalized != source:
                http_client_path.write_text(normalized, encoding="utf-8", newline="\n")
                updated.append(http_client_path)

        types_dir = base / "src" / "types"
        if types_dir.is_dir():
            generated_type_stems = self._manifest_generated_type_stems(generator_manifest)
            if generated_type_stems is not None:
                updated.extend(self._remove_unmanifested_type_artifacts(base, generated_type_stems))
            for type_path in sorted(types_dir.glob("*.ts")):
                source = type_path.read_text(encoding="utf-8")
                normalized = self._standardize_union_array_types(source)
                if normalized != source:
                    type_path.write_text(normalized, encoding="utf-8", newline="\n")
                    updated.append(type_path)
            type_index_path = types_dir / "index.ts"
            if type_index_path.is_file():
                source = type_index_path.read_text(encoding="utf-8")
                normalized = self._standardize_type_index_exports(types_dir, source, generated_type_stems)
                if normalized != source:
                    type_index_path.write_text(normalized, encoding="utf-8", newline="\n")
                    updated.append(type_index_path)

        if base.name == "clawrouter-backend-sdk":
            skill_api_path = base / "src" / "api" / "skill.ts"
            if skill_api_path.is_file():
                source = skill_api_path.read_text(encoding="utf-8")
                normalized = self._standardize_backend_skill_api_method_names(source)
                if normalized != source:
                    skill_api_path.write_text(normalized, encoding="utf-8", newline="\n")
                    updated.append(skill_api_path)
            app_api_path = base / "src" / "api" / "app.ts"
            if app_api_path.is_file():
                source = app_api_path.read_text(encoding="utf-8")
                normalized = self._standardize_backend_app_api_method_names(source)
                if normalized != source:
                    app_api_path.write_text(normalized, encoding="utf-8", newline="\n")
                    updated.append(app_api_path)

        publish_core_path = base / "bin" / "publish-core.mjs"
        if publish_core_path.is_file():
            source = publish_core_path.read_text(encoding="utf-8")
            normalized = self._standardize_publish_core_install_command(source)
            if normalized != source:
                publish_core_path.write_text(normalized, encoding="utf-8", newline="\n")
                updated.append(publish_core_path)

        updated.extend(self._remove_unexported_api_artifacts(base))
        updated.extend(self._remove_trailing_whitespace(base))

        return updated

    def _standardize_http_client_content_type(self, source: str) -> str:
        updated = source
        if "private withContentType(" not in updated:
            marker = "  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {"
            helper = """  private withContentType(headers?: Record<string, string>, contentType?: string): Record<string, string> | undefined {
    if (!contentType) {
      return headers;
    }
    const nextHeaders = { ...(headers ?? {}) };
    nextHeaders['Content-Type'] = contentType;
    return nextHeaders;
  }

"""
            updated = updated.replace(marker, helper + marker, 1)

        updated = updated.replace(
            "async post<T>(path: string, body?: unknown, params?: QueryParams, headers?: Record<string, string>): Promise<T> {",
            "async post<T>(path: string, body?: unknown, params?: QueryParams, headers?: Record<string, string>, contentType?: string): Promise<T> {",
        )
        updated = updated.replace(
            "return this.request<T>(path, { method: 'POST', body, params, headers });",
            "return this.request<T>(path, { method: 'POST', body, params, headers: this.withContentType(headers, contentType) });",
        )
        updated = updated.replace(
            "async put<T>(path: string, body?: unknown, params?: QueryParams, headers?: Record<string, string>): Promise<T> {",
            "async put<T>(path: string, body?: unknown, params?: QueryParams, headers?: Record<string, string>, contentType?: string): Promise<T> {",
        )
        updated = updated.replace(
            "return this.request<T>(path, { method: 'PUT', body, params, headers });",
            "return this.request<T>(path, { method: 'PUT', body, params, headers: this.withContentType(headers, contentType) });",
        )
        updated = updated.replace(
            "async patch<T>(path: string, body?: unknown, params?: QueryParams, headers?: Record<string, string>): Promise<T> {",
            "async patch<T>(path: string, body?: unknown, params?: QueryParams, headers?: Record<string, string>, contentType?: string): Promise<T> {",
        )
        updated = updated.replace(
            "return this.request<T>(path, { method: 'PATCH', body, params, headers });",
            "return this.request<T>(path, { method: 'PATCH', body, params, headers: this.withContentType(headers, contentType) });",
        )
        return updated

    def _standardize_union_array_types(self, source: str) -> str:
        """Fix old generator output where union arrays miss parentheses."""

        def replace(match: re.Match[str]) -> str:
            return f"{match.group('operator')}({match.group('union')})[]{match.group('trailer')}"

        return UNION_ARRAY_TYPE_PATTERN.sub(replace, source)

    def _standardize_type_index_exports(
        self,
        types_dir: Path,
        source: str,
        generated_type_stems: set[str] | None = None,
    ) -> str:
        declarations = self._type_file_declarations(types_dir, generated_type_stems)
        existing_stems: set[str] = set()
        changed = False
        lines: list[str] = []
        for line in source.splitlines():
            match = re.search(r"from\s+['\"]\./([^'\"]+)['\"]", line)
            if match is not None:
                stem = match.group(1)
                if generated_type_stems is not None and stem not in generated_type_stems:
                    changed = True
                    continue
                if not (types_dir / f"{stem}.ts").is_file():
                    changed = True
                    continue
                existing_stems.add(stem)
            lines.append(line)

        missing_exports = [
            (stem, symbol)
            for stem, symbol in declarations
            if stem not in existing_stems
        ]
        if not changed and not missing_exports:
            return source

        for stem, symbol in missing_exports:
            lines.append(f"export type {{ {symbol} }} from './{stem}';")
        return "\n".join(lines) + "\n"

    def _type_file_declarations(
        self,
        types_dir: Path,
        generated_type_stems: set[str] | None = None,
    ) -> list[tuple[str, str]]:
        declarations: list[tuple[str, str]] = []
        for type_path in sorted(types_dir.glob("*.ts")):
            if type_path.name == "index.ts":
                continue
            if generated_type_stems is not None and type_path.stem not in generated_type_stems:
                continue
            source = type_path.read_text(encoding="utf-8")
            match = re.search(
                r"^\s*export\s+(?:interface|type|class|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)",
                source,
                flags=re.MULTILINE,
            )
            if match is None:
                continue
            declarations.append((type_path.stem, match.group(1)))
        return declarations

    def _is_sdk_generator_manifest(self, manifest: dict[str, Any] | None) -> bool:
        return isinstance(manifest, dict) and manifest.get("generator") == "@sdkwork/sdk-generator"

    def _manifest_generated_type_stems(self, manifest: dict[str, Any] | None) -> set[str] | None:
        if not self._is_sdk_generator_manifest(manifest):
            return None
        generated_files = manifest.get("generatedFiles")
        if not isinstance(generated_files, list):
            return None
        stems: set[str] = set()
        for entry in generated_files:
            if not isinstance(entry, dict):
                continue
            raw_path = entry.get("path")
            if not isinstance(raw_path, str):
                continue
            normalized_path = raw_path.replace("\\", "/")
            if not normalized_path.startswith("src/types/") or not normalized_path.endswith(".ts"):
                continue
            stem = Path(normalized_path).stem
            if stem != "index":
                stems.add(stem)
        return stems

    def _remove_unmanifested_type_artifacts(self, base: Path, generated_type_stems: set[str]) -> list[Path]:
        types_dir = base / "src" / "types"
        if not types_dir.is_dir():
            return []
        updated: list[Path] = []
        for source_path in sorted(types_dir.glob("*.ts")):
            stem = source_path.stem
            if stem == "index" or stem in generated_type_stems:
                continue
            source_path.unlink()
            updated.append(source_path)
            for stale_path in (
                base / "dist" / "types" / f"{stem}.js",
                base / "dist" / "types" / f"{stem}.cjs",
                base / "dist" / "types" / f"{stem}.d.ts",
                base / "dist" / "types" / f"{stem}.d.ts.map",
            ):
                if stale_path.exists():
                    stale_path.unlink()
                    updated.append(stale_path)
        return updated

    def _standardize_backend_skill_api_method_names(self, source: str) -> str:
        """Keep backend skill lifecycle methods aligned with OpenAPI operationId values."""

        replacements = {
            "async offline(": "async offlineSkill(",
            "async publish(": "async publishSkill(",
            "async approve(": "async approveSkill(",
            "async reject(": "async rejectSkill(",
        }
        updated = source
        for old, new in replacements.items():
            updated = updated.replace(old, new)
        return updated

    def _standardize_backend_app_api_method_names(self, source: str) -> str:
        """Keep backend app detail method aligned with the OpenAPI operationId."""

        return source.replace("async fetch(", "async fetchApp(")

    def _standardize_publish_core_install_command(self, source: str) -> str:
        """Avoid running dependency prepare scripts during SDK publish build verification."""

        updated = source
        if "function hasTypeScriptSdkDependencies(projectDir)" not in updated:
            marker = "function runTypeScript(ctx) {"
            helper = """function hasTypeScriptSdkDependencies(projectDir) {
  return existsSync(path.join(projectDir, 'node_modules', 'typescript'))
    && existsSync(path.join(projectDir, 'node_modules', 'rollup'))
    && existsSync(path.join(projectDir, 'node_modules', '@sdkwork', 'sdk-common'));
}

"""
            updated = updated.replace(marker, helper + marker, 1)

        canonical_run_typescript = """function runTypeScript(ctx) {
  const packageFile = path.join(ctx.projectDir, 'package.json');
  ensureFile(packageFile, 'package.json');
  const packageJson = loadJson(packageFile);
  const hasBuildScript = Boolean(packageJson?.scripts?.build);

  if (!hasTypeScriptSdkDependencies(ctx.projectDir)) {
    run('npm', ['install', '--ignore-scripts'], { cwd: ctx.projectDir });
  } else {
    log('TypeScript dependencies already installed, skipping npm install.');
  }
  if (hasBuildScript) {
    run('npm', ['run', 'build'], { cwd: ctx.projectDir });
  } else {
    log('No build script found in package.json, skipping build.');
  }

  if (ctx.action === 'check') {
    run('npm', ['pack', '--dry-run'], { cwd: ctx.projectDir });
    return;
  }

  if (ctx.action === 'build') {
    return;
  }

  const registry = process.env.NPM_REGISTRY_URL || 'https://registry.npmjs.org/';
  const args = ['publish', '--access', 'public', '--registry', registry];
  if (ctx.channel === 'test') {
    args.push('--tag', 'next');
  }
  if (ctx.dryRun) {
    args.push('--dry-run');
  }
  run('npm', args, { cwd: ctx.projectDir });
}"""

        return self._replace_javascript_function(updated, "runTypeScript", canonical_run_typescript)

    def _replace_javascript_function(self, source: str, function_name: str, replacement: str) -> str:
        marker = f"function {function_name}("
        start = source.find(marker)
        if start < 0:
            return source
        open_brace = source.find("{", start)
        if open_brace < 0:
            return source

        depth = 0
        for index in range(open_brace, len(source)):
            character = source[index]
            if character == "{":
                depth += 1
            elif character == "}":
                depth -= 1
                if depth == 0:
                    return source[:start] + replacement + source[index + 1 :]
        return source

    def _remove_trailing_whitespace(self, base: Path) -> list[Path]:
        updated: list[Path] = []
        candidates = [base / "vite.config.ts", *sorted((base / "src").rglob("*.ts"))]
        for source_path in candidates:
            if not source_path.is_file():
                continue
            source = source_path.read_text(encoding="utf-8")
            normalized = re.sub(r"[ \t]+(?=\r?\n)", "", source)
            if normalized != source:
                source_path.write_text(normalized, encoding="utf-8", newline="\n")
                updated.append(source_path)
        return updated

    def _remove_unexported_api_artifacts(self, base: Path) -> list[Path]:
        api_dir = base / "src" / "api"
        index_path = api_dir / "index.ts"
        if not index_path.is_file():
            return []

        index_source = index_path.read_text(encoding="utf-8")
        exported_stems = set(re.findall(r"from\s+['\"]\./([^'\"]+)['\"]", index_source))
        allowed_stems = {"base", "index", "paths", *exported_stems}
        updated: list[Path] = []

        for source_path in sorted(api_dir.glob("*.ts")):
            stem = source_path.stem
            if stem in allowed_stems:
                continue
            source_path.unlink()
            updated.append(source_path)
            for stale_path in (
                base / "dist" / "api" / f"{stem}.js",
                base / "dist" / "api" / f"{stem}.cjs",
                base / "dist" / "api" / f"{stem}.d.ts",
                base / "dist" / "api" / f"{stem}.d.ts.map",
            ):
                if stale_path.exists():
                    stale_path.unlink()
                    updated.append(stale_path)

        return updated

    def _read_json(self, path: Path) -> dict[str, Any]:
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except OSError as exc:
            raise RuntimeError(f"cannot read SDK package file {path}: {exc}") from exc
        except json.JSONDecodeError as exc:
            raise RuntimeError(f"invalid SDK package JSON {path}: {exc}") from exc
        if not isinstance(payload, dict):
            raise RuntimeError(f"SDK package JSON must contain an object: {path}")
        return payload

    def _read_json_or_none(self, path: Path) -> dict[str, Any] | None:
        try:
            return self._read_json(path)
        except RuntimeError:
            return None

    def _write_json(self, path: Path, payload: dict[str, Any]) -> None:
        path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


def main() -> int:
    parser = argparse.ArgumentParser(description="Apply sdkwork-claw-router generated SDK runtime build standard.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    args = parser.parse_args()

    updated = SdkRuntimeStandardizer(root=args.root).run()
    for path in updated:
        print(path.relative_to(Path(args.root).resolve()).as_posix())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
