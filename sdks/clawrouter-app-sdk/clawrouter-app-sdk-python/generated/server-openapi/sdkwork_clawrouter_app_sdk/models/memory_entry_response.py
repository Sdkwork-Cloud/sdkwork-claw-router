from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .memory_entry_item import MemoryEntryItem


@dataclass
class MemoryEntryResponse:
    """Memory entry response schema exposed by Claw Router."""
    item: MemoryEntryItem
