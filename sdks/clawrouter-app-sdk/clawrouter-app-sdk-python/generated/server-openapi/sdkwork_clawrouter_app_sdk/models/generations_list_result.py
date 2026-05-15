from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .generation_history_response import GenerationHistoryResponse


@dataclass
class GenerationsListResult:
    """Generations list result schema exposed by Claw Router."""
    code: str
    data: Optional[GenerationHistoryResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
