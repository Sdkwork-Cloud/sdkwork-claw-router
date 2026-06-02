using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiModelRecord
    {
        public string? ApiFormat { get; set; }
        public Dictionary<string, string>? Capabilities { get; set; }
        public string? Capability { get; set; }
        public string? CapabilityIntro { get; set; }
        public string? CatalogKey { get; set; }
        public string? ColorToken { get; set; }
        public string? ContextTokens { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DefaultPricingId { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeprecatedAt { get; set; }
        public string? Description { get; set; }
        public string? DisplayName { get; set; }
        public string? DocsUrl { get; set; }
        public string? FamilyCode { get; set; }
        public string? FamilyId { get; set; }
        public MediaResource? Icon { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? InputModalities { get; set; }
        public string? LicenseType { get; set; }
        public Dictionary<string, string>? Limitations { get; set; }
        public int? MaxDurationSeconds { get; set; }
        public string? MaxInputTokens { get; set; }
        public string? MaxOutputTokens { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public Dictionary<string, string>? Modalities { get; set; }
        public string? Model { get; set; }
        public Dictionary<string, string>? ModelAliases { get; set; }
        public string? ModelFamily { get; set; }
        public string? ModelVersion { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? OutputModalities { get; set; }
        public Dictionary<string, string>? PerformanceProfile { get; set; }
        public string? ProviderHint { get; set; }
        public string? RankScore { get; set; }
        public string? ReleaseStage { get; set; }
        public string? ReplacementModel { get; set; }
        public string? RetiredAt { get; set; }
        public string? RoutingState { get; set; }
        public string? ShelfState { get; set; }
        public string? Status { get; set; }
        public Dictionary<string, string>? SupportedLanguages { get; set; }
        public bool? SupportsJsonSchema { get; set; }
        public bool? SupportsStreaming { get; set; }
        public bool? SupportsTools { get; set; }
        public string? TenantId { get; set; }
        public string? TrainingDataCutoff { get; set; }
        public string? UpdatedAt { get; set; }
        public Dictionary<string, string>? UseCases { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? VendorId { get; set; }
        public string? VendorNameSnapshot { get; set; }
        public string? Version { get; set; }
    }
}
