using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiModelMappingRuleRecord
    {
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public bool? Enabled { get; set; }
        public string? Id { get; set; }
        public string? MappingMode { get; set; }
        public string? MatchType { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? SourceVendorCode { get; set; }
        public string? SourceVendorId { get; set; }
        public string? Status { get; set; }
        public string? TargetVendorCode { get; set; }
        public string? TargetVendorId { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
