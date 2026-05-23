from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiMemoryEventRecord:
    """Ai memory event record schema exposed by Claw Router."""
    actor_id: Optional[str] = None
    actor_type: Optional[str] = None
    after_json: Optional[Dict[str, str]] = None
    before_json: Optional[Dict[str, str]] = None
    conversation_id: Optional[str] = None
    created_at: Optional[str] = None
    decision_reason: Optional[str] = None
    event_type: Optional[str] = None
    id: Optional[str] = None
    invocation_id: Optional[str] = None
    legal_hold: Optional[bool] = None
    memory_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    space_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    turn_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
