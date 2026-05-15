using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminSkillAssetUpdateRequest
    {
        public string? AltText { get; set; }
        public string? ArtifactId { get; set; }
        public int? AssetType { get; set; }
        public string? AssetUrl { get; set; }
        public string? DurationSeconds { get; set; }
        public int? FileSize { get; set; }
        public int? Height { get; set; }
        public string? MimeType { get; set; }
        public string? PublishedAt { get; set; }
        public int? SortOrder { get; set; }
        public int? Status { get; set; }
        public string? ThumbnailUrl { get; set; }
        public string? Title { get; set; }
        public int? Width { get; set; }
    }
}
