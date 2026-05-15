from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamSessionRecord:
    """Iam session record schema exposed by Claw Router."""
    access_token_hash: Optional[str] = None
    app_id: Optional[str] = None
    auth_level: Optional[str] = None
    auth_token_hash: Optional[str] = None
    created_at: Optional[str] = None
    data_scope_json: Optional[Dict[str, str]] = None
    deployment_mode: Optional[str] = None
    environment: Optional[str] = None
    expires_at: Optional[str] = None
    id: Optional[str] = None
    organization_id: Optional[str] = None
    permission_scope_json: Optional[Dict[str, str]] = None
    refresh_token_hash: Optional[str] = None
    revoked_at: Optional[str] = None
    sharding_key: Optional[str] = None
    sharding_strategy: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
