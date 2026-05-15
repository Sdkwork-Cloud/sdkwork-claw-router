from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class AppSkillConfigRequest:
    """Skill runtime configuration request. config.portal is reserved portal metadata and must not be provided by clients."""
    config: Optional[Dict[str, str]] = None
