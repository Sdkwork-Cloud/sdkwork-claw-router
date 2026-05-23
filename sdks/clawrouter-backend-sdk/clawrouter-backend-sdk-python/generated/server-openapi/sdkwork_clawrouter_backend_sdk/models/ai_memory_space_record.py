from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiMemorySpaceRecord:
    """Ai memory space record schema exposed by Claw Router."""
    auto_extract_enabled: Optional[bool] = None
    auto_recall_enabled: Optional[bool] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    entry_count: Optional[str] = None
    id: Optional[str] = None
    max_injected_tokens: Optional[str] = None
    memory_enabled: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    retention_policy: Optional[Dict[str, str]] = None
    review_required: Optional[bool] = None
    sensitivity_policy: Optional[Dict[str, str]] = None
    space_type: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
