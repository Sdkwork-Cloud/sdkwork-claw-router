from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class StorageReconciliationRunRecord:
    """Storage reconciliation run record schema exposed by Claw Router."""
    bucket_id: Optional[str] = None
    check_mode: Optional[str] = None
    checksum_mismatch_count: Optional[str] = None
    completed_at: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    dry_run: Optional[bool] = None
    id: Optional[str] = None
    idempotency_key: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    missing_object_count: Optional[str] = None
    organization_id: Optional[str] = None
    orphan_object_count: Optional[str] = None
    provider_id: Optional[str] = None
    request_id: Optional[str] = None
    requested_by: Optional[str] = None
    run_type: Optional[str] = None
    scanned_object_count: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
    summary_json: Optional[Dict[str, str]] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
