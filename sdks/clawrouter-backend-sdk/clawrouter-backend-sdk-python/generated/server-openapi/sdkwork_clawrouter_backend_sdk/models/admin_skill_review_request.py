from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminSkillReviewRequest:
    """Admin skill review request schema exposed by Claw Router."""
    comment: Optional[str] = None
    review_comment: Optional[str] = None
