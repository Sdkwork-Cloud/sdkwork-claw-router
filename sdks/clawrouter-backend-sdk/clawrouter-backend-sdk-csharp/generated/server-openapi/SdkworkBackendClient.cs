using System;
using SDKwork.Common.Core;
using SdkHttpClient = Sdkwork.ClawRouter.Backend.Http.HttpClient;
using Sdkwork.ClawRouter.Backend.Api;

namespace Sdkwork.ClawRouter.Backend
{
    public class SdkworkBackendClient
    {
        private readonly SdkHttpClient _httpClient;

        public AgentsApi Agents { get; }
        public AiApi Ai { get; }
        public CommerceApi Commerce { get; }
        public ContentApi Content { get; }
        public EcosystemApi Ecosystem { get; }
        public IamApi Iam { get; }
        public IntegrationApi Integration { get; }
        public McpApi Mcp { get; }
        public MessagingApi Messaging { get; }
        public OpenPlatformApi OpenPlatform { get; }
        public PlatformApi Platform { get; }
        public SystemApi System { get; }
        public PromptsApi Prompts { get; }
        public ServiceProvidersApi ServiceProviders { get; }
        public StorageApi Storage { get; }

        public SdkworkBackendClient(string baseUrl)
        {
            _httpClient = new SdkHttpClient(baseUrl);
            Agents = new AgentsApi(_httpClient);
            Ai = new AiApi(_httpClient);
            Commerce = new CommerceApi(_httpClient);
            Content = new ContentApi(_httpClient);
            Ecosystem = new EcosystemApi(_httpClient);
            Iam = new IamApi(_httpClient);
            Integration = new IntegrationApi(_httpClient);
            Mcp = new McpApi(_httpClient);
            Messaging = new MessagingApi(_httpClient);
            OpenPlatform = new OpenPlatformApi(_httpClient);
            Platform = new PlatformApi(_httpClient);
            System = new SystemApi(_httpClient);
            Prompts = new PromptsApi(_httpClient);
            ServiceProviders = new ServiceProvidersApi(_httpClient);
            Storage = new StorageApi(_httpClient);
        }

        public SdkworkBackendClient(SdkConfig config)
        {
            _httpClient = new SdkHttpClient(config);
            Agents = new AgentsApi(_httpClient);
            Ai = new AiApi(_httpClient);
            Commerce = new CommerceApi(_httpClient);
            Content = new ContentApi(_httpClient);
            Ecosystem = new EcosystemApi(_httpClient);
            Iam = new IamApi(_httpClient);
            Integration = new IntegrationApi(_httpClient);
            Mcp = new McpApi(_httpClient);
            Messaging = new MessagingApi(_httpClient);
            OpenPlatform = new OpenPlatformApi(_httpClient);
            Platform = new PlatformApi(_httpClient);
            System = new SystemApi(_httpClient);
            Prompts = new PromptsApi(_httpClient);
            ServiceProviders = new ServiceProvidersApi(_httpClient);
            Storage = new StorageApi(_httpClient);
        }

        public SdkworkBackendClient SetApiKey(string apiKey)
        {
            _httpClient.SetApiKey(apiKey);
            return this;
        }

        public SdkworkBackendClient SetAuthToken(string token)
        {
            _httpClient.SetAuthToken(token);
            return this;
        }

        public SdkworkBackendClient SetAccessToken(string token)
        {
            _httpClient.SetAccessToken(token);
            return this;
        }

        public SdkworkBackendClient SetHeader(string key, string value)
        {
            _httpClient.SetHeader(key, value);
            return this;
        }
    }
}
