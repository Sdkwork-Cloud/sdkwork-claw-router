from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminCourseRelationsReplaceRequest:
    """Admin course relations replace request schema exposed by Claw Router."""
    items: List[Dict[str, Any]]
