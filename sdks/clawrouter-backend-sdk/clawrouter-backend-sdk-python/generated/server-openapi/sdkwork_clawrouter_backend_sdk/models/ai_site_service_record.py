from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiSiteServiceRecord:
    """Ai site service record schema exposed by Claw Router."""
    organization_id: str
    service_code: str
    service_name: str
    service_type: str
    site_code: str
    site_id: str
    status: str
    tenant_id: str
    uuid: str
    auth_config: Optional[Dict[str, str]] = None
    auth_type: Optional[str] = None
    base_url: Optional[str] = None
    consecutive_error_count: Optional[str] = None
    created_at: Optional[str] = None
    credential_hash: Optional[str] = None
    credential_profile: Optional[str] = None
    credential_ref: Optional[str] = None
    credential_version: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    environment: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_latency_ms: Optional[int] = None
    last_sync_at: Optional[str] = None
    last_verified_at: Optional[str] = None
    masked_label: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    protocol_code: Optional[str] = None
    region_code: Optional[str] = None
    sort_order: Optional[int] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
