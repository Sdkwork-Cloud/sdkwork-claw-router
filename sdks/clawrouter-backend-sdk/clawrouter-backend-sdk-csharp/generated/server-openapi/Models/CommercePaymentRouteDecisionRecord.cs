using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentRouteDecisionRecord
    {
        public string? Amount { get; set; }
        public string? ChannelId { get; set; }
        public string? CountryCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? DecisionReason { get; set; }
        public string? FallbackFromChannelId { get; set; }
        public string? Id { get; set; }
        public string? MethodCode { get; set; }
        public string? OrganizationId { get; set; }
        public string? PaymentAttemptId { get; set; }
        public string? PaymentIntentId { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? RiskLevel { get; set; }
        public string? RouteRuleId { get; set; }
        public string? SceneCode { get; set; }
        public string? TenantId { get; set; }
    }
}
