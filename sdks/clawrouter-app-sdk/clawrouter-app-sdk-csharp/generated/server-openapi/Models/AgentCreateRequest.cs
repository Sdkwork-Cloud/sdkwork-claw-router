using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AgentCreateRequest
    {
        public string? Code { get; set; }
        public string? Description { get; set; }
        public Dictionary<string, string>? McpPolicy { get; set; }
        public Dictionary<string, string>? MemoryPolicy { get; set; }
        public string? Model { get; set; }
        public string? Name { get; set; }
        public Dictionary<string, string>? RuntimePolicy { get; set; }
        public Dictionary<string, string>? SkillPolicy { get; set; }
        public string? SystemPrompt { get; set; }
        public Dictionary<string, string>? ToolPolicy { get; set; }
    }
}
