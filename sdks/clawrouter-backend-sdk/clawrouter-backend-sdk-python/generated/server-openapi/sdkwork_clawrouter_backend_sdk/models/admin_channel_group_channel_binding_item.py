from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminChannelGroupChannelBindingItem:
    """Admin channel group channel binding item schema exposed by Claw Router."""
    capabilities: List[str]
    channel_code: str
    channel_group_id: str
    channel_id: str
    channel_name: str
    health_status: str
    id: str
    model_scope: List[str]
    models: List[str]
    priority: int
    provider_code: str
    provider_name: str
    status: str
    weight: int
