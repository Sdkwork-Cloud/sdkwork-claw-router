from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceOrderAddressSnapshotRecord:
    """Commerce order address snapshot record schema exposed by Claw Router."""
    address_line1_encrypted: str
    captured_at: str
    city: str
    country_code: str
    order_id: str
    phone_masked: str
    recipient_name_snapshot: str
    tenant_id: str
    district: Optional[str] = None
    organization_id: Optional[str] = None
    postal_code: Optional[str] = None
    region_code: Optional[str] = None
    source_address_id: Optional[str] = None
