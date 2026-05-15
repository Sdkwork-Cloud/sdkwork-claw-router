from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .provider_retry_policy import ProviderRetryPolicy


@dataclass
class AdminChannelItem:
    """Persisted channel snapshot returned after the provider health probe. Secret refs and tokens are not returned."""
    access_type: str
    balance: str
    capabilities: List[str]
    errors: int
    id: str
    is_multimodal: bool
    models: List[str]
    name: str
    protocol: str
    status: str
    vendor: str
    weight: int
    base_url: Optional[str] = None
    retry_policy: Optional[ProviderRetryPolicy] = None
    secret_ref: Optional[str] = None
    timeout_ms: Optional[int] = None
