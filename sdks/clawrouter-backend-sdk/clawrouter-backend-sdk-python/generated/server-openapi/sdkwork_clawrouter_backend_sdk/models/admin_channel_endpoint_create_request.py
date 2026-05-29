from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminChannelEndpointCreateRequest:
    """Admin channel endpoint create request schema exposed by Claw Router."""
    api_endpoint_code: str
    base_url: str
    channel_id: str
    region_code: str
    vendor_code: str
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    priority: Optional[int] = None
    status: Optional[str] = None
    weight: Optional[int] = None
