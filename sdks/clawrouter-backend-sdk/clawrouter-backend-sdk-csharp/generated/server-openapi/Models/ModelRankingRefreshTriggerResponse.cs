using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ModelRankingRefreshTriggerResponse
    {
        public int? CacheMaxAgeSeconds { get; set; }
        public int? GeneratedCount { get; set; }
        public string? NextRefreshAt { get; set; }
        public int? OrganizationId { get; set; }
        public string? RankScope { get; set; }
        public int? RefreshIntervalSeconds { get; set; }
        public string? SnapshotDate { get; set; }
        public string? SnapshotPeriod { get; set; }
        public int? SourceCount { get; set; }
        public string? Status { get; set; }
        public int? TenantId { get; set; }
        public bool? Triggered { get; set; }
        public string? WindowEnd { get; set; }
        public string? WindowStart { get; set; }
    }
}
