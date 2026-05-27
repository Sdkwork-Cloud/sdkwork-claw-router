from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationServiceProviderAccountBindingRecord:
    """Integration service provider account binding record schema exposed by Claw Router."""
    account_role: Optional[str] = None
    asset_type: Optional[str] = None
    commerce_account_id: Optional[str] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    service_provider_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
