from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRequestTraceRecord:
    """Ai request trace record schema exposed by Claw Router."""
    api_key_id: Optional[str] = None
    api_key_name_snapshot: Optional[str] = None
    attempt_no: Optional[int] = None
    cached_tokens: Optional[str] = None
    channel_group_id: Optional[str] = None
    channel_group_snapshot: Optional[str] = None
    channel_id: Optional[str] = None
    channel_name_snapshot: Optional[str] = None
    client_ip_hash: Optional[str] = None
    client_ip_masked: Optional[str] = None
    client_ip_region: Optional[str] = None
    completion_tokens: Optional[str] = None
    created_at: Optional[str] = None
    decision_log_id: Optional[str] = None
    ended_at: Optional[str] = None
    endpoint: Optional[str] = None
    error_message_masked: Optional[str] = None
    error_type: Optional[str] = None
    http_method: Optional[str] = None
    http_status: Optional[int] = None
    id: Optional[str] = None
    latency_ms: Optional[int] = None
    legacy_api_key_id: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    owner_id: Optional[str] = None
    owner_name_snapshot: Optional[str] = None
    owner_type: Optional[str] = None
    payload_hash: Optional[str] = None
    prompt_tokens: Optional[str] = None
    provider_error_code: Optional[str] = None
    provider_id: Optional[str] = None
    provider_model: Optional[str] = None
    provider_native_model: Optional[str] = None
    reasoning_effort: Optional[str] = None
    request_bytes: Optional[str] = None
    request_id: Optional[str] = None
    request_path: Optional[str] = None
    request_payload_hash: Optional[str] = None
    requested_model: Optional[str] = None
    requested_model_catalog_key: Optional[str] = None
    response_bytes: Optional[str] = None
    response_payload_hash: Optional[str] = None
    retention_until: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
    streaming: Optional[bool] = None
    tenant_id: Optional[str] = None
    total_tokens: Optional[str] = None
    trace_id: Optional[str] = None
    ttft_ms: Optional[int] = None
    user_agent_hash: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
