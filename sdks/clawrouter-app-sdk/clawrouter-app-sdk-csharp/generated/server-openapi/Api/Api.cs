namespace Sdkwork.ClawRouter.App.Api
{
    /// <summary>
    /// API modules for clawrouter-app-sdk
    /// </summary>
    public static class Api
    {
        public static AgentsApi? Agents { get; set; }
        public static AiApi? Ai { get; set; }
        public static AuthApi? Auth { get; set; }
        public static BillingApi? Billing { get; set; }
        public static CommunicationApi? Communication { get; set; }
        public static ContentApi? Content { get; set; }
        public static EcosystemApi? Ecosystem { get; set; }
        public static IamApi? Iam { get; set; }
        public static PlatformApi? Platform { get; set; }
    }
}
