using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillAssetItem
    {
        public string? AltText { get; set; }
        public string? ArtifactId { get; set; }
        public MediaResource? Asset { get; set; }
        public int? AssetType { get; set; }
        public string? CreatedAt { get; set; }
        public string? DurationSeconds { get; set; }
        public string? FileSize { get; set; }
        public int? Height { get; set; }
        public string? Id { get; set; }
        public string? MimeType { get; set; }
        public string? PublishedAt { get; set; }
        public string? SkillId { get; set; }
        public int? SortOrder { get; set; }
        public int? Status { get; set; }
        public string? TargetId { get; set; }
        public int? TargetType { get; set; }
        public MediaResource? Thumbnail { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public int? Width { get; set; }
    }
}
