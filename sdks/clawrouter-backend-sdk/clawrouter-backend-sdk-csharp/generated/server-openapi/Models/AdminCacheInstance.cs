using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCacheInstance
    {
        public int? CacheDeletes { get; set; }
        public int? CacheErrors { get; set; }
        public int? CacheHits { get; set; }
        public int? CacheInspections { get; set; }
        public int? CacheMisses { get; set; }
        public int? CacheRefreshes { get; set; }
        public int? CacheWrites { get; set; }
        public string? ConnectionProfileName { get; set; }
        public int? DefaultTtlSeconds { get; set; }
        public int? EntryCount { get; set; }
        public int? ExpiredEntryCount { get; set; }
        public string? KeyPrefix { get; set; }
        public int? MaxEntries { get; set; }
        public string? Name { get; set; }
        public string? ProviderKind { get; set; }
        public string? Purpose { get; set; }
        public string? Status { get; set; }
        public bool? SupportsDelete { get; set; }
        public bool? SupportsInspect { get; set; }
        public bool? SupportsRefresh { get; set; }
    }
}
