using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AiRateLimitBucketRecord
    {
        public string? BucketKey { get; set; }
        public string? CreatedAt { get; set; }
        public string? CurrentCount { get; set; }
        public string? CurrentTokens { get; set; }
        public string? Id { get; set; }
        public string? LastRequestAt { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OrganizationId { get; set; }
        public string? QuotaPolicyId { get; set; }
        public string? RebuildVersion { get; set; }
        public string? RemainingCount { get; set; }
        public string? RemainingTokens { get; set; }
        public string? SourceId { get; set; }
        public string? SourceType { get; set; }
        public string? SourceVersion { get; set; }
        public string? Status { get; set; }
        public string? SubjectId { get; set; }
        public string? SubjectType { get; set; }
        public string? TenantId { get; set; }
        public string? UpdatedAt { get; set; }
        public string? Uuid { get; set; }
        public string? WindowEnd { get; set; }
        public string? WindowStart { get; set; }
    }
}
