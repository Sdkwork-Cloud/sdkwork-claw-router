using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class RoutingUsageData
    {
        public int? Latency { get; set; }
        public int? Requests { get; set; }
        public string? Time { get; set; }
    }
}
