from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsInboxEventRecord:
    """Ops inbox event record schema exposed by Claw Router."""
    consumer_name: Optional[str] = None
    created_at: Optional[str] = None
    event_type: Optional[str] = None
    event_version: Optional[int] = None
    failure_reason: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    message_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    process_status: Optional[str] = None
    processed_at: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    retry_count: Optional[int] = None
    source_system: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
