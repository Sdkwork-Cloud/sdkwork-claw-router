from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChatContextSnapshotRecord:
    """Ai chat context snapshot record schema exposed by Claw Router."""
    context_json: Optional[Dict[str, str]] = None
    conversation_id: Optional[str] = None
    created_at: Optional[str] = None
    excluded_item_ids: Optional[Dict[str, str]] = None
    excluded_memory_ids: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    included_item_ids: Optional[Dict[str, str]] = None
    included_memory_ids: Optional[Dict[str, str]] = None
    input_token_estimate: Optional[str] = None
    legal_hold: Optional[bool] = None
    memory_pack: Optional[Dict[str, str]] = None
    memory_token_count: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    previous_response_id: Optional[str] = None
    provider_conversation_id: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    runtime_invocation_id: Optional[str] = None
    snapshot_no: Optional[int] = None
    status: Optional[str] = None
    strategy: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    truncation_reason: Optional[str] = None
    turn_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
