using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class GenerationAgentRunStepSnapshot
    {
        public string? Id { get; set; }
        public int? Index { get; set; }
        public string? Status { get; set; }
        public string? Title { get; set; }
        public string? Type { get; set; }
    }
}
