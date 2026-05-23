from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .memory_space_list_response import MemorySpaceListResponse


@dataclass
class SpacesListResult:
    """Spaces list result schema exposed by Claw Router."""
    code: str
    data: Optional[MemorySpaceListResponse] = None
    msg: Optional[str] = None
