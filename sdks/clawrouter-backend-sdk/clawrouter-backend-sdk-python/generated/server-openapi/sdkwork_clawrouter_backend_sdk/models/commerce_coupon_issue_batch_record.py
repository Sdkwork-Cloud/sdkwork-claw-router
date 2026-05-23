from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceCouponIssueBatchRecord:
    """Commerce coupon issue batch record schema exposed by Claw Router."""
    batch_no: str
    code_pattern: str
    code_prefix: str
    coupon_template_id: str
    created_at: str
    generation_status: str
    requested_quantity: str
    status: str
    tenant_id: str
    title: str
    updated_at: str
    audience_filter: Optional[str] = None
    campaign_code: Optional[str] = None
    created_by: Optional[str] = None
    generated_at: Optional[str] = None
    organization_id: Optional[str] = None
