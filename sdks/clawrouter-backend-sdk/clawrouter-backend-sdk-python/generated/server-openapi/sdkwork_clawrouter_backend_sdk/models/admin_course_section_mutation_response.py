from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_section_item import AdminCourseSectionItem


@dataclass
class AdminCourseSectionMutationResponse:
    """Admin course section mutation response schema exposed by Claw Router."""
    item: AdminCourseSectionItem
