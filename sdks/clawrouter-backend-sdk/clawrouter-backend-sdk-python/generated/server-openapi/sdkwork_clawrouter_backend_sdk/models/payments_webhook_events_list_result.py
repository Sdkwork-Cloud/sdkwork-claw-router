from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_webhook_event_list_response import CommercePaymentWebhookEventListResponse


@dataclass
class PaymentsWebhookEventsListResult:
    """Payments webhook events list result schema exposed by Claw Router."""
    code: str
    data: Optional[CommercePaymentWebhookEventListResponse] = None
    msg: Optional[str] = None
