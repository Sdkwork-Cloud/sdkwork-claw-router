from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MemorySpaceItem:
    """Memory space item schema exposed by Claw Router."""
    auto_extract_enabled: bool
    auto_recall_enabled: bool
    created_at: str
    entry_count: str
    id: str
    memory_enabled: bool
    review_required: bool
    space_type: str
    status: str
    title: str
    updated_at: str
    max_injected_tokens: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
