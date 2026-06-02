using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class StudioCatalogAssetRecord
    {
        public string? AltText { get; set; }
        public string? ArtifactId { get; set; }
        public MediaResource? Asset { get; set; }
        public string? AssetType { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DurationSeconds { get; set; }
        public string? FileSize { get; set; }
        public int? Height { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MimeType { get; set; }
        public string? OrganizationId { get; set; }
        public string? PublishedAt { get; set; }
        public int? SortOrder { get; set; }
        public string? Status { get; set; }
        public string? TargetId { get; set; }
        public string? TargetType { get; set; }
        public string? TenantId { get; set; }
        public MediaResource? Thumbnail { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public int? Width { get; set; }
    }
}
