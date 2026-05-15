from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRateLimitBucketRecord:
    """Ai rate limit bucket record schema exposed by Claw Router."""
    bucket_key: Optional[str] = None
    created_at: Optional[str] = None
    current_count: Optional[str] = None
    current_tokens: Optional[str] = None
    id: Optional[str] = None
    last_request_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    quota_policy_id: Optional[str] = None
    rebuild_version: Optional[str] = None
    remaining_count: Optional[str] = None
    remaining_tokens: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    status: Optional[str] = None
    subject_id: Optional[str] = None
    subject_type: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    window_end: Optional[str] = None
    window_start: Optional[str] = None
