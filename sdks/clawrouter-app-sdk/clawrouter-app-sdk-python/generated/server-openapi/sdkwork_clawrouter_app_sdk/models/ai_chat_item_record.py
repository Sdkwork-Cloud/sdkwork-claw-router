from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChatItemRecord:
    """Ai chat item record schema exposed by Claw Router."""
    completed_at: Optional[str] = None
    content_json: Optional[Dict[str, str]] = None
    content_text: Optional[str] = None
    conversation_id: Optional[str] = None
    created_at: Optional[str] = None
    direction: Optional[str] = None
    id: Optional[str] = None
    item_type: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    organization_id: Optional[str] = None
    parent_item_id: Optional[str] = None
    payload_hash: Optional[str] = None
    provider: Optional[str] = None
    provider_call_id: Optional[str] = None
    provider_item_id: Optional[str] = None
    provider_response_id: Optional[str] = None
    raw_provider_json: Optional[Dict[str, str]] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    role: Optional[str] = None
    runtime: Optional[str] = None
    runtime_invocation_id: Optional[str] = None
    sequence_no: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    turn_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
