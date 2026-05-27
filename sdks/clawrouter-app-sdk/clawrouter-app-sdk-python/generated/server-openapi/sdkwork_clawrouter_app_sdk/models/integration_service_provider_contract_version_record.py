from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationServiceProviderContractVersionRecord:
    """Integration service provider contract version record schema exposed by Claw Router."""
    approval_status: Optional[str] = None
    approved_at: Optional[str] = None
    approved_by: Optional[str] = None
    contract_id: Optional[str] = None
    contract_payload: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    published_at: Optional[str] = None
    requested_by: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    version_hash: Optional[str] = None
    version_no: Optional[int] = None
