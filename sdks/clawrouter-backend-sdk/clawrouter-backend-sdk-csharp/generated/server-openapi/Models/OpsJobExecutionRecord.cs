using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class OpsJobExecutionRecord
    {
        public string? CreatedAt { get; set; }
        public string? DurationMs { get; set; }
        public string? EndedAt { get; set; }
        public string? ExecutionStatus { get; set; }
        public string? FailureCount { get; set; }
        public string? FailureReason { get; set; }
        public string? Id { get; set; }
        public string? JobName { get; set; }
        public string? JobType { get; set; }
        public bool? LegalHold { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public Dictionary<string, string>? Payload { get; set; }
        public string? PayloadHash { get; set; }
        public string? ProcessedCount { get; set; }
        public string? RequestId { get; set; }
        public string? RetentionUntil { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public string? SuccessCount { get; set; }
        public string? TenantId { get; set; }
        public string? TraceId { get; set; }
        public string? TriggerType { get; set; }
        public string? UserId { get; set; }
        public string? Uuid { get; set; }
    }
}
