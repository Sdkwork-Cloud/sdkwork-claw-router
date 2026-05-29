from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminChannelEndpointUpdateRequest:
    """Admin channel endpoint update request schema exposed by Claw Router."""
    api_endpoint_code: Optional[str] = None
    base_url: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    priority: Optional[int] = None
    region_code: Optional[str] = None
    status: Optional[str] = None
    vendor_code: Optional[str] = None
    weight: Optional[int] = None
