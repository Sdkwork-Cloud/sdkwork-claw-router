using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PlusCommentsRecord
    {
        public Dictionary<string, string>? Author { get; set; }
        public string? Content { get; set; }
        public string? ContentId { get; set; }
        public int? ContentType { get; set; }
        public string? CreatedAt { get; set; }
        public int? DataScope { get; set; }
        public string? DeviceInfo { get; set; }
        public string? Id { get; set; }
        public string? IpAddress { get; set; }
        public bool? IsTop { get; set; }
        public int? Likes { get; set; }
        public string? OrganizationId { get; set; }
        public string? ParentId { get; set; }
        public string? Path { get; set; }
        public int? ReplyCount { get; set; }
        public int? SortWeight { get; set; }
        public int? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? V { get; set; }
    }
}
