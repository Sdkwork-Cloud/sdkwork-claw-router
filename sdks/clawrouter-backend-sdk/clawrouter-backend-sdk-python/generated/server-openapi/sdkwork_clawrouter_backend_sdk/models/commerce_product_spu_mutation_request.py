from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceProductSpuMutationRequest:
    """Commerce product spu mutation request schema exposed by Claw Router."""
    product_type: str
    spu_no: str
    status: str
    title: str
    brand: Optional[str] = None
    category_ids: Optional[List[str]] = None
    description: Optional[str] = None
    subtitle: Optional[str] = None
