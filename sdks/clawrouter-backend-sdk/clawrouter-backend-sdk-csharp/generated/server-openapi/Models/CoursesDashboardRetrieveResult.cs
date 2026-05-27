using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CoursesDashboardRetrieveResult
    {
        public string? Code { get; set; }
        public AdminCourseDashboardResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
