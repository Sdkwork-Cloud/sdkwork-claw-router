package app

import (
    "github.com/sdkwork/clawrouter-app-sdk/api"
    sdkhttp "github.com/sdkwork/clawrouter-app-sdk/http"
)

type SdkworkAppClient struct {
    http *sdkhttp.Client
    Agents *api.AgentsApi
    Ai *api.AiApi
    Chat *api.ChatApi
    Content *api.ContentApi
    Ecosystem *api.EcosystemApi
    Iam *api.IamApi
    Memory *api.MemoryApi
    Notification *api.NotificationApi
    Platform *api.PlatformApi
    System *api.SystemApi
    Commerce *api.CommerceApi
    Runtime *api.RuntimeApi
    SdkReference *api.SdkReferenceApi
}

func NewSdkworkAppClient(baseURL string) *SdkworkAppClient {
    cfg := sdkhttp.NewDefaultConfig(baseURL)
    return NewSdkworkAppClientWithConfig(cfg)
}

func NewSdkworkAppClientWithConfig(config sdkhttp.Config) *SdkworkAppClient {
    client := sdkhttp.NewClient(config)
    return &SdkworkAppClient{
        http: client,
        Agents: api.NewAgentsApi(client),
        Ai: api.NewAiApi(client),
        Chat: api.NewChatApi(client),
        Content: api.NewContentApi(client),
        Ecosystem: api.NewEcosystemApi(client),
        Iam: api.NewIamApi(client),
        Memory: api.NewMemoryApi(client),
        Notification: api.NewNotificationApi(client),
        Platform: api.NewPlatformApi(client),
        System: api.NewSystemApi(client),
        Commerce: api.NewCommerceApi(client),
        Runtime: api.NewRuntimeApi(client),
        SdkReference: api.NewSdkReferenceApi(client),
    }
}

func (c *SdkworkAppClient) SetApiKey(apiKey string) *SdkworkAppClient {
    c.http.SetApiKey(apiKey)
    return c
}

func (c *SdkworkAppClient) SetAuthToken(token string) *SdkworkAppClient {
    c.http.SetAuthToken(token)
    return c
}

func (c *SdkworkAppClient) SetAccessToken(token string) *SdkworkAppClient {
    c.http.SetAccessToken(token)
    return c
}

func (c *SdkworkAppClient) SetHeader(key string, value string) *SdkworkAppClient {
    c.http.SetHeader(key, value)
    return c
}

func (c *SdkworkAppClient) Http() *sdkhttp.Client {
    return c.http
}
