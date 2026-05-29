using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AiResourceGroupItemRecord
    {
        public string? ChildResourceGroupCode { get; set; }
        public string? ChildResourceGroupId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public string? ItemRole { get; set; }
        public string? ItemType { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ResourceCode { get; set; }
        public string? ResourceGroupCode { get; set; }
        public string? ResourceGroupId { get; set; }
        public string? ResourceId { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
