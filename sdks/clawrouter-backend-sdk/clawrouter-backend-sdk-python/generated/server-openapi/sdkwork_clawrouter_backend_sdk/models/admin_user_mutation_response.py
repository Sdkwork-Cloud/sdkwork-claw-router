from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_user_item import AdminUserItem


@dataclass
class AdminUserMutationResponse:
    """Admin user mutation response schema exposed by Claw Router."""
    item: AdminUserItem
