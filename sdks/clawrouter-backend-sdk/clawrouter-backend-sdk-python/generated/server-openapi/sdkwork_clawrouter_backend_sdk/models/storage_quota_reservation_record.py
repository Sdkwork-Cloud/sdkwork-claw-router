from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StorageQuotaReservationRecord:
    """Storage quota reservation record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    expires_at: Optional[str] = None
    id: Optional[str] = None
    idempotency_key: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    released_at: Optional[str] = None
    reservation_no: Optional[str] = None
    scope_id: Optional[str] = None
    scope_type: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    upload_session_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
