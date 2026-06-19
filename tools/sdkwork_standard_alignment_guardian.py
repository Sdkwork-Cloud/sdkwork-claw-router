from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class AlignmentCheck:
    id: str
    category: str
    severity: str
    status: str
    message: str
    remediation: str


@dataclass(frozen=True)
class AlignmentGuardianResult:
    checks: tuple[AlignmentCheck, ...]

    @property
    def blocking(self) -> tuple[AlignmentCheck, ...]:
        return tuple(check for check in self.checks if check.severity == "blocking" and check.status == "fail")

    @property
    def ok(self) -> bool:
        return not self.blocking


class SdkworkStandardAlignmentGuardian:
    """Audit sdkwork-claw-router against sdkwork-specs framework integration requirements."""

    ROOT_COMPONENT_SPEC = "specs/component.spec.json"
    WORKFLOW_MANIFEST = "sdkwork.workflow.json"
    CARGO_MANIFEST = "Cargo.toml"
    ALIGNMENT_MANIFEST = "specs/standard-alignment.manifest.json"

    REQUIRED_ROOT_CANONICAL_SPECS: tuple[str, ...] = (
        "WEB_FRAMEWORK_SPEC.md",
        "WEB_BACKEND_SPEC.md",
        "DATABASE_SPEC.md",
        "DEPLOYMENT_SPEC.md",
        "GITHUB_WORKFLOW_SPEC.md",
        "APP_RUNTIME_TOPOLOGY_SPEC.md",
    )

    REQUIRED_WORKFLOW_DEPENDENCY_IDS: tuple[str, ...] = (
        "sdkwork-web-framework",
        "sdkwork-database",
    )

    REQUIRED_CARGO_WORKSPACE_DEPS: tuple[str, ...] = (
        "sdkwork-web-axum",
        "sdkwork-web-core",
        "sdkwork-iam-web-adapter",
        "sdkwork-database-config",
        "sdkwork-database-sqlx",
        "sdkwork-database-repository",
    )

    HTTP_ROUTE_CRATES: tuple[str, ...] = (
        "crates/sdkwork-router-app-api",
        "crates/sdkwork-router-backend-api",
    )

    def __init__(self, root: Path) -> None:
        self.root = Path(root).resolve()

    def run(self) -> AlignmentGuardianResult:
        checks: list[AlignmentCheck] = []
        checks.extend(self._check_root_component_specs())
        checks.extend(self._check_workflow_dependencies())
        checks.extend(self._check_cargo_workspace_dependencies())
        checks.extend(self._check_web_framework_integration())
        checks.extend(self._check_handler_subject_resolution())
        checks.extend(self._check_http_route_manifest_runtime())
        checks.extend(self._check_database_framework_integration())
        checks.extend(self._check_api_contract_metadata())
        checks.extend(self._check_route_manifest_workspace())
        checks.extend(self._check_rpc_discovery_policy())
        checks.extend(self._check_rust_service_naming())
        return AlignmentGuardianResult(checks=tuple(checks))

    def _check_root_component_specs(self) -> list[AlignmentCheck]:
        spec_path = self.root / self.ROOT_COMPONENT_SPEC
        if not spec_path.exists():
            return [
                AlignmentCheck(
                    id="component-spec-present",
                    category="metadata",
                    severity="blocking",
                    status="fail",
                    message=f"missing root component spec at {self.ROOT_COMPONENT_SPEC}",
                    remediation="create specs/component.spec.json per COMPONENT_SPEC.md",
                )
            ]

        data = json.loads(spec_path.read_text(encoding="utf-8"))
        declared = {
            entry.get("file")
            for entry in data.get("canonicalSpecs", [])
            if isinstance(entry, dict) and isinstance(entry.get("file"), str)
        }
        checks: list[AlignmentCheck] = []
        for required in self.REQUIRED_ROOT_CANONICAL_SPECS:
            if required in declared:
                checks.append(
                    AlignmentCheck(
                        id=f"component-spec-{required}",
                        category="metadata",
                        severity="blocking",
                        status="pass",
                        message=f"root component spec declares {required}",
                        remediation="",
                    )
                )
            else:
                checks.append(
                    AlignmentCheck(
                        id=f"component-spec-{required}",
                        category="metadata",
                        severity="blocking",
                        status="fail",
                        message=f"root component spec missing canonical reference to {required}",
                        remediation=f"add {required} to specs/component.spec.json canonicalSpecs",
                    )
                )
        return checks

    def _check_workflow_dependencies(self) -> list[AlignmentCheck]:
        workflow_path = self.root / self.WORKFLOW_MANIFEST
        if not workflow_path.exists():
            return [
                AlignmentCheck(
                    id="workflow-manifest-present",
                    category="packaging",
                    severity="blocking",
                    status="fail",
                    message=f"missing {self.WORKFLOW_MANIFEST}",
                    remediation="create sdkwork.workflow.json per GITHUB_WORKFLOW_SPEC.md",
                )
            ]

        data = json.loads(workflow_path.read_text(encoding="utf-8"))
        dependency_ids = {
            entry.get("id")
            for entry in data.get("dependencies", [])
            if isinstance(entry, dict) and isinstance(entry.get("id"), str)
        }
        checks: list[AlignmentCheck] = []
        for dependency_id in self.REQUIRED_WORKFLOW_DEPENDENCY_IDS:
            if dependency_id in dependency_ids:
                checks.append(
                    AlignmentCheck(
                        id=f"workflow-dep-{dependency_id}",
                        category="packaging",
                        severity="blocking",
                        status="pass",
                        message=f"{self.WORKFLOW_MANIFEST} declares dependency checkout for {dependency_id}",
                        remediation="",
                    )
                )
            else:
                checks.append(
                    AlignmentCheck(
                        id=f"workflow-dep-{dependency_id}",
                        category="packaging",
                        severity="blocking",
                        status="fail",
                        message=f"{self.WORKFLOW_MANIFEST} missing dependency checkout for {dependency_id}",
                        remediation=f"add {dependency_id} to sdkwork.workflow.json dependencies",
                    )
                )
        return checks

    def _check_cargo_workspace_dependencies(self) -> list[AlignmentCheck]:
        cargo_path = self.root / self.CARGO_MANIFEST
        text = cargo_path.read_text(encoding="utf-8")
        checks: list[AlignmentCheck] = []
        for dependency in self.REQUIRED_CARGO_WORKSPACE_DEPS:
            if re.search(rf"^{re.escape(dependency)}\s*=", text, flags=re.MULTILINE):
                checks.append(
                    AlignmentCheck(
                        id=f"cargo-workspace-dep-{dependency}",
                        category="dependencies",
                        severity="blocking",
                        status="pass",
                        message=f"Cargo workspace declares {dependency}",
                        remediation="",
                    )
                )
            else:
                checks.append(
                    AlignmentCheck(
                        id=f"cargo-workspace-dep-{dependency}",
                        category="dependencies",
                        severity="blocking",
                        status="fail",
                        message=f"Cargo workspace missing workspace dependency {dependency}",
                        remediation=f"declare {dependency} under [workspace.dependencies] in Cargo.toml",
                    )
                )
        return checks

    def _check_web_framework_integration(self) -> list[AlignmentCheck]:
        checks: list[AlignmentCheck] = []
        cargo_text = (self.root / self.CARGO_MANIFEST).read_text(encoding="utf-8")
        has_web_framework_dep = "sdkwork-web-framework" in cargo_text or "sdkwork-web-axum" in cargo_text
        if has_web_framework_dep:
            checks.append(
                AlignmentCheck(
                    id="web-framework-workspace-dep",
                    category="web-framework",
                    severity="blocking",
                    status="pass",
                    message="Cargo workspace declares sdkwork-web-framework crates",
                    remediation="",
                )
            )
        else:
            checks.append(
                AlignmentCheck(
                    id="web-framework-workspace-dep",
                    category="web-framework",
                    severity="blocking",
                    status="fail",
                    message="Cargo workspace does not declare sdkwork-web-framework crates",
                    remediation="add sdkwork-web-axum and sdkwork-web-core workspace dependencies",
                )
            )

        for route_crate in self.HTTP_ROUTE_CRATES:
            web_bootstrap = self.root / route_crate / "src" / "web_bootstrap.rs"
            if web_bootstrap.exists():
                checks.append(
                    AlignmentCheck(
                        id=f"web-framework-bootstrap-{route_crate}",
                        category="web-framework",
                        severity="blocking",
                        status="pass",
                        message=f"{route_crate} provides web_bootstrap.rs",
                        remediation="",
                    )
                )
            else:
                checks.append(
                    AlignmentCheck(
                        id=f"web-framework-bootstrap-{route_crate}",
                        category="web-framework",
                        severity="blocking",
                        status="fail",
                        message=f"{route_crate} is missing web_bootstrap.rs for sdkwork-web-framework wrapping",
                        remediation="follow sdkwork-knowledgebase router web_bootstrap pattern and WEB_FRAMEWORK_SPEC.md",
                    )
                )

        claw_http = self.root / "crates" / "sdkwork-claw-http"
        web_bootstrap = self.root / self.HTTP_ROUTE_CRATES[0] / "src" / "web_bootstrap.rs"
        bootstrap_text = (
            web_bootstrap.read_text(encoding="utf-8") if web_bootstrap.exists() else ""
        )
        auth_rs = claw_http / "src" / "auth.rs"
        auth_text = auth_rs.read_text(encoding="utf-8") if auth_rs.exists() else ""
        web_framework_defaults_on = (
            "claw_web_framework_enabled_from_env" in (claw_http / "src" / "web_framework_compat.rs").read_text(encoding="utf-8")
            if (claw_http / "src" / "web_framework_compat.rs").exists()
            else ""
        )
        bypasses_legacy_boundary = "claw_web_framework_enabled_from_env()" in auth_text
        injects_trusted_subject = "inject_legacy_handler_context_from_web_context" in bootstrap_text
        if claw_http.exists() and web_framework_defaults_on and bypasses_legacy_boundary and injects_trusted_subject:
            checks.append(
                AlignmentCheck(
                    id="web-framework-local-http-stack",
                    category="web-framework",
                    severity="blocking",
                    status="pass",
                    message="sdkwork-web-framework owns auth/context; legacy claw-http boundaries bypass when framework is active",
                    remediation="",
                )
            )
        elif claw_http.exists() and web_framework_defaults_on:
            checks.append(
                AlignmentCheck(
                    id="web-framework-local-http-stack",
                    category="web-framework",
                    severity="warning",
                    status="fail",
                    message="sdkwork-web-framework is default-on but legacy claw-http auth bypass/projection is incomplete",
                    remediation="ensure auth.rs bypasses legacy boundaries and web_bootstrap injects TrustedRequestSubject",
                )
            )
        elif claw_http.exists():
            checks.append(
                AlignmentCheck(
                    id="web-framework-local-http-stack",
                    category="web-framework",
                    severity="warning",
                    status="fail",
                    message="local sdkwork-claw-http stack still owns HTTP auth/context; migrate to sdkwork-web-framework",
                    remediation="retire competing interceptor/context logic per WEB_FRAMEWORK_SPEC.md migration plan",
                )
            )

        for route_crate in self.HTTP_ROUTE_CRATES:
            routes_rs = self.root / route_crate / "src" / "routes.rs"
            routes_text = routes_rs.read_text(encoding="utf-8") if routes_rs.exists() else ""
            router_from_env_finalizes = (
                "pub async fn router_from_env()" in routes_text
                and "maybe_wrap_router_with_web_framework" in routes_text
            )
            checks.append(
                AlignmentCheck(
                    id=f"web-framework-router-from-env-{route_crate}",
                    category="web-framework",
                    severity="blocking",
                    status="pass" if router_from_env_finalizes else "fail",
                    message=(
                        f"{route_crate} router_from_env finalizes with sdkwork-web-framework"
                        if router_from_env_finalizes
                        else f"{route_crate} router_from_env must call maybe_wrap_router_with_web_framework once"
                    ),
                    remediation="wrap the served router in web_bootstrap::maybe_wrap_router_with_web_framework before returning",
                )
            )

        gateway_runtime = self.root / "services" / "sdkwork-claw-gateway" / "src" / "runtime.rs"
        gateway_text = (
            gateway_runtime.read_text(encoding="utf-8") if gateway_runtime.exists() else ""
        )
        all_in_one_finalizes_both = (
            "finalize_all_in_one_route_surfaces" in gateway_text
            and "sdkwork_router_app_api::maybe_wrap_router_with_web_framework" in gateway_text
            and "sdkwork_router_backend_api::maybe_wrap_router_with_web_framework" in gateway_text
        )
        checks.append(
            AlignmentCheck(
                id="web-framework-gateway-all-in-one-finalize",
                category="web-framework",
                severity="blocking",
                status="pass" if all_in_one_finalizes_both else "fail",
                message=(
                    "gateway all-in-one finalizes app and backend route surfaces with sdkwork-web-framework"
                    if all_in_one_finalizes_both
                    else "gateway all-in-one must finalize both app-api and backend-api routers once"
                ),
                remediation="use finalize_all_in_one_route_surfaces to wrap both shared-runtime routers",
            )
        )
        return checks

    def _check_handler_subject_resolution(self) -> list[AlignmentCheck]:
        checks: list[AlignmentCheck] = []
        api_dir = self.root / "services" / "sdkwork-claw-product" / "src" / "api"
        allowlist = {"app_auth.rs", "subject.rs"}
        legacy_files: list[str] = []
        migrated_files: list[str] = []
        for path in sorted(api_dir.glob("*.rs")):
            if path.name in allowlist:
                continue
            text = path.read_text(encoding="utf-8")
            if "TrustedRequestSubject::from_headers" in text:
                legacy_files.append(path.name)
            if "Option<TrustedRequestSubject>" in text or "_subject: TrustedRequestSubject" in text:
                if "TrustedRequestSubject::from_headers" not in text:
                    migrated_files.append(path.name)

        checks.append(
            AlignmentCheck(
                id="web-framework-handler-subject-migration",
                category="web-framework",
                severity="warning",
                status="pass" if not legacy_files else "fail",
                message=(
                    "product API handlers resolve subject via TrustedRequestSubject extractors"
                    if not legacy_files
                    else (
                        f"{len(legacy_files)} product API handlers still call "
                        "TrustedRequestSubject::from_headers"
                    )
                ),
                remediation=(
                    "replace header parsing with sdkwork-web-framework-aware extractors; "
                    "see services/sdkwork-claw-product/src/api/subject.rs"
                ),
            )
        )
        if migrated_files:
            checks.append(
                AlignmentCheck(
                    id="web-framework-handler-subject-migration-progress",
                    category="web-framework",
                    severity="info",
                    status="pass",
                    message=(
                        f"{len(migrated_files)} product API modules already use framework-aware "
                        "subject extractors"
                    ),
                    remediation="",
                )
            )
        return checks

    def _check_database_framework_integration(self) -> list[AlignmentCheck]:
        checks: list[AlignmentCheck] = []
        gateway_runtime = self.root / "services" / "sdkwork-claw-gateway" / "src" / "runtime.rs"
        gateway_text = gateway_runtime.read_text(encoding="utf-8") if gateway_runtime.exists() else ""
        if "sdkwork_database_sqlx" in gateway_text:
            checks.append(
                AlignmentCheck(
                    id="database-gateway-pool",
                    category="database",
                    severity="blocking",
                    status="pass",
                    message="gateway runtime uses sdkwork-database-sqlx DatabasePool",
                    remediation="",
                )
            )
        else:
            checks.append(
                AlignmentCheck(
                    id="database-gateway-pool",
                    category="database",
                    severity="blocking",
                    status="fail",
                    message="gateway runtime does not use sdkwork-database-sqlx DatabasePool",
                    remediation="route pool creation through sdkwork-database-sqlx",
                )
            )

        product_cargo = self.root / "services" / "sdkwork-claw-product" / "Cargo.toml"
        product_text = product_cargo.read_text(encoding="utf-8") if product_cargo.exists() else ""
        if "sdkwork-database-repository" in product_text:
            product_rs_files = list((self.root / "services" / "sdkwork-claw-product" / "src").rglob("*.rs"))
            uses_repository = any(
                "sdkwork_database_repository" in path.read_text(encoding="utf-8") for path in product_rs_files
            )
            uses_pool_builder = any(
                "PoolBuilder" in path.read_text(encoding="utf-8") for path in product_rs_files
            )
            if uses_repository and uses_pool_builder:
                checks.append(
                    AlignmentCheck(
                        id="database-product-repository",
                        category="database",
                        severity="warning",
                        status="pass",
                        message="product service uses sdkwork-database-repository and PoolBuilder",
                        remediation="",
                    )
                )
            elif uses_repository:
                checks.append(
                    AlignmentCheck(
                        id="database-product-repository",
                        category="database",
                        severity="warning",
                        status="pass",
                        message="product service uses sdkwork-database-repository",
                        remediation="",
                    )
                )
            else:
                checks.append(
                    AlignmentCheck(
                        id="database-product-repository",
                        category="database",
                        severity="warning",
                        status="fail",
                        message="product service declares sdkwork-database-repository but does not use it yet",
                        remediation="migrate SQL stores to repository pattern or remove unused dependency",
                    )
                )

        gateway_runtime = self.root / "services" / "sdkwork-claw-gateway" / "src" / "runtime.rs"
        gateway_text = gateway_runtime.read_text(encoding="utf-8") if gateway_runtime.exists() else ""
        if "connect_claw_sqlite_runtime" in gateway_text:
            checks.append(
                AlignmentCheck(
                    id="database-gateway-sqlite-poolbuilder",
                    category="database",
                    severity="blocking",
                    status="pass",
                    message="gateway sqlite pool creation routes through sdkwork-database PoolBuilder helpers",
                    remediation="",
                )
            )
        elif "SqlitePoolOptions::new" in gateway_text:
            checks.append(
                AlignmentCheck(
                    id="database-gateway-sqlite-poolbuilder",
                    category="database",
                    severity="warning",
                    status="fail",
                    message="gateway still creates sqlite pools with raw SqlitePoolOptions",
                    remediation="use sdkwork_claw_product::infrastructure::sql::pool::connect_claw_sqlite_runtime_pool",
                )
            )

        for route_crate in self.HTTP_ROUTE_CRATES:
            routes_rs = self.root / route_crate / "src" / "routes.rs"
            routes_text = routes_rs.read_text(encoding="utf-8") if routes_rs.exists() else ""
            uses_pool_helper = "connect_claw_sqlite_runtime_pool" in routes_text
            uses_raw_sqlite_pool = "SqlitePoolOptions::new" in routes_text.split("#[cfg(test)]")[0]
            if uses_pool_helper and not uses_raw_sqlite_pool:
                checks.append(
                    AlignmentCheck(
                        id=f"database-route-sqlite-pool-{route_crate}",
                        category="database",
                        severity="blocking",
                        status="pass",
                        message=f"{route_crate} sqlite startup pools use sdkwork-database PoolBuilder helpers",
                        remediation="",
                    )
                )
            else:
                checks.append(
                    AlignmentCheck(
                        id=f"database-route-sqlite-pool-{route_crate}",
                        category="database",
                        severity="blocking",
                        status="fail",
                        message=f"{route_crate} must route sqlite pool creation through connect_claw_sqlite_runtime_pool",
                        remediation="replace raw SqlitePoolOptions in router startup paths with product pool helpers",
                    )
                )
        return checks

    def _check_http_route_manifest_runtime(self) -> list[AlignmentCheck]:
        checks: list[AlignmentCheck] = []
        for route_crate in self.HTTP_ROUTE_CRATES:
            manifest_rs = self.root / route_crate / "src" / "http_route_manifest.rs"
            bootstrap_rs = self.root / route_crate / "src" / "web_bootstrap.rs"
            if not manifest_rs.exists():
                checks.append(
                    AlignmentCheck(
                        id=f"http-route-manifest-{route_crate}",
                        category="web-framework",
                        severity="blocking",
                        status="fail",
                        message=f"{route_crate} is missing generated http_route_manifest.rs",
                        remediation="run node tools/generate-clawrouter-http-route-manifest-rs.mjs --apply",
                    )
                )
                continue
            bootstrap_text = bootstrap_rs.read_text(encoding="utf-8") if bootstrap_rs.exists() else ""
            if "build_web_framework_layer" in bootstrap_text and "http_route_manifest()" in bootstrap_text:
                checks.append(
                    AlignmentCheck(
                        id=f"http-route-manifest-{route_crate}",
                        category="web-framework",
                        severity="blocking",
                        status="pass",
                        message=f"{route_crate} wires HttpRouteManifest into sdkwork-web-framework layer",
                        remediation="",
                    )
                )
            else:
                checks.append(
                    AlignmentCheck(
                        id=f"http-route-manifest-{route_crate}",
                        category="web-framework",
                        severity="blocking",
                        status="fail",
                        message=f"{route_crate} does not wire HttpRouteManifest into web framework bootstrap",
                        remediation="use build_web_framework_layer(resolver, http_route_manifest(), public_prefixes)",
                    )
                )
        return checks

    def _check_api_contract_metadata(self) -> list[AlignmentCheck]:
        checks: list[AlignmentCheck] = []
        openapi_roots = (
            self.root / "apis",
            self.root / "generated" / "openapi",
        )
        files_with_context = 0
        scanned = 0
        for root in openapi_roots:
            if not root.exists():
                continue
            for path in root.rglob("*.openapi.json"):
                scanned += 1
                text = path.read_text(encoding="utf-8")
                if "x-sdkwork-request-context" in text or "WebRequestContext" in text:
                    files_with_context += 1

        if scanned == 0:
            checks.append(
                AlignmentCheck(
                    id="api-contract-request-context",
                    category="api",
                    severity="blocking",
                    status="fail",
                    message="no OpenAPI contract files found under apis/ or generated/openapi/",
                    remediation="materialize API contracts per API_SPEC.md",
                )
            )
            return checks

        if files_with_context > 0:
            checks.append(
                AlignmentCheck(
                    id="api-contract-request-context",
                    category="api",
                    severity="blocking",
                    status="pass",
                    message=f"{files_with_context}/{scanned} OpenAPI files declare WebRequestContext metadata",
                    remediation="",
                )
            )
        else:
            checks.append(
                AlignmentCheck(
                    id="api-contract-request-context",
                    category="api",
                    severity="blocking",
                    status="fail",
                    message="OpenAPI contracts are missing x-sdkwork-request-context / WebRequestContext metadata",
                    remediation="add route manifest + OpenAPI extensions per API_SPEC.md section 19 and WEB_FRAMEWORK_SPEC.md",
                )
            )
        return checks

    def _check_route_manifest_workspace(self) -> list[AlignmentCheck]:
        manifest_root = self.root / "sdks" / "_route-manifests"
        if manifest_root.exists() and any(manifest_root.rglob("*.route-manifest.json")):
            return [
                AlignmentCheck(
                    id="route-manifest-workspace",
                    category="api",
                    severity="blocking",
                    status="pass",
                    message="sdks/_route-manifests contains route manifest inputs",
                    remediation="",
                )
            ]
        return [
            AlignmentCheck(
                id="route-manifest-workspace",
                category="api",
                severity="blocking",
                status="fail",
                message="missing sdks/_route-manifests/*.route-manifest.json workspace",
                remediation="create route manifests with requestContext and apiSurface per SDK_WORKSPACE_GENERATION_SPEC.md",
            )
        ]

    def _check_rpc_discovery_policy(self) -> list[AlignmentCheck]:
        has_grpc = False
        scan_roots = (
            self.root / "crates",
            self.root / "services",
            self.root / "apis",
            self.root / "sdks",
        )
        for root in scan_roots:
            if not root.exists():
                continue
            for path in root.rglob("*"):
                if not path.is_file():
                    continue
                if path.suffix == ".proto":
                    has_grpc = True
                    break
                if path.suffix == ".rs":
                    text = path.read_text(encoding="utf-8", errors="ignore")
                    if "tonic::" in text:
                        has_grpc = True
                        break
            if has_grpc:
                break

        if not has_grpc:
            return [
                AlignmentCheck(
                    id="discovery-not-required",
                    category="discovery",
                    severity="info",
                    status="pass",
                    message="no RPC/gRPC services detected; sdkwork-discovery integration is not required yet",
                    remediation="add sdkwork-discovery when RPC services are introduced",
                )
            ]

        scan_files = (
            self.root / "Cargo.toml",
            self.root / "sdkwork.workflow.json",
            self.root / "specs" / "component.spec.json",
        )
        has_discovery = any(
            path.exists() and "sdkwork-discovery" in path.read_text(encoding="utf-8", errors="ignore")
            for path in scan_files
        )
        service_configs = list((self.root / "services").glob("*/Cargo.toml"))
        has_discovery = has_discovery or any(
            "sdkwork-discovery" in path.read_text(encoding="utf-8", errors="ignore")
            for path in service_configs
        )
        if has_discovery:
            return [
                AlignmentCheck(
                    id="discovery-required",
                    category="discovery",
                    severity="blocking",
                    status="pass",
                    message="RPC services detected and sdkwork-discovery references are present",
                    remediation="",
                )
            ]
        return [
            AlignmentCheck(
                id="discovery-required",
                category="discovery",
                severity="blocking",
                status="fail",
                message="RPC/gRPC services detected but sdkwork-discovery is not integrated",
                remediation="integrate sdkwork-discovery per RPC_SPEC.md and deployment topology",
            )
        ]

    def _check_rust_service_naming(self) -> list[AlignmentCheck]:
        checks: list[AlignmentCheck] = []
        legacy_names = (
            "services/sdkwork-claw-product",
            "services/sdkwork-claw-app",
            "services/sdkwork-claw-admin",
        )
        migration_manifest = self.root / "specs" / "naming-migration.manifest.json"
        approved_legacy: set[str] = set()
        if migration_manifest.exists():
            data = json.loads(migration_manifest.read_text(encoding="utf-8"))
            for entry in data.get("legacyCrates", []):
                if isinstance(entry, dict) and isinstance(entry.get("path"), str):
                    approved_legacy.add(entry["path"])
        for legacy in legacy_names:
            if not (self.root / legacy).exists():
                continue
            if legacy in approved_legacy:
                checks.append(
                    AlignmentCheck(
                        id=f"rust-naming-{legacy.replace('/', '-')}",
                        category="naming",
                        severity="info",
                        status="pass",
                        message=f"{legacy} is an approved legacy crate pending rename per specs/naming-migration.manifest.json",
                        remediation="execute rename migration before reviewBy date",
                    )
                )
            else:
                checks.append(
                    AlignmentCheck(
                        id=f"rust-naming-{legacy.replace('/', '-')}",
                        category="naming",
                        severity="warning",
                        status="fail",
                        message=f"{legacy} uses legacy generic service naming instead of sdkwork-<domain>-<capability>-service",
                        remediation="plan rename/migration per NAMING_SPEC.md and RUST_CODE_SPEC.md",
                    )
                )
        return checks


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Audit sdkwork-claw-router alignment with sdkwork-specs framework standards."
    )
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Exit non-zero when any blocking check fails.",
    )
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON report.")
    args = parser.parse_args()

    result = SdkworkStandardAlignmentGuardian(root=args.root).run()
    if args.json:
        payload = {
            "ok": result.ok,
            "blockingFailures": len(result.blocking),
            "checks": [
                {
                    "id": check.id,
                    "category": check.category,
                    "severity": check.severity,
                    "status": check.status,
                    "message": check.message,
                    "remediation": check.remediation,
                }
                for check in result.checks
            ],
        }
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    else:
        for check in result.checks:
            prefix = {"pass": "PASS", "fail": "FAIL"}[check.status]
            print(f"[{prefix}] ({check.severity}) {check.message}")
            if check.status == "fail" and check.remediation:
                print(f"       -> {check.remediation}")
        print(
            f"\nAlignment summary: {sum(1 for c in result.checks if c.status == 'pass')} passed, "
            f"{sum(1 for c in result.checks if c.status == 'fail')} failed, "
            f"{len(result.blocking)} blocking"
        )

    if args.strict and not result.ok:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
