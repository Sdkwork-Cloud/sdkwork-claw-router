from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationProviderAccountRecord:
    """Integration provider account record schema exposed by Claw Router."""
    account_code: str
    account_name: str
    organization_id: str
    provider_code: str
    status: str
    tenant_id: str
    uuid: str
    account_type: Optional[str] = None
    auth_config: Optional[Dict[str, str]] = None
    auth_type: Optional[str] = None
    base_url: Optional[str] = None
    channel_type: Optional[str] = None
    consecutive_error_count: Optional[str] = None
    created_at: Optional[str] = None
    credential_profile: Optional[str] = None
    credential_version: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    environment: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_latency_ms: Optional[int] = None
    last_rotated_at: Optional[str] = None
    last_used_at: Optional[str] = None
    last_verified_at: Optional[str] = None
    masked_label: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    next_rotate_at: Optional[str] = None
    provider_id: Optional[str] = None
    quota_snapshot: Optional[Dict[str, str]] = None
    region_code: Optional[str] = None
    risk_level: Optional[str] = None
    secret_hash: Optional[str] = None
    secret_ref: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
