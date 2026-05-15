from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsOutboxEventRecord:
    """Ops outbox event record schema exposed by Claw Router."""
    aggregate_id: Optional[str] = None
    aggregate_type: Optional[str] = None
    aggregate_uuid: Optional[str] = None
    created_at: Optional[str] = None
    event_id: Optional[str] = None
    event_payload: Optional[Dict[str, str]] = None
    event_type: Optional[str] = None
    event_version: Optional[int] = None
    failure_reason: Optional[str] = None
    headers: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    next_retry_at: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    publish_status: Optional[str] = None
    published_at: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    retry_count: Optional[int] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
