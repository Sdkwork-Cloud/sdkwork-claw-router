from .http_client import HttpClient, SdkConfig
from .api.agents import AgentsApi
from .api.ai import AiApi
from .api.billing import BillingApi
from .api.content import ContentApi
from .api.ecosystem import EcosystemApi
from .api.iam import IamApi
from .api.integration import IntegrationApi
from .api.platform import PlatformApi
from .api.system import SystemApi


class SdkworkBackendClient:
    """clawrouter-backend-sdk SDK Client."""

    def __init__(self, config: SdkConfig):
        self._client = HttpClient(config)
        self.agents: AgentsApi
        self.ai: AiApi
        self.billing: BillingApi
        self.content: ContentApi
        self.ecosystem: EcosystemApi
        self.iam: IamApi
        self.integration: IntegrationApi
        self.platform: PlatformApi
        self.system: SystemApi

        # Initialize API modules
        self.agents = AgentsApi(self._client)
        self.ai = AiApi(self._client)
        self.billing = BillingApi(self._client)
        self.content = ContentApi(self._client)
        self.ecosystem = EcosystemApi(self._client)
        self.iam = IamApi(self._client)
        self.integration = IntegrationApi(self._client)
        self.platform = PlatformApi(self._client)
        self.system = SystemApi(self._client)

    def set_api_key(self, api_key: str) -> 'SdkworkBackendClient':
        """Set API key for authentication."""
        self._client.set_api_key(api_key)
        return self

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
