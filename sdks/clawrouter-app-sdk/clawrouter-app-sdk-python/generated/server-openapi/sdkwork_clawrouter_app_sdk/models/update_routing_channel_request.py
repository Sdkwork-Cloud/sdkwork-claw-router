from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class UpdateRoutingChannelRequest:
    """Update routing channel request schema exposed by Claw Router."""
    access_type: Optional[str] = None
    base_url: Optional[str] = None
    capabilities: Optional[List[str]] = None
    models: Optional[List[str]] = None
    name: Optional[str] = None
    protocol: Optional[str] = None
    secret_ref: Optional[str] = None
    status: Optional[str] = None
    vendor: Optional[str] = None
    weight: Optional[int] = None
