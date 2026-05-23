from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_account_item import OpenPlatformAccountItem


@dataclass
class OpenPlatformAccountListResponse:
    """Open platform account list response schema exposed by Claw Router."""
    items: List[OpenPlatformAccountItem]
