from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminChannelEndpointItem:
    """Persisted channel regional endpoint snapshot returned by the backend."""
    api_endpoint_code: str
    base_url: str
    channel_code: str
    channel_id: str
    channel_type: str
    health_status: str
    id: str
    priority: int
    provider_code: str
    region_code: str
    status: str
    vendor_code: str
    weight: int
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
