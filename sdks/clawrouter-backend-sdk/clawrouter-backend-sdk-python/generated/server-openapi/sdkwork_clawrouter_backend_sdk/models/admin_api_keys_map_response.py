from __future__ import annotations
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_api_key_item import AdminApiKeyItem


AdminApiKeysMapResponse = Dict[str, List[AdminApiKeyItem]]
