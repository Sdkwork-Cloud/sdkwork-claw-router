from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationProviderInvoiceImportRecord:
    """Integration provider invoice import record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    currency: Optional[str] = None
    id: Optional[str] = None
    import_no: Optional[str] = None
    import_status: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    period_end: Optional[str] = None
    period_start: Optional[str] = None
    provider_account_id: Optional[str] = None
    provider_code: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    source_file_ref: Optional[str] = None
    source_hash: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    total_amount: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
