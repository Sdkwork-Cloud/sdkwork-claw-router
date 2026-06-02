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
        public int? Requested { get; set; }
        public int? Skipped { get; set; }
        public string? TargetTable { get; set; }
        public int? Upserted { get; set; }
    }
}
