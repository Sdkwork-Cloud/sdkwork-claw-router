from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_application_item import AdminCourseApplicationItem


@dataclass
class AdminCourseApplicationReviewResponse:
    """Admin course application review response schema exposed by Claw Router."""
    item: AdminCourseApplicationItem
