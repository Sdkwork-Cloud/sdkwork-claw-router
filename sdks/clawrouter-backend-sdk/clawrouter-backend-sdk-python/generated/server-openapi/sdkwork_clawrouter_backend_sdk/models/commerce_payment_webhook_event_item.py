from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentWebhookEventItem:
    """Commerce payment webhook event item schema exposed by Claw Router."""
    event_no: str
    event_type: str
    id: str
    process_status: str
    provider_code: str
    received_at: str
    external_event_id: Optional[str] = None
    processed_at: Optional[str] = None
