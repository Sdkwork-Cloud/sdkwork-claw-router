from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class SettlementChartPoint:
    """Settlement chart point schema exposed by Claw Router."""
    audio: str
    day: str
    image: str
    music: str
    text: str
    video: str
