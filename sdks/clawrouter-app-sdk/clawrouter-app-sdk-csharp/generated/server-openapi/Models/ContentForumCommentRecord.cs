using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ContentForumCommentRecord
    {
        public string? AuthorId { get; set; }
        public Dictionary<string, string>? AuthorSnapshot { get; set; }
        public string? Body { get; set; }
        public string? CourseId { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Id { get; set; }
        public string? LikeCount { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? ParentId { get; set; }
        public string? PostId { get; set; }
        public string? RootId { get; set; }
        public string? Status { get; set; }
        public string? TargetId { get; set; }
        public string? TargetType { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
