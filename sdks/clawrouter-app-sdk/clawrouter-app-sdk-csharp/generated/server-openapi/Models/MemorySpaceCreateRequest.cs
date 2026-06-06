using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class MemorySpaceCreateRequest
    {
        public bool? AutoExtractEnabled { get; set; }
        public bool? AutoRecallEnabled { get; set; }
        public string? MaxInjectedTokens { get; set; }
        public bool? MemoryEnabled { get; set; }
        public Dictionary<string, string>? Metadata { get; set; }
        public string? OwnerId { get; set; }
        public string? OwnerType { get; set; }
        public Dictionary<string, string>? RetentionPolicy { get; set; }
        public bool? ReviewRequired { get; set; }
        public Dictionary<string, string>? SensitivityPolicy { get; set; }
        public string? SpaceType { get; set; }
        public string? Title { get; set; }
    }
}
