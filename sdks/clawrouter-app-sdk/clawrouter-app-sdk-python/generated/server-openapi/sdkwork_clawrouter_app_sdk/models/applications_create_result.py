from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .course_application_create_response import CourseApplicationCreateResponse


@dataclass
class ApplicationsCreateResult:
    """Applications create result schema exposed by Claw Router."""
    code: str
    data: Optional[CourseApplicationCreateResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
