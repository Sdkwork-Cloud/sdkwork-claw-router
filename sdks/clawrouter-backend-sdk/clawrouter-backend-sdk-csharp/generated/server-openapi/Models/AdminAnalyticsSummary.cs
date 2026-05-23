using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAnalyticsSummary
    {
        public int? ActiveModels { get; set; }
        public int? ActiveUsers { get; set; }
        public double? AveragePointsPerRequest { get; set; }
        public double? AverageTokensPerRequest { get; set; }
        public double? ErrorRate { get; set; }
        public int? FailedRequests { get; set; }
        public int? SuccessfulRequests { get; set; }
        public double? TotalPoints { get; set; }
        public int? TotalRequests { get; set; }
        public double? TotalTokens { get; set; }
        public int? TotalUsers { get; set; }
        public double? UpstreamCost { get; set; }
    }
}
