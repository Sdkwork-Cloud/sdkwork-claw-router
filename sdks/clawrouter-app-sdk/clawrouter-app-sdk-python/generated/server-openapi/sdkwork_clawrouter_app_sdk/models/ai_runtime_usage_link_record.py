from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRuntimeUsageLinkRecord:
    """Ai runtime usage link record schema exposed by Claw Router."""
    agent_run_id: Optional[str] = None
    agent_run_step_id: Optional[str] = None
    agent_session_id: Optional[str] = None
    cached_tokens: Optional[str] = None
    chat_item_id: Optional[str] = None
    chat_turn_id: Optional[str] = None
    conversation_id: Optional[str] = None
    cost_amount: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    id: Optional[str] = None
    input_tokens: Optional[str] = None
    legal_hold: Optional[bool] = None
    message_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    occurred_at: Optional[str] = None
    organization_id: Optional[str] = None
    output_tokens: Optional[str] = None
    payload_hash: Optional[str] = None
    provider: Optional[str] = None
    reasoning_tokens: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    runtime_invocation_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    total_tokens: Optional[str] = None
    trace_id: Optional[str] = None
    usage_fact_id: Optional[str] = None
    usage_type: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
