from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_entry_item import OpenPlatformEntryItem


@dataclass
class OpenPlatformEntryResponse:
    """Open platform entry response schema exposed by Claw Router."""
    item: OpenPlatformEntryItem
