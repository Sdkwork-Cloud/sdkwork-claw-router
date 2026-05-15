using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class PlusUserAgentSkillRecord
    {
        public string? InstalledAt { get; set; }
        public string? LastEnabledAt { get; set; }
        public string? LastUsedAt { get; set; }
    }
}
