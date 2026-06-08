import json
import re
import unittest
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
SPECS_ROOT = ROOT.parent / "sdkwork-specs"
PORTAL_ROOT = ROOT / "apps" / "sdkwork-clawrouter-pc"
SDK_CLIENTS = (
    PORTAL_ROOT
    / "packages"
    / "sdkwork-clawrouter-pc-commons"
    / "src"
    / "sdk-clients.ts"
)
IAM_RUNTIME = (
    PORTAL_ROOT
    / "packages"
    / "sdkwork-clawrouter-pc-commons"
    / "src"
    / "iam-runtime.ts"
)
DEPENDENCY_API_SURFACES = ROOT / "specs" / "dependency-api-surfaces.json"
PC_COMPONENT_SPEC = PORTAL_ROOT / "specs" / "component.spec.json"
COMMONS_COMPONENT_SPEC = (
    PORTAL_ROOT
    / "packages"
    / "sdkwork-clawrouter-pc-commons"
    / "specs"
    / "component.spec.json"
)
ADMIN_ORGANIZATION_COMPONENT_SPEC = (
    PORTAL_ROOT
    / "packages"
    / "sdkwork-clawrouter-pc-admin-organization"
    / "specs"
    / "component.spec.json"
)
ADMIN_USER_COMPONENT_SPEC = (
    PORTAL_ROOT
    / "packages"
    / "sdkwork-clawrouter-pc-admin-user"
    / "specs"
    / "component.spec.json"
)
APPBASE_IAM_HTTP = (
    ROOT.parent
    / "sdkwork-appbase"
    / "packages"
    / "native-rust"
    / "iam"
    / "sdkwork-iam-http-rust"
)
APPBASE_BACKEND_OPENAPI = (
    ROOT.parent
    / "sdkwork-appbase"
    / "sdks"
    / "sdkwork-appbase-backend-sdk"
    / "openapi"
    / "sdkwork-appbase-backend-api.sdkgen.yaml"
)
CLAWROUTER_BACKEND_OPENAPI = (
    ROOT
    / "sdks"
    / "clawrouter-backend-sdk"
    / "openapi"
    / "clawrouter-backend-sdk.sdkgen.json"
)
ADMIN_USER_SERVICE = (
    PORTAL_ROOT
    / "packages"
    / "sdkwork-clawrouter-pc-admin-user"
    / "src"
    / "userService.ts"
)
ADMIN_API_LIB = ROOT / "services" / "sdkwork-claw-admin-api" / "src" / "lib.rs"
PRODUCT_ADMIN_APPBASE_BACKEND_IAM = (
    ROOT
    / "services"
    / "sdkwork-claw-product"
    / "src"
    / "api"
    / "admin_appbase_backend_iam.rs"
)
PRODUCT_ADMIN_USER_API = (
    ROOT / "services" / "sdkwork-claw-product" / "src" / "api" / "admin_user.rs"
)
BACKEND_IAM_CONTRACT = (
    ROOT
    / "docs"
    / "schema-registry"
    / "frontend-field-contracts"
    / "operations"
    / "backend-iam.yaml"
)


def read_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def collect_sdk_dependencies() -> dict[tuple[str, str], dict[str, Any]]:
    dependencies: dict[tuple[str, str], dict[str, Any]] = {}
    for sdk_family in ["clawrouter-app-sdk", "clawrouter-backend-sdk"]:
        assembly = read_json(ROOT / "sdks" / sdk_family / ".sdkwork-assembly.json")
        for dependency in assembly.get("sdkDependencies", []):
            dependencies[(sdk_family, dependency["workspace"])] = dependency
    return dependencies


def entries_by_sdk_dependency(manifest: dict[str, Any]) -> dict[tuple[str, str], dict[str, Any]]:
    entries: dict[tuple[str, str], dict[str, Any]] = {}
    for entry in manifest.get("dependencies", []):
        key = (entry.get("consumerSdkFamily"), entry.get("workspace"))
        entries[key] = entry
    return entries


def sdk_clients_by_family(component_spec: dict[str, Any]) -> dict[str, dict[str, Any]]:
    clients: dict[str, dict[str, Any]] = {}
    for client in component_spec.get("contracts", {}).get("sdkClients", []):
        clients[client["sdkFamily"]] = client
    return clients


