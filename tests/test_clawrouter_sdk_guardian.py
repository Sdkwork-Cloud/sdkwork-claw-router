import json
import tempfile
import unittest
from pathlib import Path

from tools.clawrouter_sdk_guardian import ClawRouterSdkGuardian


class ClawRouterSdkGuardianTest(unittest.TestCase):
    def write_sdk(
        self,
        root: Path,
        sdk_dir: str,
        package_name: str,
        sdk_type: str,
        client_name: str,
        api_prefix: str,
        *,
        write_dist: bool = True,
    ) -> None:
        base = root / "sdks" / sdk_dir
        (base / "src" / "api").mkdir(parents=True, exist_ok=True)
        (base / "src" / "types").mkdir(parents=True, exist_ok=True)
        (base / "src").mkdir(parents=True, exist_ok=True)
        (base / ".sdkwork").mkdir(parents=True, exist_ok=True)
        (base / "custom").mkdir(parents=True, exist_ok=True)
        (base / "package.json").write_text(
            json.dumps(
                {
                    "name": package_name,
                    "version": "0.1.0",
                    "main": "./dist/index.cjs",
                    "module": "./dist/index.js",
                    "types": "./dist/index.d.ts",
                    "exports": {
                        ".": {
                            "types": "./dist/index.d.ts",
                            "import": "./dist/index.js",
                            "require": "./dist/index.cjs",
                        }
                    },
                    "scripts": {
                        "build": "node custom/build-runtime.mjs",
                        "dev": "node custom/build-runtime.mjs",
                        "prepublishOnly": "npm run build",
                    },
                    "devDependencies": {
                        "@types/node": "^20.0.0",
                        "rollup": "^4.0.0",
                        "typescript": "^5.3.0",
                    },
                }
            )
            + "\n",
            encoding="utf-8",
        )
        (base / "sdkwork-sdk.json").write_text(
            json.dumps({"language": "typescript", "sdkType": sdk_type, "name": sdk_dir}) + "\n",
            encoding="utf-8",
        )
        (base / "README.md").write_text(f"# {package_name}\n", encoding="utf-8")
        (base / "custom" / "README.md").write_text("custom code lives here\n", encoding="utf-8")
        (base / "custom" / "build-runtime.mjs").write_text("console.log('build');\n", encoding="utf-8")
        (base / ".sdkwork" / "sdkwork-generator-manifest.json").write_text("{}\n", encoding="utf-8")
        (base / "src" / "sdk.ts").write_text(f"export class {client_name} {{}}\n", encoding="utf-8")
        (base / "src" / "api" / "index.ts").write_text("export {};\n", encoding="utf-8")
        (base / "src" / "api" / "paths.ts").write_text(api_prefix + "\n", encoding="utf-8")
        type_exports: list[str] = []
        if sdk_dir == "clawrouter-app-sdk":
            (base / "src" / "types" / "app-model-catalog-price-availability.ts").write_text(
                "export interface AppModelCatalogPriceAvailability {\n"
                "  reason?: string | null;\n"
                "  status: 'reference' | 'unavailable';\n"
                "}\n",
                encoding="utf-8",
            )
            (base / "src" / "types" / "app-model-catalog-item.ts").write_text(
                "import type { AppModelCatalogPriceAvailability } from './app-model-catalog-price-availability';\n\n"
                "export interface AppModelCatalogItem {\n"
                "  capabilities: string[];\n"
                "  displayName: string;\n"
                "  model: string;\n"
                "  officialReferenceUnitPrice?: string | null;\n"
                "  priceAvailability: AppModelCatalogPriceAvailability;\n"
                "  providerCodes: string[];\n"
                "  vendor: string;\n"
                "  vendorCode: string;\n"
                "}\n",
                encoding="utf-8",
            )
            type_exports.extend(
                [
                    "export type { AppModelCatalogItem } from './app-model-catalog-item';",
                    "export type { AppModelCatalogPriceAvailability } from './app-model-catalog-price-availability';",
                ]
            )
        (base / "src" / "types" / "index.ts").write_text(
            "\n".join(type_exports) + "\n" if type_exports else "export {};\n",
            encoding="utf-8",
        )
        if write_dist:
            (base / "dist").mkdir(parents=True, exist_ok=True)
            (base / "dist" / "index.js").write_text("export {};\n", encoding="utf-8")
            (base / "dist" / "index.cjs").write_text('"use strict";\n', encoding="utf-8")
            (base / "dist" / "index.d.ts").write_text("export {};\n", encoding="utf-8")

    def write_portal_sdk_boundary(self, root: Path) -> None:
        portal = root / "apps" / "sdkwork-claw-router-portal"
        commons = portal / "packages" / "sdkwork-claw-router-commons"
        (commons / "src").mkdir(parents=True, exist_ok=True)
        (portal / "package.json").write_text(
            json.dumps(
                {
                    "dependencies": {
                        "@sdkwork/clawrouter-app-sdk": "file:../../sdks/clawrouter-app-sdk",
                        "@sdkwork/clawrouter-backend-sdk": "file:../../sdks/clawrouter-backend-sdk",
                    }
                }
            )
            + "\n",
            encoding="utf-8",
        )
        (commons / "package.json").write_text(
            json.dumps(
                {
                    "dependencies": {
                        "@sdkwork/clawrouter-app-sdk": "file:../../../../sdks/clawrouter-app-sdk",
                        "@sdkwork/clawrouter-backend-sdk": "file:../../../../sdks/clawrouter-backend-sdk",
                    }
                }
            )
            + "\n",
            encoding="utf-8",
        )
        (commons / "src" / "index.ts").write_text("export * from './components/CopyButton';\n", encoding="utf-8")
        (commons / "src" / "runtime.ts").write_text("export * from './sdk-clients.ts';\n", encoding="utf-8")
        (commons / "src" / "sdk-clients.ts").write_text(
            "import { SdkworkAppClient } from '@sdkwork/clawrouter-app-sdk';\n"
            "import { SdkworkBackendClient } from '@sdkwork/clawrouter-backend-sdk';\n"
            "export function createClawRouterAppSdkClient() { return new SdkworkAppClient({ baseUrl: '' }); }\n"
            "export function createClawRouterBackendSdkClient() { return new SdkworkBackendClient({ baseUrl: '' }); }\n",
            encoding="utf-8",
        )

    def test_accepts_project_generated_app_and_backend_sdks(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(
                root,
                "clawrouter-app-sdk",
                "@sdkwork/clawrouter-app-sdk",
                "app",
                "SdkworkAppClient",
                "/app/v3/api",
            )
            self.write_sdk(
                root,
                "clawrouter-backend-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "backend",
                "SdkworkBackendClient",
                "/backend/v3/api",
            )
            self.write_portal_sdk_boundary(root)

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertTrue(result.ok, result.messages)

    def test_reports_missing_sdk_and_wrong_package_name(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(root, "clawrouter-app-sdk", "@sdkwork/wrong", "app", "SdkworkAppClient", "/app/v3/api")
            self.write_portal_sdk_boundary(root)

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("clawrouter-app-sdk package.json name must be @sdkwork/clawrouter-app-sdk", result.messages)
            self.assertIn(f"generated SDK is missing: {root / 'sdks' / 'clawrouter-backend-sdk'}", result.messages)

    def test_reports_wrong_sdk_type_client_and_prefix(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(root, "clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk", "backend", "WrongClient", "/wrong")
            self.write_sdk(
                root,
                "clawrouter-backend-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "backend",
                "SdkworkBackendClient",
                "/backend/v3/api",
            )
            self.write_portal_sdk_boundary(root)

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("clawrouter-app-sdk sdkwork-sdk.json sdkType must be app", result.messages)
            self.assertIn("clawrouter-app-sdk src/sdk.ts must export SdkworkAppClient", result.messages)
            self.assertIn("clawrouter-app-sdk src/api/paths.ts must contain /app/v3/api", result.messages)

    def test_reports_missing_runtime_export_artifacts(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(
                root,
                "clawrouter-app-sdk",
                "@sdkwork/clawrouter-app-sdk",
                "app",
                "SdkworkAppClient",
                "/app/v3/api",
                write_dist=False,
            )
            self.write_sdk(
                root,
                "clawrouter-backend-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "backend",
                "SdkworkBackendClient",
                "/backend/v3/api",
                write_dist=False,
            )
            self.write_portal_sdk_boundary(root)

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("clawrouter-app-sdk package.json main points to missing file: dist/index.cjs", result.messages)
            self.assertIn("clawrouter-app-sdk package.json module points to missing file: dist/index.js", result.messages)
            self.assertIn("clawrouter-app-sdk package.json types points to missing file: dist/index.d.ts", result.messages)
            self.assertIn("clawrouter-backend-sdk package.json exports[.].require points to missing file: dist/index.cjs", result.messages)

    def test_reports_unexported_generated_api_artifact(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(root, "clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk", "app", "SdkworkAppClient", "/app/v3/api")
            self.write_sdk(
                root,
                "clawrouter-backend-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "backend",
                "SdkworkBackendClient",
                "/backend/v3/api",
            )
            app = root / "sdks" / "clawrouter-app-sdk"
            (app / "src" / "api" / "index.ts").write_text(
                "export { CouponsApi } from './coupons';\n",
                encoding="utf-8",
            )
            (app / "src" / "api" / "base.ts").write_text("export {};\n", encoding="utf-8")
            (app / "src" / "api" / "paths.ts").write_text("/app/v3/api\n", encoding="utf-8")
            (app / "src" / "api" / "coupons.ts").write_text("export class CouponsApi {}\n", encoding="utf-8")
            (app / "src" / "api" / "coupon.ts").write_text("export class CouponApi {}\n", encoding="utf-8")
            self.write_portal_sdk_boundary(root)

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "clawrouter-app-sdk must not contain unexported generated API artifact: src/api/coupon.ts",
                result.messages,
            )

    def test_reports_generated_type_file_missing_from_type_index(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(root, "clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk", "app", "SdkworkAppClient", "/app/v3/api")
            self.write_sdk(
                root,
                "clawrouter-backend-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "backend",
                "SdkworkBackendClient",
                "/backend/v3/api",
            )
            backend_types = root / "sdks" / "clawrouter-backend-sdk" / "src" / "types"
            (backend_types / "index.ts").write_text(
                "export type { AdminSkillListResponse } from './admin-skill-list-response';\n",
                encoding="utf-8",
            )
            (backend_types / "admin-skill-list-response.ts").write_text(
                "export interface AdminSkillListResponse { items: Record<string, unknown>[]; }\n",
                encoding="utf-8",
            )
            (backend_types / "admin-skill-item.ts").write_text(
                "export interface AdminSkillItem { skillKey: string; }\n",
                encoding="utf-8",
            )
            self.write_portal_sdk_boundary(root)

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "clawrouter-backend-sdk src/types/index.ts must export AdminSkillItem from ./admin-skill-item",
                result.messages,
            )

    def test_reports_non_standard_sdk_build_script(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(root, "clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk", "app", "SdkworkAppClient", "/app/v3/api")
            self.write_sdk(
                root,
                "clawrouter-backend-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "backend",
                "SdkworkBackendClient",
                "/backend/v3/api",
            )
            app_package_path = root / "sdks" / "clawrouter-app-sdk" / "package.json"
            app_package = json.loads(app_package_path.read_text(encoding="utf-8"))
            app_package["scripts"]["build"] = "tsc --emitDeclarationOnly && vite build"
            app_package["scripts"]["dev"] = "vite build --watch"
            app_package["devDependencies"]["vite"] = "^7.0.0"
            app_package["devDependencies"]["vite-plugin-dts"] = "^4.0.0"
            app_package_path.write_text(json.dumps(app_package) + "\n", encoding="utf-8")
            (root / "sdks" / "clawrouter-app-sdk" / "custom" / "build-runtime.mjs").unlink()
            self.write_portal_sdk_boundary(root)

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("clawrouter-app-sdk package.json scripts.build must be node custom/build-runtime.mjs", result.messages)
            self.assertIn("clawrouter-app-sdk package.json scripts.dev must be node custom/build-runtime.mjs", result.messages)
            self.assertIn("clawrouter-app-sdk custom/build-runtime.mjs is required for SDK runtime builds", result.messages)
            self.assertIn("clawrouter-app-sdk package.json devDependencies must not include vite", result.messages)
            self.assertIn("clawrouter-app-sdk package.json devDependencies must not include vite-plugin-dts", result.messages)

    def test_reports_public_app_model_catalog_private_pricing_type_regression(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(root, "clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk", "app", "SdkworkAppClient", "/app/v3/api")
            self.write_sdk(
                root,
                "clawrouter-backend-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "backend",
                "SdkworkBackendClient",
                "/backend/v3/api",
            )
            app_types = root / "sdks" / "clawrouter-app-sdk" / "src" / "types"
            (app_types / "app-model-catalog-item.ts").write_text(
                "import type { AppModelCatalogPriceAvailability } from './app-model-catalog-price-availability';\n\n"
                "export interface AppModelCatalogItem {\n"
                "  model: string;\n"
                "  lowestUpstreamCostUnitPrice?: string | null;\n"
                "  priceAvailability: AppModelCatalogPriceAvailability;\n"
                "}\n",
                encoding="utf-8",
            )
            (app_types / "app-model-catalog-price-availability.ts").write_text(
                "export interface AppModelCatalogPriceAvailability {\n"
                "  status: 'available' | 'unavailable';\n"
                "  customerUnitPrice?: string | null;\n"
                "  grossMarginPerUnit?: string | null;\n"
                "  pricingPlanCode?: string | null;\n"
                "  groupCode?: string | null;\n"
                "}\n",
                encoding="utf-8",
            )
            self.write_portal_sdk_boundary(root)

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "clawrouter-app-sdk AppModelCatalogPriceAvailability.status must be 'reference' | 'unavailable'",
                result.messages,
            )
            self.assertIn(
                "clawrouter-app-sdk AppModelCatalogPriceAvailability.status must not expose public available",
                result.messages,
            )
            self.assertIn(
                "clawrouter-app-sdk AppModelCatalogItem must not expose public private pricing field lowestUpstreamCostUnitPrice",
                result.messages,
            )
            for sensitive_field in (
                "customerUnitPrice",
                "grossMarginPerUnit",
                "pricingPlanCode",
                "groupCode",
            ):
                self.assertIn(
                    "clawrouter-app-sdk AppModelCatalogPriceAvailability must not expose public private "
                    f"pricing field {sensitive_field}",
                    result.messages,
                )

    def test_reports_missing_portal_sdk_boundary(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(root, "clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk", "app", "SdkworkAppClient", "/app/v3/api")
            self.write_sdk(
                root,
                "clawrouter-backend-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "backend",
                "SdkworkBackendClient",
                "/backend/v3/api",
            )
            portal = root / "apps" / "sdkwork-claw-router-portal"
            commons = portal / "packages" / "sdkwork-claw-router-commons"
            commons.mkdir(parents=True, exist_ok=True)
            (portal / "package.json").write_text('{"dependencies":{}}\n', encoding="utf-8")
            (commons / "package.json").write_text('{"dependencies":{}}\n', encoding="utf-8")

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn("portal package.json must depend on @sdkwork/clawrouter-app-sdk", result.messages)
            self.assertIn("portal commons package.json must depend on @sdkwork/clawrouter-backend-sdk", result.messages)
            self.assertIn("portal SDK boundary is missing: apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/sdk-clients.ts", result.messages)

    def test_reports_portal_runtime_missing_sdk_client_export(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(root, "clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk", "app", "SdkworkAppClient", "/app/v3/api")
            self.write_sdk(
                root,
                "clawrouter-backend-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "backend",
                "SdkworkBackendClient",
                "/backend/v3/api",
            )
            self.write_portal_sdk_boundary(root)
            runtime_path = (
                root
                / "apps"
                / "sdkwork-claw-router-portal"
                / "packages"
                / "sdkwork-claw-router-commons"
                / "src"
                / "runtime.ts"
            )
            runtime_path.write_text("export * from './api-result.ts';\n", encoding="utf-8")

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal commons runtime must export ./sdk-clients.ts: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/runtime.ts",
                result.messages,
            )

    def test_reports_portal_ui_root_that_exports_sdk_clients(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_sdk(root, "clawrouter-app-sdk", "@sdkwork/clawrouter-app-sdk", "app", "SdkworkAppClient", "/app/v3/api")
            self.write_sdk(
                root,
                "clawrouter-backend-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "backend",
                "SdkworkBackendClient",
                "/backend/v3/api",
            )
            self.write_portal_sdk_boundary(root)
            index_path = (
                root
                / "apps"
                / "sdkwork-claw-router-portal"
                / "packages"
                / "sdkwork-claw-router-commons"
                / "src"
                / "index.ts"
            )
            index_path.write_text("export * from './components/CopyButton';\nexport * from './sdk-clients';\n", encoding="utf-8")

            result = ClawRouterSdkGuardian(root=root).run()

            self.assertFalse(result.ok)
            self.assertIn(
                "portal commons UI root must not export ./sdk-clients; use sdkwork-claw-router-commons/runtime: "
                "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/index.ts",
                result.messages,
            )


if __name__ == "__main__":
    unittest.main()
