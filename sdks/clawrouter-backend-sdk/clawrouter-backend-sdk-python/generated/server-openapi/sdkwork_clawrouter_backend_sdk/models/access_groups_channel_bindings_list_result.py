from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_access_group_channel_bindings_response import AdminAccessGroupChannelBindingsResponse


@dataclass
class AccessGroupsChannelBindingsListResult:
    """Access groups channel bindings list result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminAccessGroupChannelBindingsResponse] = None
    msg: Optional[str] = None
