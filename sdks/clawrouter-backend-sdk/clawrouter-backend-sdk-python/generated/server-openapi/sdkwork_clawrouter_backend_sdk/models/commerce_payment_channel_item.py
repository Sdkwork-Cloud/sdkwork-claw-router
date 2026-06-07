from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentChannelItem:
    """Commerce payment channel item schema exposed by Claw Router."""
    channel_no: str
    country_code: str
    created_at: str
    currency_code: str
    id: str
    method_code: str
    priority: str
    provider_account_id: str
    provider_code: str
    scene_code: str
    status: str
    updated_at: str
