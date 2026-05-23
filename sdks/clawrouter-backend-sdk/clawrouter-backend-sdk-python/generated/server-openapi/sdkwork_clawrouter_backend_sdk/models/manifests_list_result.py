from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .open_platform_manifest_list_response import OpenPlatformManifestListResponse


@dataclass
class ManifestsListResult:
    """Manifests list result schema exposed by Claw Router."""
    code: str
    data: Optional[OpenPlatformManifestListResponse] = None
    msg: Optional[str] = None
