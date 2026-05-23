using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAnalyticsModelRankItem
    {
        public double? AverageTokensPerRequest { get; set; }
        public string? CatalogKey { get; set; }
        public double? ErrorRate { get; set; }
        public string? Modality { get; set; }
        public string? Model { get; set; }
        public double? Points { get; set; }
        public int? Rank { get; set; }
        public int? RequestCount { get; set; }
        public double? TotalTokens { get; set; }
        public double? UpstreamCost { get; set; }
        public int? UserCount { get; set; }
        public string? Vendor { get; set; }
    }
}
