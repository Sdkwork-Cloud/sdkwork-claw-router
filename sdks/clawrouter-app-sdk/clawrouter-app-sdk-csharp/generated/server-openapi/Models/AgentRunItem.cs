using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunItem
    {
        public string AgentId { get; set; }
        public string AgentVersionId { get; set; }
        public string? CachedTokens { get; set; }
        public string? CompletedAt { get; set; }
        public string CreatedAt { get; set; }
        public string? ErrorMessageMasked { get; set; }
        public string ExecutionMode { get; set; }
        public string Id { get; set; }
        public string? InputMessage { get; set; }
        public string? InputTokens { get; set; }
        public string? MemorySpaceId { get; set; }
        public string? Model { get; set; }
        public string? OutputMessage { get; set; }
        public string? OutputTokens { get; set; }
        public string RequestId { get; set; }
        public string? Runtime { get; set; }
        public string? SessionId { get; set; }
        public string SourceSurface { get; set; }
        public string? StartedAt { get; set; }
        public string Status { get; set; }
        public string TotalSteps { get; set; }
        public string? TotalTokens { get; set; }
        public string? TraceId { get; set; }
    }
}
