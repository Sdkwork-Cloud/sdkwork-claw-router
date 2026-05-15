using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiModelRankSnapshotRecord
    {
        public string? BaseVolume { get; set; }
        public string? CatalogKey { get; set; }
        public string? ColorToken { get; set; }
        public string? ContextSizeText { get; set; }
        public string? CostAmount { get; set; }
        public int? CostIndicator { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? Id { get; set; }
        public bool? IsNew { get; set; }
        public int? LatencyP50Ms { get; set; }
        public int? LatencyP95Ms { get; set; }
        public string? LicenseType { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Modality { get; set; }
        public string? Model { get; set; }
        public string? ModelId { get; set; }
        public string? OrganizationId { get; set; }
        public int? PreviousRankNo { get; set; }
        public string? PricingText { get; set; }
        public string? ProviderCode { get; set; }
        public int? RankNo { get; set; }
        public Dictionary<string, string>? RankPayload { get; set; }
        public string? RankScope { get; set; }
        public string? RebuildVersion { get; set; }
        public string? RegionCode { get; set; }
        public string? RequestCount { get; set; }
        public string? SnapshotDate { get; set; }
        public string? SnapshotPeriod { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public Dictionary<string, string>? Strengths { get; set; }
        public string? SuccessRate { get; set; }
        public string? TenantId { get; set; }
        public string? TokenCount { get; set; }
        public string? TrendScore { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
        public string? VendorNameSnapshot { get; set; }
        public string? WinRate { get; set; }
    }
}
