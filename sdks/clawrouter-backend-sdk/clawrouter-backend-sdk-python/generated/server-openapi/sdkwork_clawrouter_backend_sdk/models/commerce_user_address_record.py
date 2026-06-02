from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUserAddressRecord:
    """Commerce user address record schema exposed by Claw Router."""
    address_line1_encrypted: str
    city: str
    country_code: str
    created_at: str
    is_default: bool
    owner_user_id: str
    phone_country_code: str
    phone_number_encrypted: str
    recipient_name: str
    status: str
    tenant_id: str
    updated_at: str
    address_line2_encrypted: Optional[str] = None
    district: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    phone_masked: Optional[str] = None
    postal_code: Optional[str] = None
    region_code: Optional[str] = None
