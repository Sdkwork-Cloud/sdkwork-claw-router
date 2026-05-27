using System;
using SDKwork.Common.Core;
using SdkHttpClient = Sdkwork.ClawRouter.App.Http.HttpClient;
using Sdkwork.ClawRouter.App.Api;

namespace Sdkwork.ClawRouter.App
{
    public class SdkworkAppClient
    {
        private readonly SdkHttpClient _httpClient;

        public CommerceApi Commerce { get; }
        public AgentsApi Agents { get; }
        public AiApi Ai { get; }
        public AuthApi Auth { get; }
        public ChatApi Chat { get; }
        public ContentApi Content { get; }
        public EcosystemApi Ecosystem { get; }
        public IamApi Iam { get; }
        public MemoryApi Memory { get; }
        public NotificationApi Notification { get; }
        public OpenPlatformApi OpenPlatform { get; }
        public PlatformApi Platform { get; }
        public SystemApi System { get; }
        public RuntimeApi Runtime { get; }
        public SdkReferenceApi SdkReference { get; }

        public SdkworkAppClient(string baseUrl)
        {
            _httpClient = new SdkHttpClient(baseUrl);
            Commerce = new CommerceApi(_httpClient);
            Agents = new AgentsApi(_httpClient);
            Ai = new AiApi(_httpClient);
            Auth = new AuthApi(_httpClient);
            Chat = new ChatApi(_httpClient);
            Content = new ContentApi(_httpClient);
            Ecosystem = new EcosystemApi(_httpClient);
            Iam = new IamApi(_httpClient);
            Memory = new MemoryApi(_httpClient);
            Notification = new NotificationApi(_httpClient);
            OpenPlatform = new OpenPlatformApi(_httpClient);
            Platform = new PlatformApi(_httpClient);
            System = new SystemApi(_httpClient);
            Runtime = new RuntimeApi(_httpClient);
            SdkReference = new SdkReferenceApi(_httpClient);
        }

        public SdkworkAppClient(SdkConfig config)
        {
            _httpClient = new SdkHttpClient(config);
            Commerce = new CommerceApi(_httpClient);
            Agents = new AgentsApi(_httpClient);
            Ai = new AiApi(_httpClient);
            Auth = new AuthApi(_httpClient);
            Chat = new ChatApi(_httpClient);
            Content = new ContentApi(_httpClient);
            Ecosystem = new EcosystemApi(_httpClient);
            Iam = new IamApi(_httpClient);
            Memory = new MemoryApi(_httpClient);
            Notification = new NotificationApi(_httpClient);
            OpenPlatform = new OpenPlatformApi(_httpClient);
            Platform = new PlatformApi(_httpClient);
            System = new SystemApi(_httpClient);
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
