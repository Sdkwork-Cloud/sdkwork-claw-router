using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommercePaymentProviderCapabilityRecord
    {
        public string? CapabilityCode { get; set; }
        public string? CountryCode { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrencyCode { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Id { get; set; }
        public string? MaxAmount { get; set; }
        public Dictionary<string, string>? MetadataJson { get; set; }
        public string? MethodCode { get; set; }
        public string? MinAmount { get; set; }
        public Dictionary<string, string>? NativeOperationCodes { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderAccountId { get; set; }
        public string? ProviderCode { get; set; }
        public string? SceneCode { get; set; }
        public string? Status { get; set; }
        public Dictionary<string, string>? SupportedStatementTypes { get; set; }
        public Dictionary<string, string>? SupportedWebhookEvents { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
    }
}
