using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class GenerationAgentRunSnapshot
    {
        public string? Id { get; set; }
        public string? RequestId { get; set; }
        public string? Source { get; set; }
        public string? Status { get; set; }
    }
}
