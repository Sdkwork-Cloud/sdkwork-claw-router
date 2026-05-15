using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class AppInstalledSkillItem
    {
        public Dictionary<string, string>? Config { get; set; }
        public bool? Enabled { get; set; }
        public string? Id { get; set; }
        public string? InstalledAt { get; set; }
        public string? LastEnabledAt { get; set; }
        public SkillCatalogItem? Skill { get; set; }
        public string? SkillId { get; set; }
    }
}
