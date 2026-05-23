from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_pay_binding_item import OpenPlatformPayBindingItem


@dataclass
class OpenPlatformPayBindingListResponse:
    """Open platform pay binding list response schema exposed by Claw Router."""
    items: List[OpenPlatformPayBindingItem]
