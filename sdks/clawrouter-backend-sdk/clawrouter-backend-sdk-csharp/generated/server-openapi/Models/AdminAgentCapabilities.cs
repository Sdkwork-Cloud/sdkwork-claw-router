using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAgentCapabilities
    {
        public string? McpServerCount { get; set; }
        public bool? MemoryEnabled { get; set; }
        public string? SkillBindingCount { get; set; }
    }
}
