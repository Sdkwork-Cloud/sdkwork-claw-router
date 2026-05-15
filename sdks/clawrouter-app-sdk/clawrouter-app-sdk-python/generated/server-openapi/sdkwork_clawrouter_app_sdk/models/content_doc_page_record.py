from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ContentDocPageRecord:
    """Content doc page record schema exposed by Claw Router."""
    content_hash: Optional[str] = None
    content_source: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    doc_code: Optional[str] = None
    doc_type: Optional[str] = None
    id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    path: Optional[str] = None
    published_at: Optional[str] = None
    slug: Optional[str] = None
    sort_order: Optional[int] = None
    source_ref: Optional[str] = None
    status: Optional[str] = None
    summary: Optional[str] = None
    tenant_id: Optional[str] = None
    title: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    version: Optional[str] = None
