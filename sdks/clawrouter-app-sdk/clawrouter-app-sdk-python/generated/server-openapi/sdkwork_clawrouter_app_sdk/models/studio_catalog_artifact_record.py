from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .media_resource import MediaResource


@dataclass
class StudioCatalogArtifactRecord:
    """Studio catalog artifact record schema exposed by Claw Router."""
    artifact: Optional[MediaResource] = None
    artifact_ref: Optional[str] = None
    artifact_size_bytes: Optional[str] = None
    artifact_type: Optional[str] = None
    checksum_hash: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    deprecated_at: Optional[str] = None
    frameworks: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    license_name: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    os_name: Optional[str] = None
    platform_type: Optional[str] = None
    published_at: Optional[str] = None
    release_notes: Optional[str] = None
    runtime: Optional[str] = None
    status: Optional[str] = None
    target_id: Optional[str] = None
    target_type: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
