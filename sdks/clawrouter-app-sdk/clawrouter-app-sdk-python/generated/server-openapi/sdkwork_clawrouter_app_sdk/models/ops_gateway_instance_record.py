from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class OpsGatewayInstanceRecord:
    """Ops gateway instance record schema exposed by Claw Router."""
    cell: Optional[str] = None
    config_hash: Optional[str] = None
    container_id_hash: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    deployment_mode: Optional[str] = None
    desktop_device_hash: Optional[str] = None
    health_status: Optional[str] = None
    host_name: Optional[str] = None
    id: Optional[str] = None
    instance_code: Optional[str] = None
    ip_address_hash: Optional[str] = None
    ip_address_masked: Optional[str] = None
    last_heartbeat_at: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    node_name: Optional[str] = None
    orchestrator: Optional[str] = None
    organization_id: Optional[str] = None
    pod_name: Optional[str] = None
    region: Optional[str] = None
    runtime_type: Optional[str] = None
    started_at: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
    version_name: Optional[str] = None
