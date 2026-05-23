from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_manifest_item import OpenPlatformManifestItem


@dataclass
class OpenPlatformManifestListResponse:
    """Open platform manifest list response schema exposed by Claw Router."""
    items: List[OpenPlatformManifestItem]
