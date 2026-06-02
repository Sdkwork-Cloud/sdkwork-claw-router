using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ContentCourseApplicationRecord
    {
        public string? Category { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactName { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? Description { get; set; }
        public string? ExternalBvid { get; set; }
        public string? Id { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? ReviewComment { get; set; }
        public string? ReviewedAt { get; set; }
        public string? ReviewedBy { get; set; }
        public string? SourceProvider { get; set; }
        public string? Status { get; set; }
        public string? SubmittedAt { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public MediaResource? Video { get; set; }
    }
}
