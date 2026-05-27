from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_standard_resource_response import CommerceStandardResourceResponse


@dataclass
class CartCurrentRetrieveResult:
    """Cart current retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceStandardResourceResponse] = None
    msg: Optional[str] = None
