using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ModelRankingRefreshLatestJob
    {
        public int? DurationMs { get; set; }
        public string? EndedAt { get; set; }
        public int? FailureCount { get; set; }
        public string? FailureReason { get; set; }
        public int? GeneratedCount { get; set; }
        public string? Id { get; set; }
        public string? JobName { get; set; }
        public string? NextRefreshAt { get; set; }
        public int? OrganizationId { get; set; }
        public string? RankScope { get; set; }
        public string? SnapshotDate { get; set; }
        public string? SnapshotPeriod { get; set; }
        public int? SourceCount { get; set; }
        public string? StartedAt { get; set; }
        public string? Status { get; set; }
        public int? SuccessCount { get; set; }
        public int? TenantId { get; set; }
        public string? WindowEnd { get; set; }
        public string? WindowStart { get; set; }
    }
}
