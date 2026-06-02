using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PlusFeedsRecord
    {
        public Dictionary<string, string>? Author { get; set; }
        public string? CategoryId { get; set; }
        public string? CommentCount { get; set; }
        public string? ContentId { get; set; }
        public int? ContentType { get; set; }
        public Dictionary<string, string>? CoverResources { get; set; }
        public string? CreatedAt { get; set; }
        public int? DataScope { get; set; }
        public string? FavoriteCount { get; set; }
        public string? Id { get; set; }
        public bool? IsHot { get; set; }
        public bool? IsRecommended { get; set; }
        public bool? IsTop { get; set; }
        public string? LikeCount { get; set; }
        public string? OrganizationId { get; set; }
        public string? PublishTime { get; set; }
        public Dictionary<string, string>? ResourceList { get; set; }
        public string? ShareCount { get; set; }
        public int? SortOrder { get; set; }
        public string? Source { get; set; }
        public string? SourceUrl { get; set; }
        public int? Status { get; set; }
        public string? Summary { get; set; }
        public Dictionary<string, string>? Tags { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? V { get; set; }
        public string? ViewCount { get; set; }
    }
}
