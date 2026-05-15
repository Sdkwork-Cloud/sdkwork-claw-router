using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiPricingImportSnapshotRecord
    {
        public string? AcceptedCount { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? DataFormat { get; set; }
        public string? ErrorMessageMasked { get; set; }
        public string? Id { get; set; }
        public string? ImportSource { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? NormalizedPayloadHash { get; set; }
        public string? ObservedAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? PublishedAt { get; set; }
        public string? RawPayloadRef { get; set; }
        public string? RejectedCount { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RowCount { get; set; }
        public string? SchemaVersion { get; set; }
        public string? SourceHash { get; set; }
        public string? SourceName { get; set; }
        public string? SourceUrl { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UpstreamCommit { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
