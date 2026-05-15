from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class FeedsDeleteResult:
    """Feeds delete result schema exposed by Claw Router."""
    code: str
    data: Optional[bool] = None
    message: Optional[str] = None
    msg: Optional[str] = None
