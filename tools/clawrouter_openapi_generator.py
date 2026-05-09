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
class ClawRouterOpenApiCheckResult:
    ok: bool
    messages: list[str]


class ClawRouterOpenApiGenerator:
    """Generate app/backend OpenAPI specs from the ClawRouter API contract manifest."""

    SURFACES = ("app", "backend")
    OUTPUTS = {
        "app": "clawrouter-app-openapi.json",
        "backend": "clawrouter-backend-openapi.json",
    }
    TITLES = {
        "app": "SDKWork Claw Router App API",
        "backend": "SDKWork Claw Router Backend API",
    }
    SERVERS = {
        "app": "http://localhost:18082",
        "backend": "http://localhost:18081",
    }
    DEFAULT_PREFIXES = {
        "app": "/app/v3/api",
        "backend": "/backend/v3/api",
    }
    DEFAULT_CLIENTS = {
        "app": "SdkworkAppClient",
        "backend": "SdkworkBackendClient",
    }
    DEFAULT_QUERY_PARAMETERS = [
        {"name": "pageNo", "in": "query", "required": False, "schema": {"type": "integer", "format": "int32"}},
        {"name": "pageSize", "in": "query", "required": False, "schema": {"type": "integer", "format": "int32"}},
        {"name": "keyword", "in": "query", "required": False, "schema": {"type": "string"}},
        {"name": "status", "in": "query", "required": False, "schema": {"type": "string"}},
        {"name": "startTime", "in": "query", "required": False, "schema": {"type": "string", "format": "date-time"}},
        {"name": "endTime", "in": "query", "required": False, "schema": {"type": "string", "format": "date-time"}},
    ]

    def __init__(
        self,
        root: Path,
        manifest_path: Path | None = None,
        output_dir: Path | None = None,
        schema_components_path: Path | None = None,
    ) -> None:
        self.root = Path(root).resolve()
        self.manifest_path = (
            Path(manifest_path).resolve()
            if manifest_path is not None
            else self.root / "generated" / "api" / "api-contract-manifest.json"
        )
        self.output_dir = Path(output_dir).resolve() if output_dir is not None else self.root / "generated" / "openapi"
        self.schema_components_path = (
            Path(schema_components_path).resolve()
            if schema_components_path is not None
            else self.root / "generated" / "openapi" / "schema-components.yaml"
        )

    def generate(self, surface: str) -> dict[str, Any]:
        if surface not in self.SURFACES:
            raise ValueError(f"unsupported OpenAPI surface: {surface}")
        manifest = self._load_manifest()
        boundary = self._boundary(manifest, surface)
        operations = [
            operation
            for operation in manifest.get("operations", [])
            if (
                isinstance(operation, dict)
                and operation.get("api_surface") == surface
                and operation.get("openapi_exposed", True) is not False
            )
        ]
        operations.sort(key=lambda item: (self._string(item.get("api_path")), self._string(item.get("api_method")), self._string(item.get("operation"))))
        operation_ids = self._operation_ids(operations)
        schema_components = self._schema_component_schemas()

        paths: dict[str, Any] = {}
        for operation in operations:
            api_path = self._string(operation.get("api_path"))
            method = self._string(operation.get("api_method")).lower()
            if not api_path or not method:
                continue
            paths.setdefault(api_path, {})[method] = self._operation_spec(
                operation,
                operation_ids[id(operation)],
                schema_components,
            )

        return {
            "openapi": "3.0.3",
            "info": {
                "title": self.TITLES[surface],
                "version": self._version(manifest),
                "description": f"Generated from generated/api/api-contract-manifest.json for {boundary['sdk_client']}.",
            },
            "servers": [{"url": self.SERVERS[surface]}],
            "x-sdk-client": boundary["sdk_client"],
            "x-sdk-family": boundary.get("sdk_family", surface),
            "x-api-prefix": boundary["api_prefix"],
            "paths": paths,
            "components": self._components(operations, operation_ids, schema_components),
        }

    def render_json(self, surface: str) -> str:
        return json.dumps(self.generate(surface), ensure_ascii=False, indent=2, sort_keys=True) + "\n"

    def write(self) -> dict[str, Path]:
        self.output_dir.mkdir(parents=True, exist_ok=True)
        outputs: dict[str, Path] = {}
        for surface in self.SURFACES:
            output = self.output_path(surface)
            output.write_text(self.render_json(surface), encoding="utf-8", newline="\n")
            outputs[surface] = output
        return outputs

    def check(self) -> ClawRouterOpenApiCheckResult:
        messages: list[str] = []
        try:
            for surface in self.SURFACES:
                output = self.output_path(surface)
                expected = self.render_json(surface)
                if not output.exists():
                    messages.append(f"clawrouter {surface} OpenAPI spec is missing: {output}")
                    continue
                actual = output.read_text(encoding="utf-8")
                if actual != expected:
                    messages.append(f"clawrouter {surface} OpenAPI spec is stale: {output}")
        except (OSError, ValueError, json.JSONDecodeError) as exc:
            messages.append(str(exc))
        return ClawRouterOpenApiCheckResult(ok=not messages, messages=messages)

    def output_path(self, surface: str) -> Path:
        if surface not in self.OUTPUTS:
            raise ValueError(f"unsupported OpenAPI surface: {surface}")
        return self.output_dir / self.OUTPUTS[surface]

    def _operation_spec(
        self,
        operation: dict[str, Any],
        operation_id: str,
        schema_components: dict[str, Any],
    ) -> dict[str, Any]:
        method = self._string(operation.get("api_method")).upper()
        path_params = self._string_list(operation.get("path_params"))
        parameters = [self._path_parameter(param) for param in path_params]
        if bool(operation.get("idempotency_required")):
            parameters.extend(self._idempotency_parameters())
        elif bool(operation.get("request_id_header")):
            parameters.append(self._request_id_parameter())
        if method == "GET":
            parameters.extend(self._operation_query_parameters(operation))

        spec: dict[str, Any] = {
            "tags": [self._string(operation.get("tag")) or "router"],
            "operationId": operation_id,
            "summary": self._summary(operation, operation_id),
            "description": self._description(operation),
            "parameters": parameters,
            "responses": {
                "200": {
                    "description": "OK",
                    "content": {
                        "application/json": {
                            "schema": self._success_response_schema(operation, operation_id, schema_components),
                        },
                    },
                },
                "400": {"description": "Bad Request", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ErrorResponse"}}}},
                "401": {"description": "Unauthorized", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ErrorResponse"}}}},
                "500": {"description": "Server Error", "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ErrorResponse"}}}},
            },
            "x-source-file": self._string(operation.get("source")),
            "x-route-scope": self._string(operation.get("route_scope")),
            "x-contract-kind": self._string(operation.get("kind")),
            "x-read-sources": self._string_list(operation.get("read_sources")),
            "x-write-tables": self._string_list(operation.get("write_tables")),
        }
        sdk_domain = self._string(operation.get("sdk_domain"))
        if sdk_domain:
            spec["x-sdk-domain"] = sdk_domain
        if method in {"POST", "PUT", "PATCH"}:
            request_schema_ref = self._operation_request_schema(operation)
            spec["requestBody"] = {
                "required": self._request_body_required(operation, request_schema_ref),
                "content": {
                    "application/json": {
                        "schema": request_schema_ref,
                    },
                },
            }
        return spec

    def _request_body_required(
        self,
        operation: dict[str, Any],
        request_schema_ref: dict[str, str],
    ) -> bool:
        if isinstance(operation.get("request_body_required"), bool):
            return bool(operation["request_body_required"])
        return request_schema_ref != {"$ref": "#/components/schemas/OperationRequest"}

    def _success_response_schema(
        self,
        operation: dict[str, Any],
        operation_id: str,
        schema_components: dict[str, Any],
    ) -> dict[str, str]:
        if self._operation_data_schema(operation, schema_components) is None:
            return {"$ref": "#/components/schemas/PlusApiResult"}
        return {"$ref": f"#/components/schemas/{self._operation_result_component_name(operation_id)}"}

    def _operation_request_schema(self, operation: dict[str, Any]) -> dict[str, str]:
        payload_schema = self._payload_schema(operation.get("request_schema"))
        if payload_schema is None:
            return {"$ref": "#/components/schemas/OperationRequest"}
        return {"$ref": f"#/components/schemas/{payload_schema[0]}"}

    def _path_parameter(self, name: str) -> dict[str, Any]:
        return {
            "name": name,
            "in": "path",
            "required": True,
            "schema": {"type": "string"},
        }

    def _idempotency_parameters(self) -> list[dict[str, Any]]:
        return [
            {
                "name": "Idempotency-Key",
                "in": "header",
                "required": True,
                "schema": {"type": "string", "maxLength": 128},
                "description": "Required stable idempotency key for this write operation.",
            },
            self._request_id_parameter(),
        ]

    def _request_id_parameter(self) -> dict[str, Any]:
        return {
            "name": "X-Request-Id",
            "in": "header",
            "required": False,
            "schema": {"type": "string", "maxLength": 128},
            "description": "Optional caller-provided request identifier for audit correlation.",
        }

    def _operation_query_parameters(self, operation: dict[str, Any]) -> list[dict[str, Any]]:
        declared = operation.get("query_parameters")
        if isinstance(declared, list) and declared:
            parameters: list[dict[str, Any]] = []
            seen: set[str] = set()
            for parameter in declared:
                if not isinstance(parameter, dict):
                    continue
                name = self._string(parameter.get("name"))
                if not name or name in seen:
                    continue
                seen.add(name)
                schema = parameter.get("schema")
                item = {
                    "name": name,
                    "in": "query",
                    "required": bool(parameter.get("required", False)),
                    "schema": schema if isinstance(schema, dict) else {"type": "string"},
                }
                description = self._string(parameter.get("description"))
                if description:
                    item["description"] = description
                parameters.append(item)
            if parameters:
                return parameters
        if operation.get("query_parameters_declared") is True:
            return []
        return [dict(parameter) for parameter in self.DEFAULT_QUERY_PARAMETERS]

    def _description(self, operation: dict[str, Any]) -> str:
        read_sources = ", ".join(self._string_list(operation.get("read_sources"))) or "none"
        write_tables = ", ".join(self._string_list(operation.get("write_tables"))) or "none"
        description = self._string(operation.get("description"))
        suffix = f"Reads {read_sources}. Writes {write_tables}."
        if description:
            return f"{description} {suffix}"
        return f"{self._summary(operation, self._string(operation.get('operation')))}. {suffix}"

    def _summary(self, operation: dict[str, Any], operation_id: str) -> str:
        explicit = self._string(operation.get("summary"))
        if explicit:
            return explicit
        source = self._string(operation.get("operation")) or operation_id
        words = self._operation_words(source)
        if not words:
            return operation_id or "Run operation"

        verb = words[0].lower()
        noun_words = words[1:]
        prefix = self._summary_verb(verb)
        if not noun_words:
            return prefix
        noun = self._humanize_words(noun_words)
        return f"{prefix} {noun}"

    def _summary_verb(self, verb: str) -> str:
        if verb in {"fetch", "list", "search", "query"}:
            return "List"
        if verb in {"get", "load", "read"}:
            return "Get"
        if verb in {"create", "add", "submit"}:
            return "Create"
        if verb in {"update", "edit", "patch"}:
            return "Update"
        if verb in {"delete", "remove"}:
            return "Delete"
        if verb in {"sync", "import"}:
            return "Sync"
        if verb in {"enable", "disable", "publish", "approve", "reject", "trigger", "redeem", "offline"}:
            return verb.capitalize()
        return verb.capitalize()

    def _humanize_words(self, words: list[str]) -> str:
        normalized = [self._summary_word(word, index == len(words) - 1) for index, word in enumerate(words)]
        return " ".join(word for word in normalized if word)

    def _summary_word(self, word: str, is_last: bool) -> str:
        lower = word.lower()
        acronyms = {
            "api": "API",
            "id": "ID",
            "ip": "IP",
            "oauth": "OAuth",
            "qps": "QPS",
            "url": "URL",
            "vip": "VIP",
        }
        if lower in acronyms:
            return acronyms[lower]
        if lower == "apps" and not is_last:
            return "app"
        if lower == "keys" and not is_last:
            return "key"
        return lower

    def _operation_words(self, value: str) -> list[str]:
        spaced = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", value)
        spaced = re.sub(r"([A-Z]+)([A-Z][a-z])", r"\1 \2", spaced)
        return [word for word in re.split(r"[^A-Za-z0-9]+", spaced) if word]

    def _operation_ids(self, operations: list[dict[str, Any]]) -> dict[int, str]:
        counts: dict[str, int] = {}
        for operation in operations:
            base = self._safe_operation_id(self._string(operation.get("operation")) or "operation")
            counts[base] = counts.get(base, 0) + 1

        result: dict[int, str] = {}
        used: set[str] = set()
        for operation in operations:
            base = self._safe_operation_id(self._string(operation.get("operation")) or "operation")
            if counts[base] > 1:
                candidate = self._safe_operation_id(f"{self._string(operation.get('tag'))}_{base}")
            else:
                candidate = base
            unique = candidate
            suffix = 2
            while unique in used:
                unique = f"{candidate}{suffix}"
                suffix += 1
            used.add(unique)
            result[id(operation)] = unique
        return result

    def _safe_operation_id(self, value: str) -> str:
        parts = [part for part in re.split(r"[^A-Za-z0-9]+", value) if part]
        if not parts:
            return "operation"
        first = parts[0][0].lower() + parts[0][1:]
        rest = "".join(part[0].upper() + part[1:] for part in parts[1:])
        candidate = first + rest
        if not re.match(r"^[A-Za-z_]", candidate):
            candidate = f"operation{candidate[0].upper()}{candidate[1:]}"
        return candidate

    def _components(
        self,
        operations: list[dict[str, Any]],
        operation_ids: dict[int, str],
        schema_components: dict[str, Any],
    ) -> dict[str, Any]:
        schemas = {
            "PlusApiResult": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "code": {"type": "string", "description": "Business response code."},
                    "msg": {"type": "string", "description": "Java-compatible response message field."},
                    "message": {"type": "string", "description": "Human-readable response message."},
                    "data": {"$ref": "#/components/schemas/OperationResponse"},
                },
            },
            "OperationRequest": {
                "type": "object",
                "additionalProperties": True,
                "description": "Operation-specific request body. Concrete DTOs are closed in Rust handlers before SDK regeneration.",
            },
            "OperationResponse": {
                "type": "object",
                "additionalProperties": True,
                "description": "Operation-specific response payload wrapped by PlusApiResult.",
            },
            "PageResult": {
                "type": "object",
                "additionalProperties": True,
                "properties": {
                    "pageNo": {"type": "integer", "format": "int32"},
                    "pageSize": {"type": "integer", "format": "int32"},
                    "total": {"type": "integer", "format": "int64"},
                    "records": {"type": "array", "items": {"type": "object", "additionalProperties": True}},
                },
            },
            "ErrorResponse": {
                "type": "object",
                "additionalProperties": True,
                "properties": {
                    "code": {"type": "string"},
                    "msg": {"type": "string"},
                    "message": {"type": "string"},
                },
            },
        }
        for name, schema in self._operation_payload_schemas(operations).items():
            schemas[name] = schema
        for name, schema in self._operation_result_schemas(operations, operation_ids, schema_components).items():
            schemas[name] = schema
        for name, schema in schema_components.items():
            schemas.setdefault(name, schema)
        return {"schemas": schemas}

    def _operation_payload_schemas(self, operations: list[dict[str, Any]]) -> dict[str, Any]:
        result: dict[str, Any] = {}
        for operation in operations:
            for field in ("request_schema", "response_schema"):
                payload_schema = self._payload_schema(operation.get(field))
                if payload_schema is None:
                    continue
                name, schema = payload_schema
                result.setdefault(name, self._lift_named_nested_schemas(schema, result, {name}))
        return result

    def _lift_named_nested_schemas(
        self,
        value: Any,
        components: dict[str, Any],
        parent_names: set[str],
    ) -> Any:
        if isinstance(value, list):
            return [
                self._lift_named_nested_schemas(item, components, parent_names)
                for item in value
            ]
        if not isinstance(value, dict):
            return value
        if isinstance(value.get("$ref"), str):
            return dict(value)

        nested_name = value.get("name")
        if (
            isinstance(nested_name, str)
            and nested_name not in parent_names
            and re.match(r"^[A-Z][A-Za-z0-9]*$", nested_name)
            and isinstance(value.get("properties"), dict)
        ):
            component_schema = {
                key: item for key, item in value.items() if key != "name"
            }
            component_schema = self._lift_named_nested_schemas(
                component_schema,
                components,
                parent_names | {nested_name},
            )
            components[nested_name] = component_schema
            if value.get("nullable") is True:
                return {
                    "allOf": [{"$ref": f"#/components/schemas/{nested_name}"}],
                    "nullable": True,
                }
            return {"$ref": f"#/components/schemas/{nested_name}"}

        if (
            value.get("nullable") is True
            and isinstance(value.get("type"), str)
            and value.get("type") in {"string", "integer", "number", "boolean"}
        ):
            base_schema = {
                key: self._lift_named_nested_schemas(item, components, parent_names)
                for key, item in value.items()
                if key != "nullable"
            }
            return {"allOf": [base_schema], "nullable": True}

        return {
            key: self._lift_named_nested_schemas(item, components, parent_names)
            for key, item in value.items()
        }

    def _operation_result_schemas(
        self,
        operations: list[dict[str, Any]],
        operation_ids: dict[int, str],
        schema_components: dict[str, Any],
    ) -> dict[str, Any]:
        result: dict[str, Any] = {}
        for operation in operations:
            data_schema = self._operation_data_schema(operation, schema_components)
            if data_schema is None:
                continue
            operation_id = operation_ids[id(operation)]
            result[self._operation_result_component_name(operation_id)] = {
                "type": "object",
                "additionalProperties": False,
                "required": ["code"],
                "properties": {
                    "code": {"type": "string", "description": "Business response code."},
                    "msg": {"type": "string", "description": "Java-compatible response message field."},
                    "message": {"type": "string", "description": "Human-readable response message."},
                    "data": data_schema,
                },
                "x-operation-id": operation_id,
            }
        return result

    def _operation_data_schema(self, operation: dict[str, Any], schema_components: dict[str, Any]) -> dict[str, str] | None:
        response_schema = self._payload_schema(operation.get("response_schema"))
        if response_schema is not None:
            return {"$ref": f"#/components/schemas/{response_schema[0]}"}
        if self._string(operation.get("api_method")).upper() != "GET":
            return None
        read_sources = self._string_list(operation.get("read_sources"))
        if len(read_sources) != 1:
            return None
        component_name = self._record_component_name(read_sources[0])
        if component_name not in schema_components:
            return None
        record_ref = {"$ref": f"#/components/schemas/{component_name}"}
        if self._string_list(operation.get("path_params")):
            return record_ref
        return {"type": "array", "items": record_ref}

    def _operation_result_component_name(self, operation_id: str) -> str:
        if not operation_id:
            return "OperationResult"
        return operation_id[0].upper() + operation_id[1:] + "Result"

    def _record_component_name(self, table_name: str) -> str:
        return "".join(part.capitalize() for part in table_name.split("_")) + "Record"

    def _schema_component_schemas(self) -> dict[str, Any]:
        if not self.schema_components_path.exists():
            return {}
        if yaml is None:
            raise RuntimeError("PyYAML is required to load OpenAPI schema components") from _YAML_IMPORT_ERROR
        payload = yaml.safe_load(self.schema_components_path.read_text(encoding="utf-8")) or {}
        if not isinstance(payload, dict):
            raise ValueError("OpenAPI schema components root must be an object")
        components = payload.get("components", {})
        if not isinstance(components, dict):
            return {}
        schemas = components.get("schemas", {})
        if not isinstance(schemas, dict):
            return {}
        return {name: schema for name, schema in schemas.items() if isinstance(name, str) and isinstance(schema, dict)}

    def _payload_schema(self, value: Any) -> tuple[str, dict[str, Any]] | None:
        if not isinstance(value, dict):
            return None
        name = value.get("name")
        schema = value.get("schema")
        if not isinstance(name, str) or not isinstance(schema, dict):
            return None
        return name, schema

    def _load_manifest(self) -> dict[str, Any]:
        if not self.manifest_path.exists():
            raise ValueError(f"api contract manifest is missing: {self.manifest_path}")
        payload = json.loads(self.manifest_path.read_text(encoding="utf-8"))
        if not isinstance(payload, dict):
            raise ValueError("api contract manifest root must be an object")
        return payload

    def _boundary(self, manifest: dict[str, Any], surface: str) -> dict[str, Any]:
        boundaries = manifest.get("sdk_boundaries", {})
        boundary = boundaries.get(surface, {}) if isinstance(boundaries, dict) else {}
        if not isinstance(boundary, dict):
            boundary = {}
        return {
            "api_prefix": self._string(boundary.get("api_prefix")) or self.DEFAULT_PREFIXES[surface],
            "sdk_client": self._string(boundary.get("sdk_client")) or self.DEFAULT_CLIENTS[surface],
            "sdk_family": self._string(boundary.get("sdk_family")) or surface,
        }

    def _version(self, manifest: dict[str, Any]) -> str:
        schema = manifest.get("schema", {})
        if isinstance(schema, dict):
            version = schema.get("version")
            if isinstance(version, str) and version:
                return version
        return "0.1.0"

    def _string(self, value: Any) -> str:
        return value if isinstance(value, str) else ""

    def _string_list(self, value: Any) -> list[str]:
        if not isinstance(value, list):
            return []
        return [item for item in value if isinstance(item, str)]


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate sdkwork-claw-router app/backend OpenAPI specs.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    parser.add_argument("--manifest", type=Path, default=None, help="API contract manifest path")
    parser.add_argument("--output-dir", type=Path, default=None, help="OpenAPI output directory")
    parser.add_argument("--check", action="store_true", help="validate generated OpenAPI specs are current")
    args = parser.parse_args()

    generator = ClawRouterOpenApiGenerator(root=args.root, manifest_path=args.manifest, output_dir=args.output_dir)
    if args.check:
        result = generator.check()
        if result.ok:
            print("ClawRouter OpenAPI specs are current")
            return 0
        for message in result.messages:
            print(message)
        return 1

    outputs = generator.write()
    for surface, output in outputs.items():
        print(f"Wrote {surface} OpenAPI spec to {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
