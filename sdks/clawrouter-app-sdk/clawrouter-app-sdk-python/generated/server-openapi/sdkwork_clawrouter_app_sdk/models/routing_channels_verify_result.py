from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .routing_channel_test_response import RoutingChannelTestResponse


@dataclass
class RoutingChannelsVerifyResult:
    """Routing channels verify result schema exposed by Claw Router."""
    code: str
    data: Optional[RoutingChannelTestResponse] = None
    msg: Optional[str] = None
