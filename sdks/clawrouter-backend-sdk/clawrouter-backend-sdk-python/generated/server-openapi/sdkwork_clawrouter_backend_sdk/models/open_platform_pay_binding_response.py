from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_pay_binding_item import OpenPlatformPayBindingItem


@dataclass
class OpenPlatformPayBindingResponse:
    """Open platform pay binding response schema exposed by Claw Router."""
    item: OpenPlatformPayBindingItem
