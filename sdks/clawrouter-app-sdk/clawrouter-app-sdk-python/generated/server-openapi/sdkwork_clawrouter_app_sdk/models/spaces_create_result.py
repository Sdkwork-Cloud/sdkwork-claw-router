from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .memory_space_response import MemorySpaceResponse


@dataclass
class SpacesCreateResult:
    """Spaces create result schema exposed by Claw Router."""
    code: str
    data: Optional[MemorySpaceResponse] = None
    msg: Optional[str] = None
