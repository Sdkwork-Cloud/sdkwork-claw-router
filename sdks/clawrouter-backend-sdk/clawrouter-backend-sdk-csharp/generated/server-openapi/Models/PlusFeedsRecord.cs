using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PlusFeedsRecord
    {
        public Dictionary<string, string>? Author { get; set; }
        public Dictionary<string, string>? CoverImages { get; set; }
        public string? PublishTime { get; set; }
        public Dictionary<string, string>? ResourceList { get; set; }
        public string? Source { get; set; }
        public string? SourceUrl { get; set; }
        public string? Summary { get; set; }
        public Dictionary<string, string>? Tags { get; set; }
        public string? UserId { get; set; }
    }
}
