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
        public static ChatApi? Chat { get; set; }
        public static ContentApi? Content { get; set; }
        public static EcosystemApi? Ecosystem { get; set; }
        public static IamApi? Iam { get; set; }
        public static MemoryApi? Memory { get; set; }
        public static NotificationApi? Notification { get; set; }
        public static PlatformApi? Platform { get; set; }
        public static RuntimeApi? Runtime { get; set; }
        public static SdkReferenceApi? SdkReference { get; set; }
        public static SystemApi? System { get; set; }
    }
}
