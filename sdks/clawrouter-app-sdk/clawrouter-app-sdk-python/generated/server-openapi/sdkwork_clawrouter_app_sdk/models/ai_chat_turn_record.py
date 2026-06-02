from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChatTurnRecord:
    """Ai chat turn record schema exposed by Claw Router."""
    agent_id: Optional[str] = None
    agent_session_id: Optional[str] = None
    branch_id: Optional[str] = None
    cached_token_total: Optional[str] = None
    completed_at: Optional[str] = None
    context_snapshot_id: Optional[str] = None
    conversation_id: Optional[str] = None
    cost_amount: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    endpoint: Optional[str] = None
    final_output_item_id: Optional[str] = None
    id: Optional[str] = None
    input_item_id: Optional[str] = None
    input_token_total: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    organization_id: Optional[str] = None
    output_token_total: Optional[str] = None
    parent_turn_id: Optional[str] = None
    payload_hash: Optional[str] = None
    provider: Optional[str] = None
    reasoning_token_total: Optional[str] = None
    request_id: Optional[str] = None
    request_snapshot: Optional[Dict[str, str]] = None
    response_snapshot: Optional[Dict[str, str]] = None
    retention_until: Optional[str] = None
    runtime_invocation_id: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
    streaming: Optional[bool] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    turn_no: Optional[str] = None
    updated_at: Optional[str] = None
    usage_snapshot: Optional[Dict[str, str]] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
