from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .routing_channel_item import RoutingChannelItem


@dataclass
class RoutingChannelTestResponse:
    """Routing channel test response schema exposed by Claw Router."""
    channel_id: str
    item: RoutingChannelItem
    latency: str
    status: str
    success: bool
