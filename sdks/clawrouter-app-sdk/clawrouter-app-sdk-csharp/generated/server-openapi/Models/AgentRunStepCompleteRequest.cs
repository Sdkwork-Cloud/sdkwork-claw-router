using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentRunStepCompleteRequest
    {
        public string? ErrorMessageMasked { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public Dictionary<string, string>? OutputJson { get; set; }
        public string? Status { get; set; }
        public UsageSnapshot? UsageJson { get; set; }
    }
}
