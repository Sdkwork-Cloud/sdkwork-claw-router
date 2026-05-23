from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiChatConversationRecord:
    """Ai chat conversation record schema exposed by Claw Router."""
    agent_id: Optional[str] = None
    agent_session_id: Optional[str] = None
    cached_token_total: Optional[str] = None
    conversation_code: Optional[str] = None
    cost_amount_total: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    data_scope: Optional[str] = None
    default_endpoint: Optional[str] = None
    default_model: Optional[str] = None
    default_provider: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    input_token_total: Optional[str] = None
    item_count: Optional[str] = None
    last_item_id: Optional[str] = None
    last_message_preview: Optional[str] = None
    last_turn_id: Optional[str] = None
    memory_space_id: Optional[str] = None
    message_count: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    output_token_total: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    reasoning_token_total: Optional[str] = None
    source_surface: Optional[str] = None
    status: Optional[str] = None
    summary: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    turn_count: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    visibility: Optional[str] = None
