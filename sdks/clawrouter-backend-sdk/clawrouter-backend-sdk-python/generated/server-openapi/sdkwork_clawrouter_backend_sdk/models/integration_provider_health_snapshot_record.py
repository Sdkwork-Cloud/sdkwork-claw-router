from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationProviderHealthSnapshotRecord:
    """Integration provider health snapshot record schema exposed by Claw Router."""
    channel_id: Optional[str] = None
    check_type: Optional[str] = None
    checked_at: Optional[str] = None
    created_at: Optional[str] = None
    error_code: Optional[str] = None
    error_message_masked: Optional[str] = None
    health_status: Optional[str] = None
    http_status: Optional[int] = None
    id: Optional[str] = None
    latency_ms: Optional[int] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    provider_account_id: Optional[str] = None
    provider_id: Optional[str] = None
    quota_snapshot: Optional[Dict[str, str]] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
