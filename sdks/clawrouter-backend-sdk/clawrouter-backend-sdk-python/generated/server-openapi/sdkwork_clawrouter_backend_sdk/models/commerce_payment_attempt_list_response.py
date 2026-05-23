from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_attempt_item import CommercePaymentAttemptItem


@dataclass
class CommercePaymentAttemptListResponse:
    """Commerce payment attempt list response schema exposed by Claw Router."""
    items: List[CommercePaymentAttemptItem]
    page: int
    page_size: int
    total: int
