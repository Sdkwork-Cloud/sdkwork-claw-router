using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiChannelModelRecord
    {
        public string? ApiCode { get; set; }
        public string? Capability { get; set; }
        public string? CatalogKey { get; set; }
        public string? ChannelId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public Dictionary<string, string>? DefaultParameters { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EffectiveFrom { get; set; }
        public string? EffectiveTo { get; set; }
        public string? Id { get; set; }
        public string? MaxInputTokens { get; set; }
        public string? MaxOutputTokens { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Model { get; set; }
        public Dictionary<string, string>? ModelAliases { get; set; }
        public string? ModelId { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderModel { get; set; }
        public string? ProviderNativeModel { get; set; }
        public string? Status { get; set; }
        public bool? SupportsStreaming { get; set; }
        public bool? SupportsTools { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? Version { get; set; }
    }
}
