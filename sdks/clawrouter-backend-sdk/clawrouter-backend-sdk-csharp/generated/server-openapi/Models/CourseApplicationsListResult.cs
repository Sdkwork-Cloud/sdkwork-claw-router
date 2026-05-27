using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CourseApplicationsListResult
    {
        public string? Code { get; set; }
        public AdminCourseApplicationCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
