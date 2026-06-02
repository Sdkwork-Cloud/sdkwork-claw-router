using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class StorageGcJobRecord
    {
        public string? CandidateCount { get; set; }
        public string? CompletedAt { get; set; }
        public string? CreatedAt { get; set; }
        public Dictionary<string, string>? CriteriaJson { get; set; }
        public string? CursorToken { get; set; }
        public string? DataScope { get; set; }
        public string? DeletedAt { get; set; }
        public string? DeletedBy { get; set; }
        public string? DeletedObjectCount { get; set; }
        public bool? DryRun { get; set; }
        public string? Id { get; set; }
        public string? IdempotencyKey { get; set; }
        public string? JobType { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? ReleasedBytes { get; set; }
        public string? RequestId { get; set; }
        public string? RequestedBy { get; set; }
        public Dictionary<string, string>? ResultJson { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? Version { get; set; }
    }
}
