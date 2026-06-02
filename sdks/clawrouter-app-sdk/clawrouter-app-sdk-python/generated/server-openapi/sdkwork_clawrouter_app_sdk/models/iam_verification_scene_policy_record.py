from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamVerificationScenePolicyRecord:
    """Iam verification scene policy record schema exposed by Claw Router."""
    allowed_channels: Optional[Dict[str, str]] = None
    code_charset: Optional[str] = None
    code_length: Optional[int] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    default_channel: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    id: Optional[str] = None
    max_send_per_hour: Optional[int] = None
    max_verify_attempts: Optional[int] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    resend_interval_seconds: Optional[int] = None
    risk_policy: Optional[Dict[str, str]] = None
    rollout_policy: Optional[Dict[str, str]] = None
    scene_code: Optional[str] = None
    scene_name: Optional[str] = None
    status: Optional[str] = None
    target_binding_required: Optional[bool] = None
    template_code: Optional[str] = None
    tenant_id: Optional[str] = None
    ttl_seconds: Optional[int] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
