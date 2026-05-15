from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING, Optional, List, Dict, Any

if TYPE_CHECKING:
    from .iam_oauth_authorization_url_response import IamOauthAuthorizationUrlResponse


@dataclass
class OauthAuthorizationUrlsRetrieveResult:
    """Oauth authorization urls retrieve result schema exposed by Claw Router."""
    code: str
    data: Optional[IamOauthAuthorizationUrlResponse] = None
    message: Optional[str] = None
    msg: Optional[str] = None
