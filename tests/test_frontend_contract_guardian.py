import hashlib
import json
import tempfile
import textwrap
import unittest
from pathlib import Path

from tools.frontend_contract_guardian import FrontendContractGuardian


class FrontendContractGuardianTest(unittest.TestCase):
    def write_app(self, root: Path, content: str) -> Path:
        app = root / "apps" / "sdkwork-claw-router-portal" / "src" / "App.tsx"
        app.parent.mkdir(parents=True, exist_ok=True)
        app.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        self.write_standard_sdk_client_boundary(root)
        return app

    def write_manifest(self, root: Path, manifest: dict) -> Path:
        path = root / "generated" / "schema" / "manifest" / "schema-manifest.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        return path

    def write_contract(self, root: Path, content: str) -> Path:
        path = root / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return path

    def write_catalog_source(self, root: Path, relative_path: str, content: str) -> str:
        path = root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return "sha256:" + hashlib.sha256(path.read_bytes()).hexdigest()

    def write_route_classification(self, root: Path, content: str) -> Path:
        path = root / "docs" / "schema-registry" / "frontend-route-classification.yaml"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return path

    def write_static_source_manifest(self, root: Path, manifest: dict) -> Path:
        path = root / "generated" / "schema" / "frontend" / "frontend-static-source-manifest.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
        return path

    def write_vite_config(self, root: Path, content: str) -> Path:
        path = root / "apps" / "sdkwork-claw-router-portal" / "vite.config.ts"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return path

    def write_portal_package(self, root: Path, content: str) -> Path:
        path = root / "apps" / "sdkwork-claw-router-portal" / "package.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return path

    def write_portal_build_script(self, root: Path, content: str) -> Path:
        path = root / "apps" / "sdkwork-claw-router-portal" / "scripts" / "build-portal.mjs"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return path

    def write_portal_source(self, root: Path, relative_path: str, content: str) -> Path:
        path = root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(textwrap.dedent(content).strip() + "\n", encoding="utf-8")
        return path

    def write_standard_sdk_client_boundary(self, root: Path) -> Path:
        self.write_standard_runtime_env(root)
        path = (
            root
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
            / "sdk-clients.ts"
        )
        if path.exists():
            return path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            textwrap.dedent(
                """
                import { SdkworkAppClient } from '@sdkwork/clawrouter-app-sdk';
                import { SdkworkBackendClient } from '@sdkwork/clawrouter-backend-sdk';
                import { normalizeGeneratedSdkBaseUrl } from './sdk-base-url';

                const APP_API_PREFIX = '/app/v3/api';
                const BACKEND_API_PREFIX = '/backend/v3/api';

                export interface ClawRouterAppSdkClientOptions {
                  appBaseUrl?: string;
                  authToken?: string;
                  platform?: string;
                  timeout?: number;
                }

                export interface ClawRouterBackendSdkClientOptions {
                  backendBaseUrl?: string;
                  authToken?: string;
                  platform?: string;
                  timeout?: number;
                }

                export function getClawRouterAppSdkClient(options: ClawRouterAppSdkClientOptions = {}) {
                  return new SdkworkAppClient({
                    baseUrl: normalizeGeneratedSdkBaseUrl(options.appBaseUrl ?? APP_API_PREFIX, APP_API_PREFIX),
                    authToken: options.authToken,
                    platform: options.platform,
                    timeout: options.timeout,
                  });
                }

                export function getClawRouterBackendSdkClient(options: ClawRouterBackendSdkClientOptions = {}) {
                  return new SdkworkBackendClient({
                    baseUrl: normalizeGeneratedSdkBaseUrl(options.backendBaseUrl ?? BACKEND_API_PREFIX, BACKEND_API_PREFIX),
                    authToken: options.authToken,
                    platform: options.platform,
                    timeout: options.timeout,
                  });
                }
                """
            ).strip()
            + "\n",
            encoding="utf-8",
        )
        return path

    def write_standard_runtime_env(self, root: Path) -> Path:
        path = (
            root
            / "apps"
            / "sdkwork-claw-router-portal"
            / "packages"
            / "sdkwork-claw-router-commons"
            / "src"
            / "utils"
            / "env.ts"
        )
        if path.exists():
            return path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(
            textwrap.dedent(
                """
                type ClawRouterRuntimeWindow = Window & {
                  __CLAWROUTER_ENV__?: Record<string, unknown>;
                };

                const DEFAULT_API_BASE_URL = '/v1';

                export function readClawRouterRuntimeEnv(name: string): string | undefined {
                  if (typeof window === 'undefined') {
                    return undefined;
                  }
                  const value = (window as ClawRouterRuntimeWindow).__CLAWROUTER_ENV__?.[name];
                  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
                }

                export const API_BASE_URL = DEFAULT_API_BASE_URL;
                """
            ).strip()
            + "\n",
            encoding="utf-8",
        )
        return path

    def test_extracts_actual_routes_from_nested_portal_routes(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/models" element={<Models />} />
                  <Route path="/console" element={<ConsoleLayout />}>
                    <Route index element={<Navigate to="/console/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardView />} />
                    <Route path="api-keys" element={<ApiKeysView />} />
                  </Route>
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="ratelimit" element={<RateLimitAdmin />} />
                  </Route>
                  <Route path="*" element={<MainLayout />} />
                </Routes>
                """,
            )

            routes = FrontendContractGuardian(root=root).extract_portal_routes()

            self.assertEqual(
                ["/", "/admin/ratelimit", "/console/api-keys", "/console/dashboard", "/models"],
                routes,
            )

    def test_browser_source_files_ignore_dependency_and_build_artifact_directories(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/demo/src/service.ts",
                "export const value = 1;",
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/demo/node_modules/sdkwork-code-generator/src/index.ts",
                "import 'sdkwork-code-generator';",
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/demo/dist/bundle.ts",
                "import 'sdkwork-code-generator';",
            )

            files = FrontendContractGuardian(root=root)._browser_source_files(
                root / "apps" / "sdkwork-claw-router-portal"
            )

            self.assertEqual(
                ["apps/sdkwork-claw-router-portal/packages/demo/src/service.ts"],
                [path.relative_to(root).as_posix() for path in files],
            )

    def test_reports_frontend_route_missing_from_manifest(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/models" element={<Models />} />
                </Routes>
                """,
            )
            self.write_manifest(root, {"routes": {"/": {"tables": ["content_doc_page"]}}, "tables": []})
            self.write_contract(root, "routes: []")

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("frontend route missing from schema manifest: /models", result.messages)

    def test_reports_actual_route_without_field_contract(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/models" element={<Models />} />')
            self.write_manifest(root, {"routes": {"/models": {"tables": ["ai_model_vendor"]}}, "tables": []})
            self.write_contract(root, "routes: []")

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("frontend route missing field contract: /models", result.messages)

    def test_reports_required_route_tables_and_columns(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/console/account" element={<AccountView />} />')
            self.write_manifest(
                root,
                {
                    "routes": {"/console/account": {"tables": ["plus_user"]}},
                    "tables": [
                        {
                            "table": "ai_usage_fact",
                            "columns": [{"name": "modality"}],
                        }
                    ],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /console/account
                    required_tables:
                      - ai_usage_fact
                    required_columns:
                      ai_usage_fact: [modality, customer_charge_amount]
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("route /console/account requires table ai_usage_fact", result.messages)
            self.assertIn(
                "table ai_usage_fact requires column customer_charge_amount for route /console/account",
                result.messages,
            )

    def test_accepts_required_physical_columns_for_legacy_tables(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/apps" element={<AppCenter />} />')
            self.write_manifest(
                root,
                {
                    "routes": {"/apps": {"tables": ["plus_app"]}},
                    "tables": [
                        {
                            "table": "plus_app",
                            "columns": [],
                            "physical_columns": {"own": ["name", "resource_list", "release_notes"]},
                        }
                    ],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /apps
                    required_tables: [plus_app]
                    required_columns:
                      plus_app: [name, resource_list, release_notes]
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_reports_node_only_codegen_import_from_browser_source(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/api-reference" element={<ApiReference />} />')
            self.write_manifest(root, {"routes": {"/api-reference": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /api-reference\n")
            component = (
                root
                / "apps"
                / "sdkwork-claw-router-portal"
                / "packages"
                / "sdkwork-claw-router-api-reference"
                / "src"
                / "components"
                / "ApiEndpointView.tsx"
            )
            component.parent.mkdir(parents=True, exist_ok=True)
            component.write_text("import { CodeGeneratorFactory } from 'sdkwork-code-generator';\n", encoding="utf-8")

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "browser source must not import node-only package sdkwork-code-generator: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx",
                result.messages,
            )

    def test_reports_static_route_module_imports_from_app_entry(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                import React from 'react';
                import { Home } from 'sdkwork-claw-router-home';
                const Models = React.lazy(() => import('sdkwork-claw-router-models').then((module) => ({ default: module.Models })));
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/models" element={<Models />} />
                </Routes>
                """,
            )
            self.write_manifest(root, {"routes": {"/": {"tables": []}, "/models": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n  - route: /models\n")

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal App.tsx must lazy-load route package import sdkwork-claw-router-home instead of static import",
                result.messages,
            )

    def test_reports_missing_vite_manual_chunks(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_vite_config(
                root,
                """
                export default defineConfig({
                  build: {
                    target: 'esnext',
                  },
                });
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal Vite config must define rollupOptions.output.manualChunks for production chunk boundaries",
                result.messages,
            )

    def test_reports_vite_manual_chunks_without_local_route_package_boundary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_vite_config(
                root,
                """
                export default defineConfig({
                  build: {
                    rollupOptions: {
                      output: {
                        manualChunks(id) {
                          if (!id.includes('node_modules')) {
                            return undefined;
                          }
                          return 'vendor';
                        },
                      },
                    },
                  },
                });
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal Vite manualChunks must split local sdkwork-claw-router route packages before generic vendor chunks",
                result.messages,
            )

    def test_accepts_vite_manual_chunks_with_local_route_package_boundary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_vite_config(
                root,
                """
                const LOCAL_ROUTE_PACKAGE_PATTERN = /sdkwork-claw-router-/;

                export default defineConfig({
                  build: {
                    rollupOptions: {
                      output: {
                        manualChunks(id) {
                          const normalizedId = id.replaceAll('\\\\', '/');
                          const routePackageMatch = normalizedId.match(LOCAL_ROUTE_PACKAGE_PATTERN);
                          if (routePackageMatch) {
                            return routePackageMatch.groups?.packageName;
                          }
                          if (!id.includes('node_modules')) {
                            return undefined;
                          }
                          return 'vendor';
                        },
                      },
                    },
                  },
                });
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_reports_forbidden_portal_node_server_files(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            path = root / "apps" / "sdkwork-claw-router-portal" / "server.ts"
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text("export const server = true;\n", encoding="utf-8")

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal Node server runtime is forbidden; serve portal static and forwarding through Rust edge server: server.ts",
                result.messages,
            )

    def test_reports_portal_scripts_that_reference_node_server_runtime(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_package(
                root,
                """
                {
                  "scripts": {
                    "dev": "node --experimental-strip-types server.ts",
                    "browser:dev": "node --experimental-strip-types server.ts",
                    "build": "vite build && node scripts/build-server.mjs",
                    "start": "node dist/server.mjs"
                  }
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal package scripts must not reference server.ts, dist/server.mjs, build-server.mjs, or smoke-production-server.mjs",
                result.messages,
            )
            self.assertIn(
                "portal dev and browser:dev scripts must run Vite directly with native config loading",
                result.messages,
            )

    def test_reports_portal_build_script_that_builds_node_server(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_package(
                root,
                """
                {
                  "scripts": {
                    "dev": "vite",
                    "browser:dev": "vite",
                    "build": "node scripts/build-portal.mjs"
                  }
                }
                """,
            )
            self.write_portal_build_script(
                root,
                """
                process.env.NODE_ENV = "production";

                const { build } = await import("vite");
                const { buildServer } = await import("./build-server.mjs");

                await build({ configLoader: "native" });
                await buildServer();
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal build script must build only Vite portal artifacts and must not build a Node server",
                result.messages,
            )

    def test_accepts_vite_only_portal_scripts_and_build(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_package(
                root,
                """
                {
                  "scripts": {
                    "dev": "vite --configLoader native",
                    "browser:dev": "vite --configLoader native",
                    "build": "node scripts/build-portal.mjs",
                    "start": "node ../../scripts/start-claw-router-production.mjs"
                  }
                }
                """,
            )
            self.write_portal_build_script(
                root,
                """
                process.env.NODE_ENV = "production";

                const { build } = await import("vite");

                await build({ configLoader: "native" });
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_reports_missing_generated_sdk_client_boundary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            boundary = (
                root
                / "apps"
                / "sdkwork-claw-router-portal"
                / "packages"
                / "sdkwork-claw-router-commons"
                / "src"
                / "sdk-clients.ts"
            )
            boundary.unlink()

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal SDK client boundary is missing: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/sdk-clients.ts",
                result.messages,
            )

    def test_reports_sdk_client_boundary_without_generated_sdk_construction(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/sdk-clients.ts",
                "export function getClawRouterAppSdkClient() { return {}; }",
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "sdkwork-claw-router-commons/src/sdk-clients.ts must construct generated app and backend SDK clients",
                result.messages,
            )

    def test_reports_sdk_client_boundary_with_manual_auth_escape_hatches(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/sdk-clients.ts",
                """
                import { SdkworkAppClient } from '@sdkwork/clawrouter-app-sdk';
                import { SdkworkBackendClient } from '@sdkwork/clawrouter-backend-sdk';
                import { normalizeGeneratedSdkBaseUrl } from './sdk-base-url';

                export interface ClawRouterSdkClientOptions {
                  baseUrl?: string;
                  appBaseUrl?: string;
                  backendBaseUrl?: string;
                  apiKey?: string;
                  authToken?: string;
                  accessToken?: string;
                  platform?: string;
                  timeout?: number;
                  headers?: Record<string, string>;
                }

                const APP_API_PREFIX = '/app/v3/api';
                const BACKEND_API_PREFIX = '/backend/v3/api';

                export function getClawRouterAppSdkClient() {
                  return new SdkworkAppClient({
                    baseUrl: normalizeGeneratedSdkBaseUrl('/app/v3/api', APP_API_PREFIX),
                  });
                }

                export function getClawRouterBackendSdkClient() {
                  return new SdkworkBackendClient({
                    baseUrl: normalizeGeneratedSdkBaseUrl('/backend/v3/api', BACKEND_API_PREFIX),
                  });
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "sdkwork-claw-router-commons/src/sdk-clients.ts must expose separate app/backend SDK option types without manual auth/header/baseUrl escape hatches",
                result.messages,
            )

    def test_reports_external_runtime_api_base_url_defaults(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/utils/env.ts",
                """
                const DEFAULT_API_BASE_URL = 'https://api.sdkwork.com';
                export const API_BASE_URL = DEFAULT_API_BASE_URL;
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal runtime API base URL defaults must stay same-origin and must not fall back to external domains",
                result.messages,
            )

    def test_reports_generated_sdk_import_outside_commons_boundary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                """
                import { SdkworkAppClient } from '@sdkwork/clawrouter-app-sdk';

                export const client = new SdkworkAppClient({ baseUrl: '/app/v3/api' });
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal packages must value-import generated SDK clients only from sdkwork-claw-router-commons/src/sdk-clients.ts: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts "
                "imports @sdkwork/clawrouter-app-sdk",
                result.messages,
            )
            self.assertIn(
                "portal packages must construct generated SDK clients only in sdkwork-claw-router-commons/src/sdk-clients.ts: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                result.messages,
            )

    def test_accepts_type_only_generated_sdk_imports_outside_commons_boundary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                """
                import type { AppDashboardSummary } from '@sdkwork/clawrouter-app-sdk';
                import { getClawRouterAppSdkClient, readApiRecord } from 'sdkwork-claw-router-commons/runtime';

                export async function loadDashboard(): Promise<AppDashboardSummary | undefined> {
                  const result = await getClawRouterAppSdkClient().dashboard.fetchDashboardData();
                  return readApiRecord(result) as AppDashboardSummary;
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_reports_business_service_that_reads_generated_sdk_result_data_directly(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                """
                import { getClawRouterAppSdkClient } from 'sdkwork-claw-router-commons/runtime';

                export async function loadDashboard() {
                  const result = await getClawRouterAppSdkClient().router.fetchDashboardOverview();
                  return result.data;
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal business service files must read generated SDK results through "
                "sdkwork-claw-router-commons/runtime helpers instead of result.data: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                result.messages,
            )

    def test_reports_business_api_prefix_outside_commons_boundary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                """
                export const appBaseUrl = '/app/v3/api';
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal business API prefixes must be isolated to sdkwork-claw-router-commons/src/sdk-clients.ts: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                result.messages,
            )

    def test_reports_raw_fetch_in_business_source(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                """
                export async function loadDashboard() {
                  return fetch('/dashboard');
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal remote business calls must go through service -> generated SDK clients, not raw fetch/axios/XMLHttpRequest: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                result.messages,
            )

    def test_reports_raw_axios_in_business_source(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-user/src/userService.ts",
                """
                import axios from 'axios';

                export async function loadUsers() {
                  return axios.get('/users');
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal remote business calls must go through service -> generated SDK clients, not raw fetch/axios/XMLHttpRequest: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-user/src/userService.ts",
                result.messages,
            )

    def test_accepts_business_service_that_uses_commons_sdk_client(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                """
                import { getClawRouterAppSdkClient } from 'sdkwork-claw-router-commons/runtime';

                export async function loadDashboard() {
                  return getClawRouterAppSdkClient().dashboard.fetchDashboardData();
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_accepts_business_service_that_uses_generated_sdk_fetch_method(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-announcement/src/announcementService.ts",
                """
                import { getClawRouterBackendSdkClient } from 'sdkwork-claw-router-commons/runtime';

                export async function loadAnnouncements() {
                  return getClawRouterBackendSdkClient().announcements.fetch();
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_reports_business_service_that_imports_commons_ui_root(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                """
                import { ensurePlusApiSuccess, getClawRouterAppSdkClient } from 'sdkwork-claw-router-commons';

                export async function loadDashboard() {
                  const result = await getClawRouterAppSdkClient().router.fetchDashboardOverview();
                  ensurePlusApiSuccess(result, 'failed');
                  return result;
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal business service files must import runtime helpers from "
                "sdkwork-claw-router-commons/runtime instead of the commons UI root: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts",
                result.messages,
            )

    def test_reports_browser_source_that_imports_runtime_symbols_from_commons_ui_root(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx",
                """
                import { API_BASE_URL, CopyButton, resolveClawRouterRuntimeBoolean } from 'sdkwork-claw-router-commons';

                export function ApiEndpointView() {
                  return <CopyButton text={API_BASE_URL} />;
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal browser source must import runtime helpers from sdkwork-claw-router-commons/runtime "
                "instead of the commons UI root: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx "
                "imports API_BASE_URL, resolveClawRouterRuntimeBoolean",
                result.messages,
            )

    def test_accepts_browser_source_that_splits_ui_and_runtime_commons_imports(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx",
                """
                import { CopyButton } from 'sdkwork-claw-router-commons';
                import { API_BASE_URL, resolveClawRouterRuntimeBoolean } from 'sdkwork-claw-router-commons/runtime';

                const enabled = resolveClawRouterRuntimeBoolean('VITE_TOOL_API_ENABLED', false);

                export function ApiEndpointView() {
                  return <CopyButton text={enabled ? API_BASE_URL : ''} />;
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_reports_commons_ui_root_that_reexports_runtime_modules(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/index.ts",
                """
                export * from './components/CopyButton';
                export * from './sdk-clients';
                export * from './utils/env';
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "sdkwork-claw-router-commons root must not re-export runtime modules; use "
                "sdkwork-claw-router-commons/runtime for runtime helpers: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/index.ts "
                "exports ./sdk-clients, ./utils/env",
                result.messages,
            )

    def test_reports_admin_service_manual_session_token_reads(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/" element={<Home />} />')
            self.write_manifest(root, {"routes": {"/": {"tables": []}}, "tables": []})
            self.write_contract(root, "routes:\n  - route: /\n")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-user/src/userService.ts",
                """
                import { getClawRouterBackendSdkClient, getStoredAppSessionToken } from 'sdkwork-claw-router-commons';

                export async function loadUsers() {
                  const token = getStoredAppSessionToken();
                  return getClawRouterBackendSdkClient({ authToken: token }).user.fetchUsers();
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal admin services must let sdkwork-claw-router-commons/src/sdk-clients.ts inject session tokens: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-admin-user/src/userService.ts",
                result.messages,
            )

    def test_reports_random_business_facts_in_contracted_frontend_model_source(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/console/dashboard" element={<Dashboard />} />')
            self.write_manifest(
                root,
                {
                    "routes": {"/console/dashboard": {"tables": ["ai_usage_fact"]}},
                    "tables": [{"table": "ai_usage_fact", "columns": [{"name": "request_count"}]}],
                },
            )
            source_path = (
                "apps/sdkwork-claw-router-portal/packages/"
                "sdkwork-claw-router-console-dashboard/src/dashboardService.ts"
            )
            self.write_contract(
                root,
                f"""
                frontend_models:
                  - route: /console/dashboard
                    source: {source_path}
                    interface: DashboardData
                    fields: [requests]
                    data_sources: [ai_usage_fact]
                routes:
                  - route: /console/dashboard
                    required_tables: [ai_usage_fact]
                    required_columns:
                      ai_usage_fact: [request_count]
                """,
            )
            self.write_portal_source(
                root,
                source_path,
                """
                export function getDashboardData() {
                  return [{ requests: Math.floor(Math.random() * 1000) }];
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "frontend model source apps/sdkwork-claw-router-portal/packages/"
                "sdkwork-claw-router-console-dashboard/src/dashboardService.ts "
                "must not generate business facts with Math.random",
                result.messages,
            )

    def test_reports_actual_route_without_route_classification(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                <Routes>
                  <Route path="/models" element={<Models />} />
                  <Route path="/console/dashboard" element={<Dashboard />} />
                </Routes>
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/models": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["ai_model"],
                        },
                        "/console/dashboard": {
                            "required_api_surface": "app",
                            "route_scope": "console",
                            "tables": ["ai_usage_fact"],
                        },
                    },
                    "tables": [
                        {"table": "ai_model", "columns": [{"name": "model"}]},
                        {"table": "ai_usage_fact", "columns": [{"name": "request_count"}]},
                    ],
                },
            )
            self.write_contract(
                root,
                """
                frontend_operations:
                  - route: /console/dashboard
                    source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts
                    operation: fetchDashboardOverview
                    api_surface: app
                routes:
                  - route: /models
                    required_tables: [ai_model]
                  - route: /console/dashboard
                    required_tables: [ai_usage_fact]
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /models
                    package: sdkwork-claw-router-models
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [ai_model]
                    evidence: [generated/schema/manifest/schema-manifest.json]
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "frontend route missing delivery classification: /console/dashboard",
                result.messages,
            )

    def test_reports_missing_route_classification_when_required(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/models" element={<Models />} />')
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/models": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["ai_model"],
                        },
                    },
                    "tables": [{"table": "ai_model", "columns": [{"name": "model"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /models
                    required_tables: [ai_model]
                """,
            )

            result = FrontendContractGuardian(root=root, require_route_classification=True).run()

            self.assertFalse(result.ok)
            self.assertIn("frontend route classification registry is missing", result.messages)

    def test_reports_sdk_runtime_classification_without_matching_operation_contract(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/console/dashboard" element={<Dashboard />} />')
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/console/dashboard": {
                            "required_api_surface": "app",
                            "route_scope": "console",
                            "tables": ["ai_usage_fact"],
                        },
                    },
                    "tables": [{"table": "ai_usage_fact", "columns": [{"name": "request_count"}]}],
                },
            )
            self.write_contract(
                root,
                """
                frontend_operations: []
                routes:
                  - route: /console/dashboard
                    required_tables: [ai_usage_fact]
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /console/dashboard
                    package: sdkwork-claw-router-console-dashboard
                    owner: customer-console
                    route_scope: console
                    delivery_kind: sdk_backed_business_runtime
                    api_surface: app
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/dashboardService.ts
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "sdk-backed route /console/dashboard must declare at least one app frontend operation contract",
                result.messages,
            )

    def test_reports_route_classification_evidence_that_does_not_exist(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const Models = lazyRoute(() => import('sdkwork-claw-router-models'), 'Models');
                <Route path="/models" element={<Models />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/models": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["ai_model"],
                        },
                    },
                    "tables": [{"table": "ai_model", "columns": [{"name": "model"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /models
                    required_tables: [ai_model]
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /models
                    package: sdkwork-claw-router-models
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [ai_model]
                    evidence:
                      - docs/schema-registry/missing-model-evidence.yaml
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "frontend route /models classification evidence does not exist: "
                "docs/schema-registry/missing-model-evidence.yaml",
                result.messages,
            )

    def test_reports_route_classification_package_that_differs_from_app_lazy_route_package(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const Models = lazyRoute(() => import('sdkwork-claw-router-models'), 'Models');
                <Route path="/models" element={<Models />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/models": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["ai_model"],
                        },
                    },
                    "tables": [{"table": "ai_model", "columns": [{"name": "model"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /models
                    required_tables: [ai_model]
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /models
                    package: sdkwork-claw-router-home
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [ai_model]
                    evidence:
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "frontend route /models classification package must match App.tsx lazy route package "
                "sdkwork-claw-router-models",
                result.messages,
            )

    def test_reports_schema_content_package_with_runtime_network_call(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const Models = lazyRoute(() => import('sdkwork-claw-router-models'), 'Models');
                <Route path="/models" element={<Models />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/models": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["ai_model"],
                        },
                    },
                    "tables": [{"table": "ai_model", "columns": [{"name": "model"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /models
                    required_tables: [ai_model]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/runtime.ts",
                """
                export async function loadModels() {
                  return fetch('/app/v3/api/models');
                }
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /models
                    package: sdkwork-claw-router-models
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [ai_model]
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/runtime.ts
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "schema content route /models package sdkwork-claw-router-models must not contain runtime network client usage: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/runtime.ts",
                result.messages,
            )

    def test_reports_schema_content_without_static_delivery_policy(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const Models = lazyRoute(() => import('sdkwork-claw-router-models'), 'Models');
                <Route path="/models" element={<Models />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/models": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["ai_model"],
                        },
                    },
                    "tables": [{"table": "ai_model", "columns": [{"name": "model"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /models
                    required_tables: [ai_model]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/data/models.ts",
                """
                export const modelCatalog = [];
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /models
                    package: sdkwork-claw-router-models
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [ai_model]
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/data/models.ts
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "schema content route /models must declare static_delivery",
                result.messages,
            )

    def test_reports_schema_content_with_invalid_static_delivery_policy(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const Models = lazyRoute(() => import('sdkwork-claw-router-models'), 'Models');
                <Route path="/models" element={<Models />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/models": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["ai_model"],
                        },
                    },
                    "tables": [{"table": "ai_model", "columns": [{"name": "model"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /models
                    required_tables: [ai_model]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/data/models.ts",
                """
                export const modelCatalog = [];
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /models
                    package: sdkwork-claw-router-models
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [ai_model]
                    static_delivery:
                      mode: runtime_catalog
                      refresh_policy: live_query
                      max_staleness: never_stale
                      upgrade_triggers: [unknown_trigger]
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/data/models.ts
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "schema content route /models static_delivery.mode must be one of "
                "curated_seed_content, generated_reference_snapshot, published_catalog_snapshot",
                result.messages,
            )
            self.assertIn(
                "schema content route /models static_delivery.refresh_policy must be one of "
                "manual_content_release, scheduled_snapshot_import, schema_registry_regeneration",
                result.messages,
            )
            self.assertIn(
                "schema content route /models static_delivery.max_staleness must be one of "
                "daily_snapshot, release_bound, weekly_snapshot",
                result.messages,
            )
            self.assertIn(
                "schema content route /models static_delivery upgrade trigger unknown_trigger is not approved",
                result.messages,
            )

    def test_reports_curated_seed_content_without_source_manifest_ref(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const Courses = lazyRoute(() => import('sdkwork-claw-router-courses'), 'Courses');
                <Route path="/courses" element={<Courses />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/courses": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_course", "content_course_relation"],
                        },
                    },
                    "tables": [
                        {"table": "content_course", "columns": [{"name": "title"}]},
                        {"table": "content_course_relation", "columns": [{"name": "course_id"}]},
                    ],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /courses
                    required_tables: [content_course]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-courses/src/data.ts",
                """
                export const courseCatalog = [];
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /courses
                    package: sdkwork-claw-router-courses
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [content_course, content_course_relation]
                    static_delivery:
                      mode: curated_seed_content
                      refresh_policy: manual_content_release
                      max_staleness: release_bound
                      upgrade_triggers: [authoring_workflow]
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-courses/src/data.ts
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "schema content route /courses curated seed static_delivery must declare source_manifest_ref",
                result.messages,
            )

    def test_reports_static_delivery_with_inline_source_metadata(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source_hash = self.write_catalog_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-courses/src/data.ts",
                """
                export const courseCatalog = [];
                """,
            )
            self.write_app(
                root,
                """
                const Courses = lazyRoute(() => import('sdkwork-claw-router-courses'), 'Courses');
                <Route path="/courses" element={<Courses />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/courses": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_course"],
                        },
                    },
                    "tables": [{"table": "content_course", "columns": [{"name": "title"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /courses
                    required_tables: [content_course]
                """,
            )
            self.write_static_source_manifest(
                root,
                {
                    "schema": "sdkwork-claw-router-frontend-static-source-manifest",
                    "version": 1,
                    "snapshots": {
                        "static-route:/courses": {
                            "id": "static-route:/courses",
                            "route": "/courses",
                            "mode": "curated_seed_content",
                            "source_ref": "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-courses/src/data.ts",
                            "observed_at": "2026-05-03",
                            "source_hash": source_hash,
                            "schema_tables": ["content_course"],
                        }
                    },
                },
            )
            self.write_route_classification(
                root,
                f"""
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /courses
                    package: sdkwork-claw-router-courses
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [content_course]
                    static_delivery:
                      mode: curated_seed_content
                      refresh_policy: manual_content_release
                      max_staleness: release_bound
                      upgrade_triggers: [authoring_workflow]
                      source_manifest_ref: "static-route:/courses"
                      source_metadata:
                        source_ref: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-courses/src/data.ts
                        observed_at: "2026-05-03"
                        source_hash: {source_hash}
                        schema_tables: [content_course]
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-courses/src/data.ts
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "schema content route /courses curated seed static_delivery must use source_manifest_ref instead of inline source_metadata",
                result.messages,
            )

    def test_reports_missing_static_source_manifest(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const Courses = lazyRoute(() => import('sdkwork-claw-router-courses'), 'Courses');
                <Route path="/courses" element={<Courses />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/courses": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_course"],
                        },
                    },
                    "tables": [{"table": "content_course", "columns": [{"name": "title"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /courses
                    required_tables: [content_course]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-courses/src/data.ts",
                """
                export const courseCatalog = [];
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /courses
                    package: sdkwork-claw-router-courses
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [content_course]
                    static_delivery:
                      mode: curated_seed_content
                      refresh_policy: manual_content_release
                      max_staleness: release_bound
                      upgrade_triggers: [authoring_workflow]
                      source_manifest_ref: "static-route:/courses"
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-courses/src/data.ts
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertTrue(
                any(message.startswith("frontend static source manifest is missing:") for message in result.messages),
                result.messages,
            )

    def test_reports_generated_reference_source_manifest_with_mismatched_hash(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const Docs = lazyRoute(() => import('sdkwork-claw-router-api-reference'), 'Docs');
                <Route path="/docs" element={<Docs />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/docs": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_doc_page", "content_openapi_snapshot"],
                        },
                    },
                    "tables": [
                        {"table": "content_doc_page", "columns": [{"name": "slug"}]},
                        {"table": "content_openapi_snapshot", "columns": [{"name": "version"}]},
                    ],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /docs
                    required_tables: [content_doc_page]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/pages/Docs.tsx",
                """
                export function Docs() {
                  return null;
                }
                """,
            )
            self.write_static_source_manifest(
                root,
                {
                    "schema": "sdkwork-claw-router-frontend-static-source-manifest",
                    "version": 1,
                    "snapshots": {
                        "static-route:/docs": {
                            "id": "static-route:/docs",
                            "route": "/docs",
                            "mode": "generated_reference_snapshot",
                            "source_ref": "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/pages/Docs.tsx",
                            "observed_at": "2026-05-03",
                            "source_hash": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
                            "schema_tables": ["content_doc_page", "content_openapi_snapshot"],
                        }
                    },
                },
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /docs
                    package: sdkwork-claw-router-api-reference
                    owner: developer-experience
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [content_doc_page, content_openapi_snapshot]
                    static_delivery:
                      mode: generated_reference_snapshot
                      refresh_policy: schema_registry_regeneration
                      max_staleness: release_bound
                      upgrade_triggers: [authoring_workflow]
                      source_manifest_ref: "static-route:/docs"
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/pages/Docs.tsx
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "schema content route /docs generated reference static source manifest source_hash must match source_ref content",
                result.messages,
            )

    def test_reports_published_catalog_snapshot_without_source_manifest_ref(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const Models = lazyRoute(() => import('sdkwork-claw-router-models'), 'Models');
                <Route path="/models" element={<Models />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/models": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["ai_model"],
                        },
                    },
                    "tables": [{"table": "ai_model", "columns": [{"name": "model"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /models
                    required_tables: [ai_model]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/data/models.ts",
                """
                export const modelCatalog = [];
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /models
                    package: sdkwork-claw-router-models
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [ai_model]
                    static_delivery:
                      mode: published_catalog_snapshot
                      refresh_policy: scheduled_snapshot_import
                      max_staleness: daily_snapshot
                      upgrade_triggers: [provider_availability]
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/data/models.ts
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "schema content route /models published catalog static_delivery must declare source_manifest_ref",
                result.messages,
            )

    def test_reports_published_catalog_source_manifest_with_unprovenanced_schema_table(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            source_hash = self.write_catalog_source(
                root,
                "docs/schema-registry/catalog-source.yaml",
                """
                tables:
                  - ai_model
                  - ai_model_secret
                """,
            )
            self.write_app(
                root,
                """
                const Models = lazyRoute(() => import('sdkwork-claw-router-models'), 'Models');
                <Route path="/models" element={<Models />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/models": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["ai_model"],
                        },
                    },
                    "tables": [{"table": "ai_model", "columns": [{"name": "model"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /models
                    required_tables: [ai_model]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/data/models.ts",
                """
                export const modelCatalog = [];
                """,
            )
            self.write_static_source_manifest(
                root,
                {
                    "schema": "sdkwork-claw-router-frontend-static-source-manifest",
                    "version": 1,
                    "snapshots": {
                        "static-route:/models": {
                            "id": "static-route:/models",
                            "route": "/models",
                            "mode": "published_catalog_snapshot",
                            "source_ref": "docs/schema-registry/catalog-source.yaml",
                            "observed_at": "2026-05-03",
                            "source_hash": source_hash,
                            "schema_tables": ["ai_model", "ai_model_secret"],
                        }
                    },
                },
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /models
                    package: sdkwork-claw-router-models
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [ai_model]
                    static_delivery:
                      mode: published_catalog_snapshot
                      refresh_policy: scheduled_snapshot_import
                      max_staleness: daily_snapshot
                      upgrade_triggers: [provider_availability]
                      source_manifest_ref: "static-route:/models"
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/data/models.ts
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "schema content route /models published catalog static source manifest schema table "
                "ai_model_secret is not in provenance_tables",
                result.messages,
            )

    def test_reports_published_catalog_source_manifest_with_invalid_audit_fields(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_catalog_source(
                root,
                "docs/schema-registry/catalog-source.yaml",
                """
                tables:
                  - ai_model
                """,
            )
            self.write_app(
                root,
                """
                const Models = lazyRoute(() => import('sdkwork-claw-router-models'), 'Models');
                <Route path="/models" element={<Models />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/models": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["ai_model"],
                        },
                    },
                    "tables": [{"table": "ai_model", "columns": [{"name": "model"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /models
                    required_tables: [ai_model]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/data/models.ts",
                """
                export const modelCatalog = [];
                """,
            )
            self.write_static_source_manifest(
                root,
                {
                    "schema": "sdkwork-claw-router-frontend-static-source-manifest",
                    "version": 1,
                    "snapshots": {
                        "static-route:/models": {
                            "id": "static-route:/models",
                            "route": "/models",
                            "mode": "published_catalog_snapshot",
                            "source_ref": "docs/schema-registry/catalog-source.yaml",
                            "observed_at": "05/03/2026",
                            "source_hash": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
                            "schema_tables": [],
                        }
                    },
                },
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /models
                    package: sdkwork-claw-router-models
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [ai_model]
                    static_delivery:
                      mode: published_catalog_snapshot
                      refresh_policy: scheduled_snapshot_import
                      max_staleness: daily_snapshot
                      upgrade_triggers: [provider_availability]
                      source_manifest_ref: "static-route:/models"
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-models/src/data/models.ts
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "schema content route /models published catalog static source manifest observed_at must be an ISO date or datetime",
                result.messages,
            )
            self.assertIn(
                "schema content route /models published catalog static source manifest source_hash must match source_ref content",
                result.messages,
            )
            self.assertIn(
                "schema content route /models published catalog static source manifest must declare schema_tables",
                result.messages,
            )

    def test_accepts_schema_content_package_with_runtime_network_word_only_in_comment(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const ForumView = lazyRoute(() => import('sdkwork-claw-router-forum'), 'ForumView');
                <Route path="/forum" element={<ForumView />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/forum": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_forum_post"],
                        },
                    },
                    "tables": [{"table": "content_forum_post", "columns": [{"name": "title"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /forum
                    required_tables: [content_forum_post]
                """,
            )
            source_hash = self.write_catalog_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-forum/src/ForumView.tsx",
                """
                // In a future backend-backed app this page would fetch forum posts.
                export function ForumView() {
                  return null;
                }
                """,
            )
            self.write_static_source_manifest(
                root,
                {
                    "schema": "sdkwork-claw-router-frontend-static-source-manifest",
                    "version": 1,
                    "snapshots": {
                        "static-route:/forum": {
                            "id": "static-route:/forum",
                            "route": "/forum",
                            "mode": "curated_seed_content",
                            "source_ref": "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-forum/src/ForumView.tsx",
                            "observed_at": "2026-05-03",
                            "source_hash": source_hash,
                            "schema_tables": ["content_forum_post"],
                        }
                    },
                },
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /forum
                    package: sdkwork-claw-router-forum
                    owner: public-portal
                    route_scope: public
                    delivery_kind: schema_provenanced_content
                    provenance_tables: [content_forum_post]
                    static_delivery:
                      mode: curated_seed_content
                      refresh_policy: manual_content_release
                      max_staleness: release_bound
                      upgrade_triggers: [authoring_workflow]
                      source_manifest_ref: "static-route:/forum"
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-forum/src/ForumView.tsx
                      - generated/schema/manifest/schema-manifest.json
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_reports_local_tool_api_classification_without_env_gate(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/api-reference" element={<ApiReference />} />')
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/api-reference": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_openapi_snapshot"],
                        },
                    },
                    "tables": [{"table": "content_openapi_snapshot", "columns": [{"name": "api_system"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /api-reference
                    required_tables: [content_openapi_snapshot]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts",
                """
                export async function generate() {
                  await fetch('/api/code-snippet');
                }
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx",
                """
                export function ApiEndpointView() {
                  return null;
                }
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /api-reference
                    package: sdkwork-claw-router-api-reference
                    owner: developer-experience
                    route_scope: public
                    delivery_kind: local_developer_tool_api
                    tool_endpoints: [/api/code-snippet]
                    source_files:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                    gate_sources:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "local tool route /api-reference must declare browser_env VITE_TOOL_API_ENABLED",
                result.messages,
            )
            self.assertIn(
                "local tool route /api-reference must declare runtime_env PORTAL_PUBLIC_TOOL_API_ENABLED",
                result.messages,
            )
            self.assertIn(
                "local tool route /api-reference gate source "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx "
                "must read VITE_TOOL_API_ENABLED through resolveClawRouterRuntimeBoolean",
                result.messages,
            )

    def test_reports_local_tool_api_classification_without_all_browser_network_sources(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const ApiReference = lazyRoute(() => import('sdkwork-claw-router-api-reference'), 'ApiReference');
                <Route path="/api-reference" element={<ApiReference />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/api-reference": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_openapi_snapshot"],
                        },
                    },
                    "tables": [{"table": "content_openapi_snapshot", "columns": [{"name": "api_system"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /api-reference
                    required_tables: [content_openapi_snapshot]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/pages/ApiReference.tsx",
                """
                export async function loadSpec() {
                  return fetch('/openapi.json');
                }
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiPlayground.tsx",
                """
                import { resolveClawRouterRuntimeBoolean } from 'sdkwork-claw-router-commons';
                const enabled = resolveClawRouterRuntimeBoolean('VITE_TOOL_API_ENABLED', false);
                export async function send(request: { url: string; requestInit: RequestInit }) {
                  return fetch(request.url, request.requestInit);
                }
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts",
                """
                export async function generate() {
                  return fetch('/api/code-snippet');
                }
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /api-reference
                    package: sdkwork-claw-router-api-reference
                    owner: developer-experience
                    route_scope: public
                    delivery_kind: local_developer_tool_api
                    browser_env: VITE_TOOL_API_ENABLED
                    runtime_env: PORTAL_PUBLIC_TOOL_API_ENABLED
                    tool_endpoints: [/api/code-snippet]
                    source_files:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                    gate_sources:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiPlayground.tsx
                    browser_network_sources:
                      - endpoint: /api/code-snippet
                        source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                        purpose: local_tool_api
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiPlayground.tsx
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "local tool route /api-reference must declare browser_network_sources entry "
                "external_runtime_request|apps/sdkwork-claw-router-portal/packages/"
                "sdkwork-claw-router-api-reference/src/components/ApiPlayground.tsx",
                result.messages,
            )
            self.assertIn(
                "local tool route /api-reference must declare browser_network_sources entry "
                "/openapi.json|apps/sdkwork-claw-router-portal/packages/"
                "sdkwork-claw-router-api-reference/src/pages/ApiReference.tsx",
                result.messages,
            )

    def test_accepts_local_tool_api_generated_code_snippet_fetch_strings(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const ApiReference = lazyRoute(() => import('sdkwork-claw-router-api-reference'), 'ApiReference');
                <Route path="/api-reference" element={<ApiReference />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/api-reference": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_openapi_snapshot"],
                        },
                    },
                    "tables": [{"table": "content_openapi_snapshot", "columns": [{"name": "api_system"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /api-reference
                    required_tables: [content_openapi_snapshot]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts",
                """
                export function buildSnippet(url: string) {
                  return `const response = await fetch("${url}", { method: "GET" });`;
                }
                export async function generate() {
                  return fetch('/api/code-snippet');
                }
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx",
                """
                import { resolveClawRouterRuntimeBoolean } from 'sdkwork-claw-router-commons/runtime';
                const enabled = resolveClawRouterRuntimeBoolean('VITE_TOOL_API_ENABLED', false);
                export function ApiEndpointView() {
                  return null;
                }
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /api-reference
                    package: sdkwork-claw-router-api-reference
                    owner: developer-experience
                    route_scope: public
                    delivery_kind: local_developer_tool_api
                    browser_env: VITE_TOOL_API_ENABLED
                    runtime_env: PORTAL_PUBLIC_TOOL_API_ENABLED
                    tool_endpoints: [/api/code-snippet]
                    source_files:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                    gate_sources:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx
                    browser_network_sources:
                      - endpoint: /api/code-snippet
                        source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                        purpose: local_tool_api
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_accepts_local_tool_api_schema_tabs_manifest_fetch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const ApiReference = lazyRoute(() => import('sdkwork-claw-router-api-reference'), 'ApiReference');
                <Route path="/api-reference" element={<ApiReference />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/api-reference": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_openapi_snapshot"],
                        },
                    },
                    "tables": [{"table": "content_openapi_snapshot", "columns": [{"name": "api_system"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /api-reference
                    required_tables: [content_openapi_snapshot]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/apiReferenceSchemaTabs.ts",
                """
                const API_SCHEMA_TABS_URL = '/openapi/schema-tabs.json';
                async function defaultFetchJson(url: string): Promise<unknown> {
                  return fetch(url);
                }
                export async function loadTabs() {
                  return defaultFetchJson(API_SCHEMA_TABS_URL);
                }
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts",
                """
                export async function generate() {
                  return fetch('/api/code-snippet');
                }
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx",
                """
                import { resolveClawRouterRuntimeBoolean } from 'sdkwork-claw-router-commons/runtime';
                const enabled = resolveClawRouterRuntimeBoolean('VITE_TOOL_API_ENABLED', false);
                export function ApiEndpointView() {
                  return null;
                }
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /api-reference
                    package: sdkwork-claw-router-api-reference
                    owner: developer-experience
                    route_scope: public
                    delivery_kind: local_developer_tool_api
                    browser_env: VITE_TOOL_API_ENABLED
                    runtime_env: PORTAL_PUBLIC_TOOL_API_ENABLED
                    tool_endpoints: [/api/code-snippet]
                    source_files:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                    gate_sources:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx
                    browser_network_sources:
                      - endpoint: external_runtime_request
                        source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/apiReferenceSchemaTabs.ts
                        purpose: local_openapi_snapshot
                      - endpoint: /api/code-snippet
                        source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                        purpose: local_tool_api
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/apiReferenceSchemaTabs.ts
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_reports_local_tool_api_browser_network_source_with_invalid_purpose(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const ApiReference = lazyRoute(() => import('sdkwork-claw-router-api-reference'), 'ApiReference');
                <Route path="/api-reference" element={<ApiReference />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/api-reference": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_openapi_snapshot"],
                        },
                    },
                    "tables": [{"table": "content_openapi_snapshot", "columns": [{"name": "api_system"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /api-reference
                    required_tables: [content_openapi_snapshot]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/pages/ApiReference.tsx",
                """
                export async function loadSpec() {
                  return fetch('/openapi.json');
                }
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiPlayground.tsx",
                """
                import { resolveClawRouterRuntimeBoolean } from 'sdkwork-claw-router-commons';
                const enabled = resolveClawRouterRuntimeBoolean('VITE_TOOL_API_ENABLED', false);
                export async function send(request: { url: string; requestInit: RequestInit }) {
                  return fetch(request.url, request.requestInit);
                }
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts",
                """
                export async function generate() {
                  return fetch('/api/code-snippet');
                }
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /api-reference
                    package: sdkwork-claw-router-api-reference
                    owner: developer-experience
                    route_scope: public
                    delivery_kind: local_developer_tool_api
                    browser_env: VITE_TOOL_API_ENABLED
                    runtime_env: PORTAL_PUBLIC_TOOL_API_ENABLED
                    tool_endpoints: [/api/code-snippet]
                    source_files:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                    gate_sources:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiPlayground.tsx
                    browser_network_sources:
                      - endpoint: /openapi.json
                        source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/pages/ApiReference.tsx
                        purpose: local_tool_api
                      - endpoint: /api/code-snippet
                        source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                        purpose: explicit_api_playground_request
                      - endpoint: external_runtime_request
                        source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiPlayground.tsx
                        purpose: local_tool_api
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/pages/ApiReference.tsx
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiPlayground.tsx
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "local tool route /api-reference browser_network_sources entry "
                "/openapi.json|apps/sdkwork-claw-router-portal/packages/"
                "sdkwork-claw-router-api-reference/src/pages/ApiReference.tsx "
                "must use purpose local_openapi_snapshot",
                result.messages,
            )
            self.assertIn(
                "local tool route /api-reference browser_network_sources entry "
                "/api/code-snippet|apps/sdkwork-claw-router-portal/packages/"
                "sdkwork-claw-router-api-reference/src/codeSnippetClient.ts "
                "must use purpose local_tool_api",
                result.messages,
            )
            self.assertIn(
                "local tool route /api-reference browser_network_sources entry "
                "external_runtime_request|apps/sdkwork-claw-router-portal/packages/"
                "sdkwork-claw-router-api-reference/src/components/ApiPlayground.tsx "
                "must use purpose explicit_api_playground_request",
                result.messages,
            )

    def test_reports_external_runtime_browser_source_outside_api_playground(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(
                root,
                """
                const ApiReference = lazyRoute(() => import('sdkwork-claw-router-api-reference'), 'ApiReference');
                <Route path="/api-reference" element={<ApiReference />} />
                """,
            )
            self.write_manifest(
                root,
                {
                    "routes": {
                        "/api-reference": {
                            "required_api_surface": "app",
                            "route_scope": "public",
                            "tables": ["content_openapi_snapshot"],
                        },
                    },
                    "tables": [{"table": "content_openapi_snapshot", "columns": [{"name": "api_system"}]}],
                },
            )
            self.write_contract(
                root,
                """
                routes:
                  - route: /api-reference
                    required_tables: [content_openapi_snapshot]
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx",
                """
                import { resolveClawRouterRuntimeBoolean } from 'sdkwork-claw-router-commons';
                const enabled = resolveClawRouterRuntimeBoolean('VITE_TOOL_API_ENABLED', false);
                export async function send(request: { url: string; requestInit: RequestInit }) {
                  return fetch(request.url, request.requestInit);
                }
                """,
            )
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts",
                """
                export async function generate() {
                  return fetch('/api/code-snippet');
                }
                """,
            )
            self.write_route_classification(
                root,
                """
                schema: sdkwork-claw-router-frontend-route-classification
                source: apps/sdkwork-claw-router-portal/src/App.tsx
                routes:
                  - route: /api-reference
                    package: sdkwork-claw-router-api-reference
                    owner: developer-experience
                    route_scope: public
                    delivery_kind: local_developer_tool_api
                    browser_env: VITE_TOOL_API_ENABLED
                    runtime_env: PORTAL_PUBLIC_TOOL_API_ENABLED
                    tool_endpoints: [/api/code-snippet]
                    source_files:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                    gate_sources:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx
                    browser_network_sources:
                      - endpoint: /api/code-snippet
                        source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                        purpose: local_tool_api
                      - endpoint: external_runtime_request
                        source: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx
                        purpose: explicit_api_playground_request
                    evidence:
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/codeSnippetClient.ts
                      - apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "local tool route /api-reference external runtime browser source "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-api-reference/src/components/ApiEndpointView.tsx "
                "must be isolated in an ApiPlayground component or the API reference schema-tabs loader",
                result.messages,
            )

    def test_ignores_random_ui_helpers_outside_contracted_frontend_model_sources(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_app(root, '<Route path="/console/dashboard" element={<Dashboard />} />')
            self.write_manifest(
                root,
                {
                    "routes": {"/console/dashboard": {"tables": ["ai_usage_fact"]}},
                    "tables": [{"table": "ai_usage_fact", "columns": [{"name": "request_count"}]}],
                },
            )
            source_path = (
                "apps/sdkwork-claw-router-portal/packages/"
                "sdkwork-claw-router-console-dashboard/src/dashboardService.ts"
            )
            self.write_contract(
                root,
                f"""
                frontend_models:
                  - route: /console/dashboard
                    source: {source_path}
                    interface: DashboardData
                    fields: [requests]
                    data_sources: [ai_usage_fact]
                routes:
                  - route: /console/dashboard
                    required_tables: [ai_usage_fact]
                    required_columns:
                      ai_usage_fact: [request_count]
                """,
            )
            self.write_portal_source(root, source_path, "export const requests = 42;")
            self.write_portal_source(
                root,
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-console-dashboard/src/sparkline.ts",
                """
                export function jitter() {
                  return Math.random();
                }
                """,
            )

            result = FrontendContractGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_portal_business_services_use_generated_sdk_client_mount_names(self) -> None:
        root = Path(__file__).resolve().parents[1]
        source_roots = [
            root / "apps" / "sdkwork-claw-router-portal" / "packages",
            root / "apps" / "sdkwork-claw-router-portal" / "src",
        ]
        forbidden_mounts = (
            ".announcements.",
            ".providerSecrets.",
            ".accessGroups.",
            ".rateLimits.",
            ".firewall.",
            ".couponBatches.",
            ".couponCodes.",
            ".referrals.",
            ".monitor.",
            ".users.",
            ".modelVendors.",
            ".models.",
            ".coupons.",
            ".payments.",
            ".skills.",
        )

        guardian = FrontendContractGuardian(root=root)
        for source_root in source_roots:
            for path in guardian._browser_source_files(source_root):
                if path.suffix not in {".ts", ".tsx"}:
                    continue
                try:
                    path = path.resolve()
                    path.relative_to(source_root.resolve())
                except ValueError:
                    continue
                text = path.read_text(encoding="utf-8")
                if "getClawRouterAppSdkClient()" not in text and "getClawRouterBackendSdkClient()" not in text:
                    continue
                with self.subTest(path=path.relative_to(root).as_posix()):
                    for mount in forbidden_mounts:
                        self.assertNotIn(mount, text)

if __name__ == "__main__":
    unittest.main()
