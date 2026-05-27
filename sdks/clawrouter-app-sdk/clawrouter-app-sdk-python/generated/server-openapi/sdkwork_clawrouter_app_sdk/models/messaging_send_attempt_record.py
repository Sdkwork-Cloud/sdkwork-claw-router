from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingSendAttemptRecord:
    """Messaging send attempt record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    failure_code: Optional[str] = None
    failure_message_masked: Optional[str] = None
    http_status: Optional[int] = None
    id: Optional[str] = None
    latency_ms: Optional[int] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    provider_message_id: Optional[str] = None
    provider_request_id: Optional[str] = None
    provider_status: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    retry_after_at: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
