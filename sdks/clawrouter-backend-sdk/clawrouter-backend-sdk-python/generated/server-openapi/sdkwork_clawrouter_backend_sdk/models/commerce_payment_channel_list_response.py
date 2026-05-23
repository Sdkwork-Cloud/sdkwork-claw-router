from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .commerce_payment_channel_item import CommercePaymentChannelItem


@dataclass
class CommercePaymentChannelListResponse:
    """Commerce payment channel list response schema exposed by Claw Router."""
    items: List[CommercePaymentChannelItem]
    page: int
    page_size: int
    total: int
