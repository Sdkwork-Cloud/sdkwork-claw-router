using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiModelMappingRuleItemRecord
    {
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public bool? Enabled { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? RuleId { get; set; }
        public string? RuleUuid { get; set; }
        public int? SortOrder { get; set; }
        public string? SourceCatalogKey { get; set; }
        public string? SourceModel { get; set; }
        public string? Status { get; set; }
        public string? TargetCatalogKey { get; set; }
        public string? TargetModel { get; set; }
        public string? TargetProviderModel { get; set; }
        public string? TargetProviderNativeModel { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
