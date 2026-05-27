from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .promotion_operation_response import PromotionOperationResponse


@dataclass
class PromotionsCodesRedemptionsCreateResult:
    """Promotions codes redemptions create result schema exposed by Claw Router."""
    code: str
    data: Optional[PromotionOperationResponse] = None
    msg: Optional[str] = None
