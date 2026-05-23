using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminCacheNamespacePolicy
    {
        public string? Consistency { get; set; }
        public bool? Enabled { get; set; }
        public string? FailureMode { get; set; }
        public string? InstanceName { get; set; }
        public int? JitterPercent { get; set; }
        public string? Namespace { get; set; }
        public string? Scope { get; set; }
        public string? Sensitivity { get; set; }
        public int? StaleWhileRevalidateSeconds { get; set; }
        public List<string>? Tags { get; set; }
        public int? TtlSeconds { get; set; }
    }
}
