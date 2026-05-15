from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .routing_channel_mutation_response import RoutingChannelMutationResponse


@dataclass
class RoutingChannelsStatusUpdateResult:
    """Routing channels status update result schema exposed by Claw Router."""
    code: str
    data: Optional[RoutingChannelMutationResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
