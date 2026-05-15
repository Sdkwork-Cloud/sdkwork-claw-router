from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class ClawRouterOpenApiContractAuditResult:
    ok: bool
    messages: list[str]


class ClawRouterOpenApiContractAudit:
    """Audit app/backend OpenAPI contracts for strong operation DTO boundaries."""

    SPEC_FILES = {
        "app": "clawrouter-app-openapi.json",
        "backend": "clawrouter-backend-openapi.json",
    }
    HTTP_METHODS = {"get", "put", "post", "delete", "patch", "options", "head", "trace"}
    FORBIDDEN_SHARED_COMPONENTS = {"OperationRequest", "OperationResponse", "PageResult", "ErrorResponse"}
    FORBIDDEN_SUCCESS_REFS = {
        "#/components/schemas/OperationResponse",
    }
    STANDARD_QUERY_PARAMETER_ALIASES = {
        "search_query": ("q", "search text"),
        "searchQuery": ("q", "search text"),
        "keyword": ("q", "search text"),
        "search": ("q", "search text"),
        "size": ("page_size", "page size"),
        "page_no": ("page", "page index"),
    }
    STANDARD_OPERATION_ACTIONS = {
        "activate",
        "approve",
        "archive",
        "batchCreate",
        "batchDelete",
        "batchUpdate",
        "cancel",
        "create",
        "deactivate",
        "delete",
        "disable",
        "enable",
        "list",
        "publish",
        "refresh",
        "reject",
        "renew",
        "restore",
        "retrieve",
        "revoke",
        "submit",
        "unpublish",
        "update",
        "upgrade",
        "verify",
    }
    FORBIDDEN_RPC_PATH_SEGMENTS = {"check_collected", "detail", "list", "mine", "search"}

    def __init__(self, root: Path, openapi_dir: Path | None = None) -> None:
        self.root = Path(root).resolve()
        self.openapi_dir = Path(openapi_dir).resolve() if openapi_dir is not None else self.root / "generated" / "openapi"

    def run(self) -> ClawRouterOpenApiContractAuditResult:
        messages: list[str] = []
        for surface, filename in self.SPEC_FILES.items():
            spec_path = self.openapi_dir / filename
            try:
                spec = json.loads(spec_path.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError) as exc:
                messages.append(f"{surface} OpenAPI spec could not be read: {exc}")
                continue
            messages.extend(self._audit_spec(surface, spec))
        return ClawRouterOpenApiContractAuditResult(ok=not messages, messages=messages)

    def _audit_spec(self, surface: str, spec: dict[str, Any]) -> list[str]:
        messages: list[str] = []
        schemas = self._schemas(spec)
        paths = spec.get("paths", {})
        if not isinstance(paths, dict):
            messages.append(f"{surface} OpenAPI paths must be an object")
            paths = {}

        messages.extend(self._audit_standard_metadata(surface, spec, paths))
        messages.extend(self._audit_forbidden_components(surface, schemas))
        messages.extend(self._audit_standard_schemas(surface, schemas))
        messages.extend(self._audit_operations(surface, paths, schemas))
        messages.extend(self._audit_ref_integrity(surface, spec, schemas))
        return messages

    def _audit_standard_metadata(self, surface: str, spec: dict[str, Any], paths: dict[str, Any]) -> list[str]:
        messages: list[str] = []
        if spec.get("openapi") != "3.1.2":
            messages.append(f"{surface} OpenAPI version must be 3.1.2")
        if spec.get("jsonSchemaDialect") != "https://json-schema.org/draft/2020-12/schema":
            messages.append(
                f"{surface} OpenAPI jsonSchemaDialect must be https://json-schema.org/draft/2020-12/schema"
            )
        info = spec.get("info")
        if not isinstance(info, dict):
            messages.append(f"{surface} OpenAPI info must be an object")
        else:
            for field in ("title", "version", "description"):
                if not self._non_empty_string(info.get(field)):
                    messages.append(f"{surface} OpenAPI info.{field} must be a non-empty string")
        if not isinstance(spec.get("servers"), list) or not spec.get("servers"):
            messages.append(f"{surface} OpenAPI servers must declare at least one server")
        if paths and (not isinstance(spec.get("tags"), list) or not spec.get("tags")):
            messages.append(f"{surface} OpenAPI tags must declare at least one tag")

        components = spec.get("components")
        security_schemes = components.get("securitySchemes") if isinstance(components, dict) else None
        auth_token = security_schemes.get("AuthToken") if isinstance(security_schemes, dict) else None
        if not isinstance(auth_token, dict) or auth_token.get("type") != "http" or auth_token.get("scheme") != "bearer":
            messages.append(f"{surface} OpenAPI components.securitySchemes.AuthToken must be an http bearer scheme")
        access_token = security_schemes.get("SdkworkAccessToken") if isinstance(security_schemes, dict) else None
        if (
            not isinstance(access_token, dict)
            or access_token.get("type") != "apiKey"
            or access_token.get("in") != "header"
            or access_token.get("name") != "Sdkwork-Access-Token"
        ):
            messages.append(
                f"{surface} OpenAPI components.securitySchemes.SdkworkAccessToken must be an apiKey header named Sdkwork-Access-Token"
            )
        if isinstance(access_token, dict) and access_token.get("name") == "Access-Token":
            messages.append(f"{surface} OpenAPI must not declare legacy Access-Token security scheme headers")
        if spec.get("security") != [{"AuthToken": [], "SdkworkAccessToken": []}]:
            messages.append(f"{surface} OpenAPI security must require AuthToken and SdkworkAccessToken")
        return messages

    def _audit_forbidden_components(self, surface: str, schemas: dict[str, Any]) -> list[str]:
        messages: list[str] = []
        for component_name in sorted(self.FORBIDDEN_SHARED_COMPONENTS):
            if component_name in schemas:
                messages.append(self._forbidden_component_message(surface, component_name))
        return messages

    def _audit_standard_schemas(self, surface: str, schemas: dict[str, Any]) -> list[str]:
        messages: list[str] = []
        plus_api_result = schemas.get("PlusApiResult")
        if not isinstance(plus_api_result, dict):
            messages.append(f"{surface} schema component PlusApiResult must exist")
            return messages
        if plus_api_result.get("type") != "object":
            messages.append(f"{surface} schema component PlusApiResult must be an object")
        if plus_api_result.get("additionalProperties") is not False:
            messages.append(f"{surface} schema component PlusApiResult must set additionalProperties to false")
        if plus_api_result.get("required") != ["code"]:
            messages.append(f"{surface} schema component PlusApiResult required fields must be ['code']")
        properties = plus_api_result.get("properties")
        if not isinstance(properties, dict):
            messages.append(f"{surface} schema component PlusApiResult properties must be an object")
            return messages
        code_schema = properties.get("code")
        if not isinstance(code_schema, dict) or code_schema.get("type") != "string":
            messages.append(f"{surface} schema component PlusApiResult.code must be a string")
        data_schema = properties.get("data")
        if not self._schema_refers_to(data_schema, "#/components/schemas/NoData"):
            messages.append(
                f"{surface} schema component PlusApiResult.data must reference NoData as its default empty payload"
            )
        no_data = schemas.get("NoData")
        if not isinstance(no_data, dict):
            messages.append(f"{surface} schema component NoData must exist")
        elif no_data != {
            "type": "object",
            "additionalProperties": False,
            "properties": {},
            "description": "Closed empty payload for operations that complete without business data.",
        }:
            messages.append(f"{surface} schema component NoData must be a closed empty object")
        problem_detail = schemas.get("ProblemDetail")
        if not isinstance(problem_detail, dict):
            messages.append(f"{surface} schema component ProblemDetail must exist")
            return messages
        if problem_detail.get("type") != "object":
            messages.append(f"{surface} schema component ProblemDetail must be an object")
        if problem_detail.get("required") != ["type", "title", "status"]:
            messages.append(f"{surface} schema component ProblemDetail required fields must be ['type', 'title', 'status']")
        problem_properties = problem_detail.get("properties")
        if not isinstance(problem_properties, dict):
            messages.append(f"{surface} schema component ProblemDetail properties must be an object")
            return messages
        for field in ("type", "title", "status", "code", "traceId", "errors"):
            if field not in problem_properties:
                messages.append(f"{surface} schema component ProblemDetail.{field} must be declared")
        return messages

    def _audit_operations(self, surface: str, paths: dict[str, Any], schemas: dict[str, Any]) -> list[str]:
        messages: list[str] = []
        for path, path_item in paths.items():
            messages.extend(self._audit_path_standard(surface, path))
            if not isinstance(path_item, dict):
                continue
            for method, operation in path_item.items():
                method_lower = method.lower()
                if method_lower not in self.HTTP_METHODS or not isinstance(operation, dict):
                    continue
                label = f"{surface} {method_upper(method_lower)} {path}"
                messages.extend(self._audit_operation_standard(label, operation))
                messages.extend(self._audit_query_parameters(label, operation))
                messages.extend(self._audit_error_responses(label, operation))
                messages.extend(self._audit_success_response(label, operation, schemas))
                messages.extend(self._audit_request_body(label, operation, schemas))
        return messages

    def _audit_path_standard(self, surface: str, path: Any) -> list[str]:
        messages: list[str] = []
        if not isinstance(path, str):
            return messages

        expected_prefix = f"/{surface}/v3/api"

        if surface == "backend" and (path == f"{expected_prefix}/auth" or path.startswith(f"{expected_prefix}/auth/")):
            messages.append(f"{surface} path {path} must not expose auth namespace routes")

        for raw_segment in [segment for segment in path.split("/") if segment]:
            if raw_segment in {"app", "backend", "v3", "api"}:
                continue
            if raw_segment.startswith("{") and raw_segment.endswith("}"):
                parameter_name = raw_segment[1:-1]
                if not re.match(r"^[a-z][A-Za-z0-9]*$", parameter_name):
                    messages.append(f"{surface} path {path} parameter {parameter_name} must be lowerCamelCase")
                continue
            if not re.match(r"^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$", raw_segment):
                messages.append(f"{surface} path {path} static segment {raw_segment} must be lowercase lower_snake_case")
            if raw_segment in self.FORBIDDEN_RPC_PATH_SEGMENTS:
                messages.append(
                    f"{surface} path {path} static segment {raw_segment} must not encode RPC action; use resource path plus operationId action"
                )

        return messages

    def _audit_operation_standard(self, label: str, operation: dict[str, Any]) -> list[str]:
        messages: list[str] = []
        operation_id = self._operation_id(operation)
        if not re.match(r"^[a-z][A-Za-z0-9]*(?:\.[a-z][A-Za-z0-9]*)+$", operation_id):
            messages.append(f"{label} operationId {operation_id} must use dotted lowerCamel resource.action format")
        tags = operation.get("tags")
        if not isinstance(tags, list) or len(tags) != 1 or not isinstance(tags[0], str):
            messages.append(f"{label} must declare exactly one tag")
        elif not re.match(r"^[a-z][A-Za-z0-9]*$", tags[0]):
            messages.append(f"{label} tag {tags[0]} must be lowerCamelCase")
        elif operation_id.startswith(f"{tags[0]}."):
            messages.append(f"{label} operationId {operation_id} must not repeat tag {tags[0]}")
        if "." in operation_id:
            action = operation_id.rsplit(".", 1)[-1]
            if action not in self.STANDARD_OPERATION_ACTIONS:
                messages.append(
                    f"{label} operationId action {action} must use standard SDKWork action vocabulary"
                )
        if not self._non_empty_string(operation.get("x-sdkwork-domain")):
            messages.append(f"{label} must declare x-sdkwork-domain")
        if not self._non_empty_string(operation.get("x-sdkwork-resource")):
            messages.append(f"{label} must declare x-sdkwork-resource")
        return messages

    def _audit_query_parameters(self, label: str, operation: dict[str, Any]) -> list[str]:
        messages: list[str] = []
        parameters = operation.get("parameters")
        if not isinstance(parameters, list):
            return messages
        for parameter in parameters:
            if not isinstance(parameter, dict) or parameter.get("in") != "query":
                continue
            name = parameter.get("name")
            if not isinstance(name, str):
                messages.append(f"{label} query parameter {self._string(name)} must be lower_snake_case")
            elif name in self.STANDARD_QUERY_PARAMETER_ALIASES:
                standard_name, meaning = self.STANDARD_QUERY_PARAMETER_ALIASES[name]
                messages.append(f"{label} query parameter {name} must use {standard_name} for {meaning}")
            elif not re.match(r"^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$", name):
                messages.append(f"{label} query parameter {self._string(name)} must be lower_snake_case")
        return messages

    def _audit_error_responses(self, label: str, operation: dict[str, Any]) -> list[str]:
        messages: list[str] = []
        responses = operation.get("responses")
        if not isinstance(responses, dict):
            return messages
        for status_code, response in responses.items():
            numeric_status = int(status_code) if isinstance(status_code, str) and status_code.isdigit() else None
            if status_code != "default" and (numeric_status is None or numeric_status < 400):
                continue
            if not isinstance(response, dict):
                continue
            content = response.get("content")
            if not isinstance(content, dict) or "application/problem+json" not in content:
                messages.append(f"{label} {status_code} response must use application/problem+json")
                continue
            media = content.get("application/problem+json")
            schema = media.get("schema") if isinstance(media, dict) else None
            if not self._schema_refers_to(schema, "#/components/schemas/ProblemDetail"):
                messages.append(f"{label} {status_code} response must reference ProblemDetail")
        return messages

    def _audit_success_response(
        self,
        label: str,
        operation: dict[str, Any],
        schemas: dict[str, Any],
    ) -> list[str]:
        messages: list[str] = []
        response_schema = self._json_schema(
            operation.get("responses", {}).get("200", {}) if isinstance(operation.get("responses"), dict) else {}
        )
        response_ref = response_schema.get("$ref") if isinstance(response_schema, dict) else None
        if response_ref == "#/components/schemas/PlusApiResult":
            messages.append(f"{label} 200 response must reference an operation-specific *Result schema, not PlusApiResult")
            return messages
        if response_ref in self.FORBIDDEN_SUCCESS_REFS or not isinstance(response_ref, str) or not response_ref.endswith("Result"):
            messages.append(
                f"{label} 200 response must reference an operation-specific *Result schema"
            )
            return messages

        component_name = self._component_name(response_ref)
        result_schema = schemas.get(component_name)
        if not isinstance(result_schema, dict):
            messages.append(f"{label} 200 response references missing result schema {component_name}")
            return messages
        if result_schema.get("type") != "object":
            messages.append(f"{label} result schema {component_name} must be an object")
        if result_schema.get("additionalProperties") is not False:
            messages.append(f"{label} result schema {component_name} must set additionalProperties to false")
        properties = result_schema.get("properties")
        if not isinstance(properties, dict):
            messages.append(f"{label} result schema {component_name} properties must be an object")
            return messages
        code_schema = properties.get("code")
        if not isinstance(code_schema, dict) or code_schema.get("type") != "string":
            messages.append(f"{label} result schema {component_name}.code must be a string")
        if "data" not in properties:
            messages.append(f"{label} result schema {component_name}.data must be explicitly declared")
        elif self._schema_refers_to(properties.get("data"), "#/components/schemas/PlusApiResult"):
            messages.append(f"{label} result schema {component_name}.data must not reference PlusApiResult")
        return messages

    def _audit_request_body(
        self,
        label: str,
        operation: dict[str, Any],
        schemas: dict[str, Any],
    ) -> list[str]:
        messages: list[str] = []
        request_body = operation.get("requestBody")
        if not isinstance(request_body, dict):
            return messages
        request_schema = self._json_schema(request_body)
        request_ref = request_schema.get("$ref") if isinstance(request_schema, dict) else None
        if not isinstance(request_ref, str):
            messages.append(f"{label} requestBody must reference a component request schema")
            return messages
        if self._component_name(request_ref) in self.FORBIDDEN_SHARED_COMPONENTS:
            messages.append(f"{label} requestBody must not reference shared weak component {self._component_name(request_ref)}")
            return messages
        component_name = self._component_name(request_ref)
        schema = schemas.get(component_name)
        if not isinstance(schema, dict):
            messages.append(f"{label} requestBody references missing schema {component_name}")
            return messages
        if schema.get("type") != "object":
            messages.append(f"{label} request schema {component_name} must be an object")
            return messages
        properties = schema.get("properties")
        has_properties = isinstance(properties, dict) and bool(properties)
        if not has_properties and schema.get("additionalProperties") is not False:
            messages.append(
                f"{label} request schema {component_name} must be a closed empty object or define explicit properties"
            )
        if isinstance(properties, dict):
            for property_name, property_schema in properties.items():
                if self._is_search_text_property_alias(property_name, property_schema):
                    messages.append(
                        f"{label} request schema {component_name}.{property_name} must use q for search text"
                    )
        return messages

    def _is_search_text_property_alias(self, property_name: Any, property_schema: Any) -> bool:
        if property_name not in {"keyword", "search", "search_query", "searchQuery"}:
            return False
        if not isinstance(property_schema, dict):
            return False
        schema_type = property_schema.get("type")
        if isinstance(schema_type, list):
            return "string" in schema_type
        return schema_type in {None, "string"}

    def _audit_ref_integrity(
        self,
        surface: str,
        spec: dict[str, Any],
        schemas: dict[str, Any],
    ) -> list[str]:
        messages: list[str] = []

        def walk(node: Any, location: str) -> None:
            if isinstance(node, dict):
                ref = node.get("$ref")
                if isinstance(ref, str):
                    if len(node) > 1:
                        messages.append(
                            f"{surface} {location} $ref must not have sibling fields; use allOf/oneOf composition"
                        )
                    component_name = self._component_name(ref)
                    if ref.startswith("#/components/schemas/") and component_name not in schemas:
                        messages.append(f"{surface} {location} references missing component schema {component_name}")
                for key, value in node.items():
                    child_location = key if not location else f"{location}.{key}"
                    walk(value, child_location)
            elif isinstance(node, list):
                for index, value in enumerate(node):
                    walk(value, f"{location}[{index}]")

        walk(spec, "")
        return messages

    def _json_schema(self, content_owner: dict[str, Any]) -> dict[str, Any] | None:
        content = content_owner.get("content")
        if not isinstance(content, dict):
            return None
        media_type = content.get("application/json")
        if not isinstance(media_type, dict):
            media_type = next((value for value in content.values() if isinstance(value, dict)), None)
        if not isinstance(media_type, dict):
            return None
        schema = media_type.get("schema")
        return schema if isinstance(schema, dict) else None

    def _schemas(self, spec: dict[str, Any]) -> dict[str, Any]:
        components = spec.get("components")
        schemas = components.get("schemas") if isinstance(components, dict) else None
        return schemas if isinstance(schemas, dict) else {}

    def _component_name(self, ref: str) -> str:
        return ref.rsplit("/", 1)[-1]

    def _forbidden_component_message(self, surface: str, component_name: str) -> str:
        if component_name == "ErrorResponse":
            return f"{surface} schema component ErrorResponse is forbidden; use ProblemDetail for error responses"
        return f"{surface} schema component {component_name} is forbidden; use operation-specific request DTOs"

    def _operation_id(self, operation: dict[str, Any]) -> str:
        return self._string(operation.get("operationId"))

    def _operation_result_component_name(self, operation_id: str) -> str:
        if not operation_id:
            return "OperationResult"
        safe = self._component_safe_operation_name(operation_id)
        return safe[0].upper() + safe[1:] + "Result"

    def _component_safe_operation_name(self, operation_id: str) -> str:
        if re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", operation_id):
            return operation_id
        parts = [part for part in re.split(r"[^A-Za-z0-9]+", operation_id) if part]
        if not parts:
            return "operation"
        first = parts[0][0].lower() + parts[0][1:]
        rest = "".join(part[0].upper() + part[1:] for part in parts[1:])
        candidate = first + rest
        if not re.match(r"^[A-Za-z_]", candidate):
            candidate = f"operation{candidate[0].upper()}{candidate[1:]}"
        return candidate

    def _non_empty_string(self, value: Any) -> bool:
        return isinstance(value, str) and bool(value.strip())

    def _non_empty_string_value(self, value: Any) -> str:
        return value.strip() if isinstance(value, str) and value.strip() else ""

    def _string(self, value: Any) -> str:
        return value if isinstance(value, str) else ""

    def _schema_refers_to(self, schema: Any, expected_ref: str) -> bool:
        if not isinstance(schema, dict):
            return False
        if schema.get("$ref") == expected_ref:
            return True
        all_of = schema.get("allOf")
        return isinstance(all_of, list) and all_of == [{"$ref": expected_ref}]

def method_upper(method: str) -> str:
    return method.upper()


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit Claw Router OpenAPI operation contract strength.")
    parser.add_argument("--root", type=Path, default=Path.cwd(), help="sdkwork-claw-router root directory")
    parser.add_argument("--openapi-dir", type=Path, default=None, help="OpenAPI output directory")
    args = parser.parse_args()

    result = ClawRouterOpenApiContractAudit(root=args.root, openapi_dir=args.openapi_dir).run()
    if result.ok:
        print("Claw Router OpenAPI contract audit passed")
        return 0
    for message in result.messages:
        print(message)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
