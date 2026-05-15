from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamGatewayApiKeyRecord:
    """Iam gateway api key record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    environment: Optional[str] = None
    expire_at: Optional[str] = None
    group_id: Optional[str] = None
    hash_alg: Optional[str] = None
    id: Optional[str] = None
    idempotency_key: Optional[str] = None
    key_display_masked: Optional[str] = None
    key_hash: Optional[str] = None
    key_prefix: Optional[str] = None
    last_revealed_at: Optional[str] = None
    last_used_at: Optional[str] = None
    last_used_ip_hash: Optional[str] = None
    last_used_ip_masked: Optional[str] = None
    last_used_ip_region: Optional[str] = None
    legacy_api_key_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    policy_id: Optional[str] = None
    quota_policy_id: Optional[str] = None
    rate_limit_policy_id: Optional[str] = None
    revoked_at: Optional[str] = None
    revoked_by: Optional[str] = None
    rotated_from_key_id: Optional[str] = None
    secret_version: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
