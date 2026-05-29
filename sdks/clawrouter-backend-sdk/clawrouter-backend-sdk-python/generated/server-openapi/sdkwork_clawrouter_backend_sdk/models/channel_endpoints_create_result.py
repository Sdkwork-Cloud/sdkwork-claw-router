from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_channel_endpoint_mutation_response import AdminChannelEndpointMutationResponse


@dataclass
class ChannelEndpointsCreateResult:
    """Channel endpoints create result schema exposed by Claw Router."""
    code: str
    data: Optional[AdminChannelEndpointMutationResponse] = None
    msg: Optional[str] = None
