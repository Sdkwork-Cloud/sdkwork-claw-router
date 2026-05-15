from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .generation_history_item import GenerationHistoryItem


@dataclass
class GenerationHistoryResponse:
    """Generation history response schema exposed by Claw Router."""
    items: List[GenerationHistoryItem]
