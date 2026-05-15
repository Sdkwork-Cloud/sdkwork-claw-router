from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PlusCategoryRecord:
    """Plus category record schema exposed by Claw Router."""
    code: Optional[str] = None
    description: Optional[str] = None
    group_name: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[str] = None
    path: Optional[str] = None
    shop_id: Optional[str] = None
