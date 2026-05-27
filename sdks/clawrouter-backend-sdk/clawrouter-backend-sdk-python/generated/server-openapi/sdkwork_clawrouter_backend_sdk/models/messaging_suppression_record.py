from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingSuppressionRecord:
    """Messaging suppression record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    ends_at: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    note: Optional[str] = None
    organization_id: Optional[str] = None
    status: Optional[str] = None
    target_masked: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
