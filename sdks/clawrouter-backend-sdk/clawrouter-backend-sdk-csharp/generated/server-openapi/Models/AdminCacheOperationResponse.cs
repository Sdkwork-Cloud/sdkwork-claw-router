using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCacheOperationResponse
    {
        public string? CacheKey { get; set; }
        public int? DeletedEntries { get; set; }
        public string? InstanceName { get; set; }
        public string? Namespace { get; set; }
        public string? Operation { get; set; }
        public int? RefreshedEntries { get; set; }
        public string? Status { get; set; }
    }
}
