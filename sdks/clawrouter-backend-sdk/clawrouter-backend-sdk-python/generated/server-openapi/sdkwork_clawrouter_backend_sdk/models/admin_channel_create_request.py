from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .provider_retry_policy import ProviderRetryPolicy


@dataclass
class AdminChannelCreateRequest:
    """Admin channel create request schema exposed by Claw Router."""
    models: List[str]
    name: str
    secret_ref: str
    vendor: str
    access_type: Optional[str] = None
    base_url: Optional[str] = None
    capabilities: Optional[List[str]] = None
    protocol: Optional[str] = None
    retry_policy: Optional[ProviderRetryPolicy] = None
    status: Optional[str] = None
    timeout_ms: Optional[int] = None
    weight: Optional[int] = None
