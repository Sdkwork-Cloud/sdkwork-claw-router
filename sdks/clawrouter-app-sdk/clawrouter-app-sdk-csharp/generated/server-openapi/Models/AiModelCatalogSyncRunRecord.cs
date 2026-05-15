using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiModelCatalogSyncRunRecord
    {
        public string? AcceptedCount { get; set; }
        public string? CatalogVersion { get; set; }
        public Dictionary<string, string>? ChangeSummary { get; set; }
        public string? CreatedAt { get; set; }
        public string? ErrorMessageMasked { get; set; }
        public string? FinishedAt { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? ObservedAt { get; set; }
        public string? ObservedMeterCount { get; set; }
        public string? ObservedModelCount { get; set; }
        public string? ObservedPriceCount { get; set; }
        public string? ObservedVendorCount { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? ProviderCode { get; set; }
        public string? RegionCode { get; set; }
        public string? RejectedCount { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RunStatus { get; set; }
        public string? SkippedCount { get; set; }
        public string? SourceCode { get; set; }
        public string? SourceHash { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? VendorCode { get; set; }
    }
}
