from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationServiceProviderSubjectBindingRecord:
    """Integration service provider subject binding record schema exposed by Claw Router."""
    binding_priority: Optional[int] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    service_provider_id: Optional[str] = None
    status: Optional[str] = None
    subject_code: Optional[str] = None
    subject_id: Optional[str] = None
    subject_type: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
