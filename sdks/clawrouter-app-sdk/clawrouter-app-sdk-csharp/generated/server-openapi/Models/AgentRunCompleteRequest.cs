using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunCompleteRequest
    {
        public string? ErrorMessageMasked { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OutputMessage { get; set; }
        public string? Status { get; set; }
        public UsageSnapshot? UsageJson { get; set; }
    }
}
