from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_product_attribute_mutation_response import CommerceProductAttributeMutationResponse


@dataclass
class CatalogAttributesCreateResult:
    """Catalog attributes create result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceProductAttributeMutationResponse] = None
    msg: Optional[str] = None
