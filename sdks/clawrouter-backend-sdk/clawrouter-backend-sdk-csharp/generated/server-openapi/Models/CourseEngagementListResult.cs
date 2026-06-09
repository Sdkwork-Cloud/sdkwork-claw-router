using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CourseEngagementListResult
    {
        public string Code { get; set; }
        public AdminCourseEngagementCollectionResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
