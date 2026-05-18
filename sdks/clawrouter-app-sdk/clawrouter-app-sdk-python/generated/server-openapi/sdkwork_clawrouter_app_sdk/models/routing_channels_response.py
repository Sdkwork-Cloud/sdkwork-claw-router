from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .provider_retry_policy import ProviderRetryPolicy


@dataclass
class RoutingChannelsResponse:
    """Routing channels response schema exposed by Claw Router."""
    items: List[Dict[str, Any]]