def sdk_clients_with_dependency_surfaces(component_spec: dict[str, Any]) -> list[dict[str, Any]]:
    return [
        client
        for client in component_spec.get("contracts", {}).get("sdkClients", [])
        if client.get("dependencyApiSurface")
    ]


def extract_function(source: str, name: str) -> str:
    match = re.search(rf"function {re.escape(name)}\([^)]*\).*?(?=\nfunction |\nexport function |\Z)", source, re.S)
    if not match:
        raise AssertionError(f"{name} not found")
    return match.group(0)


def normalize_openapi_path(path: str) -> str:
    return re.sub(r"\{[^}]+\}", "{}", path)


def operation_map(document: dict[str, Any], prefix: str) -> dict[tuple[str, str], dict[str, Any]]:
    operations: dict[tuple[str, str], dict[str, Any]] = {}
    for raw_path, path_item in document.get("paths", {}).items():
        if not raw_path.startswith(prefix):
            continue
        if not isinstance(path_item, dict):
            continue
        normalized_path = normalize_openapi_path(raw_path)
        for method, operation in path_item.items():
            if method.lower() not in {"get", "post", "put", "patch", "delete", "head", "options", "trace"}:
                continue
            if isinstance(operation, dict):
                operations[(method.upper(), normalized_path)] = operation
    return operations


