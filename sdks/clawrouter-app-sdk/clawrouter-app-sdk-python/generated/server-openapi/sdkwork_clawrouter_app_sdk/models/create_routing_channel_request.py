from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CreateRoutingChannelRequest:
    """Create routing channel request schema exposed by Claw Router."""
    models: List[str]
    name: str
    secret_ref: str
    vendor: str
    access_type: Optional[str] = None
    base_url: Optional[str] = None
    capabilities: Optional[List[str]] = None
    protocol: Optional[str] = None
    status: Optional[str] = None
    weight: Optional[int] = None
