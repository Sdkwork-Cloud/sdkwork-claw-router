from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MemoryEntryCreateRequest:
    """Memory entry create request schema exposed by Claw Router."""
    content: str
    confidence_score: Optional[str] = None
    content_json: Optional[Dict[str, str]] = None
    importance_score: Optional[str] = None
    memory_type: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    sensitivity_level: Optional[str] = None
    source_conversation_id: Optional[str] = None
    source_invocation_id: Optional[str] = None
    source_item_id: Optional[str] = None
    source_kind: Optional[str] = None
    source_turn_id: Optional[str] = None
    status: Optional[str] = None
    subject_key: Optional[str] = None
    subject_type: Optional[str] = None
    trust_level: Optional[str] = None
