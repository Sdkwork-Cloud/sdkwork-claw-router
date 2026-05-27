from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseApplicationReviewRequest:
    """Admin course application review request schema exposed by Claw Router."""
    status: str
    review_note: Optional[str] = None
