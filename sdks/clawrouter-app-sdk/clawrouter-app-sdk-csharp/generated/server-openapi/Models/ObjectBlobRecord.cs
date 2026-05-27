using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ObjectBlobRecord
    {
        public string? BucketId { get; set; }
        public string? ContentSha256 { get; set; }
        public string? ContentType { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? EncryptionMode { get; set; }
        public string? Id { get; set; }
        public string? KmsKeyRef { get; set; }
        public string? LastVerifiedAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? ObjectKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? OriginalFilename { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public string? ProviderId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? Status { get; set; }
        public string? StorageClass { get; set; }
        public string? StorageEtag { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
        public string? VersionId { get; set; }
    }
}
