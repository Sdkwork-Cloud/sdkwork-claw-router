from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceUsageServiceProviderStatementRecord:
    """Commerce usage service provider statement record schema exposed by Claw Router."""
    buyer_provider_id: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    due_at: Optional[str] = None
    generated_at: Optional[str] = None
    id: Optional[str] = None
    invoice_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    paid_at: Optional[str] = None
    payable_amount: Optional[str] = None
    payment_status: Optional[str] = None
    period: Optional[str] = None
    period_end: Optional[str] = None
    period_start: Optional[str] = None
    rebuild_version: Optional[str] = None
    receivable_amount: Optional[str] = None
    seller_provider_id: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    statement_no: Optional[str] = None
    statement_status: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    total_requests: Optional[str] = None
    total_tokens: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
