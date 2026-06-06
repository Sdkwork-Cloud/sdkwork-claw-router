using System;
using SDKwork.Common.Core;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;
using Sdkwork.ClawRouter.App.Api;

namespace Sdkwork.ClawRouter.App
{
    public class SdkworkAppClient
    {
        private readonly SdkHttpClient _httpClient;

        public AgentsApi Agents { get; }
        public AiApi Ai { get; }
        public ChatApi Chat { get; }
        public ContentApi Content { get; }
        public EcosystemApi Ecosystem { get; }
        public IamApi Iam { get; }
        public MemoryApi Memory { get; }
        public NotificationApi Notification { get; }
        public PlatformApi Platform { get; }
        public SystemApi System { get; }
        public CommerceApi Commerce { get; }
        public RuntimeApi Runtime { get; }
        public SdkReferenceApi SdkReference { get; }

        public SdkworkAppClient(string baseUrl)
        {
            _httpClient = new SdkHttpClient(baseUrl);
            Agents = new AgentsApi(_httpClient);
            Ai = new AiApi(_httpClient);
            Chat = new ChatApi(_httpClient);
            Content = new ContentApi(_httpClient);
            Ecosystem = new EcosystemApi(_httpClient);
            Iam = new IamApi(_httpClient);
            Memory = new MemoryApi(_httpClient);
            Notification = new NotificationApi(_httpClient);
            Platform = new PlatformApi(_httpClient);
            System = new SystemApi(_httpClient);
            Commerce = new CommerceApi(_httpClient);
            Runtime = new RuntimeApi(_httpClient);
            SdkReference = new SdkReferenceApi(_httpClient);
        }

        public SdkworkAppClient(SdkConfig config)
        {
            _httpClient = new SdkHttpClient(config);
            Agents = new AgentsApi(_httpClient);
            Ai = new AiApi(_httpClient);
            Chat = new ChatApi(_httpClient);
            Content = new ContentApi(_httpClient);
            Ecosystem = new EcosystemApi(_httpClient);
            Iam = new IamApi(_httpClient);
            Memory = new MemoryApi(_httpClient);
            Notification = new NotificationApi(_httpClient);
            Platform = new PlatformApi(_httpClient);
            System = new SystemApi(_httpClient);
            Commerce = new CommerceApi(_httpClient);
            Runtime = new RuntimeApi(_httpClient);
            SdkReference = new SdkReferenceApi(_httpClient);
        }

        public SdkworkAppClient SetApiKey(string apiKey)
        {
            _httpClient.SetApiKey(apiKey);
            return this;
        }

        public SdkworkAppClient SetAuthToken(string token)
        {
            _httpClient.SetAuthToken(token);
            return this;
        }

        public SdkworkAppClient SetAccessToken(string token)
        {
            _httpClient.SetAccessToken(token);
            return this;
        }

        public SdkworkAppClient SetHeader(string key, string value)
        {
            _httpClient.SetHeader(key, value);
            return this;
        }
    }
}
