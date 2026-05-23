from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_webhook_event_item import CommercePaymentWebhookEventItem


@dataclass
class CommercePaymentWebhookEventListResponse:
    """Commerce payment webhook event list response schema exposed by Claw Router."""
    items: List[CommercePaymentWebhookEventItem]
    page: int
    page_size: int
    total: int
