from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_coupon_catalog_item import CommerceCouponCatalogItem


@dataclass
class CouponsCatalogListResult:
    """Coupons catalog list result schema exposed by Claw Router."""
    code: str
    data: Optional[List[CommerceCouponCatalogItem]] = None
    msg: Optional[str] = None
