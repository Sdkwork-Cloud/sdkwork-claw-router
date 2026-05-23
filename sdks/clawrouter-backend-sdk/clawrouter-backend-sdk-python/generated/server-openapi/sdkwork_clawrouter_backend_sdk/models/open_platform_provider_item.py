from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformProviderItem:
    """Open platform provider item schema exposed by Claw Router."""
    id: str
    name: str
    provider: str
    status: str
