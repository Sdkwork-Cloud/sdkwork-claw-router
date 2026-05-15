from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiGenerationJobRecord:
    """Ai generation job record schema exposed by Claw Router."""
    channel_id: Optional[str] = None
    completed_at: Optional[str] = None
    created_at: Optional[str] = None
    failure_code: Optional[str] = None
    failure_message_masked: Optional[str] = None
    id: Optional[str] = None
    input_asset_ids: Optional[Dict[str, str]] = None
    job_type: Optional[str] = None
    legal_hold: Optional[bool] = None
    metadata: Optional[Dict[str, str]] = None
    modality: Optional[str] = None
    model: Optional[str] = None
    negative_prompt: Optional[str] = None
    organization_id: Optional[str] = None
    parameter_snapshot: Optional[Dict[str, str]] = None
    payload_hash: Optional[str] = None
    progress_percent: Optional[int] = None
    prompt: Optional[str] = None
    provider_id: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    session_id: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    trace_id: Optional[str] = None
    usage_fact_id: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
