from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentProviderItem:
    """Commerce payment provider item schema exposed by Claw Router."""
    capabilities: List[str]
    created_at: str
    display_name: str
    id: str
    provider_code: str
    provider_type: str
    status: str
    supported_countries: List[str]
    supported_currencies: List[str]
    updated_at: str
    settlement_type: Optional[str] = None
