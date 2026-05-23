from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_sku_attribute_item import CommerceProductSkuAttributeItem


@dataclass
class CommerceProductSkuItem:
    """Commerce product sku item schema exposed by Claw Router."""
    created_at: str
    fulfillment_type: str
    id: str
    product_id: str
    sku_no: str
    status: str
    title: str
    updated_at: str
    attributes: Optional[List[CommerceProductSkuAttributeItem]] = None
    default_currency_code: Optional[str] = None
    default_price_amount: Optional[str] = None
    published_at: Optional[str] = None
    sales_unit: Optional[str] = None
    tax_category: Optional[str] = None
