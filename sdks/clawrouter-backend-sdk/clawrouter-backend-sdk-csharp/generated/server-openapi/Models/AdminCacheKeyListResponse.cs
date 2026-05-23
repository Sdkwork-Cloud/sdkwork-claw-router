using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCacheKeyListResponse
    {
        public bool? HasMore { get; set; }
        public string? InstanceName { get; set; }
        public List<AdminCacheKeyItem>? Items { get; set; }
        public int? Limit { get; set; }
        public string? Namespace { get; set; }
        public string? NextCursor { get; set; }
        public int? ReturnedItems { get; set; }
        public bool? ScanComplete { get; set; }
        public int? ScannedItems { get; set; }
    }
}
