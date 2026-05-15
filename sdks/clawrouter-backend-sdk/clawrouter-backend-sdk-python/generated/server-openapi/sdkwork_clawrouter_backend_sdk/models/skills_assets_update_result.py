from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_asset_mutation_response import AdminSkillAssetMutationResponse


@dataclass
class SkillsAssetsUpdateResult:
    """Skills assets update result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillAssetMutationResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
