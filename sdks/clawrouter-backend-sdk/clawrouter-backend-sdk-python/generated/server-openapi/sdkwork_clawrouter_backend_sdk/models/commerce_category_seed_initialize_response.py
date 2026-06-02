from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_category_seed_initialize_summary import CommerceCategorySeedInitializeSummary


@dataclass
class CommerceCategorySeedInitializeResponse:
    """Commerce category seed initialize response schema exposed by Claw Router."""
    items: List[CommerceCategorySeedInitializeSummary]
