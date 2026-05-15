from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRoutingDecisionLogRecord:
    """Ai routing decision log record schema exposed by Claw Router."""
    api_key_id: Optional[str] = None
    candidate_snapshot: Optional[Dict[str, str]] = None
    capability: Optional[str] = None
    created_at: Optional[str] = None
    decision_latency_ms: Optional[int] = None
    decision_mode: Optional[str] = None
    decision_reason: Optional[Dict[str, str]] = None
    fallback_chain: Optional[Dict[str, str]] = None
    id: Optional[str] = None
    legacy_api_key_id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    policy_id: Optional[str] = None
    profile_id: Optional[str] = None
    request_id: Optional[str] = None
    requested_model: Optional[str] = None
    resolved_model: Optional[str] = None
    retention_until: Optional[str] = None
    rule_id: Optional[str] = None
    selected_account_id: Optional[str] = None
    selected_channel_id: Optional[str] = None
    selected_provider_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
