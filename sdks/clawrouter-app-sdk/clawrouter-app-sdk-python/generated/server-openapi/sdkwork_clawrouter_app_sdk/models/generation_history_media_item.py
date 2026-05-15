from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class GenerationHistoryMediaItem:
    """Generation history media item schema exposed by Claw Router."""
    url: str
    thumb: Optional[str] = None
