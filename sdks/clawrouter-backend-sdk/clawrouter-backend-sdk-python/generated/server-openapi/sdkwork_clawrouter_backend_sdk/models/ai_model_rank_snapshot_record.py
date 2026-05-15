from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiModelRankSnapshotRecord:
    """Ai model rank snapshot record schema exposed by Claw Router."""
    catalog_key: str
    model: str
    organization_id: str
    rank_no: int
    rank_scope: str
    region_code: str
    snapshot_date: str
    snapshot_period: str
    status: str
    tenant_id: str
    uuid: str
    vendor_code: str
    base_volume: Optional[str] = None
    color_token: Optional[str] = None
    context_size_text: Optional[str] = None
    cost_amount: Optional[str] = None
    cost_indicator: Optional[int] = None
    created_at: Optional[str] = None
    currency: Optional[str] = None
    id: Optional[str] = None
    is_new: Optional[bool] = None
    latency_p50_ms: Optional[int] = None
    latency_p95_ms: Optional[int] = None
    license_type: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    modality: Optional[str] = None
    model_id: Optional[str] = None
    previous_rank_no: Optional[int] = None
    pricing_text: Optional[str] = None
    provider_code: Optional[str] = None
    rank_payload: Optional[Dict[str, str]] = None
    rebuild_version: Optional[str] = None
    request_count: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    strengths: Optional[Dict[str, str]] = None
    success_rate: Optional[str] = None
    token_count: Optional[str] = None
    trend_score: Optional[str] = None
    updated_at: Optional[str] = None
    vendor_name_snapshot: Optional[str] = None
    win_rate: Optional[str] = None
