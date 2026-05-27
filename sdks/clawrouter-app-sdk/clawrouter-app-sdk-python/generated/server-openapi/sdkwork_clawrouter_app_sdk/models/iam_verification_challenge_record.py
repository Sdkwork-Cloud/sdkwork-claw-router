from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamVerificationChallengeRecord:
    """Iam verification challenge record schema exposed by Claw Router."""
    consumed_at: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    delivery_request_id: Optional[str] = None
    id: Optional[str] = None
    locked_until: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    salt_ref: Optional[str] = None
    status: Optional[str] = None
    target_masked: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    verified_at: Optional[str] = None
    version: Optional[str] = None
