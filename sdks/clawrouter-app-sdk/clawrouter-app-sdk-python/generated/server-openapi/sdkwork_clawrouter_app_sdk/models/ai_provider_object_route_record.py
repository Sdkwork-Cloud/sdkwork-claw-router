from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiProviderObjectRouteRecord:
    """Ai provider object route record schema exposed by Claw Router."""
    channel_id: str
    object_id: str
    object_key_hash: str
    object_type: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    api_code: Optional[str] = None
    api_key_id: Optional[str] = None
    catalog_key: Optional[str] = None
    channel_group_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    endpoint_id: Optional[str] = None
    expires_at: Optional[str] = None
    id: Optional[str] = None
    last_seen_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    parent_object_id: Optional[str] = None
    parent_object_type: Optional[str] = None
    provider_code: Optional[str] = None
    provider_model: Optional[str] = None
    region_code: Optional[str] = None
    sticky_scope: Optional[str] = None
    updated_at: Optional[str] = None
    vendor_code: Optional[str] = None
    version: Optional[str] = None
