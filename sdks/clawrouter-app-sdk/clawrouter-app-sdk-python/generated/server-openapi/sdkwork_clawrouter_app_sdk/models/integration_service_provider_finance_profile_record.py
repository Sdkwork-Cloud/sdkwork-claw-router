from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationServiceProviderFinanceProfileRecord:
    """Integration service provider finance profile record schema exposed by Claw Router."""
    billing_cycle: Optional[str] = None
    created_at: Optional[str] = None
    credit_limit_amount: Optional[str] = None
    currency: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    invoice_title_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payment_terms_days: Optional[int] = None
    service_provider_id: Optional[str] = None
    settlement_day: Optional[int] = None
    settlement_mode: Optional[str] = None
    status: Optional[str] = None
    suspend_threshold_amount: Optional[str] = None
    tax_profile_ref: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    warning_threshold_amount: Optional[str] = None
