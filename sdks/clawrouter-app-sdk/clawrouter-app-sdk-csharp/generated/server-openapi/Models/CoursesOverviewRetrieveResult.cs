using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.App.Models
{
    public class CoursesOverviewRetrieveResult
    {
        public string? Code { get; set; }
        public CourseOverview? Data { get; set; }
        public string? Msg { get; set; }
    }
}
