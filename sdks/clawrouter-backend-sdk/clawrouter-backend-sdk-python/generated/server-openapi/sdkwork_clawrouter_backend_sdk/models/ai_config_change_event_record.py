from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiConfigChangeEventRecord:
    """Ai config change event record schema exposed by Claw Router."""
    config_scope: str
    config_version: str
    event_status: str
    organization_id: str
    status: str
    tenant_id: str
    uuid: str
    changed_object_id: Optional[str] = None
    changed_object_type: Optional[str] = None
    created_at: Optional[str] = None
    event_payload: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    last_error_message: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    payload_hash: Optional[str] = None
    publish_attempts: Optional[int] = None
    published_at: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
