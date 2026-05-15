from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IntegrationWebhookEndpointRecord:
    """Integration webhook endpoint record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    endpoint_code: Optional[str] = None
    event_types: Optional[Dict[str, str]] = None
    failure_count: Optional[str] = None
    id: Optional[str] = None
    last_failure_at: Optional[str] = None
    last_success_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    name: Optional[str] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_type: Optional[str] = None
    retry_policy: Optional[Dict[str, str]] = None
    secret_hash: Optional[str] = None
    secret_ref: Optional[str] = None
    signing_alg: Optional[str] = None
    status: Optional[str] = None
    target_url: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
