from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingProviderAccountRecord:
    """Messaging provider account record schema exposed by Claw Router."""
    account_code: str
    account_name: str
    channel: str
    organization_id: str
    provider_code: str
    status: str
    tenant_id: str
    uuid: str
    auth_type: Optional[str] = None
    base_url: Optional[str] = None
    created_at: Optional[str] = None
    credential_hash: Optional[str] = None
    credential_ref: Optional[str] = None
    credential_version: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    delivery_purpose: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_used_at: Optional[str] = None
    last_verified_at: Optional[str] = None
    masked_label: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    provider_id: Optional[str] = None
    updated_at: Optional[str] = None
    version: Optional[str] = None
