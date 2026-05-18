using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class GenerationAgentSnapshot
    {
        public string? Id { get; set; }
        public string? Model { get; set; }
        public string? Name { get; set; }
        public string? VersionId { get; set; }
    }
}
