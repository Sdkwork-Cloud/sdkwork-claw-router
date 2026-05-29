from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRouteCandidateRecord:
    """Ai route candidate record schema exposed by Claw Router."""
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    api_code: Optional[str] = None
    catalog_key: Optional[str] = None
    channel_group_id: Optional[str] = None
    channel_id: Optional[str] = None
    channel_type: Optional[str] = None
    config_version: Optional[str] = None
    created_at: Optional[str] = None
    endpoint_id: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model_code: Optional[str] = None
    priority: Optional[int] = None
    provider_code: Optional[str] = None
    rebuild_version: Optional[str] = None
    refreshed_at: Optional[str] = None
    region_code: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    updated_at: Optional[str] = None
    vendor_code: Optional[str] = None
    weight: Optional[int] = None
