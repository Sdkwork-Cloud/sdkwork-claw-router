package backend

import (
    "github.com/sdkwork/clawrouter-backend-sdk/api"
    sdkhttp "github.com/sdkwork/clawrouter-backend-sdk/http"
)

type SdkworkBackendClient struct {
    http *sdkhttp.Client
    Agents *api.AgentsApi
    Ai *api.AiApi
    Content *api.ContentApi
    Ecosystem *api.EcosystemApi
    Iam *api.IamApi
    Integration *api.IntegrationApi
    Mcp *api.McpApi
    Messaging *api.MessagingApi
    Platform *api.PlatformApi
    Prompts *api.PromptsApi
    ServiceProviders *api.ServiceProvidersApi
    Sites *api.SitesApi
    Storage *api.StorageApi
    System *api.SystemApi
}

func NewSdkworkBackendClient(baseURL string) *SdkworkBackendClient {
    cfg := sdkhttp.NewDefaultConfig(baseURL)
    return NewSdkworkBackendClientWithConfig(cfg)
}

func NewSdkworkBackendClientWithConfig(config sdkhttp.Config) *SdkworkBackendClient {
    client := sdkhttp.NewClient(config)
    return &SdkworkBackendClient{
        http: client,
        Agents: api.NewAgentsApi(client),
        Ai: api.NewAiApi(client),
        Content: api.NewContentApi(client),
        Ecosystem: api.NewEcosystemApi(client),
        Iam: api.NewIamApi(client),
        Integration: api.NewIntegrationApi(client),
        Mcp: api.NewMcpApi(client),
        Messaging: api.NewMessagingApi(client),
        Platform: api.NewPlatformApi(client),
        Prompts: api.NewPromptsApi(client),
        ServiceProviders: api.NewServiceProvidersApi(client),
        Sites: api.NewSitesApi(client),
        Storage: api.NewStorageApi(client),
        System: api.NewSystemApi(client),
    }
}

func (c *SdkworkBackendClient) SetAuthToken(token string) *SdkworkBackendClient {
    c.http.SetAuthToken(token)
    return c
}

func (c *SdkworkBackendClient) SetAccessToken(token string) *SdkworkBackendClient {
    c.http.SetAccessToken(token)
    return c
}

func (c *SdkworkBackendClient) SetHeader(key string, value string) *SdkworkBackendClient {
    c.http.SetHeader(key, value)
    return c
}

func (c *SdkworkBackendClient) Http() *sdkhttp.Client {
    return c.http
}
