using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class UploadSessionRecord
    {
        public string? AbortedAt { get; set; }
        public string? BucketId { get; set; }
        public string? CompletedAt { get; set; }
        public string? ContentType { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? ExpectedSha256 { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? LogicalScope { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? ObjectKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? OriginalFilename { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? ProviderId { get; set; }
        public string? RequestId { get; set; }
        public string? S3UploadId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UploadMode { get; set; }
        public string? UploadSessionNo { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
