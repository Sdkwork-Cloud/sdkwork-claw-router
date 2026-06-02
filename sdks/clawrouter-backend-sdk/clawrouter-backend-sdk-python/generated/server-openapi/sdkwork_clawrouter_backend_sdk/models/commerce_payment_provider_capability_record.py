from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class CommercePaymentProviderCapabilityRecord:
    """Commerce payment provider capability record schema exposed by Claw Router."""
    capability_code: str
    created_at: str
    provider_code: str
    status: str
    tenant_id: str
    updated_at: str
    country_code: Optional[str] = None
    currency_code: Optional[str] = None
    effective_from: Optional[str] = None
    effective_to: Optional[str] = None
    id: Optional[str] = None
    max_amount: Optional[str] = None
    metadata_json: Optional[Dict[str, str]] = None
    method_code: Optional[str] = None
    min_amount: Optional[str] = None
    native_operation_codes: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    scene_code: Optional[str] = None
    supported_statement_types: Optional[Dict[str, str]] = None
    supported_webhook_events: Optional[Dict[str, str]] = None
