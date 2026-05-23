from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiMemoryLinkRecord:
    """Ai memory link record schema exposed by Claw Router."""
    agent_run_id: Optional[str] = None
    agent_run_step_id: Optional[str] = None
    agent_session_id: Optional[str] = None
    chat_item_id: Optional[str] = None
    chat_turn_id: Optional[str] = None
    conversation_id: Optional[str] = None
    created_at: Optional[str] = None
    id: Optional[str] = None
    injected_text_snapshot: Optional[str] = None
    legal_hold: Optional[bool] = None
    link_type: Optional[str] = None
    memory_id: Optional[str] = None
    memory_space_id: Optional[str] = None
    message_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    policy_decision: Optional[str] = None
    recall_query: Optional[str] = None
    recall_rank: Optional[int] = None
    recall_score: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    runtime_invocation_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    token_count: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