class DependencyApiSurfaceStandardTest(unittest.TestCase):
    def test_root_specs_define_dependency_api_runtime_mount_boundaries(self) -> None:
        spec_expectations = {
            "SDK_SPEC.md": [
                "Dependency API Authority Export And Runtime Mount Boundaries",
                "dependencyApiSurfaces",
                "same-origin",
                "executable router",
                "Appbase backend-admin IAM dependency rule",
                "production-capable",
                "hard-coded tenant/user/organization/API-key data",
            ],
            "SDK_WORKSPACE_GENERATION_SPEC.md": [
                "dependencyApiSurfaces",
                "same-origin",
                "mount coverage",
            ],
            "APP_SDK_INTEGRATION_SPEC.md": [
                "Rust Backend Dependency API Composition",
                "Appbase Backend IAM Runtime Rule",
                "route contract",
                "executable router",
                "production-capable",
                "fake success handler",
            ],
            "CONFIG_SPEC.md": [
                "same-origin",
                "dependencySdkBaseUrls",
                "appbase backend-admin IAM",
                "mount coverage",
                "Demo routers",
            ],
            "WEB_BACKEND_SPEC.md": [
                "route metadata is not handler coverage",
                "dependencyApiSurfaces",
                "executable router",
                "@sdkwork/appbase-backend-sdk",
                "hard-coded IAM tenants/users/organizations/API keys",
            ],
            "TEST_SPEC.md": [
                "Dependency API surface",
                "same-origin",
                "Appbase backend IAM",
                "mount coverage",
                "demo rows",
            ],
        }

        for filename, markers in spec_expectations.items():
            source = read_text(SPECS_ROOT / filename)
            with self.subTest(filename=filename):
                for marker in markers:
                    self.assertIn(marker, source)

    def test_sdk_dependencies_have_runtime_api_surface_manifest_entries(self) -> None:
        manifest = read_json(DEPENDENCY_API_SURFACES)
        self.assertEqual(1, manifest["schemaVersion"])
        self.assertEqual("sdkwork.dependency-api-surfaces", manifest["kind"])
        self.assertEqual("sdkwork-claw-router", manifest["application"])

        sdk_dependencies = collect_sdk_dependencies()
        manifest_entries = entries_by_sdk_dependency(manifest)
        self.assertEqual(set(sdk_dependencies), set(manifest_entries))

        for key, dependency in sdk_dependencies.items():
            with self.subTest(sdkFamily=key[0], workspace=key[1]):
                entry = manifest_entries[key]
                self.assertEqual(dependency["apiPrefix"], entry["apiPrefix"])
                self.assertEqual(dependency["role"], entry["role"])
                self.assertEqual(dependency["dependencyMode"], entry["dependencyMode"])
                self.assertIn(entry["runtimeIntegration"]["mode"], {"same-origin-mounted", "external-service"})
                self.assertIsInstance(entry["runtimeIntegration"]["sameOriginAllowed"], bool)

    def test_backend_appbase_iam_dependency_is_verified_same_origin_mount(self) -> None:
        manifest = read_json(DEPENDENCY_API_SURFACES)
        backend_entry = entries_by_sdk_dependency(manifest)[
            ("clawrouter-backend-sdk", "sdkwork-appbase-backend-sdk")
        ]
        runtime = backend_entry["runtimeIntegration"]
        route_contract = runtime["rustRouteContractCrate"]
        coverage = runtime["mountCoverage"]

        self.assertEqual("backend-api", backend_entry["surface"])
        self.assertEqual("same-origin-mounted", runtime["mode"])
        self.assertTrue(runtime["sameOriginAllowed"])
        self.assertEqual("VITE_SDKWORK_APPBASE_BACKEND_API_BASE_URL", runtime["baseUrlEnv"])
        self.assertEqual("VITE_CLAWROUTER_BACKEND_API_BASE_URL", runtime["fallbackBaseUrlEnv"])
        self.assertEqual("PORTAL_PUBLIC_APPBASE_BACKEND_API_BASE_URL", runtime["publicBaseUrlEnv"])
        self.assertEqual("PORTAL_PUBLIC_SDK_BASE_URL", runtime["commonBaseUrlEnv"])
        self.assertNotIn("requiredBaseUrlEnv", runtime)
        self.assertEqual("verified", coverage["status"])
        self.assertGreater(len(coverage["evidence"]), 0)
        evidence_text = "\n".join(coverage["evidence"])
        self.assertIn("admin_appbase_backend_iam_api", evidence_text)
        self.assertIn("admin_user_route_serves_appbase_backend_iam_users_from_store", evidence_text)
        self.assertIn("appbase_backend_iam_routes_are_not_demo_mounted_without_database_runtime", evidence_text)
        self.assertIn("database_config_router_serves_backend_sdk_contract_aliases", evidence_text)
        self.assertIn("database_config_router_serves_appbase_backend_iam_from_real_sql_runtime", evidence_text)
        self.assertEqual("sdkwork_iam_http", route_contract["package"])
        self.assertEqual(["backend_routes"], route_contract["routeMetadataExports"])
        self.assertIsNone(route_contract["executableRouterExport"])
        handler_exports = {
            exported
            for adapter in runtime.get("handlerAdapterExports", [])
            for exported in adapter.get("exports", [])
        }
        self.assertIn(
            "admin_appbase_backend_iam_directory_router_with_read_store",
            handler_exports,
        )
        self.assertIn("AdminAppbaseBackendIamSqlReadStore", handler_exports)
        self.assertIn("admin_user_router_with_store", handler_exports)

        route_contract_root = (ROOT / route_contract["path"]).resolve()
        self.assertEqual(APPBASE_IAM_HTTP.resolve(), route_contract_root)
        route_source = read_text(route_contract_root / "src" / "sdkwork_appbase_backend_api.rs")
        self.assertIn("pub fn backend_routes()", route_source)
        self.assertIn('"/backend/v3/api/iam/organizations/tree"', route_source)
        self.assertIn('"/backend/v3/api/iam/roles"', route_source)

        admin_api_source = read_text(ADMIN_API_LIB)
        self.assertIn("admin_appbase_backend_iam_directory_router_with_read_store", admin_api_source)
        self.assertIn("appbase_backend_iam_sql_read_store", admin_api_source)
        self.assertNotIn("build_sdkwork_appbase_backend_api_router", admin_api_source)
        self.assertNotIn("appbase_backend_iam_router", admin_api_source)

        product_directory_source = read_text(PRODUCT_ADMIN_APPBASE_BACKEND_IAM)
        self.assertIn("AppIamDirectoryReadStore", product_directory_source)
        self.assertIn("FROM iam_role", product_directory_source)
        self.assertIn("FROM iam_permission", product_directory_source)
        self.assertIn("iam_role_permission", product_directory_source)
        self.assertIn("execute_sqlite_command", product_directory_source)
        self.assertIn("execute_postgres_command", product_directory_source)
        self.assertIn("iam_department_assignment", product_directory_source)
        self.assertNotIn("command route is not mounted with a real command store", product_directory_source)
        self.assertNotIn("appbase backend IAM Postgres command store is not implemented yet", product_directory_source)

        product_user_source = read_text(PRODUCT_ADMIN_USER_API)
        self.assertIn("AdminUserStore", product_user_source)
        self.assertIn('"/backend/v3/api/iam/users"', product_user_source)
        self.assertIn('"/backend/v3/api/iam/api_keys"', product_user_source)

        for forbidden_demo_marker in [
            "DEFAULT_TENANT_ID",
            "t_demo",
            "org_demo",
            "local-admin@sdkwork-iam.local",
            "sk-local-admin",
        ]:
            with self.subTest(forbiddenDemoMarker=forbidden_demo_marker):
                self.assertNotIn(forbidden_demo_marker, product_directory_source)
                self.assertNotIn(forbidden_demo_marker, product_user_source)

    def test_backend_iam_method_level_ownership_is_declared_and_consumed_by_the_right_sdk(self) -> None:
        manifest = read_json(DEPENDENCY_API_SURFACES)
        backend_entry = entries_by_sdk_dependency(manifest)[
            ("clawrouter-backend-sdk", "sdkwork-appbase-backend-sdk")
        ]
        dependency_operations = backend_entry["dependencyOwnedOperations"]
        product_overrides = backend_entry["productOwnedOperationOverrides"]
        appbase_operations = operation_map(read_json(APPBASE_BACKEND_OPENAPI), "/backend/v3/api")
        clawrouter_operations = operation_map(read_json(CLAWROUTER_BACKEND_OPENAPI), "/backend/v3/api")
        service = read_text(ADMIN_USER_SERVICE)
        backend_iam_contract = read_text(BACKEND_IAM_CONTRACT)

        self.assertIn("openapi_exposed: false", backend_iam_contract)
        self.assertGreaterEqual(len(dependency_operations), 4)
        self.assertEqual(
            {
                ("GET", "/backend/v3/api/iam/api_keys"),
                ("POST", "/backend/v3/api/iam/api_keys/{}/revoke"),
                ("GET", "/backend/v3/api/iam/users"),
                ("POST", "/backend/v3/api/iam/users"),
                ("PATCH", "/backend/v3/api/iam/users/{}"),
            },
            {
                (operation["method"], normalize_openapi_path(operation["path"]))
                for operation in dependency_operations
            },
        )

        for operation in dependency_operations:
            key = (operation["method"], normalize_openapi_path(operation["path"]))
            with self.subTest(dependencyOperation=operation["operationId"]):
                self.assertIn(key, appbase_operations)
                self.assertEqual(operation["operationId"], appbase_operations[key]["operationId"])
                self.assertEqual("sdkwork-appbase", appbase_operations[key]["x-sdkwork-owner"])
                self.assertIsInstance(operation["consumerRequired"], bool)
                if operation["consumerRequired"]:
                    self.assertIn(operation["sdkClient"], service)
                else:
                    self.assertNotIn(operation["sdkClient"], service)

        for operation in product_overrides:
            key = (operation["method"], normalize_openapi_path(operation["path"]))
            with self.subTest(productOperation=operation["operationId"]):
                self.assertIn(key, clawrouter_operations)
                self.assertEqual(operation["operationId"], clawrouter_operations[key]["operationId"])
                self.assertEqual("sdkwork-claw-router", clawrouter_operations[key]["x-sdkwork-owner"])
                self.assertIsInstance(operation["consumerRequired"], bool)
                self.assertIn("services/sdkwork-claw-product/src/api/admin_user.rs", operation["evidence"])
                if operation["consumerRequired"]:
                    self.assertIn(operation["sdkClient"], service)

        self.assertNotIn("getClawRouterBackendSdkClient().iam.users.list", service)
        self.assertNotIn("getClawRouterBackendSdkClient().iam.users.create", service)
        self.assertNotIn("getClawRouterBackendSdkClient().iam.users.update", service)
        self.assertNotIn("getClawRouterBackendSdkClient().iam.apiKeys.list", service)
        self.assertNotIn("getClawRouterBackendSdkClient().iam.apiKeys.revoke", service)
        self.assertNotIn("getSdkworkAppbaseBackendSdkClient().iam.apiKeys.revoke", service)

    def test_backend_appbase_sdk_config_can_inherit_verified_same_origin_backend_mount(self) -> None:
        manifest = read_json(DEPENDENCY_API_SURFACES)
        backend_entry = entries_by_sdk_dependency(manifest)[
            ("clawrouter-backend-sdk", "sdkwork-appbase-backend-sdk")
        ]
        runtime = backend_entry["runtimeIntegration"]
        self.assertTrue(runtime["sameOriginAllowed"])
        self.assertEqual("verified", runtime["mountCoverage"]["status"])

        for path in [ROOT / ".env.release.example", PORTAL_ROOT / ".env.example"]:
            with self.subTest(path=path.relative_to(ROOT).as_posix()):
                source = read_text(path)
                self.assertIn(f'{runtime["publicBaseUrlEnv"]}=""', source)
                self.assertNotIn(f'{runtime["publicBaseUrlEnv"]}="/backend/v3/api"', source)

        source = read_text(SDK_CLIENTS)
        resolver = extract_function(source, "resolveRequiredAppbaseBackendBaseUrl")
        self.assertIn(runtime["baseUrlEnv"], resolver)
        self.assertIn(runtime["fallbackBaseUrlEnv"], resolver)
        self.assertIn("BACKEND_API_PREFIX", resolver)
        self.assertNotIn("throw new Error", resolver)
        self.assertNotIn("?? '/backend/v3/api'", resolver)

    def test_external_dependency_surfaces_declare_common_sdk_base_url_default(self) -> None:
        manifest = read_json(DEPENDENCY_API_SURFACES)
        for entry in manifest["dependencies"]:
            runtime = entry["runtimeIntegration"]
            if runtime["sameOriginAllowed"]:
                continue
            with self.subTest(workspace=entry["workspace"]):
                self.assertEqual("external-service", runtime["mode"])
                self.assertEqual("PORTAL_PUBLIC_SDK_BASE_URL", runtime.get("commonBaseUrlEnv"))
                self.assertIn("requiredBaseUrlEnv", runtime)
                self.assertIn("publicBaseUrlEnv", runtime)

    def test_iam_runtime_does_not_require_appbase_backend_dependency_config(self) -> None:
        manifest = read_json(DEPENDENCY_API_SURFACES)
        backend_entry = entries_by_sdk_dependency(manifest)[
            ("clawrouter-backend-sdk", "sdkwork-appbase-backend-sdk")
        ]
        runtime = backend_entry["runtimeIntegration"]
        self.assertTrue(runtime["sameOriginAllowed"])

        source = read_text(IAM_RUNTIME)
        self.assertNotIn("resolveRequiredAppbaseBackendBaseUrl", source)
        self.assertNotIn("getSdkworkAppbaseBackendSdkClient", source)
        self.assertNotIn("createAppbaseBackendClient", source)
        self.assertNotIn("appbaseBackendApiBaseUrl", source)

        sdk_clients = read_text(SDK_CLIENTS)
        required_resolver = extract_function(sdk_clients, "resolveRequiredAppbaseBackendBaseUrl")
        self.assertIn(runtime["baseUrlEnv"], required_resolver)
        self.assertIn(runtime["fallbackBaseUrlEnv"], required_resolver)
        self.assertIn("BACKEND_API_PREFIX", required_resolver)
        self.assertNotIn("throw new Error", required_resolver)

    def test_same_origin_dependency_surfaces_have_mount_coverage_evidence(self) -> None:
        manifest = read_json(DEPENDENCY_API_SURFACES)
        for entry in manifest["dependencies"]:
            runtime = entry["runtimeIntegration"]
            if not runtime["sameOriginAllowed"]:
                continue
            with self.subTest(sdkFamily=entry["consumerSdkFamily"], workspace=entry["workspace"]):
                self.assertEqual("same-origin-mounted", runtime["mode"])
                coverage = runtime["mountCoverage"]
                self.assertEqual("verified", coverage["status"])
                self.assertGreater(len(coverage.get("evidence", [])), 0)
                route_contract = runtime["rustRouteContractCrate"]
                has_dependency_router_export = route_contract.get("executableRouterExport") is not None
                has_handler_adapters = len(runtime.get("handlerAdapterExports", [])) > 0
                self.assertTrue(
                    has_dependency_router_export or has_handler_adapters,
                    "same-origin dependency surfaces need a dependency router export or approved handler adapters",
                )

    def test_pc_components_declare_sdk_surface_imports_and_exports(self) -> None:
        manifest = read_json(DEPENDENCY_API_SURFACES)
        manifest_entries = entries_by_sdk_dependency(manifest)

        pc_spec = read_json(PC_COMPONENT_SPEC)
        commons_spec = read_json(COMMONS_COMPONENT_SPEC)
        organization_spec = read_json(ADMIN_ORGANIZATION_COMPONENT_SPEC)
        user_spec = read_json(ADMIN_USER_COMPONENT_SPEC)

        for name, component_spec in [
            ("pc app", pc_spec),
            ("commons", commons_spec),
        ]:
            with self.subTest(component=name):
                contracts = component_spec["contracts"]
                self.assertIn("dependencyApiSurfaces", contracts)
                self.assertIn(contracts["dependencyApiSurfaces"], contracts["configKeys"])
                self.assertIn(contracts["dependencyApiSurfaces"], contracts["runtimeEntrypoints"])
                canonical_specs = {
                    spec["file"]
                    for spec in component_spec.get("canonicalSpecs", [])
                }
                self.assertIn("APP_SDK_INTEGRATION_SPEC.md", canonical_specs)
                self.assertIn("SDK_WORKSPACE_GENERATION_SPEC.md", canonical_specs)

        pc_clients = sdk_clients_by_family(pc_spec)
        commons_clients = sdk_clients_by_family(commons_spec)

        expected_pc_client_families = {
            "clawrouter-app-sdk",
            "clawrouter-backend-sdk",
            "clawrouter-open-sdk",
            "sdkwork-appbase-app-sdk",
            "sdkwork-appbase-backend-sdk",
            "sdkwork-commerce-app-sdk",
            "sdkwork-commerce-backend-sdk",
        }
        self.assertTrue(expected_pc_client_families.issubset(pc_clients))

        expected_commons_client_families = {
            "clawrouter-app-sdk",
            "clawrouter-backend-sdk",
            "clawrouter-open-sdk",
            "sdkwork-appbase-app-sdk",
            "sdkwork-appbase-backend-sdk",
            "sdkwork-drive-app-sdk",
            "sdkwork-generations-app-sdk",
            "sdkwork-commerce-app-sdk",
            "sdkwork-commerce-backend-sdk",
        }
        self.assertTrue(expected_commons_client_families.issubset(commons_clients))
        self.assertEqual("./sdk-clients", commons_clients["sdkwork-appbase-backend-sdk"]["sourceExport"])

        for key in [
            ("clawrouter-app-sdk", "sdkwork-appbase-app-sdk"),
            ("clawrouter-backend-sdk", "sdkwork-appbase-backend-sdk"),
            ("clawrouter-app-sdk", "sdkwork-commerce-app-sdk"),
            ("clawrouter-backend-sdk", "sdkwork-commerce-backend-sdk"),
        ]:
            dependency_entry = manifest_entries[key]
            client = commons_clients[dependency_entry["workspace"]]
            runtime = dependency_entry["runtimeIntegration"]
            with self.subTest(client=dependency_entry["workspace"]):
                self.assertEqual(dependency_entry["surface"], client["surface"])
                self.assertEqual(dependency_entry["apiPrefix"], client["apiPrefix"])
                self.assertEqual(runtime["mode"], client["runtimeIntegration"]["mode"])
                self.assertEqual(runtime["sameOriginAllowed"], client["runtimeIntegration"]["sameOriginAllowed"])

        appbase_backend_client = commons_clients["sdkwork-appbase-backend-sdk"]
        self.assertEqual(
            "VITE_SDKWORK_APPBASE_BACKEND_API_BASE_URL",
            appbase_backend_client["runtimeIntegration"]["baseUrlEnv"],
        )
        self.assertEqual(
            "VITE_CLAWROUTER_BACKEND_API_BASE_URL",
            appbase_backend_client["runtimeIntegration"]["fallbackBaseUrlEnv"],
        )
        self.assertEqual(
            "PORTAL_PUBLIC_APPBASE_BACKEND_API_BASE_URL",
            appbase_backend_client["runtimeIntegration"]["publicBaseUrlEnv"],
        )
        self.assertNotIn("requiredBaseUrlEnv", appbase_backend_client["runtimeIntegration"])
        self.assertTrue(appbase_backend_client["runtimeIntegration"]["sameOriginAllowed"])

        organization_clients = sdk_clients_by_family(organization_spec)
        self.assertEqual(
            {"sdkwork-appbase-app-sdk", "sdkwork-appbase-backend-sdk"},
            set(organization_clients),
        )
        self.assertEqual(
            "sdkwork-clawrouter-pc-commons/runtime",
            organization_clients["sdkwork-appbase-backend-sdk"]["providedBy"],
        )
        self.assertTrue(
            organization_clients["sdkwork-appbase-backend-sdk"]["runtimeIntegration"]["sameOriginAllowed"],
        )

        user_clients = sdk_clients_by_family(user_spec)
        self.assertEqual(
            {"clawrouter-backend-sdk", "sdkwork-appbase-backend-sdk"},
            set(user_clients),
        )
        self.assertEqual(
            "sdkwork-clawrouter-pc-commons/runtime",
            user_clients["sdkwork-appbase-backend-sdk"]["providedBy"],
        )
        self.assertTrue(
            user_clients["sdkwork-appbase-backend-sdk"]["runtimeIntegration"]["sameOriginAllowed"],
        )

    def test_component_dependency_sdk_runtime_config_matches_dependency_api_surfaces(self) -> None:
        manifest = read_json(DEPENDENCY_API_SURFACES)
        entries_by_workspace = {
            entry["workspace"]: entry
            for entry in manifest.get("dependencies", [])
        }
        component_paths = [
            PC_COMPONENT_SPEC,
            COMMONS_COMPONENT_SPEC,
            ADMIN_ORGANIZATION_COMPONENT_SPEC,
            ADMIN_USER_COMPONENT_SPEC,
        ]

        for component_path in component_paths:
            component_spec = read_json(component_path)
            for client in sdk_clients_with_dependency_surfaces(component_spec):
                dependency_surface = client["dependencyApiSurface"]
                with self.subTest(
                    component=component_path.relative_to(ROOT).as_posix(),
                    sdkFamily=client["sdkFamily"],
                ):
                    self.assertEqual(client["sdkFamily"], dependency_surface)
                    self.assertIn(dependency_surface, entries_by_workspace)
                    entry = entries_by_workspace[dependency_surface]
                    manifest_runtime = entry["runtimeIntegration"]
                    client_runtime = client["runtimeIntegration"]
                    self.assertEqual(entry["surface"], client["surface"])
                    self.assertEqual(entry["apiPrefix"], client["apiPrefix"])
                    self.assertEqual(manifest_runtime["mode"], client_runtime["mode"])
                    self.assertEqual(manifest_runtime["sameOriginAllowed"], client_runtime["sameOriginAllowed"])
                    self.assertEqual(
                        manifest_runtime.get("publicBaseUrlEnv"),
                        client_runtime.get("publicBaseUrlEnv"),
                    )
                    if manifest_runtime["sameOriginAllowed"]:
                        self.assertEqual(
                            manifest_runtime.get("baseUrlEnv"),
                            client_runtime.get("baseUrlEnv"),
                        )
                        self.assertEqual(
                            manifest_runtime.get("fallbackBaseUrlEnv"),
                            client_runtime.get("fallbackBaseUrlEnv"),
                        )
                        self.assertNotIn("requiredBaseUrlEnv", client_runtime)
                    else:
                        self.assertEqual("external-service", client_runtime["mode"])
                        self.assertEqual(
                            manifest_runtime.get("requiredBaseUrlEnv"),
                            client_runtime.get("requiredBaseUrlEnv"),
                        )
                        self.assertIn("requiredBaseUrlEnv", client_runtime)
                        self.assertNotIn("fallbackBaseUrlEnv", client_runtime)
                        self.assertNotEqual(
                            "VITE_CLAWROUTER_BACKEND_API_BASE_URL",
                            client_runtime["requiredBaseUrlEnv"],
                        )
                    if "commonBaseUrlEnv" in manifest_runtime:
                        self.assertEqual(
                            manifest_runtime["commonBaseUrlEnv"],
                            client_runtime.get("commonBaseUrlEnv"),
                        )

    def test_component_sdk_clients_declare_common_sdk_base_url_default(self) -> None:
        for component_path in [
            PC_COMPONENT_SPEC,
            COMMONS_COMPONENT_SPEC,
            ADMIN_ORGANIZATION_COMPONENT_SPEC,
            ADMIN_USER_COMPONENT_SPEC,
        ]:
            component_spec = read_json(component_path)
            for client in component_spec.get("contracts", {}).get("sdkClients", []):
                with self.subTest(
                    component=component_path.relative_to(ROOT).as_posix(),
                    sdkFamily=client["sdkFamily"],
                ):
                    self.assertEqual(
                        "PORTAL_PUBLIC_SDK_BASE_URL",
                        client["runtimeIntegration"].get("commonBaseUrlEnv"),
                    )


if __name__ == "__main__":
    unittest.main()
