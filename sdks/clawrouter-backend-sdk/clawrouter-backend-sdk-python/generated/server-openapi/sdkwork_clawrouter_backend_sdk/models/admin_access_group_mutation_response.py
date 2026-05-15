from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_access_group_item import AdminAccessGroupItem


@dataclass
class AdminAccessGroupMutationResponse:
    """Admin access group mutation response schema exposed by Claw Router."""
    item: AdminAccessGroupItem
