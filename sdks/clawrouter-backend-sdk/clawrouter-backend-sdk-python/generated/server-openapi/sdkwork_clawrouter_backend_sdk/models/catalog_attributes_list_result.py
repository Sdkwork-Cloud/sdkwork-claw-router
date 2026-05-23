from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_attribute_list_response import CommerceProductAttributeListResponse


@dataclass
class CatalogAttributesListResult:
    """Catalog attributes list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceProductAttributeListResponse] = None
    msg: Optional[str] = None
