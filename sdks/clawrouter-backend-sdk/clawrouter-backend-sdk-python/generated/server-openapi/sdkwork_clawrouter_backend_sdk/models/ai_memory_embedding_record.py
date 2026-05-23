from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AiMemoryEmbeddingRecord:
    """Ai memory embedding record schema exposed by Claw Router."""
    content_hash: Optional[str] = None
    created_at: Optional[str] = None
    data_scope: Optional[str] = None
    deleted_at: Optional[str] = None
    deleted_by: Optional[str] = None
    embedding_dimensions: Optional[int] = None
    embedding_model: Optional[str] = None
    embedding_provider: Optional[str] = None
    id: Optional[str] = None
    indexed_at: Optional[str] = None
    memory_id: Optional[str] = None
    metadata: Optional[Dict[str, str]] = None
    organization_id: Optional[str] = None
    status: Optional[str] = None
    tenant_id: Optional[str] = None
    updated_at: Optional[str] = None
    uuid: Optional[str] = None
    vector_json: Optional[Dict[str, str]] = None
    vector_storage_key: Optional[str] = None
    version: Optional[str] = None
