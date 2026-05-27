using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiUsageServiceProviderEdgeRecord
    {
        public string? AmountRole { get; set; }
        public string? BillableQuantity { get; set; }
        public string? BillingMeterCode { get; set; }
        public string? BuyerProviderId { get; set; }
        public Dictionary<string, string>? BuyerSnapshot { get; set; }
        public string? ChainId { get; set; }
        public string? ChargeAmount { get; set; }
        public string? ConvertedChargeAmount { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public int? EdgeDepth { get; set; }
        public string? EdgeId { get; set; }
        public string? FxRateSnapshot { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OccurredAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public Dictionary<string, string>? PriceSnapshot { get; set; }
        public string? PricingPlanId { get; set; }
        public string? PricingRuleId { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? SellerProviderId { get; set; }
        public Dictionary<string, string>? SellerSnapshot { get; set; }
        public string? SettlementCurrency { get; set; }
        public string? SettlementStatus { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TokenKind { get; set; }
        public string? TraceId { get; set; }
        public string? UnitPrice { get; set; }
        public string? UnitSize { get; set; }
        public string? UsageFactId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
