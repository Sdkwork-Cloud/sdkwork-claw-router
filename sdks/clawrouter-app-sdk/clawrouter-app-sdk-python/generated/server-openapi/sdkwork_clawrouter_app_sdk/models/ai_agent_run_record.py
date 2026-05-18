from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiAgentRunRecord:
    """Ai agent run record schema exposed by Claw Router."""
    agent_id: Optional[str] = None
    agent_version_id: Optional[str] = None
    audio_seconds: Optional[str] = None
    cached_tokens: Optional[str] = None
    cancelled_at: Optional[str] = None
    completed_at: Optional[str] = None
    completion_tokens: Optional[str] = None
    created_at: Optional[str] = None
    error_message_masked: Optional[str] = None
    execution_mode: Optional[str] = None
    failed_at: Optional[str] = None
    id: Optional[str] = None
    image_count: Optional[str] = None
    input_message: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    metering_status: Optional[str] = None
    organization_id: Optional[str] = None
    output_message: Optional[str] = None
    payload_hash: Optional[str] = None
    planner_model: Optional[str] = None
    prompt_tokens: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    run_status: Optional[str] = None
    run_uuid: Optional[str] = None
    source_surface: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
    target_modality: Optional[str] = None
    tenant_id: Optional[str] = None
    total_steps: Optional[int] = None
    total_tokens: Optional[str] = None
    trace_id: Optional[str] = None
    usage_fact_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
    video_seconds: Optional[str] = None
