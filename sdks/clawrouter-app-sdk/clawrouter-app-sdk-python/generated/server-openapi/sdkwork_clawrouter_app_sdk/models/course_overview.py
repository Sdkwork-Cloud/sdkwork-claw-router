from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_overview_source import CourseOverviewSource
    from .course_overview_stats import CourseOverviewStats


@dataclass
class CourseOverview:
    """Course overview schema exposed by Claw Router."""
    source: CourseOverviewSource
    stats: CourseOverviewStats
