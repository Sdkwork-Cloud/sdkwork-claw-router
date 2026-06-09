from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any


@dataclass
class IamOauthAuthorizationUrlResponse:
    """Iam oauth authorization url response schema exposed by Claw Router."""
    auth_url: str
