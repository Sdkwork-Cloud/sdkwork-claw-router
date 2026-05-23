from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_artifact_list_response import AdminSkillArtifactListResponse


@dataclass
class SkillsArtifactsListResult:
    """Skills artifacts list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillArtifactListResponse] = None
    msg: Optional[str] = None
