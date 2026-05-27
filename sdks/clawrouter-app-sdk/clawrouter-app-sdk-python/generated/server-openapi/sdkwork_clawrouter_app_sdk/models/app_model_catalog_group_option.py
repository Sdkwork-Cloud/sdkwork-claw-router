from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AppModelCatalogGroupOption:
    """App model catalog group option schema exposed by Claw Router."""
    key: str
    label: str
    model_count: int
