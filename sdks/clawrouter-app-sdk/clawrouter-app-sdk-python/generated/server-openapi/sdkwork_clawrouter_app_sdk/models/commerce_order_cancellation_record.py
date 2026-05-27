from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceOrderCancellationRecord:
    """Commerce order cancellation record schema exposed by Claw Router."""
    cancellation_no: str
    created_at: str
    idempotency_key: str
    order_id: str
    reason_code: str
    requested_by: str
    status: str
    tenant_id: str
    approved_by: Optional[str] = None
    completed_at: Optional[str] = None
    organization_id: Optional[str] = None
    reason_message: Optional[str] = None
