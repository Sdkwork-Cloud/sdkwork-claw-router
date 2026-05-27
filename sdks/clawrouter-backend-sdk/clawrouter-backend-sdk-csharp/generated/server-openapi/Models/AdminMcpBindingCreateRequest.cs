using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminMcpBindingCreateRequest
    {
        public List<string>? AllowedTools { get; set; }
        public List<string>? DeniedTools { get; set; }
        public bool? Enabled { get; set; }
        public int? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public Dictionary<string, string>? PolicyJson { get; set; }
        public int? Priority { get; set; }
        public int? ServerRevisionId { get; set; }
        public string? Status { get; set; }
        public int? ToolId { get; set; }
    }
}
