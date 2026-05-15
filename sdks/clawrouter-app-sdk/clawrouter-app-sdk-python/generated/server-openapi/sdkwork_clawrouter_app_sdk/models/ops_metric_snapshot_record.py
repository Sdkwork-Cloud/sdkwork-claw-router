from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsMetricSnapshotRecord:
    """Ops metric snapshot record schema exposed by Claw Router."""
    created_at: Optional[str] = None
    dimension_key: Optional[str] = None
    dimension_value: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    metric_name: Optional[str] = None
    metric_period: Optional[str] = None
    metric_scope: Optional[str] = None
    metric_unit: Optional[str] = None
    metric_value: Optional[str] = None
    organization_id: Optional[str] = None
    payload: Optional[Dict[str, str]] = None
    period_end: Optional[str] = None
    period_start: Optional[str] = None
    rebuild_version: Optional[str] = None
    source_id: Optional[str] = None
    source_type: Optional[str] = None
    source_version: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
