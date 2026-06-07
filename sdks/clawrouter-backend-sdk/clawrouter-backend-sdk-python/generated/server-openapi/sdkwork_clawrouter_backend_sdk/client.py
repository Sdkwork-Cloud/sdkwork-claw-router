from .http_client import HttpClient, SdkConfig
from .api.agents import AgentsApi
from .api.ai import AiApi
from .api.commerce import CommerceApi
from .api.content import ContentApi
from .api.ecosystem import EcosystemApi
from .api.iam import IamApi
from .api.integration import IntegrationApi
from .api.mcp import McpApi
from .api.messaging import MessagingApi
from .api.open_platform import OpenPlatformApi
from .api.platform import PlatformApi
from .api.system import SystemApi
from .api.prompts import PromptsApi
from .api.service_providers import ServiceProvidersApi
from .api.sites import SitesApi
from .api.storage import StorageApi


class SdkworkBackendClient:
    """clawrouter-backend-sdk SDK Client."""

    def __init__(self, config: SdkConfig):
        self._client = HttpClient(config)
        self.agents: AgentsApi
        self.ai: AiApi
        self.commerce: CommerceApi
        self.content: ContentApi
        self.ecosystem: EcosystemApi
        self.iam: IamApi
        self.integration: IntegrationApi
        self.mcp: McpApi
        self.messaging: MessagingApi
        self.open_platform: OpenPlatformApi
        self.platform: PlatformApi
        self.system: SystemApi
        self.prompts: PromptsApi
        self.service_providers: ServiceProvidersApi
        self.sites: SitesApi
        self.storage: StorageApi

        # Initialize API modules
        self.agents = AgentsApi(self._client)
        self.ai = AiApi(self._client)
        self.commerce = CommerceApi(self._client)
        self.content = ContentApi(self._client)
        self.ecosystem = EcosystemApi(self._client)
        self.iam = IamApi(self._client)
        self.integration = IntegrationApi(self._client)
        self.mcp = McpApi(self._client)
        self.messaging = MessagingApi(self._client)
        self.open_platform = OpenPlatformApi(self._client)
        self.platform = PlatformApi(self._client)
        self.system = SystemApi(self._client)
        self.prompts = PromptsApi(self._client)
        self.service_providers = ServiceProvidersApi(self._client)
        self.sites = SitesApi(self._client)
        self.storage = StorageApi(self._client)
    def set_auth_token(self, token: str) -> 'SdkworkBackendClient':
        """Set auth token for authentication."""
        self._client.set_auth_token(token)
        return self

    def set_access_token(self, token: str) -> 'SdkworkBackendClient':
        """Set access token for authentication."""
        self._client.set_access_token(token)
        return self

    def set_header(self, key: str, value: str) -> 'SdkworkBackendClient':
        """Set custom header."""
        self._client.set_header(key, value)
        return self

    @property
    def http(self) -> HttpClient:
        """Get the underlying HTTP client."""
        return self._client


def create_client(config: SdkConfig) -> SdkworkBackendClient:
    """Create a new SDK client instance."""
    return SdkworkBackendClient(config)
