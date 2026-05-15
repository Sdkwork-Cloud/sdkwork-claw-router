from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsCouponIssueBatchRecord:
    """Ops coupon issue batch record schema exposed by Claw Router."""
    audience_filter: Optional[Dict[str, str]] = None
    available_count: Optional[str] = None
    batch_no: Optional[str] = None
    campaign_code: Optional[str] = None
    claimed_count: Optional[str] = None
    code_pattern: Optional[str] = None
    code_prefix: Optional[str] = None
    coupon_id: Optional[str] = None
    coupon_template_id: Optional[str] = None
    created_at: Optional[str] = None
    created_by: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    expire_at: Optional[str] = None
    generated_at: Optional[str] = None
    generated_count: Optional[str] = None
    generation_status: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    requested_count: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    used_count: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    voided_count: Optional[str] = None
