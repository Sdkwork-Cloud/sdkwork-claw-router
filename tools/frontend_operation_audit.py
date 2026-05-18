from __future__ import annotations

import argparse
import json
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError as exc:  # pragma: no cover - exercised only on missing tooling
    yaml = None
    _YAML_IMPORT_ERROR = exc
else:
    _YAML_IMPORT_ERROR = None


@dataclass(frozen=True)
class FrontendOperationAuditResult:
    ok: bool
    messages: list[str]


class FrontendOperationAudit:
    """Audit portal service operations against route table contracts."""

    SOURCE_EXCLUDED_DIRECTORIES = frozenset(
        {
            ".git",
            ".turbo",
            ".vite",
            "coverage",
            "dist",
            "node_modules",
        }
    )
    CLASS_STATIC_ASYNC_PATTERN = re.compile(r"\bstatic\s+async\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(")
    OBJECT_ASYNC_PATTERN = re.compile(r"^\s*async\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(", re.MULTILINE)
    EXPORT_ASYNC_FUNCTION_PATTERN = re.compile(r"\bexport\s+async\s+function\s+([A-Za-z_][A-Za-z0-9_]*)\s*\(")
    VALID_KINDS = {"read", "create", "update", "delete", "action", "sync"}
    WRITE_KINDS = {"create", "update", "delete", "action", "sync"}
    VALID_API_SURFACES = {"app", "backend", "openai_v1"}
    API_PREFIXES = {
        "app": "/app/v3/api",
        "backend": "/backend/v3/api",
        "openai_v1": "/v1",
    }
    KIND_METHODS = {
        "read": {"GET"},
        "create": {"POST"},
        "update": {"PATCH", "PUT"},
        "delete": {"DELETE"},
        "action": {"POST"},
        "sync": {"POST"},
    }
    SDK_CLIENTS = {
        "app": "getClawRouterAppSdkClient",
        "backend": "getClawRouterBackendSdkClient",
        "openai_v1": "getClawRouterAiSdkClient",
    }
    APPBASE_IAM_RUNTIME_PATTERN = re.compile(r"\bgetClawRouterIamRuntime\s*\(\s*\)\s*\.service\b")
    APPBASE_IAM_CONTROLLER_PATTERN = re.compile(
        r"\bcreateSdkworkIamRuntimeAuthController\s*\([\s\S]*\bgetRuntime\s*:\s*getClawRouterIamRuntime\b"
    )
    APPBASE_IAM_CONTROLLER_OPERATIONS = (
        "bootstrap",
        "checkLoginQrCodeStatus",
        "confirmLoginQrCode",
        "generateLoginQrCode",
        "getOAuthAuthorizationUrl",
        "register",
        "requestPasswordReset",
        "resetPassword",
        "refreshSession",
        "sendVerifyCode",
        "signIn",
        "signInWithEmailCode",
        "signInWithOAuth",
        "signInWithPhoneCode",
        "signInWithSessionBridge",
        "signOut",
        "updateCurrentSession",
        "verifyCode",
    )
    MOCK_DATA_PATTERNS = (
        ("setTimeout", re.compile(r"\bsetTimeout\s*\(")),
        ("Math.random", re.compile(r"\bMath\.random\s*\(")),
        ("Promise.resolve", re.compile(r"\bPromise\.resolve\s*\(")),
        ("mock data", re.compile(r"\bmock\s+data\b", re.IGNORECASE)),
        ("local mock", re.compile(r"\blocal\s+mock\b", re.IGNORECASE)),
    )

    def __init__(
        self,
        root: Path,
        contract_path: Path | None = None,
        output_path: Path | None = None,
    ) -> None:
        self.root = Path(root).resolve()
        self.contract_path = (
            Path(contract_path).resolve()
            if contract_path is not None
            else self.root / "docs" / "schema-registry" / "frontend-field-contracts.yaml"
        )
        self.output_path = (
            Path(output_path).resolve()
            if output_path is not None
            else self.root / "generated" / "schema" / "frontend" / "frontend-operation-audit.json"
        )

    def generate(self) -> dict[str, Any]:
        operations: list[dict[str, Any]] = []
        contract_index = self._frontend_operation_contract_index()
        for source in self._source_files():
            display_source = self._display_path(source)
            for operation in self._extract_operations(source):
                contract = contract_index.get(f"{display_source}#{operation}", {})
                operations.append(
                    {
                        "source": display_source,
                        "operation": operation,
                        "route": contract.get("route"),
                        "kind": contract.get("kind"),
                        "api_surface": contract.get("api_surface"),
                        "api_method": contract.get("api_method"),
                        "api_path": contract.get("api_path"),
                        "read_sources": contract.get("read_sources", []),
                        "write_tables": contract.get("write_tables", []),
                        "file_targets": contract.get("file_targets", []),
                    }
                )

        operations.sort(key=lambda item: (item["source"], item["operation"]))
        return {
            "summary": {
                "source_file_count": len({item["source"] for item in operations}),
                "operation_count": len(operations),
                "write_operation_count": sum(1 for item in operations if item.get("kind") in self.WRITE_KINDS),
            },
            "operations": operations,
        }

    def render_json(self) -> str:
        return json.dumps(self.generate(), ensure_ascii=False, indent=2, sort_keys=True) + "\n"

    def write(self, output_path: Path | None = None) -> Path:
        target = Path(output_path) if output_path is not None else self.output_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(self.render_json(), encoding="utf-8")
        return target

    def check(self, output_path: Path | None = None) -> FrontendOperationAuditResult:
        validation = self.validate()
        if not validation.ok:
            return validation

        target = Path(output_path) if output_path is not None else self.output_path
        expected = self.render_json()
        if not target.exists():
            return FrontendOperationAuditResult(ok=False, messages=[f"frontend operation audit is missing: {target}"])
        actual = target.read_text(encoding="utf-8")
        if actual != expected:
            return FrontendOperationAuditResult(ok=False, messages=[f"frontend operation audit is stale: {target}"])
        return FrontendOperationAuditResult(ok=True, messages=[])

    def validate(self) -> FrontendOperationAuditResult:
        actual = {
            f"{item['source']}#{item['operation']}"
            for item in self.generate()["operations"]
            if isinstance(item.get("source"), str) and isinstance(item.get("operation"), str)
        }
        contract = self._load_contract()
        entries = contract.get("frontend_operations", [])
        if not isinstance(entries, list):
            return FrontendOperationAuditResult(ok=False, messages=["frontend_operations must be a list"])

        routes = contract.get("routes", [])
        route_tables: dict[str, set[str]] = {}
        if isinstance(routes, list):
            for route_entry in routes:
                if not isinstance(route_entry, dict):
                    continue
                route = route_entry.get("route")
                required_tables = route_entry.get("required_tables", [])
                if isinstance(route, str) and isinstance(required_tables, list):
                    route_tables[route] = {table for table in required_tables if isinstance(table, str)}

        expected: set[str] = set()
        messages: list[str] = []
        source_text_cache: dict[str, str | None] = {}
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            source = entry.get("source")
            operation = entry.get("operation")
            route = entry.get("route")
            kind = entry.get("kind")
            api_surface = entry.get("api_surface")
            api_method = entry.get("api_method")
            api_path = entry.get("api_path")
            if not isinstance(source, str) or not isinstance(operation, str):
                messages.append("frontend_operations entries must include source and operation")
                continue
            key = f"{source}#{operation}"
            expected.add(key)

            if not isinstance(route, str):
                messages.append(f"frontend operation {key} must declare route")
            elif route not in route_tables:
                messages.append(f"frontend operation {key} references route without route contract: {route}")
            if not isinstance(kind, str) or kind not in self.VALID_KINDS:
                messages.append(f"frontend operation {key} kind must be one of {', '.join(sorted(self.VALID_KINDS))}")
            if not isinstance(api_surface, str):
                messages.append(f"frontend operation {key} must declare api_surface")
            elif api_surface not in self.VALID_API_SURFACES:
                messages.append(f"frontend operation {key} api_surface must be one of {', '.join(sorted(self.VALID_API_SURFACES))}")
            if not isinstance(api_method, str):
                messages.append(f"frontend operation {key} must declare api_method")
            elif isinstance(kind, str) and kind in self.KIND_METHODS:
                normalized_method = api_method.upper()
                allowed_methods = self._allowed_methods(kind, api_surface)
                if normalized_method not in allowed_methods:
                    messages.append(f"frontend operation {key} kind {kind} does not allow api_method {normalized_method}")
            if not isinstance(api_path, str):
                messages.append(f"frontend operation {key} must declare api_path")
            if isinstance(route, str) and isinstance(api_surface, str):
                if route.startswith("/admin") and api_surface != "backend":
                    messages.append(f"frontend operation {key} route {route} must use backend api_surface")
                elif not route.startswith("/admin") and api_surface == "backend":
                    messages.append(f"frontend operation {key} route {route} must not use backend api_surface")
            if isinstance(api_surface, str) and api_surface in self.SDK_CLIENTS:
                source_text = self._source_text(source, source_text_cache)
                sdk_client = self.SDK_CLIENTS[api_surface]
                if (
                    source_text is not None
                    and not re.search(rf"\b{re.escape(sdk_client)}\s*\(", source_text)
                    and not (
                        api_surface == "app"
                        and (
                            self.APPBASE_IAM_RUNTIME_PATTERN.search(source_text)
                            or self.APPBASE_IAM_CONTROLLER_PATTERN.search(source_text)
                        )
                    )
                ):
                    messages.append(f"frontend operation {key} must use {sdk_client} for {api_surface} api_surface")
                for label in self._mock_data_pattern_labels(source_text):
                    messages.append(f"frontend operation {key} must not use mock async data pattern: {label}")

            read_sources = entry.get("read_sources", [])
            write_tables = entry.get("write_tables", [])
            file_targets = entry.get("file_targets", [])
            request_content_type = entry.get("request_content_type")
            is_multipart_upload = request_content_type == "multipart/form-data"
            valid_read_sources = isinstance(read_sources, list) and all(isinstance(source, str) for source in read_sources)
            valid_write_tables = isinstance(write_tables, list) and all(isinstance(table, str) for table in write_tables)
            valid_file_targets = isinstance(file_targets, list) and all(isinstance(target, str) for target in file_targets)

            if not valid_read_sources:
                messages.append(f"frontend operation {key} must declare read_sources as a string list")
            elif not read_sources and not is_multipart_upload:
                messages.append(f"frontend operation {key} must declare non-empty read_sources")
            elif read_sources and isinstance(route, str) and route in route_tables:
                for read_source in read_sources:
                    if read_source not in route_tables[route]:
                        messages.append(
                            f"frontend operation {key} read_source {read_source} is not declared in route {route} required_tables"
                        )

            if not valid_write_tables:
                messages.append(f"frontend operation {key} write_tables must be a string list")
            if not valid_file_targets:
                messages.append(f"frontend operation {key} file_targets must be a string list")
            if is_multipart_upload and valid_file_targets and not file_targets:
                messages.append(f"frontend operation {key} multipart upload must declare non-empty file_targets")

            if kind in self.WRITE_KINDS:
                if valid_write_tables and not write_tables and not is_multipart_upload:
                    messages.append(f"frontend operation {key} kind {kind} must declare non-empty write_tables")
                elif valid_write_tables and write_tables and isinstance(route, str) and route in route_tables:
                    for write_table in write_tables:
                        if write_table not in route_tables[route]:
                            messages.append(
                                f"frontend operation {key} write_table {write_table} is not declared in route {route} required_tables"
                            )
            elif valid_write_tables and write_tables:
                messages.append(f"frontend operation {key} kind read must not declare write_tables")

        for key in sorted(actual):
            if key not in expected:
                messages.append(f"frontend operation missing from contract: {key}")
        for key in sorted(expected):
            if key not in actual:
                messages.append(f"frontend operation contract references missing operation: {key}")

        return FrontendOperationAuditResult(ok=not messages, messages=messages)

    def _source_files(self) -> list[Path]:
        portal_root = self.root / "apps" / "sdkwork-claw-router-portal"
        source_roots = [portal_root / "packages", portal_root / "src"]
        files: list[Path] = []
        for source_root in source_roots:
            if not source_root.exists():
                continue
            for path in self._walk_source_tree(source_root):
                if path.suffix not in {".ts", ".tsx"}:
                    continue
                if self._is_operation_source_file(path, portal_root):
                    files.append(path)
        return sorted(files)

    def _is_operation_source_file(self, path: Path, portal_root: Path) -> bool:
        lowered_name = path.name.lower()
        if "service" in lowered_name:
            return True
        portal_src = portal_root / "src"
        try:
            path.relative_to(portal_src)
        except ValueError:
            return False
        return "controller" in lowered_name

    def _walk_source_tree(self, root: Path) -> list[Path]:
        files: list[Path] = []

        def ignore_scan_error(_error: OSError) -> None:
            return None

        for directory, names, filenames in os.walk(root, onerror=ignore_scan_error):
            names[:] = sorted(
                name for name in names if name not in self.SOURCE_EXCLUDED_DIRECTORIES
            )
            base = Path(directory)
            for filename in sorted(filenames):
                files.append(base / filename)
        return files

    def _extract_operations(self, source: Path) -> list[str]:
        text = source.read_text(encoding="utf-8", errors="ignore")
        operations: list[str] = []
        if self.APPBASE_IAM_CONTROLLER_PATTERN.search(text):
            operations.extend(self.APPBASE_IAM_CONTROLLER_OPERATIONS)
        class_spans = self._class_spans(text)
        for match in self.CLASS_STATIC_ASYNC_PATTERN.finditer(text):
            operation = match.group(1)
            if operation not in operations:
                operations.append(operation)
        for pattern in [self.OBJECT_ASYNC_PATTERN, self.EXPORT_ASYNC_FUNCTION_PATTERN]:
            for match in pattern.finditer(text):
                if self._inside_spans(match.start(), class_spans):
                    continue
                operation = match.group(1)
                if operation not in operations:
                    operations.append(operation)
        return operations

    def _class_spans(self, text: str) -> list[tuple[int, int]]:
        spans: list[tuple[int, int]] = []
        for match in re.finditer(r"\bclass\s+[A-Za-z_][A-Za-z0-9_]*", text):
            start = text.find("{", match.end())
            if start == -1:
                continue
            end = self._balanced_block_end(text, start)
            spans.append((match.start(), end))
        return spans

    def _balanced_block_end(self, text: str, start: int) -> int:
        depth = 0
        for index in range(start, len(text)):
            char = text[index]
            if char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
                if depth == 0:
                    return index + 1
        return len(text)

    def _inside_spans(self, index: int, spans: list[tuple[int, int]]) -> bool:
        return any(start <= index < end for start, end in spans)

    def _load_contract(self) -> dict[str, Any]:
        if yaml is None:
            raise RuntimeError("PyYAML is required to load frontend field contracts") from _YAML_IMPORT_ERROR
        if not self.contract_path.exists():
            return {}
        contract = yaml.safe_load(self.contract_path.read_text(encoding="utf-8"))
        if contract is None:
            return {}
        if not isinstance(contract, dict):
            raise ValueError("frontend field contract root must be a mapping")
        return contract

    def _frontend_operation_contract_index(self) -> dict[str, dict[str, Any]]:
        contract = self._load_contract()
        entries = contract.get("frontend_operations", [])
        if not isinstance(entries, list):
            return {}

        indexed: dict[str, dict[str, Any]] = {}
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            source = entry.get("source")
            operation = entry.get("operation")
            if not isinstance(source, str) or not isinstance(operation, str):
                continue
            indexed[f"{source}#{operation}"] = entry
        return indexed

    def _allowed_methods(self, kind: str, api_surface: Any) -> set[str]:
        methods = set(self.KIND_METHODS[kind])
        if kind == "read" and api_surface == "backend":
            methods.add("POST")
        return methods

    def _source_text(self, source: str, cache: dict[str, str | None]) -> str | None:
        if source in cache:
            return cache[source]
        path = self.root / source
        if not path.exists() or not path.is_file():
            cache[source] = None
            return None
        cache[source] = path.read_text(encoding="utf-8", errors="ignore")
        return cache[source]

    def _mock_data_pattern_labels(self, source_text: str | None) -> list[str]:
        if source_text is None:
            return []
        labels: list[str] = []
        for label, pattern in self.MOCK_DATA_PATTERNS:
            if pattern.search(source_text):
                labels.append(label)
        return labels

    def _display_path(self, path: Path) -> str:
        try:
            return path.relative_to(self.root).as_posix()
        except ValueError:
            return path.as_posix()


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit portal TypeScript service operations against route data contracts.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    parser.add_argument("--contract", type=Path, default=None, help="frontend field contract YAML path")
    parser.add_argument("--output", type=Path, default=None, help="output audit JSON path")
    parser.add_argument("--check", action="store_true", help="validate generated operation audit and operation contracts")
    args = parser.parse_args()

    auditor = FrontendOperationAudit(root=args.root, contract_path=args.contract, output_path=args.output)
    if args.check:
        result = auditor.check(args.output)
        if result.ok:
            print("Frontend operation audit is current")
            return 0
        for message in result.messages:
            print(message)
        return 1

    validation = auditor.validate()
    if not validation.ok:
        for message in validation.messages:
            print(message)
        return 1

    output = auditor.write(args.output)
    print(f"Wrote frontend operation audit to {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
