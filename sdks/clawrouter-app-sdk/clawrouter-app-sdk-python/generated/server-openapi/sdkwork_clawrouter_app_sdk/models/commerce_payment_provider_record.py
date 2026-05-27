from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentProviderRecord:
    """Commerce payment provider record schema exposed by Claw Router."""
    created_at: str
    display_name: str
    provider_code: str
    provider_type: str
    status: str
    tenant_id: str
    updated_at: str
    organization_id: Optional[str] = None
    supported_countries: Optional[Dict[str, str]] = None
    supported_currencies: Optional[Dict[str, str]] = None
    supported_methods: Optional[Dict[str, str]] = None
