from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_provider_item import OpenPlatformProviderItem


@dataclass
class OpenPlatformProviderListResponse:
    """Open platform provider list response schema exposed by Claw Router."""
    items: List[OpenPlatformProviderItem]
