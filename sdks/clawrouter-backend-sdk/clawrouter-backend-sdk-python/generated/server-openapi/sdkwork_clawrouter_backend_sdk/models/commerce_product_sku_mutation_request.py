from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_sku_attribute_item import CommerceProductSkuAttributeItem


@dataclass
class CommerceProductSkuMutationRequest:
    """Commerce product sku mutation request schema exposed by Claw Router."""
    fulfillment_type: str
    product_id: str
    sku_no: str
    status: str
    title: str
    attributes: Optional[List[CommerceProductSkuAttributeItem]] = None
    default_currency_code: Optional[str] = None
    default_price_amount: Optional[str] = None
    sales_unit: Optional[str] = None
    tax_category: Optional[str] = None
