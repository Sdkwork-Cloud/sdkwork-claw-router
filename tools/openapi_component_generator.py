from __future__ import annotations

import argparse
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from tools.schema_registry_loader import load_schema_registry

try:
    import yaml
except ImportError as exc:  # pragma: no cover - exercised only on missing tooling
    yaml = None
    _YAML_IMPORT_ERROR = exc
else:
    _YAML_IMPORT_ERROR = None


STRING_TYPE_PATTERN = re.compile(r"^string\((\d+)\)$")

COMMON_COLUMN_TYPES = {
    "id": "int64",
    "uuid": "string(64)",
    "tenant_id": "int64",
    "organization_id": "int64",
    "user_id": "int64",
    "owner_type": "enum_int32",
    "owner_id": "int64",
    "data_scope": "enum_int32",
    "status": "enum_int32",
    "created_at": "instant",
    "updated_at": "instant",
    "version": "int64",
    "deleted_at": "instant",
    "deleted_by": "int64",
    "metadata": "json",
    "request_id": "string(128)",
    "trace_id": "string(128)",
    "payload_hash": "string(128)",
    "retention_until": "instant",
    "legal_hold": "bool",
    "operator_id": "int64",
    "action": "string(128)",
    "target_type": "enum_int32",
    "target_id": "int64",
    "source_type": "string(128)",
    "source_id": "int64",
    "source_version": "int64",
    "rebuild_version": "int64",
}


@dataclass(frozen=True)
class OpenApiComponentCheckResult:
    ok: bool
    messages: list[str]


class OpenApiComponentGenerator:
    """Generate OpenAPI component schemas from Schema Registry table contracts."""

    def __init__(self, root: Path, registry_path: Path | None = None) -> None:
        self.root = Path(root).resolve()
        self.registry_path = (
            Path(registry_path).resolve()
            if registry_path is not None
            else self.root / "docs" / "schema-registry" / "sdkwork-claw-router.tables.yaml"
        )

    def render_yaml(self) -> str:
        registry = self._load_registry()
        components = self._components(registry)
        return self._dump_yaml({"components": {"schemas": components}})

    def write(self, output_path: Path | None = None) -> Path:
        target = (
            Path(output_path)
            if output_path is not None
            else self.root / "generated" / "openapi" / "schema-components.yaml"
        )
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(self.render_yaml(), encoding="utf-8")
        return target

    def check(self, output_path: Path | None = None) -> OpenApiComponentCheckResult:
        target = (
            Path(output_path)
            if output_path is not None
            else self.root / "generated" / "openapi" / "schema-components.yaml"
        )
        expected = self.render_yaml()
        if not target.exists():
            return OpenApiComponentCheckResult(ok=False, messages=[f"openapi schema components are missing: {target}"])
        actual = target.read_text(encoding="utf-8")
        if actual != expected:
            return OpenApiComponentCheckResult(ok=False, messages=[f"openapi schema components are stale: {target}"])
        return OpenApiComponentCheckResult(ok=True, messages=[])

    def _load_registry(self) -> dict[str, Any]:
        return load_schema_registry(self.registry_path)

    def _components(self, registry: dict[str, Any]) -> dict[str, Any]:
        tables = registry.get("tables", [])
        if not isinstance(tables, list):
            tables = []
        schema = registry.get("schema_registry", {})
        common_column_groups = schema.get("common_column_groups", {}) if isinstance(schema, dict) else {}
        if not isinstance(common_column_groups, dict):
            common_column_groups = {}

        components: dict[str, Any] = {}
        for table in tables:
            if not isinstance(table, dict) or not isinstance(table.get("table"), str):
                continue
            component_name = self._component_name(table["table"])
            components[component_name] = self._component_schema(table, common_column_groups)
        return dict(sorted(components.items()))

    def _component_schema(self, table: dict[str, Any], common_column_groups: dict[str, Any]) -> dict[str, Any]:
        properties: dict[str, Any] = {}
        for name, registry_type in self._columns(table, common_column_groups):
            properties[name] = self._property_schema(registry_type)

        schema = {
            "type": "object",
            "x-table": table["table"],
            "x-domain": table.get("domain"),
            "x-generated-by-this-project": table.get("generated_by_this_project") is not False,
            "properties": properties,
        }
        required = self._required_columns(table, properties)
        if required:
            schema["required"] = required
        return schema

    def _required_columns(self, table: dict[str, Any], properties: dict[str, Any]) -> list[str]:
        not_null_columns = table.get("not_null_columns", [])
        if not isinstance(not_null_columns, list):
            return []
        return [
            column
            for column in not_null_columns
            if isinstance(column, str) and column in properties
        ]

    def _columns(self, table: dict[str, Any], common_column_groups: dict[str, Any]) -> list[tuple[str, str]]:
        columns: list[tuple[str, str]] = []
        group_name = table.get("common_columns")
        if isinstance(group_name, str):
            group_columns = common_column_groups.get(group_name, [])
            if isinstance(group_columns, list):
                for name in group_columns:
                    if isinstance(name, str):
                        columns.append((name, COMMON_COLUMN_TYPES.get(name, "string(128)")))

        explicit = table.get("columns", {})
        if isinstance(explicit, dict):
            for name, registry_type in explicit.items():
                if isinstance(name, str) and isinstance(registry_type, str):
                    columns.append((name, registry_type))
        return columns

    def _property_schema(self, registry_type: str) -> dict[str, Any]:
        string_match = STRING_TYPE_PATTERN.match(registry_type)
        if string_match:
            return {"type": "string", "maxLength": int(string_match.group(1))}
        if registry_type == "text":
            return {"type": "string"}
        if registry_type == "json":
            return {"type": "object", "additionalProperties": True}
        if registry_type == "bool":
            return {"type": "boolean"}
        if registry_type == "int32":
            return {"type": "integer", "format": "int32"}
        if registry_type == "enum_int32":
            return {"type": "string", "x-db-type": "enum_int32"}
        if registry_type == "int64":
            return {"type": "string", "format": "int64"}
        if registry_type == "decimal":
            return {"type": "string", "format": "decimal"}
        if registry_type == "instant":
            return {"type": "string", "format": "date-time"}
        if registry_type == "date":
            return {"type": "string", "format": "date"}
        return {"type": "string", "x-db-type": registry_type}

    def _component_name(self, table_name: str) -> str:
        return "".join(part.capitalize() for part in table_name.split("_")) + "Record"

    def _dump_yaml(self, data: dict[str, Any]) -> str:
        return yaml.safe_dump(data, allow_unicode=True, sort_keys=False, default_flow_style=False)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate OpenAPI component schemas from Schema Registry.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    parser.add_argument("--registry", type=Path, default=None, help="schema registry YAML path")
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="output OpenAPI components path; defaults to generated/openapi/schema-components.yaml",
    )
    parser.add_argument("--check", action="store_true", help="validate that the generated OpenAPI components are current")
    args = parser.parse_args()

    generator = OpenApiComponentGenerator(root=args.root, registry_path=args.registry)
    if args.check:
        result = generator.check(args.output)
        if result.ok:
            print("OpenAPI schema components are current")
            return 0
        for message in result.messages:
            print(message)
        return 1

    output = generator.write(args.output)
    print(f"Wrote OpenAPI schema components to {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
