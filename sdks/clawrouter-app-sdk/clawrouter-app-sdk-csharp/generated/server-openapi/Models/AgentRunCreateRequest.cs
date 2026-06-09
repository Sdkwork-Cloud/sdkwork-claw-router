using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunCreateRequest
    {
        public string AgentId { get; set; }
        public string AgentVersionId { get; set; }
        public string? ExecutionMode { get; set; }
        public string? InputMessage { get; set; }
        public string? MemorySpaceId { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? Model { get; set; }
        public string? Runtime { get; set; }
        public string? SourceSurface { get; set; }
        public string? TraceId { get; set; }
    }
}
