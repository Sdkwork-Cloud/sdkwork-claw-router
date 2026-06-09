from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_position_item import IamPositionItem


@dataclass
class IamPositionListResponse:
    """Iam position list response schema exposed by Claw Router."""
    items: List[IamPositionItem]
