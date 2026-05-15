using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ContentDocPageRecord
    {
        public string? ContentHash { get; set; }
        public string? ContentSource { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DocCode { get; set; }
        public string? DocType { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? Path { get; set; }
        public string? PublishedAt { get; set; }
        public string? Slug { get; set; }
        public int? SortOrder { get; set; }
        public string? SourceRef { get; set; }
        public string? Status { get; set; }
        public string? Summary { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
