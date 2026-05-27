from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAccessGroupChannelBindingInput:
    """Admin access group channel binding input schema exposed by Claw Router."""
    channel_id: str
    capabilities: Optional[List[str]] = None
    model_scope: Optional[List[str]] = None
    priority: Optional[int] = None
    status: Optional[str] = None
    weight: Optional[int] = None
