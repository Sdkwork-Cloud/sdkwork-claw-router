using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class StorageReconciliationItemRecord
    {
        public string? ActualHash { get; set; }
        public string? ActualSizeBytes { get; set; }
        public string? BucketId { get; set; }
        public string? CreatedAt { get; set; }
        public string? ExpectedHash { get; set; }
        public string? ExpectedSizeBytes { get; set; }
        public string? Id { get; set; }
        public string? IssueType { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? ObjectBlobId { get; set; }
        public string? ObjectKey { get; set; }
        public string? OrganizationId { get; set; }
        public string? PayloadHash { get; set; }
        public Dictionary<string, string>? RepairPayload { get; set; }
        public string? RepairStatus { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? RunId { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
