from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceBillingHistoryRecord:
    """Commerce billing history record schema exposed by Claw Router."""
    amount: str
    asset_type: str
    created_at: str
    direction: str
    history_no: str
    history_type: str
    occurred_at: str
    owner_user_id: str
    points_delta: str
    source_id: str
    source_type: str
    status: str
    tenant_id: str
    title: str
    updated_at: str
    currency_code: Optional[str] = None
    id: Optional[str] = None
    metadata_json: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payment_method: Optional[str] = None
    reference_no: Optional[str] = None
    related_order_id: Optional[str] = None
    related_order_no: Optional[str] = None
