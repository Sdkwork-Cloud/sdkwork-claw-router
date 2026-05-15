from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .routing_channel_delete_response import RoutingChannelDeleteResponse


@dataclass
class RoutingChannelsDeleteResult:
    """Routing channels delete result schema exposed by Claw Router."""
    code: str
    data: Optional[RoutingChannelDeleteResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
