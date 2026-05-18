from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .provider_retry_policy import ProviderRetryPolicy


@dataclass
class RoutingChannelItem:
    """Routing channel item schema exposed by Claw Router."""
    access_type: str
    api_key: str
    balance: str
    base_url: str
    capabilities: List[str]
    errors: int
    id: str
    is_multimodal: bool
    latency: str
    models: List[str]
    name: str
    protocol: str
    provider: str
    provider_code: str
    rpm: int
    status: str
    vendor: str
    weight: int
    retry_policy: Optional[ProviderRetryPolicy] = None
    timeout_ms: Optional[int] = None
