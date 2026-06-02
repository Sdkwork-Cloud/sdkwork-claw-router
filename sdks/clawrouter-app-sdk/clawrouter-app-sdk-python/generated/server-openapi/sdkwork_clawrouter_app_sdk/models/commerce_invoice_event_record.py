from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceInvoiceEventRecord:
    """Commerce invoice event record schema exposed by Claw Router."""
    actor_type: str
    created_at: str
    event_no: str
    event_type: str
    idempotency_key: str
    invoice_id: str
    tenant_id: str
    to_status: str
    actor_id: Optional[str] = None
    from_status: Optional[str] = None
    id: Optional[str] = None
    message: Optional[str] = None
    organization_id: Optional[str] = None
    payload_json: Optional[Dict[str, str]] = None
    reason_code: Optional[str] = None
    request_id: Optional[str] = None
