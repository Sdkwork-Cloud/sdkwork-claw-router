from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .account_consumption_item import AccountConsumptionItem
    from .account_invoice_settings import AccountInvoiceSettings
    from .account_login_log import AccountLoginLog
    from .account_security_summary import AccountSecuritySummary


@dataclass
class AccountSummaryResponse:
    """Account summary response schema exposed by Claw Router."""
    available_credits: float
    consumption_by_service: List[AccountConsumptionItem]
    email: str
    est_days_remaining: int
    id: str
    invoice_settings: AccountInvoiceSettings
    is_verified: bool
    login_logs: List[AccountLoginLog]
    monthly_consumption: float
    name: str
    organization: str
    security: AccountSecuritySummary
    tier: str
