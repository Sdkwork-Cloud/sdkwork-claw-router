using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCacheSummary
    {
        public int? CacheDeletes { get; set; }
        public int? CacheErrors { get; set; }
        public int? CacheHits { get; set; }
        public int? CacheInspections { get; set; }
        public int? CacheMisses { get; set; }
        public int? CacheRefreshes { get; set; }
        public int? CacheWrites { get; set; }
        public int? ExpiredEntries { get; set; }
        public string? RuntimeTarget { get; set; }
        public int? TotalEntries { get; set; }
        public int? TotalInstances { get; set; }
        public int? TotalNamespaces { get; set; }
    }
}
