using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class PlusFavoriteRecord
    {
        public string? ContentId { get; set; }
        public int? ContentType { get; set; }
        public string? CreatedAt { get; set; }
        public int? DataScope { get; set; }
        public string? FolderId { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Image { get; set; }
        public bool? IsPrivate { get; set; }
        public string? LastViewedAt { get; set; }
        public string? OrganizationId { get; set; }
        public string? Remark { get; set; }
        public int? SortWeight { get; set; }
        public int? Status { get; set; }
        public string? Tags { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? V { get; set; }
        public int? ViewCount { get; set; }
    }
}
