from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_media_item import CommerceProductMediaItem


@dataclass
class CommerceProductSpuItem:
    """Commerce product spu item schema exposed by Claw Router."""
    created_at: str
    id: str
    product_type: str
    spu_no: str
    status: str
    title: str
    updated_at: str
    brand: Optional[str] = None
    category_ids: Optional[List[str]] = None
    currency_code: Optional[str] = None
    default_sku_id: Optional[str] = None
    description: Optional[str] = None
    media: Optional[List[CommerceProductMediaItem]] = None
    min_price_amount: Optional[str] = None
    published_at: Optional[str] = None
    subtitle: Optional[str] = None
