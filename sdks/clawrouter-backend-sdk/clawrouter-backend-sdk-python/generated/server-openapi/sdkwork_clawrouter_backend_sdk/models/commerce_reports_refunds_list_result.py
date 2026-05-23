from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_standard_collection_response import CommerceStandardCollectionResponse


@dataclass
class CommerceReportsRefundsListResult:
    """Commerce reports refunds list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommerceStandardCollectionResponse] = None
    msg: Optional[str] = None
