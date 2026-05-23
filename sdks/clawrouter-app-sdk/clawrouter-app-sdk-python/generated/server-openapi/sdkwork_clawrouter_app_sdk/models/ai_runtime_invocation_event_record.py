from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRuntimeInvocationEventRecord:
    """Ai runtime invocation event record schema exposed by Claw Router."""
    agent_run_id: Optional[str] = None
    agent_run_step_id: Optional[str] = None
    agent_session_id: Optional[str] = None
    chat_turn_id: Optional[str] = None
    conversation_id: Optional[str] = None
    created_at: Optional[str] = None
    event_no: Optional[str] = None
    event_source: Optional[str] = None
    event_type: Optional[str] = None
    id: Optional[str] = None
    invocation_id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    payload_json: Optional[Dict[str, str]] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    text_delta: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
