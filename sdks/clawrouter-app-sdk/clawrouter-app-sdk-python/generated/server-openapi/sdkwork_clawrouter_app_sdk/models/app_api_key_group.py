from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AppApiKeyGroup:
    """App api key group schema exposed by Claw Router."""
    code: str
    id: str
    name: str
    rate: Optional[str]
