from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_channel_endpoint_item import AdminChannelEndpointItem


@dataclass
class AdminChannelEndpointMutationResponse:
    """Admin channel endpoint mutation response schema exposed by Claw Router."""
    item: AdminChannelEndpointItem
