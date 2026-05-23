from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class RuntimeArtifactItem:
    """Runtime artifact item schema exposed by Claw Router."""
    artifact_type: str
    created_at: str
    id: str
    invocation_id: str
    content_text: Optional[str] = None
    mime_type: Optional[str] = None
    name: Optional[str] = None
    sha256: Optional[str] = None
    size_bytes: Optional[int] = None
    storage_key: Optional[str] = None
    storage_url: Optional[str] = None
