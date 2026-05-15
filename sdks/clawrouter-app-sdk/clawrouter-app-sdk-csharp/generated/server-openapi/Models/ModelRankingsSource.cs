using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class ModelRankingsSource
    {
        public int? CacheMaxAgeSeconds { get; set; }
        public string? GeneratedAt { get; set; }
        public string? NextRefreshAt { get; set; }
        public string? ObservedAt { get; set; }
        public string? RankScope { get; set; }
        public int? RefreshIntervalSeconds { get; set; }
        public string? SnapshotDate { get; set; }
        public string? SnapshotPeriod { get; set; }
        public string? SourceDescription { get; set; }
        public string? SourceLabel { get; set; }
        public List<string>? SourceTables { get; set; }
        public string? WindowEnd { get; set; }
        public string? WindowStart { get; set; }
    }
}
