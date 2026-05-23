from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationProviderAccountRecord:
    """Integration provider account record schema exposed by Claw Router."""
    account_code: Optional[str] = None
    account_name: Optional[str] = None
    auth_config: Optional[Dict[str, str]] = None
    auth_type: Optional[str] = None
    base_url: Optional[str] = None
    consecutive_error_count: Optional[str] = None
    created_at: Optional[str] = None
    credential_profile: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    external_account_id: Optional[str] = None
    id: Optional[str] = None
    last_balance_checked_at: Optional[str] = None
    last_rotated_at: Optional[str] = None
    last_used_at: Optional[str] = None
    last_verified_at: Optional[str] = None
    masked_label: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    next_rotate_at: Optional[str] = None
    organization_id: Optional[str] = None
    provider_code: Optional[str] = None
    provider_id: Optional[str] = None
    quota_limit: Optional[str] = None
    quota_unit: Optional[str] = None
    quota_used: Optional[str] = None
    risk_level: Optional[str] = None
    secret_hash: Optional[str] = None
    secret_ref: Optional[str] = None
    secret_rotation_policy: Optional[Dict[str, str]] = None
    secret_version: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    upstream_balance_amount: Optional[str] = None
    upstream_balance_currency: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
