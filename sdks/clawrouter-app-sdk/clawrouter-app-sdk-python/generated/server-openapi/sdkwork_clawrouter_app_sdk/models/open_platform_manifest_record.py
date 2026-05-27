from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformManifestRecord:
    """Open platform manifest record schema exposed by Claw Router."""
    account_type: Optional[str] = None
    callback_schema: Optional[Dict[str, str]] = None
    capability_schema: Optional[Dict[str, str]] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    entry_schema: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    manifest_key: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    provider: Optional[str] = None
    sort_order: Optional[int] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
