using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAgentCapabilities
    {
        public int? McpServerCount { get; set; }
        public bool? MemoryEnabled { get; set; }
        public int? SkillBindingCount { get; set; }
    }
}
