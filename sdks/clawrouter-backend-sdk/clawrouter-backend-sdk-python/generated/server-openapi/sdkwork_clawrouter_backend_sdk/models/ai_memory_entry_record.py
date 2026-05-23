from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiMemoryEntryRecord:
    """Ai memory entry record schema exposed by Claw Router."""
    confidence_score: Optional[str] = None
    content_json: Optional[Dict[str, str]] = None
    content_text: Optional[str] = None
    created_at: Optional[str] = None
    created_by: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    expires_at: Optional[str] = None
    id: Optional[str] = None
    importance_score: Optional[str] = None
    last_recalled_at: Optional[str] = None
    memory_code: Optional[str] = None
    memory_type: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    recall_count: Optional[str] = None
    sensitivity_level: Optional[str] = None
    source_conversation_id: Optional[str] = None
    source_invocation_id: Optional[str] = None
    source_item_id: Optional[str] = None
    source_kind: Optional[str] = None
    source_turn_id: Optional[str] = None
    space_id: Optional[str] = None
    status: Optional[str] = None
    subject_key: Optional[str] = None
    subject_type: Optional[str] = None
    supersedes_memory_id: Optional[str] = None
    tenant_id: Optional[str] = None
    trust_level: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    valid_from: Optional[str] = None
    valid_until: Optional[str] = None
    version: Optional[str] = None
    version_no: Optional[str] = None
