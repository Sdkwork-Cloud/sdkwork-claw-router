from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_relation_item import AdminCourseRelationItem


@dataclass
class AdminCourseRelationCollectionResponse:
    """Admin course relation collection response schema exposed by Claw Router."""
    items: List[AdminCourseRelationItem]
