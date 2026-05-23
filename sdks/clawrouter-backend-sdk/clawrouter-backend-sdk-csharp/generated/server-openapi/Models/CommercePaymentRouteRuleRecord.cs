using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentRouteRuleRecord
    {
        public string? AmountMax { get; set; }
        public string? AmountMin { get; set; }
        public string? ChannelId { get; set; }
        public string? ClientPlatform { get; set; }
        public string? CountryCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? EndsAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PurchaseType { get; set; }
        public string? RiskLevel { get; set; }
        public string? RuleNo { get; set; }
        public string? StartsAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserSegment { get; set; }
    }
}
