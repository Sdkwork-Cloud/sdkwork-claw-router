using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class UploadPresignGrantRecord
    {
        public string? BucketId { get; set; }
        public Dictionary<string, string>? CanonicalHeaders { get; set; }
        public string? ConsumedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? ExpiresAt { get; set; }
        public string? Id { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Method { get; set; }
        public string? ObjectKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public string? ProviderId { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public Dictionary<string, string>? SignedHeaders { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UploadPartId { get; set; }
        public string? UploadSessionId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
