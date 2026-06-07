from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .promotion_collection_response import PromotionCollectionResponse


@dataclass
class PromotionsUserCouponsManagementListResult:
    """Promotions user coupons management list result schema exposed by Claw Router."""
    code: str
    data: Optional[PromotionCollectionResponse] = None
    msg: Optional[str] = None
