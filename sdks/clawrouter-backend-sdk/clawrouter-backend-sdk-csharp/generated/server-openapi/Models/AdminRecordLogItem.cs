using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminRecordLogItem
    {
        public string? BaseInputPrice { get; set; }
        public string? BaseOutputPrice { get; set; }
        public string? CacheReadPrice { get; set; }
        public int? CacheReadTokens { get; set; }
        public string? Cost { get; set; }
        public string? Group { get; set; }
        public string? Id { get; set; }
        public int? InputTokens { get; set; }
        public string? Ip { get; set; }
        public bool? IsStream { get; set; }
        public string? Model { get; set; }
        public string? Multiplier { get; set; }
        public int? OutputTokens { get; set; }
        public string? Path { get; set; }
        public string? ReasoningEffort { get; set; }
        public string? RequestId { get; set; }
        public string? Time { get; set; }
        public string? TokenName { get; set; }
        public string? TotalTime { get; set; }
        public string? Ttft { get; set; }
        public string? Type { get; set; }
        public string? User { get; set; }
    }
}
