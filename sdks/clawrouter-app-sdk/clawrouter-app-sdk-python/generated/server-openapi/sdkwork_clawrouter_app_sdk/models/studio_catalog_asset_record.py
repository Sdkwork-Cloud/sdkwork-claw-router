from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StudioCatalogAssetRecord:
    """Studio catalog asset record schema exposed by Claw Router."""
    alt_text: Optional[str] = None
    artifact_id: Optional[str] = None
    asset_type: Optional[str] = None
    asset_url: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    duration_seconds: Optional[str] = None
    file_size: Optional[str] = None
    height: Optional[int] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    mime_type: Optional[str] = None
    organization_id: Optional[str] = None
    published_at: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None
    target_id: Optional[str] = None
    target_type: Optional[str] = None
    tenant_id: Optional[str] = None
    thumbnail_url: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    width: Optional[int] = None
