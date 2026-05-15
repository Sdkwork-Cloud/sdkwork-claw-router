from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .no_data import NoData


@dataclass
class PlusApiResult:
    """Base Claw Router response envelope. Operation-specific Result schemas carry concrete business data."""
    code: str
    data: Optional[NoData] = None
    message: Optional[str] = None
    msg: Optional[str] = None
