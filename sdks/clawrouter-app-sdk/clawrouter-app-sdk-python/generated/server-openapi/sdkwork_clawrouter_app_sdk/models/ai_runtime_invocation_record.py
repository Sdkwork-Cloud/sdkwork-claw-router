from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiRuntimeInvocationRecord:
    """Ai runtime invocation record schema exposed by Claw Router."""
    agent_run_id: Optional[str] = None
    agent_run_step_id: Optional[str] = None
    agent_session_id: Optional[str] = None
    approval_policy: Optional[str] = None
    attempt_no: Optional[int] = None
    chat_item_id: Optional[str] = None
    chat_turn_id: Optional[str] = None
    completed_at: Optional[str] = None
    conversation_id: Optional[str] = None
    created_at: Optional[str] = None
    cwd: Optional[str] = None
    endpoint: Optional[str] = None
    error_code: Optional[str] = None
    error_message_masked: Optional[str] = None
    error_type: Optional[str] = None
    exit_code: Optional[str] = None
    finish_reason: Optional[str] = None
    id: Optional[str] = None
    invocation_no: Optional[str] = None
    invocation_type: Optional[str] = None
    latency_ms: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    organization_id: Optional[str] = None
    payload_hash: Optional[str] = None
    permission_mode: Optional[str] = None
    provider: Optional[str] = None
    provider_conversation_id: Optional[str] = None
    provider_response_id: Optional[str] = None
    provider_session_id: Optional[str] = None
    provider_step_id: Optional[str] = None
    request_id: Optional[str] = None
    request_json: Optional[Dict[str, str]] = None
    response_json: Optional[Dict[str, str]] = None
    retention_until: Optional[str] = None
    runtime: Optional[str] = None
    sandbox_policy: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    tool_call_id: Optional[str] = None
    tool_name: Optional[str] = None
    trace_id: Optional[str] = None
    ttft_ms: Optional[str] = None
    usage_json: Optional[Dict[str, str]] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
