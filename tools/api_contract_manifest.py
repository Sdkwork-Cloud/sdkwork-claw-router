from __future__ import annotations

import argparse
import json
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
class ApiContractManifestCheckResult:
    ok: bool
    messages: list[str]


class ApiContractManifestGenerator:
    """Compile frontend operation contracts into SDK/API gateway manifest data."""

    SDK_BOUNDARIES: dict[str, dict[str, str]] = {
        "app": {
            "api_prefix": "/app/v3/api",
            "sdk_family": "app",
            "sdk_client": "SdkworkAppClient",
            "openapi_source": "spring-ai-plus-app-api/sdkwork-sdk-app/app-openapi-8080.json",
            "generated_sdk_home": "spring-ai-plus-app-api/sdkwork-sdk-app",
            "generator": "sdk/sdkwork-sdk-generator",
        },
        "backend": {
            "api_prefix": "/backend/v3/api",
            "sdk_family": "backend",
            "sdk_client": "SdkworkBackendClient",
            "openapi_source": "spring-ai-plus-backend-api/sdkwork-sdk-backend/backend-openapi-8080.json",
            "generated_sdk_home": "spring-ai-plus-backend-api/sdkwork-sdk-backend",
            "generator": "sdk/sdkwork-sdk-generator",
        },
        "openai_v1": {
            "api_prefix": "/v1",
            "sdk_family": "ai",
            "sdk_client": "SdkworkAiClient",
            "openapi_source": "spring-ai-plus-ai-api/sdkwork-sdk-ai",
            "generated_sdk_home": "spring-ai-plus-ai-api/sdkwork-sdk-ai",
            "generator": "sdk/sdkwork-sdk-generator",
        },
    }
    VALID_KINDS = {"read", "create", "update", "delete", "action", "sync"}
    KIND_METHODS = {
        "read": {"GET"},
        "create": {"POST"},
        "update": {"PATCH", "PUT"},
        "delete": {"DELETE"},
        "action": {"POST"},
        "sync": {"POST"},
    }
    PATH_PARAM_PATTERN = re.compile(r"\{([A-Za-z_][A-Za-z0-9_]*)\}")
    PAYLOAD_SCHEMA_NAME_PATTERN = re.compile(r"^[A-Z][A-Za-z0-9]*$")
    RESERVED_PAYLOAD_SCHEMA_NAMES = {
        "ErrorResponse",
        "OperationRequest",
        "OperationResponse",
        "PageResult",
        "PlusApiResult",
    }
    JSON_SCHEMA_CONSTRAINT_KEYS = {
        "$ref",
        "allOf",
        "anyOf",
        "const",
        "default",
        "deprecated",
        "enum",
        "example",
        "examples",
        "exclusiveMaximum",
        "exclusiveMinimum",
        "format",
        "items",
        "maxItems",
        "maxLength",
        "maxProperties",
        "maximum",
        "minItems",
        "minLength",
        "minProperties",
        "minimum",
        "multipleOf",
        "not",
        "nullable",
        "oneOf",
        "pattern",
        "patternProperties",
        "propertyNames",
        "readOnly",
        "uniqueItems",
        "writeOnly",
    }

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
            else self.root / "generated" / "api" / "api-contract-manifest.json"
        )

    def generate(self) -> dict[str, Any]:
        operations = [
            self._compile_operation(entry)
            for entry in self._frontend_operations()
            if isinstance(entry, dict)
        ]
        operations.sort(key=lambda item: item["key"])

        api_surface_counts: dict[str, int] = {}
        sdk_client_counts: dict[str, int] = {}
        route_scope_counts: dict[str, int] = {}
        method_counts: dict[str, int] = {}
        for operation in operations:
            self._increment(api_surface_counts, operation["api_surface"])
            self._increment(sdk_client_counts, operation["sdk_client"])
            self._increment(route_scope_counts, operation["route_scope"])
            self._increment(method_counts, operation["api_method"])

        return {
            "schema": {
                "name": "sdkwork-claw-router-api-contract-manifest",
                "version": "0.1.0",
                "contract_path": self._display_path(self.contract_path),
            },
            "summary": {
                "operation_count": len(operations),
                "api_surface_counts": dict(sorted(api_surface_counts.items())),
                "sdk_client_counts": dict(sorted(sdk_client_counts.items())),
                "route_scope_counts": dict(sorted(route_scope_counts.items())),
                "api_method_counts": dict(sorted(method_counts.items())),
            },
            "sdk_boundaries": self.SDK_BOUNDARIES,
            "operations": operations,
        }

    def render_json(self) -> str:
        return json.dumps(self.generate(), ensure_ascii=False, indent=2, sort_keys=True) + "\n"

    def write(self, output_path: Path | None = None) -> Path:
        validation = self.validate()
        if not validation.ok:
            raise ValueError("\n".join(validation.messages))

        target = Path(output_path) if output_path is not None else self.output_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(self.render_json(), encoding="utf-8", newline="\n")
        return target

    def check(self, output_path: Path | None = None) -> ApiContractManifestCheckResult:
        validation = self.validate()
        if not validation.ok:
            return validation

        target = Path(output_path) if output_path is not None else self.output_path
        expected = self.render_json()
        if not target.exists():
            return ApiContractManifestCheckResult(ok=False, messages=[f"api contract manifest is missing: {target}"])
        actual = target.read_text(encoding="utf-8")
        if actual != expected:
            return ApiContractManifestCheckResult(ok=False, messages=[f"api contract manifest is stale: {target}"])
        return ApiContractManifestCheckResult(ok=True, messages=[])

    def validate(self) -> ApiContractManifestCheckResult:
        entries = self._frontend_operations()
        messages: list[str] = []
        keys: set[str] = set()
        openapi_operations: dict[tuple[str, str, str], str] = {}

        for entry in entries:
            if not isinstance(entry, dict):
                messages.append("frontend_operations entries must be mappings")
                continue

            source = entry.get("source")
            operation = entry.get("operation")
            route = entry.get("route")
            kind = entry.get("kind")
            api_surface = entry.get("api_surface")
            api_method = entry.get("api_method")
            api_path = entry.get("api_path")
            openapi_exposed = entry.get("openapi_exposed", True)
            key = self._operation_key(source, operation)

            if key in keys:
                messages.append(f"duplicate api contract operation: {key}")
            else:
                keys.add(key)

            if "openapi_exposed" in entry and not isinstance(openapi_exposed, bool):
                messages.append(f"api contract {key} openapi_exposed must be boolean")

            if (
                openapi_exposed is not False
                and
                isinstance(api_surface, str)
                and api_surface in self.SDK_BOUNDARIES
                and isinstance(api_method, str)
                and isinstance(api_path, str)
            ):
                openapi_key = (api_surface, api_method.upper(), api_path)
                existing = openapi_operations.get(openapi_key)
                if existing is not None and existing != key:
                    messages.append(
                        f"duplicate OpenAPI path/method on {api_surface} {api_method.upper()} {api_path}: {existing} and {key}"
                    )
                else:
                    openapi_operations[openapi_key] = key

            if not isinstance(source, str) or not source:
                messages.append(f"api contract {key} must declare source")
            if not isinstance(operation, str) or not operation:
                messages.append(f"api contract {key} must declare operation")
            if not isinstance(route, str) or not route:
                messages.append(f"api contract {key} must declare route")
            if not isinstance(kind, str) or kind not in self.VALID_KINDS:
                messages.append(f"api contract {key} kind must be one of {', '.join(sorted(self.VALID_KINDS))}")
            if not isinstance(api_surface, str) or api_surface not in self.SDK_BOUNDARIES:
                messages.append(f"api contract {key} api_surface must be one of {', '.join(sorted(self.SDK_BOUNDARIES))}")
                continue
            if not isinstance(api_method, str):
                messages.append(f"api contract {key} must declare api_method")
            elif isinstance(kind, str) and kind in self.KIND_METHODS:
                method = api_method.upper()
                allowed_methods = self._allowed_methods(kind, api_surface)
                if method not in allowed_methods:
                    messages.append(f"api contract {key} kind {kind} does not allow api_method {method}")
            if not isinstance(api_path, str):
                messages.append(f"api contract {key} must declare api_path")
            else:
                prefix = self.SDK_BOUNDARIES[api_surface]["api_prefix"]
                if not api_path.startswith(prefix):
                    messages.append(f"api contract {key} api_path must start with {prefix}")
                invalid_param = self._invalid_path_param(api_path)
                if invalid_param:
                    messages.append(f"api contract {key} path param is invalid: {invalid_param}")

            if isinstance(route, str):
                if route.startswith("/admin") and api_surface != "backend":
                    messages.append(f"api contract {key} route {route} must use backend api_surface")
                elif not route.startswith("/admin") and api_surface == "backend":
                    messages.append(f"api contract {key} route {route} must not use backend api_surface")

            read_sources = entry.get("read_sources")
            if not isinstance(read_sources, list) or not all(isinstance(item, str) for item in read_sources):
                messages.append(f"api contract {key} must declare read_sources as string list")
            write_tables = entry.get("write_tables", [])
            if write_tables and (not isinstance(write_tables, list) or not all(isinstance(item, str) for item in write_tables)):
                messages.append(f"api contract {key} write_tables must be a string list")
            messages.extend(self._query_parameter_validation_messages(key, entry.get("query_parameters")))
            for field in ("request_schema", "response_schema"):
                messages.extend(self._payload_schema_validation_messages(key, field, entry.get(field)))

        return ApiContractManifestCheckResult(ok=not messages, messages=messages)

    def _compile_operation(self, entry: dict[str, Any]) -> dict[str, Any]:
        source = self._string(entry.get("source"))
        operation = self._string(entry.get("operation"))
        route = self._string(entry.get("route"))
        api_surface = self._string(entry.get("api_surface"))
        api_method = self._string(entry.get("api_method")).upper()
        api_path = self._string(entry.get("api_path"))
        boundary = self.SDK_BOUNDARIES.get(api_surface, self.SDK_BOUNDARIES["app"])

        compiled = {
            "key": self._operation_key(source, operation),
            "source": source,
            "operation": operation,
            "route": route,
            "route_scope": self._route_scope(route),
            "module": self._module_name(source, route),
            "kind": self._string(entry.get("kind")),
            "api_surface": api_surface,
            "api_method": api_method,
            "api_path": api_path,
            "tag": self._tag(api_surface, api_path),
            "path_params": self.PATH_PARAM_PATTERN.findall(api_path),
            "sdk_family": boundary["sdk_family"],
            "sdk_client": boundary["sdk_client"],
            "sdk_api_prefix": boundary["api_prefix"],
            "sdk_domain": self._string(entry.get("sdk_domain")),
            "openapi_exposed": entry.get("openapi_exposed", True) is not False,
            "idempotency_required": bool(entry.get("idempotency_required")),
            "request_id_header": bool(entry.get("request_id_header")),
            "request_body_required": entry.get("request_body_required"),
            "read_sources": self._string_list(entry.get("read_sources")),
            "write_tables": self._string_list(entry.get("write_tables")),
            "query_parameters_declared": "query_parameters" in entry,
            "query_parameters": self._normalize_query_parameters(entry.get("query_parameters")),
        }
        description = self._string(entry.get("description"))
        if description:
            compiled["description"] = description
        summary = self._string(entry.get("summary"))
        if summary:
            compiled["summary"] = summary
        request_schema = self._normalize_payload_schema(entry.get("request_schema"))
        if request_schema is not None:
            compiled["request_schema"] = request_schema
        response_schema = self._normalize_payload_schema(entry.get("response_schema"))
        if response_schema is not None:
            compiled["response_schema"] = response_schema
        return compiled

    def _frontend_operations(self) -> list[Any]:
        contract = self._load_contract()
        operations = contract.get("frontend_operations", [])
        if operations is None:
            return []
        if not isinstance(operations, list):
            raise ValueError("frontend_operations must be a list")
        return operations

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

    def _allowed_methods(self, kind: str, api_surface: str) -> set[str]:
        methods = set(self.KIND_METHODS[kind])
        if kind == "read" and api_surface == "backend":
            methods.add("POST")
        return methods

    def _invalid_path_param(self, api_path: str) -> str | None:
        for raw in re.findall(r"\{([^}]*)\}", api_path):
            if not re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", raw):
                return raw
        return None

    def _payload_schema_validation_messages(self, key: str, field: str, value: Any) -> list[str]:
        if value is None:
            return []
        if not isinstance(value, dict):
            return [f"api contract {key} {field} must be an object"]

        messages: list[str] = []
        name = value.get("name")
        if not isinstance(name, str) or not self.PAYLOAD_SCHEMA_NAME_PATTERN.match(name):
            messages.append(f"api contract {key} {field}.name must be PascalCase")
        elif name in self.RESERVED_PAYLOAD_SCHEMA_NAMES:
            messages.append(f"api contract {key} {field}.name must not use reserved schema name {name}")

        schema = value.get("schema")
        schema_source = schema if isinstance(schema, dict) else value
        schema_type = self._string(schema_source.get("type")) or "object" if isinstance(schema_source, dict) else "object"
        if schema_type == "array":
            items = schema_source.get("items") if isinstance(schema_source, dict) else None
            if not isinstance(items, dict):
                messages.append(f"api contract {key} {field}.items must be an object")
            else:
                messages.extend(self._payload_object_property_validation_messages(key, f"{field}.items", items))
        else:
            messages.extend(self._payload_object_property_validation_messages(key, field, schema_source))

        required = schema_source.get("required") if isinstance(schema_source, dict) else None
        if required is not None and (not isinstance(required, list) or not all(isinstance(item, str) for item in required)):
            messages.append(f"api contract {key} {field}.required must be a string list")
        return messages

    def _query_parameter_validation_messages(self, key: str, value: Any) -> list[str]:
        if value is None:
            return []
        if not isinstance(value, list):
            return [f"api contract {key} query_parameters must be a list"]

        messages: list[str] = []
        names: set[str] = set()
        for index, parameter in enumerate(value):
            if not isinstance(parameter, dict):
                messages.append(f"api contract {key} query_parameters[{index}] must be an object")
                continue
            name = parameter.get("name")
            if not isinstance(name, str) or not re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", name):
                messages.append(f"api contract {key} query_parameters[{index}].name must be camelCase identifier")
            elif name in names:
                messages.append(f"api contract {key} query_parameters duplicate name: {name}")
            else:
                names.add(name)

            location = parameter.get("in", "query")
            if location != "query":
                messages.append(f"api contract {key} query_parameters[{index}].in must be query")

            required = parameter.get("required", False)
            if not isinstance(required, bool):
                messages.append(f"api contract {key} query_parameters[{index}].required must be boolean")

            schema = parameter.get("schema")
            if schema is not None and not isinstance(schema, dict):
                messages.append(f"api contract {key} query_parameters[{index}].schema must be an object")
        return messages

    def _payload_object_property_validation_messages(
        self,
        key: str,
        field: str,
        schema_source: Any,
    ) -> list[str]:
        if not isinstance(schema_source, dict):
            return [f"api contract {key} {field}.properties must be an object"]
        if isinstance(schema_source.get("$ref"), str):
            return []
        schema_type = self._string(schema_source.get("type")) or "object"
        if schema_type != "object":
            return []

        properties = schema_source.get("properties")
        if not isinstance(properties, dict):
            return [f"api contract {key} {field}.properties must be an object"]

        messages: list[str] = []
        for property_name, property_schema in properties.items():
            if not isinstance(property_name, str) or not property_name:
                messages.append(f"api contract {key} {field}.properties keys must be non-empty strings")
            if not isinstance(property_schema, dict):
                messages.append(f"api contract {key} {field}.properties.{property_name} must be an object")
        return messages

    def _normalize_payload_schema(self, value: Any) -> dict[str, Any] | None:
        if not isinstance(value, dict) or not isinstance(value.get("name"), str):
            return None

        raw_schema = value.get("schema")
        schema_source = raw_schema if isinstance(raw_schema, dict) else value
        if not isinstance(schema_source, dict):
            return None

        schema = self._normalize_json_schema(schema_source)
        if not isinstance(schema, dict):
            return None
        return {
            "name": value["name"],
            "schema": schema,
        }

    def _normalize_json_schema(self, value: Any) -> dict[str, Any] | None:
        if not isinstance(value, dict):
            return None
        if isinstance(value.get("$ref"), str):
            return {"$ref": value["$ref"]}

        schema: dict[str, Any] = {}
        name = value.get("name")
        if isinstance(name, str) and self.PAYLOAD_SCHEMA_NAME_PATTERN.match(name):
            schema["name"] = name

        schema_type, type_nullable = self._normalize_schema_type(value.get("type"))
        if schema_type:
            schema["type"] = schema_type
        elif isinstance(value.get("properties"), dict):
            schema["type"] = "object"
        if type_nullable:
            schema["nullable"] = True

        additional_properties = value.get("additionalProperties")
        if isinstance(additional_properties, bool):
            schema["additionalProperties"] = additional_properties
        elif isinstance(additional_properties, dict):
            normalized = self._normalize_json_schema(additional_properties)
            if normalized is not None:
                schema["additionalProperties"] = normalized

        properties = value.get("properties")
        if isinstance(properties, dict):
            schema.setdefault("type", "object")
            schema.setdefault("additionalProperties", False)
            schema["properties"] = {
                property_name: normalized
                for property_name, property_schema in properties.items()
                if isinstance(property_name, str)
                for normalized in [self._normalize_json_schema(property_schema)]
                if normalized is not None
            }

        required = value.get("required")
        if isinstance(required, list):
            schema["required"] = [item for item in required if isinstance(item, str)]

        description = value.get("description")
        if isinstance(description, str) and description:
            schema["description"] = description

        for key in sorted(self.JSON_SCHEMA_CONSTRAINT_KEYS):
            if key in {"$ref", "additionalProperties", "description", "properties", "required", "type"}:
                continue
            if key in value:
                normalized = self._normalize_schema_constraint_value(value[key])
                if normalized is not None:
                    schema[key] = normalized

        return schema if schema else None

    def _normalize_schema_type(self, value: Any) -> tuple[str, bool]:
        if isinstance(value, str):
            return value, False
        if not isinstance(value, list):
            return "", False

        types = [item for item in value if isinstance(item, str)]
        non_null_types = [item for item in types if item != "null"]
        nullable = len(non_null_types) != len(types)
        if len(non_null_types) != 1:
            return "", nullable
        return non_null_types[0], nullable

    def _normalize_schema_constraint_value(self, value: Any) -> Any:
        if isinstance(value, dict):
            return self._normalize_json_schema(value)
        if isinstance(value, list):
            result: list[Any] = []
            for item in value:
                if isinstance(item, dict):
                    normalized = self._normalize_json_schema(item)
                    if normalized is not None:
                        result.append(normalized)
                elif isinstance(item, (str, int, float, bool)) or item is None:
                    result.append(item)
            return result
        if isinstance(value, (str, int, float, bool)) or value is None:
            return value
        return None

    def _normalize_query_parameters(self, value: Any) -> list[dict[str, Any]]:
        if not isinstance(value, list):
            return []

        result: list[dict[str, Any]] = []
        seen: set[str] = set()
        for parameter in value:
            if not isinstance(parameter, dict):
                continue
            name = parameter.get("name")
            if not isinstance(name, str) or not re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", name):
                continue
            if name in seen:
                continue
            seen.add(name)

            normalized: dict[str, Any] = {
                "name": name,
                "in": "query",
                "required": bool(parameter.get("required", False)),
                "schema": parameter.get("schema") if isinstance(parameter.get("schema"), dict) else {"type": "string"},
            }
            description = parameter.get("description")
            if isinstance(description, str) and description:
                normalized["description"] = description
            result.append(normalized)
        return result

    def _module_name(self, source: str, route: str) -> str:
        parts = source.replace("\\", "/").split("/")
        if "packages" in parts:
            package_index = parts.index("packages") + 1
            if package_index < len(parts):
                package = parts[package_index]
                prefix = "sdkwork-claw-router-"
                if package.startswith(prefix):
                    return package[len(prefix) :]
                return package
        route_parts = [part for part in route.split("/") if part]
        if route_parts:
            return route_parts[-1]
        return "root"

    def _tag(self, api_surface: str, api_path: str) -> str:
        boundary = self.SDK_BOUNDARIES.get(api_surface)
        prefix = boundary["api_prefix"] if boundary else ""
        path = api_path[len(prefix) :] if prefix and api_path.startswith(prefix) else api_path
        segments = [segment for segment in path.split("/") if segment and not segment.startswith("{")]
        if not segments:
            return "root"
        if api_surface == "backend" and segments[0] == "router" and len(segments) > 1:
            return segments[1]
        return segments[0]

    def _route_scope(self, route: str) -> str:
        if route.startswith("/admin"):
            return "admin"
        if route.startswith("/console"):
            return "console"
        return "public"

    def _operation_key(self, source: Any, operation: Any) -> str:
        return f"{self._string(source)}#{self._string(operation)}"

    def _string(self, value: Any) -> str:
        return value if isinstance(value, str) else ""

    def _string_list(self, value: Any) -> list[str]:
        if not isinstance(value, list):
            return []
        return [item for item in value if isinstance(item, str)]

    def _increment(self, counter: dict[str, int], key: str) -> None:
        counter[key] = counter.get(key, 0) + 1

    def _display_path(self, path: Path) -> str:
        try:
            return path.relative_to(self.root).as_posix()
        except ValueError:
            return path.as_posix()


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate sdkwork-claw-router API contract manifest.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    parser.add_argument("--contract", type=Path, default=None, help="frontend field contract YAML path")
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="output path; defaults to generated/api/api-contract-manifest.json",
    )
    parser.add_argument("--check", action="store_true", help="validate that the generated API contract manifest is current")
    args = parser.parse_args()

    generator = ApiContractManifestGenerator(root=args.root, contract_path=args.contract, output_path=args.output)
    if args.check:
        result = generator.check(args.output)
        if result.ok:
            print("API contract manifest is current")
            return 0
        for message in result.messages:
            print(message)
        return 1

    try:
        output = generator.write(args.output)
    except ValueError as exc:
        print(exc)
        return 1
    print(f"Wrote API contract manifest to {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
