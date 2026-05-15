using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceUsageStatementItemRecord
    {
        public string? AssetCount { get; set; }
        public Dictionary<string, string>? BreakdownPayload { get; set; }
        public string? CostAmount { get; set; }
        public string? CreatedAt { get; set; }
        public string? Currency { get; set; }
        public string? DurationSeconds { get; set; }
        public string? Id { get; set; }
        public string? ItemType { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Modality { get; set; }
        public string? Model { get; set; }
        public Dictionary<string, string>? ModelList { get; set; }
        public string? OrganizationId { get; set; }
        public string? ProviderCode { get; set; }
        public string? RebuildVersion { get; set; }
        public string? RequestCount { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public Dictionary<string, string>? SourceUsageFactIds { get; set; }
        public string? SourceVersion { get; set; }
        public string? StatementId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TokenCount { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UsageText { get; set; }
        public string? Uuid { get; set; }
    }
}
