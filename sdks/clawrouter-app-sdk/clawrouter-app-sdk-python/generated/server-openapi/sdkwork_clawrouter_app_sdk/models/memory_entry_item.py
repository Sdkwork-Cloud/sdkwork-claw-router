from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MemoryEntryItem:
    """Memory entry item schema exposed by Claw Router."""
    content: str
    created_at: str
    id: str
    memory_type: str
    recall_count: int
    sensitivity_level: str
    source_kind: str
    space_id: str
    status: str
    trust_level: str
    updated_at: str
    confidence_score: Optional[str] = None
    importance_score: Optional[str] = None
    source_conversation_id: Optional[str] = None
    source_invocation_id: Optional[str] = None
    source_item_id: Optional[str] = None
    source_turn_id: Optional[str] = None
    subject_key: Optional[str] = None
    subject_type: Optional[str] = None
