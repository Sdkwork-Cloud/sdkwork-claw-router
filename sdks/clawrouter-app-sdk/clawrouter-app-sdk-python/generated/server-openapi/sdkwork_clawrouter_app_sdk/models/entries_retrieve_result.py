from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .memory_entry_item import MemoryEntryItem


@dataclass
class EntriesRetrieveResult:
    """Entries retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[MemoryEntryItem] = None
    msg: Optional[str] = None
