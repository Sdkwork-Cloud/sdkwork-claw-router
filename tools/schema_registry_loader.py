from __future__ import annotations

from copy import deepcopy
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError as exc:  # pragma: no cover - exercised only on missing tooling
    yaml = None
    _YAML_IMPORT_ERROR = exc
else:
    _YAML_IMPORT_ERROR = None


class SchemaRegistryLoadError(ValueError):
    """Raised when the schema registry or one of its fragments is malformed."""


def load_schema_registry(path: Path) -> dict[str, Any]:
    """Load a Schema Registry YAML file and merge any table fragments it declares."""
    if yaml is None:
        raise RuntimeError("PyYAML is required to load schema registry YAML") from _YAML_IMPORT_ERROR

    registry_path = Path(path).resolve()
    if not registry_path.exists():
        raise FileNotFoundError(f"schema registry not found: {registry_path}")

    registry = _load_mapping(registry_path)
    fragments = _string_list(registry.get("table_fragments"))
    if not fragments:
        return registry

    merged = deepcopy(registry)
    inline_tables = merged.get("tables", [])
    if inline_tables is None:
        inline_tables = []
    if not isinstance(inline_tables, list):
        raise SchemaRegistryLoadError("tables must be a list")

    tables: list[Any] = list(inline_tables)
    for fragment in fragments:
        fragment_path = _resolve_fragment_path(registry_path, fragment)
        fragment_registry = _load_mapping(fragment_path)
        fragment_tables = fragment_registry.get("tables", [])
        if not isinstance(fragment_tables, list):
            raise SchemaRegistryLoadError(f"{_display_path(fragment_path)} tables must be a list")
        tables.extend(fragment_tables)

    merged["tables"] = tables
    return merged


def render_schema_registry(path: Path) -> str:
    """Render the effective registry as YAML, including tables from fragments."""
    registry = load_schema_registry(path)
    if yaml is None:
        raise RuntimeError("PyYAML is required to render schema registry YAML") from _YAML_IMPORT_ERROR
    return yaml.safe_dump(registry, allow_unicode=True, sort_keys=False)


def schema_registry_source_paths(path: Path) -> list[Path]:
    """Return the entry file plus all declared table fragment files."""
    registry_path = Path(path).resolve()
    registry = _load_mapping(registry_path)
    return [registry_path, *[_resolve_fragment_path(registry_path, fragment) for fragment in _string_list(registry.get("table_fragments"))]]


def _load_mapping(path: Path) -> dict[str, Any]:
    if yaml is None:
        raise RuntimeError("PyYAML is required to load schema registry YAML") from _YAML_IMPORT_ERROR
    payload = yaml.safe_load(path.read_text(encoding="utf-8"))
    if payload is None:
        return {}
    if not isinstance(payload, dict):
        raise SchemaRegistryLoadError(f"{_display_path(path)} root must be a mapping")
    return payload


def _resolve_fragment_path(registry_path: Path, fragment: str) -> Path:
    fragment_path = (registry_path.parent / fragment).resolve()
    try:
        fragment_path.relative_to(registry_path.parent)
    except ValueError as exc:
        raise SchemaRegistryLoadError(f"table fragment must stay under schema registry directory: {fragment}") from exc
    if not fragment_path.exists():
        raise FileNotFoundError(f"schema registry table fragment not found: {fragment_path}")
    return fragment_path


def _string_list(value: Any) -> list[str]:
    if value is None:
        return []
    if not isinstance(value, list):
        raise SchemaRegistryLoadError("table_fragments must be a list")
    fragments: list[str] = []
    for item in value:
        if not isinstance(item, str) or not item:
            raise SchemaRegistryLoadError("table_fragments entries must be non-empty strings")
        fragments.append(item)
    return fragments


def _display_path(path: Path) -> str:
    return path.as_posix()
