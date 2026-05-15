from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ContentOpenapiSnapshotRecord:
    """Content openapi snapshot record schema exposed by Claw Router."""
    api_surface: Optional[str] = None
    api_system: Optional[str] = None
    category_tree: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    endpoint_count: Optional[int] = None
    example_manifest: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    openapi_hash: Optional[str] = None
    organization_id: Optional[str] = None
    published_at: Optional[str] = None
    rebuild_version: Optional[str] = None
    source_id: Optional[str] = None
    source_ref: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
