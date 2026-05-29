from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChannelRecord:
    """Ai channel record schema exposed by Claw Router."""
    channel_code: str
    channel_name: str
    channel_type: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    auth_config: Optional[Dict[str, str]] = None
    auth_type: Optional[str] = None
    base_url: Optional[str] = None
    circuit_breaker_policy: Optional[Dict[str, str]] = None
    consecutive_error_count: Optional[str] = None
    created_at: Optional[str] = None
    credential_hash: Optional[str] = None
    credential_profile: Optional[str] = None
    credential_ref: Optional[str] = None
    credential_rotation_policy: Optional[Dict[str, str]] = None
    credential_version: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    environment: Optional[str] = None
    external_channel_id: Optional[str] = None
    id: Optional[str] = None
    last_balance_checked_at: Optional[str] = None
    last_latency_ms: Optional[int] = None
    last_rotated_at: Optional[str] = None
    last_used_at: Optional[str] = None
    last_verified_at: Optional[str] = None
    masked_label: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    next_rotate_at: Optional[str] = None
    protocol_code: Optional[str] = None
    provider_code: Optional[str] = None
    provider_id: Optional[str] = None
    proxy_id: Optional[str] = None
    quota_limit: Optional[str] = None
    quota_unit: Optional[str] = None
    quota_used: Optional[str] = None
    region_code: Optional[str] = None
    retry_policy: Optional[Dict[str, str]] = None
    risk_level: Optional[str] = None
    rpm_limit: Optional[str] = None
    timeout_ms: Optional[int] = None
    updated_at: Optional[str] = None
    upstream_balance_amount: Optional[str] = None
    upstream_balance_currency: Optional[str] = None
    version: Optional[str] = None
