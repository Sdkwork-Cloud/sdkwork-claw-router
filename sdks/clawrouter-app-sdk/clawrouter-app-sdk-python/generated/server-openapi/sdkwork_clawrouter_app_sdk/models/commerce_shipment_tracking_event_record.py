from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceShipmentTrackingEventRecord:
    """Commerce shipment tracking event record schema exposed by Claw Router."""
    created_at: str
    event_code: str
    event_time: str
    shipment_id: str
    tenant_id: str
    description: Optional[str] = None
    id: Optional[str] = None
    location: Optional[str] = None
    organization_id: Optional[str] = None
    raw_payload_json: Optional[Dict[str, str]] = None
