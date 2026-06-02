using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class StorageReconciliationRunRecord
    {
        public string? BucketId { get; set; }
        public string? CheckMode { get; set; }
        public string? ChecksumMismatchCount { get; set; }
        public string? CompletedAt { get; set; }
        public string? CreatedAt { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public bool? DryRun { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? MissingObjectCount { get; set; }
        public string? OrganizationId { get; set; }
        public string? OrphanObjectCount { get; set; }
        public string? ProviderId { get; set; }
        public string? RequestId { get; set; }
        public string? RequestedBy { get; set; }
        public string? RunType { get; set; }
        public string? ScannedObjectCount { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public Dictionary<string, string>? SummaryJson { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
