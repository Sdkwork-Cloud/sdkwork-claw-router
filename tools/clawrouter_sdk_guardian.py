from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class ClawRouterSdkGuardianResult:
    ok: bool
    messages: list[str]


@dataclass(frozen=True)
class ExpectedSdk:
    directory: str
    package_name: str
    sdk_type: str
    client_name: str
    api_prefix: str


class ClawRouterSdkGuardian:
    """Check generated project SDK packages without modifying generator-owned files."""

    APP_MODEL_CATALOG_PRIVATE_ITEM_FIELDS = ("lowestUpstreamCostUnitPrice",)
    APP_MODEL_CATALOG_PRIVATE_AVAILABILITY_FIELDS = (
        "customerUnitPrice",
        "grossMarginPerUnit",
        "pricingPlanCode",
        "groupCode",
    )
    APP_MODEL_CATALOG_PUBLIC_AVAILABILITY_STATUS = ("reference", "unavailable")

    EXPECTED = (
        ExpectedSdk(
            directory="clawrouter-app-sdk",
            package_name="@sdkwork/clawrouter-app-sdk",
            sdk_type="app",
            client_name="SdkworkAppClient",
            api_prefix="/app/v3/api",
        ),
        ExpectedSdk(
            directory="clawrouter-backend-sdk",
            package_name="@sdkwork/clawrouter-backend-sdk",
            sdk_type="backend",
            client_name="SdkworkBackendClient",
            api_prefix="/backend/v3/api",
        ),
    )

    def __init__(self, root: Path) -> None:
        self.root = Path(root).resolve()
        self.sdk_root = self.root / "sdks"

    def run(self) -> ClawRouterSdkGuardianResult:
        messages: list[str] = []
        for expected in self.EXPECTED:
            messages.extend(self._check_sdk(expected))
        messages.extend(self._check_portal_boundary())
        return ClawRouterSdkGuardianResult(ok=not messages, messages=messages)

    def _check_sdk(self, expected: ExpectedSdk) -> list[str]:
        base = self.sdk_root / expected.directory
        messages: list[str] = []
        if not base.exists():
            return [f"generated SDK is missing: {base}"]
        if not base.is_dir():
            return [f"generated SDK path must be a directory: {base}"]

        package = self._read_json(base / "package.json", messages)
        if package is not None and package.get("name") != expected.package_name:
            messages.append(f"{expected.directory} package.json name must be {expected.package_name}")
        if package is not None:
            self._check_package_entry_files(expected.directory, base, package, messages)
            self._check_package_build_standard(expected.directory, base, package, messages)

        metadata = self._read_json(base / "sdkwork-sdk.json", messages)
        if metadata is not None:
            if metadata.get("language") != "typescript":
                messages.append(f"{expected.directory} sdkwork-sdk.json language must be typescript")
            if metadata.get("sdkType") != expected.sdk_type:
                messages.append(f"{expected.directory} sdkwork-sdk.json sdkType must be {expected.sdk_type}")

        self._require_file(base / "README.md", messages)
        self._require_file(base / "custom" / "README.md", messages)
        self._require_file(base / ".sdkwork" / "sdkwork-generator-manifest.json", messages)

        sdk_source = self._read_text(base / "src" / "sdk.ts", messages)
        if sdk_source is not None and expected.client_name not in sdk_source:
            messages.append(f"{expected.directory} src/sdk.ts must export {expected.client_name}")

        paths_source = self._read_text(base / "src" / "api" / "paths.ts", messages)
        if paths_source is not None and expected.api_prefix not in paths_source:
            messages.append(f"{expected.directory} src/api/paths.ts must contain {expected.api_prefix}")

        self._check_unexported_api_artifacts(expected.directory, base, messages)
        self._check_type_index_exports(expected.directory, base, messages)

        if expected.sdk_type == "app":
            self._check_public_app_model_catalog_types(expected.directory, base, messages)
        return messages

    def _read_json(self, path: Path, messages: list[str]) -> dict[str, Any] | None:
        if not path.exists():
            messages.append(f"required SDK file is missing: {path}")
            return None
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            messages.append(f"required SDK file is invalid JSON: {path}: {exc}")
            return None
        if not isinstance(payload, dict):
            messages.append(f"required SDK JSON file must contain an object: {path}")
            return None
        return payload

    def _read_text(self, path: Path, messages: list[str]) -> str | None:
        if not path.exists():
            messages.append(f"required SDK file is missing: {path}")
            return None
        try:
            return path.read_text(encoding="utf-8")
        except OSError as exc:
            messages.append(f"required SDK file cannot be read: {path}: {exc}")
            return None

    def _require_file(self, path: Path, messages: list[str]) -> None:
        if not path.exists() or not path.is_file():
            messages.append(f"required SDK file is missing: {path}")

    def _check_package_entry_files(
        self,
        sdk_dir: str,
        base: Path,
        package: dict[str, Any],
        messages: list[str],
    ) -> None:
        for field in ("main", "module", "types"):
            value = package.get(field)
            if not isinstance(value, str) or not value.strip():
                messages.append(f"{sdk_dir} package.json must declare {field}")
                continue
            self._check_package_relative_file(sdk_dir, base, f"package.json {field}", value, messages)

        exports = package.get("exports")
        if not isinstance(exports, dict):
            messages.append(f"{sdk_dir} package.json must declare exports")
            return

        root_export = exports.get(".")
        if not isinstance(root_export, dict):
            messages.append(f"{sdk_dir} package.json exports must declare .")
            return

        for condition in ("types", "import", "require"):
            value = root_export.get(condition)
            if not isinstance(value, str) or not value.strip():
                messages.append(f"{sdk_dir} package.json exports[.] must declare {condition}")
                continue
            self._check_package_relative_file(
                sdk_dir,
                base,
                f"package.json exports[.].{condition}",
                value,
                messages,
            )

    def _check_package_relative_file(
        self,
        sdk_dir: str,
        base: Path,
        label: str,
        raw_value: str,
        messages: list[str],
    ) -> None:
        display = self._display_package_path(raw_value)
        relative_value = raw_value.removeprefix("./")
        relative_path = Path(relative_value)
        if relative_path.is_absolute() or ".." in relative_path.parts:
            messages.append(f"{sdk_dir} {label} must stay inside SDK package: {display}")
            return
        target = base / relative_path
        if not target.exists() or not target.is_file():
            messages.append(f"{sdk_dir} {label} points to missing file: {display}")

    def _display_package_path(self, raw_value: str) -> str:
        return raw_value.removeprefix("./").replace("\\", "/")

    def _check_package_build_standard(
        self,
        sdk_dir: str,
        base: Path,
        package: dict[str, Any],
        messages: list[str],
    ) -> None:
        scripts = package.get("scripts")
        if not isinstance(scripts, dict):
            scripts = {}
        if scripts.get("build") != "node custom/build-runtime.mjs":
            messages.append(f"{sdk_dir} package.json scripts.build must be node custom/build-runtime.mjs")
        if scripts.get("dev") != "node custom/build-runtime.mjs":
            messages.append(f"{sdk_dir} package.json scripts.dev must be node custom/build-runtime.mjs")
        if scripts.get("prepublishOnly") != "npm run build":
            messages.append(f"{sdk_dir} package.json scripts.prepublishOnly must be npm run build")

        build_script = base / "custom" / "build-runtime.mjs"
        if not build_script.exists() or not build_script.is_file():
            messages.append(f"{sdk_dir} custom/build-runtime.mjs is required for SDK runtime builds")

        dev_dependencies = package.get("devDependencies")
        if not isinstance(dev_dependencies, dict):
            dev_dependencies = {}
        for forbidden in ("vite", "vite-plugin-dts"):
            if forbidden in dev_dependencies:
                messages.append(f"{sdk_dir} package.json devDependencies must not include {forbidden}")
        for required in ("typescript", "rollup"):
            if required not in dev_dependencies:
                messages.append(f"{sdk_dir} package.json devDependencies must include {required}")

    def _check_public_app_model_catalog_types(self, sdk_dir: str, base: Path, messages: list[str]) -> None:
        types_dir = base / "src" / "types"
        item_source = self._read_text(types_dir / "app-model-catalog-item.ts", messages)
        availability_source = self._read_text(types_dir / "app-model-catalog-price-availability.ts", messages)

        if item_source is not None:
            for field in self.APP_MODEL_CATALOG_PRIVATE_ITEM_FIELDS:
                if self._has_typescript_property(item_source, field):
                    messages.append(
                        f"{sdk_dir} AppModelCatalogItem must not expose public private pricing field {field}"
                    )

        if availability_source is None:
            return

        status_values = self._typescript_property_union_literals(availability_source, "status")
        expected_values = list(self.APP_MODEL_CATALOG_PUBLIC_AVAILABILITY_STATUS)
        if status_values != expected_values:
            messages.append(
                f"{sdk_dir} AppModelCatalogPriceAvailability.status must be "
                f"'reference' | 'unavailable'"
            )
        if "available" in status_values:
            messages.append(f"{sdk_dir} AppModelCatalogPriceAvailability.status must not expose public available")

        for field in self.APP_MODEL_CATALOG_PRIVATE_AVAILABILITY_FIELDS:
            if self._has_typescript_property(availability_source, field):
                messages.append(
                    f"{sdk_dir} AppModelCatalogPriceAvailability must not expose public private "
                    f"pricing field {field}"
                )

    def _check_unexported_api_artifacts(self, sdk_dir: str, base: Path, messages: list[str]) -> None:
        index_path = base / "src" / "api" / "index.ts"
        index_source = self._read_text(index_path, messages)
        if index_source is None:
            return
        exported_stems = set(re.findall(r"from\s+['\"]\./([^'\"]+)['\"]", index_source))
        allowed_stems = {"base", "index", "paths", *exported_stems}
        api_dir = base / "src" / "api"
        if not api_dir.is_dir():
            return
        for source_path in sorted(api_dir.glob("*.ts")):
            if source_path.stem not in allowed_stems:
                relative = source_path.relative_to(base).as_posix()
                messages.append(f"{sdk_dir} must not contain unexported generated API artifact: {relative}")

    def _check_type_index_exports(self, sdk_dir: str, base: Path, messages: list[str]) -> None:
        types_dir = base / "src" / "types"
        index_path = types_dir / "index.ts"
        index_source = self._read_text(index_path, messages)
        if index_source is None:
            return
        exported_stems = set(re.findall(r"from\s+['\"]\./([^'\"]+)['\"]", index_source))
        for source_path in sorted(types_dir.glob("*.ts")):
            if source_path.name == "index.ts":
                continue
            source = self._read_text(source_path, messages)
            if source is None:
                continue
            match = re.search(
                r"^\s*export\s+(?:interface|type|class|enum)\s+([A-Za-z_$][A-Za-z0-9_$]*)",
                source,
                flags=re.MULTILINE,
            )
            if match is None:
                continue
            if source_path.stem not in exported_stems:
                messages.append(
                    f"{sdk_dir} src/types/index.ts must export {match.group(1)} from ./{source_path.stem}"
                )

    def _has_typescript_property(self, source: str, property_name: str) -> bool:
        return re.search(rf"^\s*{re.escape(property_name)}\??\s*:", source, flags=re.MULTILINE) is not None

    def _typescript_property_union_literals(self, source: str, property_name: str) -> list[str]:
        match = re.search(rf"^\s*{re.escape(property_name)}\??\s*:\s*([^;\n]+)", source, flags=re.MULTILINE)
        if match is None:
            return []
        return re.findall(r"['\"]([^'\"]+)['\"]", match.group(1))

    def _check_portal_boundary(self) -> list[str]:
        messages: list[str] = []
        portal_root = self.root / "apps" / "sdkwork-claw-router-portal"
        commons_root = portal_root / "packages" / "sdkwork-claw-router-commons"

        portal_package = self._read_json(portal_root / "package.json", messages)
        if portal_package is not None:
            self._check_dependency(portal_package, "@sdkwork/clawrouter-app-sdk", "portal package.json", messages)
            self._check_dependency(portal_package, "@sdkwork/clawrouter-backend-sdk", "portal package.json", messages)

        commons_package = self._read_json(commons_root / "package.json", messages)
        if commons_package is not None:
            self._check_dependency(commons_package, "@sdkwork/clawrouter-app-sdk", "portal commons package.json", messages)
            self._check_dependency(commons_package, "@sdkwork/clawrouter-backend-sdk", "portal commons package.json", messages)

        boundary_relative = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/sdk-clients.ts"
        boundary_path = self.root / boundary_relative
        boundary_source = self._read_text(boundary_path, [])
        if boundary_source is None:
            messages.append(f"portal SDK boundary is missing: {boundary_relative}")
        else:
            for token in (
                "@sdkwork/clawrouter-app-sdk",
                "@sdkwork/clawrouter-backend-sdk",
                "createClawRouterAppSdkClient",
                "createClawRouterBackendSdkClient",
            ):
                if token not in boundary_source:
                    messages.append(f"portal SDK boundary must mention {token}")

        runtime_relative = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/runtime.ts"
        runtime_source = self._read_text(self.root / runtime_relative, [])
        if runtime_source is None or "./sdk-clients.ts" not in runtime_source:
            messages.append(f"portal commons runtime must export ./sdk-clients.ts: {runtime_relative}")

        index_relative = "apps/sdkwork-claw-router-portal/packages/sdkwork-claw-router-commons/src/index.ts"
        index_source = self._read_text(self.root / index_relative, [])
        if index_source is not None and re.search(r"['\"]\./sdk-clients(?:\.(?:ts|js))?['\"]", index_source):
            messages.append(
                "portal commons UI root must not export ./sdk-clients; use sdkwork-claw-router-commons/runtime: "
                f"{index_relative}"
            )

        return messages

    def _check_dependency(self, package_json: dict[str, Any], package_name: str, label: str, messages: list[str]) -> None:
        dependencies = package_json.get("dependencies", {})
        dev_dependencies = package_json.get("devDependencies", {})
        if not isinstance(dependencies, dict):
            dependencies = {}
        if not isinstance(dev_dependencies, dict):
            dev_dependencies = {}
        if package_name not in dependencies and package_name not in dev_dependencies:
            messages.append(f"{label} must depend on {package_name}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Check sdkwork-claw-router generated SDK packages.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    args = parser.parse_args()

    result = ClawRouterSdkGuardian(root=args.root).run()
    if result.ok:
        print("ClawRouter generated SDKs passed")
        return 0
    for message in result.messages:
        print(message)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
