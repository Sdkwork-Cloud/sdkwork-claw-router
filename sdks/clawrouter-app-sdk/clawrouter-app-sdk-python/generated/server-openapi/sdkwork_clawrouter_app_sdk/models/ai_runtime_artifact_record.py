from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRuntimeArtifactRecord:
    """Ai runtime artifact record schema exposed by Claw Router."""
    agent_run_id: Optional[str] = None
    agent_run_step_id: Optional[str] = None
    agent_session_id: Optional[str] = None
    artifact_type: Optional[str] = None
    chat_item_id: Optional[str] = None
    chat_turn_id: Optional[str] = None
    content_json: Optional[Dict[str, str]] = None
    content_text: Optional[str] = None
    conversation_id: Optional[str] = None
    created_at: Optional[str] = None
    id: Optional[str] = None
    legal_hold: Optional[bool] = None
    message_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    mime_type: Optional[str] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    runtime_invocation_id: Optional[str] = None
    sha256: Optional[str] = None
    size_bytes: Optional[str] = None
    status: Optional[str] = None
    storage_key: Optional[str] = None
    storage_url: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
