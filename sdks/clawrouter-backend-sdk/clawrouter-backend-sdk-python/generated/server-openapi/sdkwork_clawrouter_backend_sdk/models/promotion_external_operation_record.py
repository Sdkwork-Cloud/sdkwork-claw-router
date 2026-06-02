from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class PromotionExternalOperationRecord:
    """Promotion external operation record schema exposed by Claw Router."""
    aggregate_id: str
    aggregate_type: str
    created_at: str
    idempotency_key: str
    occurred_at: str
    operation_no: str
    operation_type: str
    platform: str
    retry_count: int
    sanitized_request_json: Dict[str, str]
    sanitized_response_json: Dict[str, str]
    status: str
    tenant_id: str
    binding_id: Optional[str] = None
    callback_at: Optional[str] = None
    callback_id: Optional[str] = None
    callback_sig_hash: Optional[str] = None
    cancel_until: Optional[str] = None
    error_code: Optional[str] = None
    error_message: Optional[str] = None
    external_operation_id: Optional[str] = None
    external_request_no: Optional[str] = None
    external_status: Optional[str] = None
    id: Optional[str] = None
    next_retry_at: Optional[str] = None
    organization_id: Optional[str] = None
    provider_code: Optional[str] = None
    provider_request_id: Optional[str] = None
    replay_op_id: Optional[str] = None
    request_hash: Optional[str] = None
    response_hash: Optional[str] = None
