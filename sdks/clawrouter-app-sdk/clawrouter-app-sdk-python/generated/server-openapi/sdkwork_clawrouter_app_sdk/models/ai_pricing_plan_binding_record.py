from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiPricingPlanBindingRecord:
    """Ai pricing plan binding record schema exposed by Claw Router."""
    effective_from: str
    organization_id: str
    pricing_plan_id: str
    priority: int
    status: str
    subject_type: str
    tenant_id: str
    uuid: str
    binding_source: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    multiplier_override: Optional[str] = None
    pricing_plan_code: Optional[str] = None
    quota_policy_id: Optional[str] = None
    rpm_override: Optional[str] = None
    subject_code: Optional[str] = None
    subject_id: Optional[str] = None
    tpm_override: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
