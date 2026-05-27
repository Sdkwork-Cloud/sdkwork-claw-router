from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_section_item import AdminCourseSectionItem


@dataclass
class AdminCourseSectionCollectionResponse:
    """Admin course section collection response schema exposed by Claw Router."""
    items: List[AdminCourseSectionItem]
