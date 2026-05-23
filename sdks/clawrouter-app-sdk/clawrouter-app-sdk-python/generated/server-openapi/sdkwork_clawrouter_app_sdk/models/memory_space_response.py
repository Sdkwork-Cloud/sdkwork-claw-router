from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .memory_space_item import MemorySpaceItem


@dataclass
class MemorySpaceResponse:
    """Memory space response schema exposed by Claw Router."""
    item: MemorySpaceItem
