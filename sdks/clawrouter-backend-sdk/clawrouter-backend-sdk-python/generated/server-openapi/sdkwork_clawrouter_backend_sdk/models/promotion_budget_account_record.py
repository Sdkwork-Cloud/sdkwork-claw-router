from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionBudgetAccountRecord:
    """Promotion budget account record schema exposed by Claw Router."""
    available_amount_minor: str
    available_quantity: str
    budget_no: str
    budget_type: str
    consumed_amount_minor: str
    consumed_quantity: str
    created_at: str
    currency_code: str
    lock_mode: str
    offer_id: str
    overrun_amount_minor: str
    planned_amount_minor: str
    reserved_amount_minor: str
    reserved_quantity: str
    status: str
    tenant_id: str
    total_amount_minor: str
    total_quantity: str
    updated_at: str
    created_by: Optional[str] = None
    id: Optional[str] = None
    offer_version_id: Optional[str] = None
    organization_id: Optional[str] = None
    stock_id: Optional[str] = None
    updated_by: Optional[str] = None
