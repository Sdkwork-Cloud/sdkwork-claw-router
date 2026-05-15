from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsGatewayHeartbeatRecord:
    """Ops gateway heartbeat record schema exposed by Claw Router."""
    active_connections: Optional[str] = None
    cpu_percent: Optional[str] = None
    created_at: Optional[str] = None
    disk_percent: Optional[str] = None
    heartbeat_at: Optional[str] = None
    id: Optional[str] = None
    instance_id: Optional[str] = None
    legal_hold: Optional[bool] = None
    memory_percent: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    network_in_bytes: Optional[str] = None
    network_out_bytes: Optional[str] = None
    open_file_count: Optional[str] = None
    organization_id: Optional[str] = None
    payload: Optional[Dict[str, str]] = None
    payload_hash: Optional[str] = None
    request_id: Optional[str] = None
    retention_until: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    thread_count: Optional[str] = None
    trace_id: Optional[str] = None
    uptime_seconds: Optional[str] = None
    user_id: Optional[str] = None
    uuid: Optional[str] = None
