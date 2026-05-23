from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceExchangeRuleRecord:
    """Commerce exchange rule record schema exposed by Claw Router."""
    created_at: str
    idempotency_key: str
    rate: str
    request_no: str
    rule_no: str
    source_asset_type: str
    status: str
    target_asset_type: str
    tenant_id: str
    updated_at: str
    organization_id: Optional[str] = None
    remark: Optional[str] = None
