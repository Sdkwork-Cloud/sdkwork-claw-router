from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .provider_circuit_breaker_policy import ProviderCircuitBreakerPolicy
    from .provider_retry_policy import ProviderRetryPolicy


@dataclass
class AdminChannelCreateRequest:
    """Admin channel create request schema exposed by Claw Router."""
    api_key: str
    models: List[str]
    name: str
    vendor: str
    access_type: Optional[str] = None
    base_url: Optional[str] = None
    capabilities: Optional[List[str]] = None
    channel_type: Optional[str] = None
    circuit_breaker_policy: Optional[ProviderCircuitBreakerPolicy] = None
    expires_at: Optional[str] = None
    protocol: Optional[str] = None
    resource_codes: Optional[List[str]] = None
    retry_policy: Optional[ProviderRetryPolicy] = None
    secret_ref: Optional[str] = None
    status: Optional[str] = None
    timeout_ms: Optional[int] = None
    weight: Optional[int] = None
