from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SetRoutingChannelStatusRequest:
    """Set routing channel status request schema exposed by Claw Router."""
    status: str
