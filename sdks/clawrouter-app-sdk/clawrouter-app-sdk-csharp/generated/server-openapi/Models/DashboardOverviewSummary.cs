using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class DashboardOverviewSummary
    {
        public int? AudioRequests { get; set; }
        public double? AvailableCredits { get; set; }
        public int? ErrorCount { get; set; }
        public int? ImageRequests { get; set; }
        public int? MusicRequests { get; set; }
        public int? RequestCount { get; set; }
        public double? Rpm { get; set; }
        public int? TotalRequestCount { get; set; }
        public double? TotalUsedCredits { get; set; }
        public double? Tpm { get; set; }
        public double? UsedCredits { get; set; }
        public int? VideoRequests { get; set; }
    }
}
