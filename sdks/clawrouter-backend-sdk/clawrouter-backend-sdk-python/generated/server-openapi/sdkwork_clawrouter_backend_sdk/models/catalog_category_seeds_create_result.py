from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_category_seed_initialize_response import CommerceCategorySeedInitializeResponse


@dataclass
class CatalogCategorySeedsCreateResult:
    """Catalog category seeds create result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceCategorySeedInitializeResponse] = None
    msg: Optional[str] = None
