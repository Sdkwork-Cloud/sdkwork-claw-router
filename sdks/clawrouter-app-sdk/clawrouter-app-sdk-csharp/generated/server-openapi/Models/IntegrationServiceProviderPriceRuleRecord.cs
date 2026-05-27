using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class IntegrationServiceProviderPriceRuleRecord
    {
        public string? BillingMeterCode { get; set; }
        public string? BuyerProviderId { get; set; }
        public string? CatalogKey { get; set; }
        public string? ChannelId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EdgeId { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MinimumCharge { get; set; }
        public string? Model { get; set; }
        public string? OrganizationId { get; set; }
        public string? PricePlanId { get; set; }
        public int? Priority { get; set; }
        public string? ProviderCode { get; set; }
        public string? RoundingMode { get; set; }
        public string? SellerProviderId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TokenKind { get; set; }
        public string? UnitPrice { get; set; }
        public string? UnitSize { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
