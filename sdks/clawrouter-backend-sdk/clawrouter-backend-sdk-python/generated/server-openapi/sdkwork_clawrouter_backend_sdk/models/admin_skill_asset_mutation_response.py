from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_skill_asset_item import AdminSkillAssetItem


@dataclass
class AdminSkillAssetMutationResponse:
    """Admin skill asset mutation response schema exposed by Claw Router."""
    item: AdminSkillAssetItem
