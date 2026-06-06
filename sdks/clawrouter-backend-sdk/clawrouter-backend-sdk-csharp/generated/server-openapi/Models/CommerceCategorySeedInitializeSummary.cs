using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CommerceCategorySeedInitializeSummary
    {
        public string? ConfigKey { get; set; }
        public string? Dataset { get; set; }
        public bool? InstallDefaultEnabled { get; set; }
        public string? Requested { get; set; }
        public string? Skipped { get; set; }
        public string? TargetTable { get; set; }
        public string? Upserted { get; set; }
    }
}
