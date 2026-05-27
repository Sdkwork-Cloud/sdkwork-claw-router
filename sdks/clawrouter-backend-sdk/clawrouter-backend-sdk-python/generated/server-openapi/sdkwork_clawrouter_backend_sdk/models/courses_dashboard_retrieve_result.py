from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_dashboard_response import AdminCourseDashboardResponse


@dataclass
class CoursesDashboardRetrieveResult:
    """Courses dashboard retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseDashboardResponse] = None
    msg: Optional[str] = None
