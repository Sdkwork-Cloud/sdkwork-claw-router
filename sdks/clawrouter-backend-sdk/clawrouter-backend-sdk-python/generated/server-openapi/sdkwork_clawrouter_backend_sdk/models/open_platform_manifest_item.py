from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformManifestItem:
    """Open platform manifest item schema exposed by Claw Router."""
    id: str
    key: str
    provider: str
    status: str
    type: str
    version: str
