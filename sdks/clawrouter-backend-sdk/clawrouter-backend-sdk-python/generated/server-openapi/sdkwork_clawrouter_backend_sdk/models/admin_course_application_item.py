from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseApplicationItem:
    """Admin course application item schema exposed by Claw Router."""
    id: str
    reviewed_at: Optional[str] = None
    status: Optional[str] = None
