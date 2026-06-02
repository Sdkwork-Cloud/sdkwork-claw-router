using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MediaResourceRecord
    {
        public Dictionary<string, string>? AccessJson { get; set; }
        public Dictionary<string, string>? AiJson { get; set; }
        public string? AltText { get; set; }
        public string? BucketId { get; set; }
        public Dictionary<string, string>? ChecksumJson { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DurationSeconds { get; set; }
        public string? FileName { get; set; }
        public int? Height { get; set; }
        public string? Id { get; set; }
        public string? Kind { get; set; }
        public string? MediaResourceNo { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MimeType { get; set; }
        public string? ObjectBlobId { get; set; }
        public string? ObjectKey { get; set; }
        public string? ObjectVersion { get; set; }
        public string? OrganizationId { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public Dictionary<string, string>? RenditionsJson { get; set; }
        public string? SizeBytes { get; set; }
        public string? Source { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? Title { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uri { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public int? Width { get; set; }
    }
}
