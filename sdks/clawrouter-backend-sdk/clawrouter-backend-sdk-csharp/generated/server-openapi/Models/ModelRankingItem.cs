using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class ModelRankingItem
    {
        public int? BaseVolume { get; set; }
        public string? Color { get; set; }
        public string? ContextSize { get; set; }
        public double? Cost { get; set; }
        public int? CostIndicator { get; set; }
        public string? Currency { get; set; }
        public string? Id { get; set; }
        public bool? IsNew { get; set; }
        public int? Latency { get; set; }
        public string? License { get; set; }
        public string? Modality { get; set; }
        public string? Name { get; set; }
        public int? PrevRank { get; set; }
        public string? Pricing { get; set; }
        public int? Rank { get; set; }
        public int? Requests { get; set; }
        public List<string>? Strengths { get; set; }
        public int? Tokens { get; set; }
        public double? TrendScore { get; set; }
        public string? Vendor { get; set; }
        public string? VendorCode { get; set; }
        public double? WinRate { get; set; }
    }
}
