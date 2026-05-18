from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import NotificationsListResult

def _append_query_string(path: str, raw_query_string: str) -> str:
    query = raw_query_string.lstrip('?')
    if not query:
        return path
    separator = '&' if '?' in path else '?'
    return f"{path}{separator}{query}"





class CommunicationApi:
    """communication communication API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.notifications = CommunicationNotificationsApi(client)


class CommunicationNotificationsApi:
    """communication communication.notifications API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def list(self) -> NotificationsListResult:
        """List messages"""
        return self._client.get(f"/app/v3/api/communication/notifications")
