from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_user_item import AdminUserItem


@dataclass
class AdminUsersResponse:
    """Admin users response schema exposed by Claw Router."""
    items: List[AdminUserItem]
