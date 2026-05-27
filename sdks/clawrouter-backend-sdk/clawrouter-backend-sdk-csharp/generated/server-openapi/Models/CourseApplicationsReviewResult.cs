using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Sdkwork.ClawRouter.Backend.Models
{
    public class CourseApplicationsReviewResult
    {
        public string? Code { get; set; }
        public AdminCourseApplicationReviewResponse? Data { get; set; }
        public string? Msg { get; set; }
    }
}
