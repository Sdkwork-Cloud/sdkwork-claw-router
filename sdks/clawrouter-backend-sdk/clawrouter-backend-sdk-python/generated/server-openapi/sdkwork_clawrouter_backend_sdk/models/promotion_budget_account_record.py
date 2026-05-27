from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionBudgetAccountRecord:
    """Promotion budget account record schema exposed by Claw Router."""
    budget_no: str
    budget_type: str
    created_at: str
    currency_code: str
    lock_mode: str
    offer_id: str
    overrun_amount_minor: str
    planned_amount_minor: str
    status: str
    tenant_id: str
    updated_at: str
    created_by: Optional[str] = None
    offer_version_id: Optional[str] = None
    organization_id: Optional[str] = None
    stock_id: Optional[str] = None
    updated_by: Optional[str] = None
