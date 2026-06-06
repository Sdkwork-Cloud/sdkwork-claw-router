from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionCollectionResponse:
    """Promotion collection response schema exposed by Claw Router."""
    items: List[Dict[str, Any]]
    page: str
    page_size: str
    total: str
