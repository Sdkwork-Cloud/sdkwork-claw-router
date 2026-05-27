from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .admin_access_group_channel_binding_input import AdminAccessGroupChannelBindingInput


@dataclass
class AdminAccessGroupChannelBindingsReplaceRequest:
    """Admin access group channel bindings replace request schema exposed by Claw Router."""
    items: List[AdminAccessGroupChannelBindingInput]
