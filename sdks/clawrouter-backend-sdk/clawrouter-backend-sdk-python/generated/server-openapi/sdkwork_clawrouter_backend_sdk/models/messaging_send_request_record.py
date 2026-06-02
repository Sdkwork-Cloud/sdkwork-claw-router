from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingSendRequestRecord:
    """Messaging send request record schema exposed by Claw Router."""
    accepted_at: Optional[str] = None
    app_id: Optional[str] = None
    channel: Optional[str] = None
    created_at: Optional[str] = None
    delivered_at: Optional[str] = None
    delivery_purpose: Optional[str] = None
    delivery_status: Optional[str] = None
    dry_run: Optional[bool] = None
    expires_at: Optional[str] = None
    failed_at: Optional[str] = None
    id: Optional[str] = None
    idempotency_key: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    render_hash: Optional[str] = None
    request_id: Optional[str] = None
    request_no: Optional[str] = None
    request_payload_redacted: Optional[Dict[str, str]] = None
    resolved_provider_account_id: Optional[str] = None
    resolved_route_rule_id: Optional[str] = None
    resolved_sender_identity_id: Optional[str] = None
    retention_until: Optional[str] = None
    scene_code: Optional[str] = None
    scheduled_at: Optional[str] = None
    sent_at: Optional[str] = None
    status: Optional[str] = None
    target_hash: Optional[str] = None
    target_masked: Optional[str] = None
    target_type: Optional[str] = None
    template_variant_id: Optional[str] = None
    template_version_id: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
