from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_asset_list_response import AdminSkillAssetListResponse


@dataclass
class SkillsAssetsListResult:
    """Skills assets list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminSkillAssetListResponse] = None
    msg: Optional[str] = None
