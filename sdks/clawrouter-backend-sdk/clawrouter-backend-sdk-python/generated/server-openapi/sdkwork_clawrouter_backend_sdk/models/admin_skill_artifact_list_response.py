from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_artifact_item import AdminSkillArtifactItem


@dataclass
class AdminSkillArtifactListResponse:
    """Admin skill artifact list response schema exposed by Claw Router."""
    items: List[AdminSkillArtifactItem]
