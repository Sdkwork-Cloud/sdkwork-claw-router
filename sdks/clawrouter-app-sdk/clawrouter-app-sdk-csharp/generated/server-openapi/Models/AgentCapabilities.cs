using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentCapabilities
    {
        public string McpServerCount { get; set; }
        public bool MemoryEnabled { get; set; }
        public string SkillBindingCount { get; set; }
    }
}
