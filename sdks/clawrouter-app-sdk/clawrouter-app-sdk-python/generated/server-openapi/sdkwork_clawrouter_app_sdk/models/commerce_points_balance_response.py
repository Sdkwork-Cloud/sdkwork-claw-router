from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePointsBalanceResponse:
    """Commerce points balance response schema exposed by Claw Router."""
    available_points: int
    frozen_points: int
