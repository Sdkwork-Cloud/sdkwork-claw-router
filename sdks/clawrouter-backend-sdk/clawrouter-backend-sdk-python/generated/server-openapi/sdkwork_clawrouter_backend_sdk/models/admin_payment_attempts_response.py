from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_payment_attempt_item import AdminPaymentAttemptItem


@dataclass
class AdminPaymentAttemptsResponse:
    """Admin payment attempts response schema exposed by Claw Router."""
    items: List[AdminPaymentAttemptItem]
