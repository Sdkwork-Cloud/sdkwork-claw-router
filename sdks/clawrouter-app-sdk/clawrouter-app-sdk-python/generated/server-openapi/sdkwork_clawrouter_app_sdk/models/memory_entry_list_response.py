from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .memory_entry_item import MemoryEntryItem


@dataclass
class MemoryEntryListResponse:
    """Memory entry list response schema exposed by Claw Router."""
    items: List[MemoryEntryItem]
