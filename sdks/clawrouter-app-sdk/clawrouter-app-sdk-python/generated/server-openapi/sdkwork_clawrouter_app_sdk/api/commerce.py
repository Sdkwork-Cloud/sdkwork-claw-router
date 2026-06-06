from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import RechargesSettingsRetrieveResult

def _append_query_string(path: str, raw_query_string: str) -> str:
    query = raw_query_string.lstrip('?')
    if not query:
        return path
    separator = '&' if '?' in path else '?'
    return f"{path}{separator}{query}"





class CommerceApi:
    """commerce commerce API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.recharges = CommerceRechargesApi(client)


class CommerceRechargesApi:
    """commerce commerce.recharges API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.settings = CommerceRechargesSettingsApi(client)


class CommerceRechargesSettingsApi:
    """commerce commerce.recharges.settings API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def retrieve(self) -> RechargesSettingsRetrieveResult:
        """Recharges Settings Retrieve"""
        return self._client.get(f"/app/v3/api/recharges/settings")
