from typing import Any, Dict, List, Optional
from ..http_client import HttpClient
from ..models import ArchivesCreateResult, DocumentationCreateResult, SdkReferenceArchiveGenerateRequest, SdkReferenceDocumentationGenerateRequest

def _append_query_string(path: str, raw_query_string: str) -> str:
    query = raw_query_string.lstrip('?')
    if not query:
        return path
    separator = '&' if '?' in path else '?'
    return f"{path}{separator}{query}"





class SdkReferenceApi:
    """sdk_reference sdk_reference API client."""

    def __init__(self, client: HttpClient):
        self._client = client
        self.archives = SdkReferenceArchivesApi(client)
        self.documentation = SdkReferenceDocumentationApi(client)


class SdkReferenceArchivesApi:
    """sdk_reference sdk_reference.archives API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: SdkReferenceArchiveGenerateRequest) -> ArchivesCreateResult:
        """Generate SDK archive"""
        return self._client.post(f"/app/v3/api/sdk_reference/archives", json=body)

class SdkReferenceDocumentationApi:
    """sdk_reference sdk_reference.documentation API client."""

    def __init__(self, client: HttpClient):
        self._client = client


    def create(self, body: SdkReferenceDocumentationGenerateRequest) -> DocumentationCreateResult:
        """Generate SDK reference documentation"""
        return self._client.post(f"/app/v3/api/sdk_reference/documentation", json=body)
