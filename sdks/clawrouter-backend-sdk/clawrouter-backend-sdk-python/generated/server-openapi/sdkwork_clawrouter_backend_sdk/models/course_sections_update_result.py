from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_course_section_mutation_response import AdminCourseSectionMutationResponse


@dataclass
class CourseSectionsUpdateResult:
    """Course sections update result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminCourseSectionMutationResponse] = None
    msg: Optional[str] = None
