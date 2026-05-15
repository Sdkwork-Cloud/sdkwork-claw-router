from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_asset_delete_response import AdminSkillAssetDeleteResponse


@dataclass
class SkillsAssetsDeleteResult:
    """Skills assets delete result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillAssetDeleteResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
