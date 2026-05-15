from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .no_data import NoData


@dataclass
class PasswordResetsCreateResult:
    """Password resets create result schema exposed by Claw Router."""
    code: str
    data: Optional[NoData] = None
    message: Optional[str] = None
    msg: Optional[str] = None
