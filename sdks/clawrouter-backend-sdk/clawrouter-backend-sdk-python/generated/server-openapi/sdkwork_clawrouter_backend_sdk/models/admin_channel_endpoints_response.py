from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_channel_endpoint_item import AdminChannelEndpointItem


@dataclass
class AdminChannelEndpointsResponse:
    """Admin channel endpoints response schema exposed by Claw Router."""
    items: List[AdminChannelEndpointItem]
