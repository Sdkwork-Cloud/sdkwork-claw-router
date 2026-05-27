from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_dashboard import AdminCourseDashboard


@dataclass
class AdminCourseDashboardResponse:
    """Admin course dashboard response schema exposed by Claw Router."""
    item: AdminCourseDashboard
