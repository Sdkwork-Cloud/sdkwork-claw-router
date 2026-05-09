import json
import tempfile
import unittest
from pathlib import Path

from tools.clawrouter_sdk_runtime_standardizer import SdkRuntimeStandardizer


class SdkRuntimeStandardizerTest(unittest.TestCase):
    def test_standardizes_generated_sdk_runtime_build_metadata(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for sdk_dir, package_name in (
                ("clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk"),
                ("clawrouter-backend-sdk", "@sdkwork/clawrouter-backend-sdk"),
            ):
                base = root / "sdks" / sdk_dir
                (base / "custom").mkdir(parents=True, exist_ok=True)
                (base / "src" / "http").mkdir(parents=True, exist_ok=True)
                (base / "package.json").write_text(
                    json.dumps(
                        {
                            "name": package_name,
                            "dependencies": {
                                "@sdkwork/sdk-common": "^1.0.0",
                            },
                            "scripts": {
                                "build": "tsc --emitDeclarationOnly && vite build",
                                "dev": "vite build --watch",
                                "prepublishOnly": "npm run build",
                            },
                            "devDependencies": {
                                "@types/node": "^20.0.0",
                                "typescript": "^5.3.0",
                                "vite": "^7.0.0",
                                "vite-plugin-dts": "^4.0.0",
                            },
                        }
                    )
                    + "\n",
                    encoding="utf-8",
                )
                (base / "src" / "http" / "client.ts").write_text(
                    "import type { QueryParams } from '@sdkwork/sdk-common';\n"
                    "export class HttpClient {\n"
                    "  async request<T>(path: string, options: unknown = {}): Promise<T> { throw new Error('stub'); }\n"
                    "  async post<T>(path: string, body?: unknown, params?: QueryParams, headers?: Record<string, string>): Promise<T> {\n"
                    "    return this.request<T>(path, { method: 'POST', body, params, headers });\n"
                    "  }\n"
                    "  async put<T>(path: string, body?: unknown, params?: QueryParams, headers?: Record<string, string>): Promise<T> {\n"
                    "    return this.request<T>(path, { method: 'PUT', body, params, headers });\n"
                    "  }\n"
                    "  async patch<T>(path: string, body?: unknown, params?: QueryParams, headers?: Record<string, string>): Promise<T> {\n"
                    "    return this.request<T>(path, { method: 'PATCH', body, params, headers });\n"
                    "  }\n"
                    "}\n",
                    encoding="utf-8",
                )

            updated = SdkRuntimeStandardizer(root=root).run()

            updated_paths = set(updated)
            for sdk_dir in ("clawrouter-app-sdk", "clawrouter-backend-sdk"):
                base = root / "sdks" / sdk_dir
                self.assertTrue(
                    {
                        base / "package.json",
                        base / "custom" / "build-runtime.mjs",
                        base / "custom" / "README.md",
                        base / "sdkwork-sdk.json",
                        base / ".sdkwork" / "sdkwork-generator-manifest.json",
                        base / "src" / "http" / "client.ts",
                    }.issubset(updated_paths)
                )
                package = json.loads((base / "package.json").read_text(encoding="utf-8"))
                self.assertEqual("node custom/build-runtime.mjs", package["scripts"]["build"])
                self.assertEqual("node custom/build-runtime.mjs", package["scripts"]["dev"])
                self.assertEqual("npm run build", package["scripts"]["prepublishOnly"])
                self.assertEqual("^1.0.2", package["dependencies"]["@sdkwork/sdk-common"])
                self.assertIn("rollup", package["devDependencies"])
                self.assertNotIn("vite", package["devDependencies"])
                self.assertNotIn("vite-plugin-dts", package["devDependencies"])
                self.assertIn("rollup", (base / "custom" / "build-runtime.mjs").read_text(encoding="utf-8"))
                http_client = (base / "src" / "http" / "client.ts").read_text(encoding="utf-8")
                self.assertIn("contentType?: string", http_client)
                self.assertIn("headers: this.withContentType(headers, contentType)", http_client)

    def test_standardizes_publish_core_dependency_install_without_dependency_prepare_scripts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for sdk_dir, package_name in (
                ("clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk"),
                ("clawrouter-backend-sdk", "@sdkwork/clawrouter-backend-sdk"),
            ):
                base = root / "sdks" / sdk_dir
                (base / "bin").mkdir(parents=True, exist_ok=True)
                (base / "package.json").write_text(
                    json.dumps({"name": package_name}) + "\n",
                    encoding="utf-8",
                )
                (base / "bin" / "publish-core.mjs").write_text(
                    "import { existsSync } from 'node:fs';\n"
                    "import path from 'node:path';\n"
                    "function runTypeScript(ctx) {\n"
                    "  run('npm', ['install'], { cwd: ctx.projectDir });\n"
                    "  run('npm', ['run', 'build'], { cwd: ctx.projectDir });\n"
                    "}\n",
                    encoding="utf-8",
                )

            updated = SdkRuntimeStandardizer(root=root).run()

            for sdk_dir in ("clawrouter-app-sdk", "clawrouter-backend-sdk"):
                publish_core = root / "sdks" / sdk_dir / "bin" / "publish-core.mjs"
                source = publish_core.read_text(encoding="utf-8")
                self.assertIn("function hasTypeScriptSdkDependencies(projectDir) {", source)
                self.assertIn("if (!hasTypeScriptSdkDependencies(ctx.projectDir)) {", source)
                self.assertIn("run('npm', ['install', '--ignore-scripts'], { cwd: ctx.projectDir });", source)
                self.assertIn("TypeScript dependencies already installed, skipping npm install.", source)
                self.assertNotIn("run('npm', ['install'], { cwd: ctx.projectDir });", source)
                self.assertIn(publish_core, updated)

    def test_standardizes_publish_core_dependency_install_idempotently(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for sdk_dir, package_name in (
                ("clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk"),
                ("clawrouter-backend-sdk", "@sdkwork/clawrouter-backend-sdk"),
            ):
                base = root / "sdks" / sdk_dir
                (base / "bin").mkdir(parents=True, exist_ok=True)
                (base / "package.json").write_text(
                    json.dumps({"name": package_name}) + "\n",
                    encoding="utf-8",
                )
                (base / "bin" / "publish-core.mjs").write_text(
                    "import { existsSync } from 'node:fs';\n"
                    "import path from 'node:path';\n"
                    "function hasTypeScriptSdkDependencies(projectDir) {\n"
                    "  return existsSync(path.join(projectDir, 'node_modules', 'typescript'))\n"
                    "    && existsSync(path.join(projectDir, 'node_modules', 'rollup'))\n"
                    "    && existsSync(path.join(projectDir, 'node_modules', '@sdkwork', 'sdk-common'));\n"
                    "}\n"
                    "\n"
                    "function runTypeScript(ctx) {\n"
                    "  const packageFile = path.join(ctx.projectDir, 'package.json');\n"
                    "  ensureFile(packageFile, 'package.json');\n"
                    "  const packageJson = loadJson(packageFile);\n"
                    "  const hasBuildScript = Boolean(packageJson?.scripts?.build);\n"
                    "\n"
                    "  if (ctx.action === 'check') {\n"
                    "    run('npm', ['pack', '--dry-run'], { cwd: ctx.projectDir });\n"
                    "    return;\n"
                    "  }\n"
                    "\n"
                    "  if (!hasTypeScriptSdkDependencies(ctx.projectDir)) {\n"
                    "    if (!hasTypeScriptSdkDependencies(ctx.projectDir)) {\n"
                    "    run('npm', ['install', '--ignore-scripts'], { cwd: ctx.projectDir });\n"
                    "  } else {\n"
                    "    log('TypeScript dependencies already installed, skipping npm install.');\n"
                    "  }\n"
                    "  } else {\n"
                    "    log('TypeScript dependencies already installed, skipping npm install.');\n"
                    "  }\n"
                    "  if (hasBuildScript) {\n"
                    "    run('npm', ['run', 'build'], { cwd: ctx.projectDir });\n"
                    "  }\n"
                    "}\n"
                    "\n"
                    "function runDart(ctx) {}\n",
                    encoding="utf-8",
                )

            updated = SdkRuntimeStandardizer(root=root).run()

            for sdk_dir in ("clawrouter-app-sdk", "clawrouter-backend-sdk"):
                publish_core = root / "sdks" / sdk_dir / "bin" / "publish-core.mjs"
                source = publish_core.read_text(encoding="utf-8")
                self.assertEqual(1, source.count("if (!hasTypeScriptSdkDependencies(ctx.projectDir)) {"))
                self.assertEqual(1, source.count("run('npm', ['install', '--ignore-scripts'], { cwd: ctx.projectDir });"))
                self.assertNotIn("if (!hasTypeScriptSdkDependencies(ctx.projectDir)) {\n    if (!hasTypeScriptSdkDependencies", source)
                self.assertIn(
                    "  if (!hasTypeScriptSdkDependencies(ctx.projectDir)) {\n"
                    "    run('npm', ['install', '--ignore-scripts'], { cwd: ctx.projectDir });\n"
                    "  } else {\n"
                    "    log('TypeScript dependencies already installed, skipping npm install.');\n"
                    "  }\n"
                    "  if (hasBuildScript) {",
                    source,
                )
                self.assertIn(publish_core, updated)

    def test_standardizes_publish_core_check_to_build_before_pack(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for sdk_dir, package_name in (
                ("clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk"),
                ("clawrouter-backend-sdk", "@sdkwork/clawrouter-backend-sdk"),
            ):
                base = root / "sdks" / sdk_dir
                (base / "bin").mkdir(parents=True, exist_ok=True)
                (base / "package.json").write_text(
                    json.dumps({"name": package_name}) + "\n",
                    encoding="utf-8",
                )
                (base / "bin" / "publish-core.mjs").write_text(
                    "import { existsSync } from 'node:fs';\n"
                    "function runTypeScript(ctx) {\n"
                    "  const packageFile = path.join(ctx.projectDir, 'package.json');\n"
                    "  ensureFile(packageFile, 'package.json');\n"
                    "  const packageJson = loadJson(packageFile);\n"
                    "  const hasBuildScript = Boolean(packageJson?.scripts?.build);\n"
                    "\n"
                    "  if (ctx.action === 'check') {\n"
                    "    run('npm', ['pack', '--dry-run'], { cwd: ctx.projectDir });\n"
                    "    return;\n"
                    "  }\n"
                    "\n"
                    "  run('npm', ['install'], { cwd: ctx.projectDir });\n"
                    "  if (hasBuildScript) {\n"
                    "    run('npm', ['run', 'build'], { cwd: ctx.projectDir });\n"
                    "  } else {\n"
                    "    log('No build script found in package.json, skipping build.');\n"
                    "  }\n"
                    "\n"
                    "  if (ctx.action === 'build') {\n"
                    "    return;\n"
                    "  }\n"
                    "\n"
                    "  run('npm', ['publish'], { cwd: ctx.projectDir });\n"
                    "}\n",
                    encoding="utf-8",
                )

            updated = SdkRuntimeStandardizer(root=root).run()

            for sdk_dir in ("clawrouter-app-sdk", "clawrouter-backend-sdk"):
                publish_core = root / "sdks" / sdk_dir / "bin" / "publish-core.mjs"
                source = publish_core.read_text(encoding="utf-8")
                self.assertNotIn(
                    "if (ctx.action === 'check') {\n"
                    "    run('npm', ['pack', '--dry-run'], { cwd: ctx.projectDir });\n"
                    "    return;\n"
                    "  }\n\n"
                    "  if (!hasTypeScriptSdkDependencies(ctx.projectDir)) {",
                    source,
                )
                self.assertIn(
                    "  if (hasBuildScript) {\n"
                    "    run('npm', ['run', 'build'], { cwd: ctx.projectDir });\n"
                    "  } else {\n"
                    "    log('No build script found in package.json, skipping build.');\n"
                    "  }\n"
                    "\n"
                    "  if (ctx.action === 'check') {\n"
                    "    run('npm', ['pack', '--dry-run'], { cwd: ctx.projectDir });\n"
                    "    return;\n"
                    "  }\n"
                    "\n"
                    "  if (ctx.action === 'build') {",
                    source,
                )
                self.assertIn(publish_core, updated)

    def test_exports_every_generated_type_file_from_type_index(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for sdk_dir, package_name in (
                ("clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk"),
                ("clawrouter-backend-sdk", "@sdkwork/clawrouter-backend-sdk"),
            ):
                base = root / "sdks" / sdk_dir
                (base / "src" / "types").mkdir(parents=True, exist_ok=True)
                (base / "package.json").write_text(
                    json.dumps({"name": package_name}) + "\n",
                    encoding="utf-8",
                )
                (base / "src" / "types" / "index.ts").write_text(
                    "export type { ExistingType } from './existing-type';\n",
                    encoding="utf-8",
                )
                (base / "src" / "types" / "existing-type.ts").write_text(
                    "export interface ExistingType { id: string; }\n",
                    encoding="utf-8",
                )
                (base / "src" / "types" / "admin-skill-item.ts").write_text(
                    "export interface AdminSkillItem { skillKey: string; }\n",
                    encoding="utf-8",
                )

            updated = SdkRuntimeStandardizer(root=root).run()

            for sdk_dir in ("clawrouter-app-sdk", "clawrouter-backend-sdk"):
                index_path = root / "sdks" / sdk_dir / "src" / "types" / "index.ts"
                source = index_path.read_text(encoding="utf-8")
                self.assertIn("export type { ExistingType } from './existing-type';", source)
                self.assertIn("export type { AdminSkillItem } from './admin-skill-item';", source)
                self.assertIn(index_path, updated)

    def test_preserves_generator_manifest_and_ignores_unmanifested_legacy_type_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for sdk_dir, package_name in (
                ("clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk"),
                ("clawrouter-backend-sdk", "@sdkwork/clawrouter-backend-sdk"),
            ):
                base = root / "sdks" / sdk_dir
                (base / ".sdkwork").mkdir(parents=True, exist_ok=True)
                (base / "src" / "types").mkdir(parents=True, exist_ok=True)
                (base / "package.json").write_text(
                    json.dumps({"name": package_name}) + "\n",
                    encoding="utf-8",
                )
                (base / "src" / "types" / "index.ts").write_text(
                    "export type { ExistingType } from './existing-type';\n"
                    "export type { LegacyType } from './legacy-type';\n",
                    encoding="utf-8",
                )
                (base / "src" / "types" / "existing-type.ts").write_text(
                    "export interface ExistingType { id: string; }\n",
                    encoding="utf-8",
                )
                (base / "src" / "types" / "legacy-type.ts").write_text(
                    "export interface LegacyType { id: string; }\n",
                    encoding="utf-8",
                )
                (base / ".sdkwork" / "sdkwork-generator-manifest.json").write_text(
                    json.dumps(
                        {
                            "schemaVersion": 1,
                            "generator": "@sdkwork/sdk-generator",
                            "sdk": {
                                "name": sdk_dir,
                                "version": "0.1.0",
                                "language": "typescript",
                                "sdkType": "app" if sdk_dir == "clawrouter-app-sdk" else "backend",
                                "packageName": package_name,
                            },
                            "generatedFiles": [
                                {"path": "src/types/index.ts", "sha256": "index"},
                                {"path": "src/types/existing-type.ts", "sha256": "existing"},
                            ],
                            "scaffoldFiles": ["custom/README.md"],
                            "customRoots": ["custom/"],
                        }
                    )
                    + "\n",
                    encoding="utf-8",
                )

            updated = SdkRuntimeStandardizer(root=root).run()

            for sdk_dir in ("clawrouter-app-sdk", "clawrouter-backend-sdk"):
                base = root / "sdks" / sdk_dir
                manifest = json.loads((base / ".sdkwork" / "sdkwork-generator-manifest.json").read_text(encoding="utf-8"))
                source = (base / "src" / "types" / "index.ts").read_text(encoding="utf-8")

                self.assertEqual("@sdkwork/sdk-generator", manifest["generator"])
                self.assertIn("generatedFiles", manifest)
                self.assertTrue((base / "src" / "types" / "existing-type.ts").exists())
                self.assertFalse((base / "src" / "types" / "legacy-type.ts").exists())
                self.assertIn("export type { ExistingType } from './existing-type';", source)
                self.assertNotIn("legacy-type", source)
                self.assertIn(base / "src" / "types" / "legacy-type.ts", updated)
                self.assertIn(base / "src" / "types" / "index.ts", updated)

    def test_normalizes_generated_union_array_type_precedence(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for sdk_dir, package_name in (
                ("clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk"),
                ("clawrouter-backend-sdk", "@sdkwork/clawrouter-backend-sdk"),
            ):
                base = root / "sdks" / sdk_dir
                (base / "src" / "types").mkdir(parents=True, exist_ok=True)
                (base / "package.json").write_text(
                    json.dumps({"name": package_name}) + "\n",
                    encoding="utf-8",
                )
                (base / "src" / "types" / "request.ts").write_text(
                    "export interface Request {\n"
                    "  modalities?: 'text' | 'image' | 'video' | 'audio' | 'music'[];\n"
                    "  retryableStatusCodes: 408 | 409 | 425 | 429 | 500 | 502 | 503 | 504[];\n"
                    "  passthrough?: string | null;\n"
                    "  alreadyCorrect?: ('a' | 'b')[];\n"
                    "}\n",
                    encoding="utf-8",
                )

            SdkRuntimeStandardizer(root=root).run()

            for sdk_dir in ("clawrouter-app-sdk", "clawrouter-backend-sdk"):
                source = (root / "sdks" / sdk_dir / "src" / "types" / "request.ts").read_text(encoding="utf-8")
                self.assertIn("modalities?: ('text' | 'image' | 'video' | 'audio' | 'music')[];", source)
                self.assertIn("retryableStatusCodes: (408 | 409 | 425 | 429 | 500 | 502 | 503 | 504)[];", source)
                self.assertIn("passthrough?: string | null;", source)
                self.assertIn("alreadyCorrect?: ('a' | 'b')[];", source)

    def test_removes_generated_trailing_whitespace(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for sdk_dir, package_name in (
                ("clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk"),
                ("clawrouter-backend-sdk", "@sdkwork/clawrouter-backend-sdk"),
            ):
                base = root / "sdks" / sdk_dir
                (base / "src" / "api").mkdir(parents=True, exist_ok=True)
                (base / "src" / "http").mkdir(parents=True, exist_ok=True)
                (base / "src" / "types").mkdir(parents=True, exist_ok=True)
                (base / "package.json").write_text(
                    json.dumps({"name": package_name}) + "\n",
                    encoding="utf-8",
                )
                (base / "src" / "api" / "index.ts").write_text(
                    "export { ExampleApi } from './example';\n",
                    encoding="utf-8",
                )
                (base / "src" / "api" / "example.ts").write_text(
                    "export class ExampleApi { \n  constructor() { \n  } \n}\n",
                    encoding="utf-8",
                )
                (base / "src" / "http" / "client.ts").write_text(
                    "export class HttpClient { \n}\n",
                    encoding="utf-8",
                )

            SdkRuntimeStandardizer(root=root).run()

            for sdk_dir in ("clawrouter-app-sdk", "clawrouter-backend-sdk"):
                base = root / "sdks" / sdk_dir
                for relative in ("src/api/example.ts", "src/http/client.ts"):
                    source = (base / relative).read_text(encoding="utf-8")
                    self.assertNotRegex(source, r"[ \t]+(?=\n)")

    def test_preserves_exported_router_api_artifacts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for sdk_dir, package_name in (
                ("clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk"),
                ("clawrouter-backend-sdk", "@sdkwork/clawrouter-backend-sdk"),
            ):
                base = root / "sdks" / sdk_dir
                (base / "src" / "api").mkdir(parents=True, exist_ok=True)
                (base / "dist" / "api").mkdir(parents=True, exist_ok=True)
                (base / "package.json").write_text(
                    json.dumps({"name": package_name}) + "\n",
                    encoding="utf-8",
                )
                (base / "src" / "api" / "index.ts").write_text(
                    "export { RouterApi } from './router';\n",
                    encoding="utf-8",
                )
                (base / "src" / "api" / "router.ts").write_text(
                    "export class RouterApi {}\n",
                    encoding="utf-8",
                )
                (base / "dist" / "api" / "router.d.ts").write_text(
                    "export declare class RouterApi {}\n",
                    encoding="utf-8",
                )
                (base / "dist" / "api" / "router.d.ts.map").write_text(
                    "{}\n",
                    encoding="utf-8",
                )

            updated = SdkRuntimeStandardizer(root=root).run()

            for sdk_dir in ("clawrouter-app-sdk", "clawrouter-backend-sdk"):
                base = root / "sdks" / sdk_dir
                self.assertTrue((base / "src" / "api" / "router.ts").exists())
                self.assertTrue((base / "dist" / "api" / "router.d.ts").exists())
                self.assertTrue((base / "dist" / "api" / "router.d.ts.map").exists())
                self.assertNotIn(base / "src" / "api" / "router.ts", updated)
                self.assertNotIn(base / "dist" / "api" / "router.d.ts", updated)

    def test_removes_unexported_generated_api_artifacts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            for sdk_dir, package_name, exported_name, stale_name in (
                ("clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk", "coupons", "coupon"),
                ("clawrouter-backend-sdk", "@sdkwork/clawrouter-backend-sdk", "provider-secrets", "provider-secret"),
            ):
                base = root / "sdks" / sdk_dir
                (base / "src" / "api").mkdir(parents=True, exist_ok=True)
                (base / "dist" / "api").mkdir(parents=True, exist_ok=True)
                (base / "package.json").write_text(
                    json.dumps({"name": package_name}) + "\n",
                    encoding="utf-8",
                )
                (base / "src" / "api" / "index.ts").write_text(
                    f"export {{ ExampleApi }} from './{exported_name}';\n",
                    encoding="utf-8",
                )
                for name in ("base", "paths", exported_name, stale_name):
                    (base / "src" / "api" / f"{name}.ts").write_text(
                        "export {};\n",
                        encoding="utf-8",
                    )
                    (base / "dist" / "api" / f"{name}.d.ts").write_text(
                        "export {};\n",
                        encoding="utf-8",
                    )
                    (base / "dist" / "api" / f"{name}.d.ts.map").write_text(
                        "{}\n",
                        encoding="utf-8",
                    )

            SdkRuntimeStandardizer(root=root).run()

            for sdk_dir, exported_name, stale_name in (
                ("clawrouter-app-sdk", "coupons", "coupon"),
                ("clawrouter-backend-sdk", "provider-secrets", "provider-secret"),
            ):
                base = root / "sdks" / sdk_dir
                self.assertTrue((base / "src" / "api" / f"{exported_name}.ts").exists())
                self.assertTrue((base / "dist" / "api" / f"{exported_name}.d.ts").exists())
                self.assertFalse((base / "src" / "api" / f"{stale_name}.ts").exists())
                self.assertFalse((base / "dist" / "api" / f"{stale_name}.d.ts").exists())
                self.assertFalse((base / "dist" / "api" / f"{stale_name}.d.ts.map").exists())


if __name__ == "__main__":
    unittest.main()
