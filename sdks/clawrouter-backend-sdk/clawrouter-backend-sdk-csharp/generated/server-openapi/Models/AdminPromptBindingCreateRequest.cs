using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class AdminPromptBindingCreateRequest
    {
        public string? BindingRole { get; set; }
        public bool? Enabled { get; set; }
        public int? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public Dictionary<string, string>? PolicyJson { get; set; }
        public int? Priority { get; set; }
        public int? PromptVersionId { get; set; }
    }
}
