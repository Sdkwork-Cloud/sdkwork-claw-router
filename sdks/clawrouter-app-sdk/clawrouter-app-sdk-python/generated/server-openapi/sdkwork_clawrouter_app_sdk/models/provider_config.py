from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class ProviderConfig:
    """Provider config schema exposed by Claw Router."""
    description: str
    id: str
    integration_type: str
    name: str
    provider_family: str
    status: str
    url: str
