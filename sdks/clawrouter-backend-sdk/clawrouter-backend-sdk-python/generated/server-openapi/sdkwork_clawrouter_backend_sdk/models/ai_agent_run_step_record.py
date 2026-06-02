from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiAgentRunStepRecord:
    """Ai agent run step record schema exposed by Claw Router."""
    agent_id: Optional[str] = None
    agent_version_id: Optional[str] = None
    audio_seconds: Optional[str] = None
    cached_tokens: Optional[str] = None
    completed_at: Optional[str] = None
    completion_tokens: Optional[str] = None
    created_at: Optional[str] = None
    error_message_masked: Optional[str] = None
    id: Optional[str] = None
    image_count: Optional[str] = None
    input_snapshot: Optional[Dict[str, str]] = None
    latency_ms: Optional[int] = None
    legal_hold: Optional[bool] = None
    mcp_server_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    model: Optional[str] = None
    organization_id: Optional[str] = None
    output_snapshot: Optional[Dict[str, str]] = None
    payload_hash: Optional[str] = None
    prompt_tokens: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    run_id: Optional[str] = None
    runtime_invocation_id: Optional[str] = None
    skill_id: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
    step_index: Optional[int] = None
    step_status: Optional[str] = None
    step_type: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    tool_binding_id: Optional[str] = None
    tool_name: Optional[str] = None
    total_tokens: Optional[str] = None
    trace_id: Optional[str] = None
    usage_fact_id: Optional[str] = None
    usage_json: Optional[Dict[str, str]] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    video_seconds: Optional[str] = None
