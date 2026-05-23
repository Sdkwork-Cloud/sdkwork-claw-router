from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChatMessageRecord:
    """Ai chat message record schema exposed by Claw Router."""
    content_json: Optional[Dict[str, str]] = None
    content_text: Optional[str] = None
    conversation_id: Optional[str] = None
    created_at: Optional[str] = None
    direction: Optional[str] = None
    finish_reason: Optional[str] = None
    id: Optional[str] = None
    item_id: Optional[str] = None
    legal_hold: Optional[bool] = None
    message_kind: Optional[str] = None
    message_no: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    provider: Optional[str] = None
    raw_provider_json: Optional[Dict[str, str]] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    role: Optional[str] = None
    runtime: Optional[str] = None
    runtime_invocation_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    token_count: Optional[str] = None
    trace_id: Optional[str] = None
    turn_id: Optional[str] = None
    usage_link_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
