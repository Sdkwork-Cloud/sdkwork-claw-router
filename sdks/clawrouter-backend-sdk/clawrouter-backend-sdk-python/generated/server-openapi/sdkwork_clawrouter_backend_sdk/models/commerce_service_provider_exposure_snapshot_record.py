from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommerceServiceProviderExposureSnapshotRecord:
    """Commerce service provider exposure snapshot record schema exposed by Claw Router."""
    balance_amount: Optional[str] = None
    calculated_at: Optional[str] = None
    created_at: Optional[str] = None
    credit_limit_amount: Optional[str] = None
    currency: Optional[str] = None
    exposure_amount: Optional[str] = None
    frozen_amount: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    overdue_amount: Optional[str] = None
    pending_settlement_amount: Optional[str] = None
    rebuild_version: Optional[str] = None
    risk_status: Optional[str] = None
    service_provider_id: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    used_credit_amount: Optional[str] = None
    uuid: Optional[str] = None
