from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AdminAiResourceGroupItem:
    """Admin ai resource group item schema exposed by Claw Router."""
    dynamic: bool
    group_code: str
    group_name: str
    group_type: str
    id: str
    resource_count: int
    selection_mode: str
    status: str
    description: Optional[str] = None
    sort_order: Optional[int] = None
