from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class MessagingProviderCapabilityRecord:
    """Messaging provider capability record schema exposed by Claw Router."""
    capability_schema: Optional[Dict[str, str]] = None
    channel: Optional[str] = None
    country_code: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    delivery_purpose: Optional[str] = None
    health_status: Optional[str] = None
    id: Optional[str] = None
    last_verified_at: Optional[str] = None
    locale: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    provider_account_id: Optional[str] = None
    provider_code: Optional[str] = None
    rate_limit_policy: Optional[Dict[str, str]] = None
    sandbox_supported: Optional[bool] = None
    status: Optional[str] = None
    supports_batch_send: Optional[bool] = None
    supports_delivery_receipt: Optional[bool] = None
    supports_template_sync: Optional[bool] = None
    supports_test_send: Optional[bool] = None
    supports_webhook: Optional[bool] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
