namespace Sdkwork.ClawRouter.Backend.Api
{
    /// <summary>
    /// API modules for clawrouter-backend-sdk
    /// </summary>
    public static class Api
    {
        public static AgentsApi? Agents { get; set; }
        public static AiApi? Ai { get; set; }
        public static CommerceApi? Commerce { get; set; }
        public static ContentApi? Content { get; set; }
        public static EcosystemApi? Ecosystem { get; set; }
        public static IamApi? Iam { get; set; }
        public static IntegrationApi? Integration { get; set; }
        public static McpApi? Mcp { get; set; }
        public static MessagingApi? Messaging { get; set; }
        public static OpenPlatformApi? OpenPlatform { get; set; }
        public static PlatformApi? Platform { get; set; }
        public static SystemApi? System { get; set; }
        public static PromptsApi? Prompts { get; set; }
        public static ServiceProvidersApi? ServiceProviders { get; set; }
        public static SitesApi? Sites { get; set; }
        public static StorageApi? Storage { get; set; }
    }
}
