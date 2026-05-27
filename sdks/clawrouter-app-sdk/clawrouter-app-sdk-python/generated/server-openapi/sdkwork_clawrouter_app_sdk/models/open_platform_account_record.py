from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpenPlatformAccountRecord:
    """Open platform account record schema exposed by Claw Router."""
    account_key: Optional[str] = None
    account_type: Optional[str] = None
    aes_key_ref: Optional[str] = None
    app_id: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_entry_id: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    provider: Optional[str] = None
    qr_default: Optional[bool] = None
    secret_ref: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    token_ref: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
