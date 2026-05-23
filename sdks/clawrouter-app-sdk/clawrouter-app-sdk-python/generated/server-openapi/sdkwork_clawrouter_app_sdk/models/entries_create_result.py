from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .memory_entry_response import MemoryEntryResponse


@dataclass
class EntriesCreateResult:
    """Entries create result schema exposed by Claw Router."""
    code: str
    data: Optional[MemoryEntryResponse] = None
    msg: Optional[str] = None
