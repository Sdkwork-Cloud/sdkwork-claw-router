using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminAgentVersionItem
    {
        public string CreatedAt { get; set; }
        public string Id { get; set; }
        public Dictionary<string, string> McpPolicy { get; set; }
        public Dictionary<string, string> MemoryPolicy { get; set; }
        public string? Model { get; set; }
        public string ReleaseStatus { get; set; }
        public Dictionary<string, string> RuntimePolicy { get; set; }
        public Dictionary<string, string> SkillPolicy { get; set; }
        public string SystemPrompt { get; set; }
        public Dictionary<string, string> ToolPolicy { get; set; }
        public string UpdatedAt { get; set; }
        public string VersionNo { get; set; }
    }
}
