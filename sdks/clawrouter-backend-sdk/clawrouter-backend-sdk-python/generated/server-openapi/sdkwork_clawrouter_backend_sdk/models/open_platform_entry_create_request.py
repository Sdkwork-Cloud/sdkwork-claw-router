from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformEntryCreateRequest:
    """Open platform entry create request schema exposed by Claw Router."""
    key: str
    type: str
    url: str
