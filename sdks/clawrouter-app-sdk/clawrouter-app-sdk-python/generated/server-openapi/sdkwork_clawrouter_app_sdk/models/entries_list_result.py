from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .memory_entry_list_response import MemoryEntryListResponse


@dataclass
class EntriesListResult:
    """Entries list result schema exposed by Claw Router."""
    code: str
    data: Optional[MemoryEntryListResponse] = None
    msg: Optional[str] = None
