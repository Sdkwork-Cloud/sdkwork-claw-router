using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CourseOverviewSource
    {
        public string? ObservedAt { get; set; }
        public string? SourceDescription { get; set; }
        public string? SourceLabel { get; set; }
        public List<string>? SourceTables { get; set; }
    }
}
