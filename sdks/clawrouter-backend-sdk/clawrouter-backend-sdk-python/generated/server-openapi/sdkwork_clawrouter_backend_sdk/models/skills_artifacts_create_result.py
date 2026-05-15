from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_artifact_mutation_response import AdminSkillArtifactMutationResponse


@dataclass
class SkillsArtifactsCreateResult:
    """Skills artifacts create result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillArtifactMutationResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
