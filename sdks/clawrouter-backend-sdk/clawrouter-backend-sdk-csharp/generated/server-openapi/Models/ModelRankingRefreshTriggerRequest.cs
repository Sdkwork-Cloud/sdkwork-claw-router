using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ModelRankingRefreshTriggerRequest
    {
        public int? CacheMaxAgeSeconds { get; set; }
        public int? Limit { get; set; }
        public int? LookbackDays { get; set; }
        public string? RankScope { get; set; }
        public int? RefreshIntervalSeconds { get; set; }
        public string? SnapshotPeriod { get; set; }
    }
}
